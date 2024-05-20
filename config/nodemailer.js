const nodemailer = require('nodemailer');
const path = require('path');

// const env = require('./enviroment');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'mrunknown.0086@gmail.com',
    pass: 'cwcvyshamucgvnky'
  }
});

let renderTemplate = (data, templateContent) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: 'mrunknown.0086@gmail.com',
      to: data.email,
      subject: 'Password Reset',
      html: templateContent.replace(/{{resetCode}}/g, data.resetCode)
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error in sending password reset email:', error);
        reject(error);
      } else {
        console.log('Password reset email sent:', info.response);
        resolve();
      }
    });
  });
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate
};
