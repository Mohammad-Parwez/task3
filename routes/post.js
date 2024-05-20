const postController = require('../controllers/postController')
const express = require('express')
const app=express()
const router=express.Router()
const {isAuthenticatedUser}=require('../config/authConfig') 

router.post('/create-post',isAuthenticatedUser,postController.createPost)
router.get('/show',isAuthenticatedUser,postController.showPost)
router.put('/update/:postId',isAuthenticatedUser,postController.updatePost)

router.delete('/delete/:postId',isAuthenticatedUser,postController.deletePost)

module.exports = router