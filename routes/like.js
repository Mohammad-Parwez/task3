const likeController = require('../controllers/likeController')
const express = require('express')
const app=express()
const router=express.Router()
const {isAuthenticatedUser}=require('../config/authConfig') 

router.post('/toogle-like/:postId',isAuthenticatedUser,likeController.likePost)
router.post('/toogle-comment/:commentId',isAuthenticatedUser,likeController.likeComments)

module.exports = router