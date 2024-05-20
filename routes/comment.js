const commentController = require('../controllers/commentsController')
const express = require('express')
const app=express()
const router=express.Router()
const {isAuthenticatedUser}=require('../config/authConfig') 

router.post('/add/:postId',isAuthenticatedUser,commentController.addComment)
router.delete('/delete/:commentId',isAuthenticatedUser,commentController.deleteComment)

router.put('/update/:commentId',isAuthenticatedUser,commentController.updateComment)
router.get('/show/:postId',isAuthenticatedUser,commentController.showComment)

module.exports = router