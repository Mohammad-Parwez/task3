const nodeMailer = require("../config/nodemailer");
// const User = require("../models/user");
// const session = require('express-session');



exports.resetMail = (email,token) => {
    console.log('inside Reset mailer');
   

    nodeMailer.transporter.sendMail({
        from: 'mrunknown.0086@gmail.com',
        to: email,
        subject: "Password reseted Successfully",
        html: `<h1> Hey ${token} is your Reset Token user reset password route to reset it </h1>`
    },
    (err,info)=>{
        if(err){
            console.log('error in sending mail',err);
        }
        console.log("mail sent",info);
        return;
    }
    );
} 
