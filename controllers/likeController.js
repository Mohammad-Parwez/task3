const Like = require('../models/like')
const Post = require('../models/post')
const Comment = require('../models/comments')


module.exports.likePost = async (req, res) => {
    const { postId } = req.params
    const userId = req.user.userId;
    try {

        const post = await Post.findById(postId);
        const checkLike = await Like.findOne({ user: userId, post: postId })
        if (checkLike) {
            await checkLike.deleteOne()
            await Post.findByIdAndUpdate(postId,{$pull:{like:checkLike.id}})
            return res.send({
                status: 'Post Unliked',
                post
            })
        }

        const addLike = new Like({ user: userId, post: postId })
        await addLike.save()

        post.like.push(addLike._id); // Add the new like to the post's likes array
        await post.save();

        return res.send({
            success: true,
            status: 'Post Liked',
            post
        })

    } catch (err) {
        console.log(err);
    }


}

module.exports.likeComments=async(req,res)=>{
    const { commentId } = req.params
    const userId = req.user.userId;

    try{
        const comment = await Comment.findById(commentId)
        const checkLike = await Like.findOne({user: userId, comment:commentId })

        if(checkLike){
            await checkLike.deleteOne()
            await Comment.findByIdAndUpdate(commentId,{$pull:{like:checkLike.id}})
            return res.send({
                status: 'Comment Unliked',
                comment
            })
        }

        const addLike = new Like({ user: userId, comment: commentId })
        await addLike.save()

        comment.like.push(addLike._id); // Add the new like to the post's likes array
        await comment.save();

        return res.send({
            success: true,
            status: 'Comment Liked',
            comment
        })

    }catch (err) {
        console.log(err);
    }
}