const mongoose =require('mongoose');


const postSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    // Post belong to User
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'

    },
    // include the array of ids of all cmmt
    comments:[
        {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: 'comment'
            type: Array,
        }
    ],
    like:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'like'
        }
    ]
    
},{
    timestamps: true
});

const Post = mongoose.model('post',postSchema);
module.exports = Post;