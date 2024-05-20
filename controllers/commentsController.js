const Comment = require('../models/comments');
const Like = require('../models/like');
const Post = require('../models/post')
const { encryptData } = require('../utils/encryption') // Import the encryption utility
const { decryptData } =require('../utils/decryption')


module.exports.addComment = async (req, res) => {
    try {
        const {postId} = req.params
        const userId = req.user.userId;
        let { comment } = req.body
        console.log(comment);
        if (!comment) {
            return res.send({
                success: false,
                msg: "required field missing "
            })
        }

        const post= await Post.findById(postId)
        if(!post){
            return res.send({
                success: false,
                msg: "Post Not Found"
            })
        }

        const encryptedData = encryptData(comment);
        const createComment = new Comment({
            comment: JSON.stringify(encryptedData),
            user: userId,
            post:postId
        });

        
        // console.log(createComment.comment);
        await createComment.save()
        post.comments.push(createComment.comment)
        await post.save()

        res.send({
            createComment
        })



    } catch (err) {
        res.send(err)
    }
}

module.exports.showComment = async (req, res) => {
    const { postId } = req.params;
  
    try {
        const findCommnets= await Comment.find({post:postId})
      const post = await Post.findById(postId).populate('comments');
        console.log(findCommnets);
      if (!post) {
        return res.send({
          success: false,
          msg: "Post Not Found",
        });
      }
  
      
      const decryptedComments = findCommnets.map(comment => {
        console.log(comment);
        const { iv, encryptedData } = JSON.parse(comment.comment);
        const decryptedContent = decryptData(encryptedData, iv);
        return { _id: comment._id, content: decryptedContent };
    });
  
      res.send({
        decryptedComments,
        

      });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  };
  

module.exports.updateComment=async(req,res)=>{
    const {commentId}=req.params
    const {newComment}=req.body

    if(!newComment){
        return res.send('required field missing')
    }

    try{

        const updateComment=await Comment.findById(commentId)
        if(!updateComment){
            return res.send({
                success: false,
                msg: "Comment Not Found"
            })
        }


        const encryptedData = encryptData(newComment);
        updateComment.comment = JSON.stringify(encryptedData)
        // updateComment.comment=newComment
        await updateComment.save()

        return res.send({
            success: true,
            msg:'Comment updated successfully',
            
        })

    }catch(err){
        console.log(err);
        return res.send(err)
    }
}

module.exports.deleteComment=async(req,res)=>{
    const {commentId}=req.params


   try{
    const comment= await Comment.findById(commentId)
    if(!comment){
        return res.send({
            success: false,
            msg: "Comment Not Found",
          });
    }

    await comment.deleteOne()
    const postId=comment.post

    await Post.findByIdAndUpdate(postId,{$pull:{comments:commentId}})
    await Like.deleteMany({comment: commentId})
    

    res.send({
        success: true,
        msg: "Comment deleted"
    })
   }catch(err){
    console.log(err);
    return res.send(err)
   }
}