const mongoose = require('mongoose')


mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://mrunknown0086:fVxgrlMmbOesmUYG@cluster0.uvmipg3.mongodb.net/?retryWrites=true&w=majority');





const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error in connecting to db'));

//up and runnning
db.once('open', function() {
    console.log("successfully connected to the database");
});