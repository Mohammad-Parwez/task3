
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const resetMailer = require('../mailer/resetpasswordmailer');
const JWT_SECRET='mykey'

module.exports.home = (req, res) => {
    return res.send({
        connected: true,
        msg: "Successfully connected"
    })
}



module.exports.signup = async (req, res) => {
    try {
        const { email, username, password, name } = req.body



        if (!email || !username || !password || !name) {
            res.send({
                success: false,
                msg: "required field missing "
            })
        }

        // Check if user with the same email already exists

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        const checkUsername = await User.findOne({ username });

        if (checkUsername) {
            return res.status(400).json({ error: `'${username}' username is Taken Please choose another username ` });
        }

        const user = new User({ email, username, password, name });
        await user.save();

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.json({ token, user });

    } catch (error) {
        res.send(error)
    }
}


module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.send({
                success: false,
                msg: "required field missing "
            })
        }

        // Check if user with the provided email exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials email' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        // save in cookies
        res.cookie('token', token, { httpOnly: true });
        // Send the token and user data in the response
        res.json({
            msg: "Successfully Logged In",
            token,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};



function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
}


module.exports.forgetPassword = async (req, res) => {

    try {
        const { email } = req.body;

        if (!email) {
            return res.send({
                success: false,
                msg: "required field missing"
            });
        }

        // Check if user with the provided email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User with this email does not exist' });
        }

        // Generate a unique token or code for password reset
        const resetToken = generateRandomCode(7);

        // Save the token or code in the user's document
        user.resetToken = resetToken;
        await user.save();

        // Send the password reset email to the user's email address
        resetMailer.resetMail(user.email, resetToken);

        res.json({ msg: 'Password reset instructions sent to your email' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during password reset' });
    }
};


module.exports.chnagePassword = async (req,res) => {
    try {
        const { token, email, password } = req.body
        
        if (!email || !token || !password) {
            res.send('required field missing')
        }
        const user = await User.findOne({ email })
        console.log(user);

        if (!user) {
            res.send({
                success: false,
                msg: "User Not found..."
            })
        }

        if (token != user.resetToken) {
            return res.send({
                success: false,
                msg: "Invalid Token"
            })
        }

        // Update the user's password
        user.password = password;
        user.resetToken = ''; // Clear the reset token
        await user.save();

        res.send({
            success: true,
            msg: 'Password changed successfully'
        });

} catch (err) {
        res.send(err)
    }
}

module.exports.logout = async (req, res) => {
    try {
      // Clear the token cookie
      res.clearCookie('token');
  
      res.json({ msg: 'Logged out successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred during logout' });
    }
  };