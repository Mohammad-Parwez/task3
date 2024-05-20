# CURD API Assestment

## Functionality

- Login and Register User
- User can Create, Update, Delete Posts and Comments as well
- User can like and Unlike any Post and Comments 
- All the Post and Comments will saved after Encryption in database 


## Tech Stack

- Nodejs
- ExpressJS
- MongoDB
- bcrypt (to hash Password)
- crypto (to encrypt data)
- JSONWeb token

## Tolls I use

- VS Code - code editor
- MongoDb Compass - GUI for managing database 
- Postman - To test APIs

## Installation

- Clone repo with git clone <br>
``` git clone https://github.com/raj0811/banao-nodejs-task.git ```
- Install all dependencies<br>
``` npm install ```
- Start the Server<br>
``` npm start ```
- Server will start on port 8003<br>
``` http://localhost:8003/ ```


## APIs
- Base URl (hosted link) <br>   ``` http://16.170.239.111:8003/ ```  
- Signup -(POST request) <br> ``` /signup ``` 
- Login - (POST request) <br> ``` /login ``` 
- Forget Password - (POST request) <br> ``` /forget-password ``` 
- Change Password - (POST request) <br> ``` /change-password' ``` 
- Create Post - (GET request) <br> ``` /post/show ``` 
- Update Post - (PUT request) <br> ``` /post/update/:postId ``` 
- Delete Post - (Delete request) <br> ``` /post/delete/:postId ``` 
- Add Comment - (POST request) <br> ``` /comment/add/:postId ``` 
- Delete Comment - (DELETE request) <br> ``` /comment/delete/:commentId ``` 
- Update Comment - (UPDATE request) <br> ``` /comment/update/:commentId ``` 
- Show Comment - (POST request) <br> ``` /comment/show/:postId ``` 
- Toggle Like Post - (POST request) <br> ``` /like/toogle-like/:postId ``` 
- Toggle Like Comment - (POST request) <br> ``` /like/toogle-comment/:commentId ``` 

# Thank you :)


