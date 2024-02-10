const jwt = require('jsonwebtoken');
const _ = require('lodash')
const { jwtTokenSecretKey } = require('../config/envVariables');

// This function checks if the user is authenticated before allowing access to protected routes.
const authenticateUser = (req, res, next) => {
  // Get the token from the request headers, query string, or cookies
  let token = _.get(req,'headers.authorization') || _.get(req,'query.token')  || _.get(req,'cookies.token') ;


  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }



  if (!token) {
    // Token is not provided, send an error response
    return res.status(401).json({ error: 'Access denied. Token is required.' });
  }

  try {
    // Verify and decode the token

const decoded = jwt.verify(token, jwtTokenSecretKey);

    // Add the decoded user information to the request object
    req.user = decoded;

    // User is authenticated, proceed to the next middleware or route handler
    return next();
  } catch (error) {
    // Token is invalid or expired, send an error response
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authenticateUser;
