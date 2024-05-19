const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mykey';

exports.isAuthenticatedUser = (req, res, next) => {
  // Ensure req.cookies is defined
  if (!req.cookies) {
    console.error('No cookies found in the request.');
    return res.status(401).json({ error: 'Unauthorized, no cookies found' });
  }

  const token = req.cookies.token;

  if (!token) {
    console.error('No token found in the request cookies.');
    return res.status(401).json({ error: 'Unauthorized, no token found' });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, JWT_SECRET);

    // Log the decoded token
    console.log('Decoded Token:', decodedToken);

    // Store the decoded token in the request object
    req.user = decodedToken;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Handle invalid signature error
      console.error('Invalid token signature:', error.message);
      return res.status(401).json({ error: 'Invalid token signature' });
    }

    console.error('An error occurred during authentication:', error);
    return res.status(500).json({ error: 'An error occurred during authentication' });
  }
};
