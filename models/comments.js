const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    // comment belongs to a user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    // Comment belong to Post
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    like:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'like'
        }
    ]
},{
    timestamps: true
});

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;