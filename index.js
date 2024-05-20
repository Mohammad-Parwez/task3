const express = require('express');
const mongoose = require("mongoose")
const app=express();
const port =8003
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const bodyParser = require('body-parser')
const session = require('express-session');
app.use(bodyParser.json());
app.use(express.json());
// app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
 mongoose.connect("mongodb://localhost:27017/Parwez")
const MongoStore = require('connect-mongo');

app.use(session({ 
    name: 'banao Tech',
    secret: 'mykey',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 10000)
    },
    store: MongoStore.create({

        mongoUrl: 'mongodb+srv://mrunknown0086:fVxgrlMmbOesmUYG@cluster0.uvmipg3.mongodb.net/?retryWrites=true&w=majority',
        autoRemove: 'disabled'

    },
    function(err){
        console.log(err || 'error in connect - mongodb setup ok');
    }
    )
}));

app.use('/', require('./routes'));


app.listen(port,function(err){
    if(err){
        console.log("error in starting server");
        
    }
    console.log('server start on port',port);
})