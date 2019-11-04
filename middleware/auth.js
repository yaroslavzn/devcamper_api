const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }

  await jwt.verify(token, process.env.JWT_SECRET, async function(err, decode) {
    if (err) {
      return next(new ErrorResponse('Not authorize to access this route', 401));
    }

    const user = await User.findById(decode.id);

    req.user = user;

    next();
  });
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route.`,
          403
        )
      );
    }

    next();
  };
};
