const mongoose = require('mongoose');


const likesSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'post'
    },
    comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'comment'
    }
},{
    timestamps: true
});

const Like = mongoose.model('like',likesSchema);
module.exports = Like;