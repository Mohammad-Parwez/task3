const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comments')
const Like = require('../models/like')
const { encryptData } = require('../utils/encryption') // Import the encryption utility
const { decryptData } =require('../utils/decryption')

module.exports.createPost = async (req, res) => {
    try {
        const userId = req.user.userId;
        let { content } = req.body
        if (!content) {
            return res.send({
                success: false,
                msg: "required field missing "
            })
        }
        
        const encryptedData = encryptData(content);
        const post = new Post({
            content: JSON.stringify(encryptedData),
            user: userId,
        });
        await post.save();

        res.send({
            success: true,
            msg: "Post Created Successfully",
            post
        })
    } catch (err) {
        res.send(err)
    }
}

module.exports.showPost = async (req, res) => {
    const userId = req.user.userId;

    try{
        const posts = await Post.find({ user: userId })
    if (!posts) {
        return res.send({
            success: false,
            msg: "Post Not Found"
        })
    }

    const decryptedPosts = posts.map(post => {
        const { iv: contentIV, encryptedData: contentEncryptedData } = JSON.parse(post.content); // Retrieve iv and encryptedData from the content field
        const decryptedContent = decryptData(contentEncryptedData, contentIV); // Decrypt the content

        // Decrypt comments
        const decryptedComments = post.comments.map(comment => {
            // console.log({content: comment});
            const { iv: commentIV, encryptedData: commentEncryptedData } = JSON.parse(comment); // Retrieve iv and encryptedData from the comment content field
            const decryptedComment = decryptData(commentEncryptedData, commentIV); // Decrypt the comment content
            return { _id: comment._id, content: decryptedComment };
        });
        const likeCount = post.like.length;
        return {
            _id: post._id,
            content: decryptedContent,
            user: post.user,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            comments: decryptedComments,
            like: post.like,
            likeCount
        };
    });

    res.send({decryptedPosts});

    }catch(err){
        console.log(err);
    }
}

module.exports.updatePost = async (req, res) => {
    const { postId } = req.params
    const { content } = req.body;
    try {
        const post = await Post.findById(postId)

        if (!post) {
            return res.send({
                success: false,
                msg: "Post Not Found"
            })
        }
        const encryptedData = encryptData(content);
        post.content = JSON.stringify(encryptedData)
        // post.content = content

        await post.save()
        return res.status(200).json({ message: 'Post updated successfully', post });
    } catch (err) {
        res.send({
            success: false,
            msg: "Error in updating Post",
            err
        })
    }
}

module.exports.deletePost = async (req, res) => {
    const { postId } = req.params;
  
    try {
      // Delete all comments associated with the post
      await Comment.deleteMany({ post: postId });
      await Like.deleteMany({post: postId})
      
      const delpost = await Post.findById(postId);
  
      if (!delpost) {
        return res.send({
          success: false,
          msg: "Post Not Found",
        });
      }
  
      // Remove the post
      await delpost.deleteOne();
  
      return res.send({
        success: true,
        msg: "Post deleted successfully",
      });
    } catch (err) {
        console.log(err);
      res.send(err);
    }
  };
  