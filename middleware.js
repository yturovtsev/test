const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';
const User = require('./models/User');

const withAuth = function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

  if (!token) {
    res.status(401).json({ 'error': 'Unauthorized: No token provided' });
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        console.log('verify, but err');
        res.status(401).json({ 'error': 'Unauthorized: Invalid token' });
      } else {
        console.log('decoded', decoded);
        const { email } = decoded;

        User.findOne({ email }, function(err, user) {
          if (err) {
            console.error(err);
            res.status(500)
              .json({
                error: 'Internal error please try again'
              });
          } else if (!user) {
            res.status(401)
              .json({
                error: 'Incorrect email or password'
              });
          } else {
            req.email = email;
            next();
          }
        });
      }
    });
  }
};

module.exports = withAuth;
