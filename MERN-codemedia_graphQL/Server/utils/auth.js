const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Function to sign the token
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    // Create and return the signed token with an expiration of 2 hours
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  // Middleware to authenticate the user based on the token
  authMiddleware: function ({ req }) {
    // Allow token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // If the token is sent as part of the Authorization header (Bearer <token>)
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();  // Extract token value
    }

    // If no token is provided, return the request object as is
    if (!token) {
      return req;
    }

    try {
      // Verify the token and attach the user data to the request object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.log('Invalid token', err); // Log the error if the token is invalid
    }

    // Return the updated request object with user data attached (if token was valid)
    return req;
  },
};
