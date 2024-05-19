const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const { encryptData, decryptData } = require('../utils/encrypt'); // Import both encryption and decryption utilities
const { isAuthenticatedUser } = require('../config/authconfig');
const router = express.Router();

// Create a new post
router.post('/', isAuthenticatedUser, async (req, res) => {
    const { content,userI } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const encryptedContent = encryptData(content);

        const post = new Post({ user: user._id, content: encryptedContent.encryptedData, iv: encryptedContent.iv });
        await post.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username');
        const decryptedPosts = posts.map(post => ({
            id: post._id,
            user: post.user.username,
            content: decryptData(post.content, post.iv)
        }));
        res.json(decryptedPosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get a single post by ID
router.get('/:postId', isAuthenticatedUser, async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId).populate('user', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({
            id: post._id,
            user: post.user.username,
            content: decryptData(post.content, post.iv)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a post by ID
router.put('/:postId', isAuthenticatedUser, async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    try {
        let post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const encryptedContent = encryptData(content);
        post.content = encryptedContent.encryptedData;
        post.iv = encryptedContent.iv;
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a post by ID
router.delete('/:postId', isAuthenticatedUser, async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await Post.deleteOne({ _id: postId });
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Like a post
router.post('/:postId/like', isAuthenticatedUser, async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has already liked the post
        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        // Add user ID to the likes array
        post.likes.push(userId);
        await post.save();

        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add a comment to a post
router.post('/:postId/comment', isAuthenticatedUser, async (req, res) => {
    const { postId } = req.params;
    const { userId, text } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create the comment object
        const comment = {
            user: userId,
            text: encryptData(text).encryptedData,
            iv: encryptData(text).iv
        };

        // Add the comment to the comments array
        post.comments.push(comment);
        await post.save();

        res.status(200).json({ comment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
