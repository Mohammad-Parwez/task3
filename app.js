require('dotenv').config();
const cookieParser = require("cookie-parser")
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post')
 


const app = express();
//cookie-parser
app.use(cookieParser());
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/backend')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
    app.set('jwt_secret', process.env.JWT_SECRET);

// Use routes
 app.get("/",(req,res)=>{
    res.send("task1")
 })
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
