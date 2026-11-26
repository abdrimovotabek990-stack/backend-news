import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import News from '../models/news.model.js';

export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.accessToken;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.userId);

    if (
      !user ||
      user.isBlocked ||
      user.tokenVersion !== decoded.tokenVersion
    ) {
      req.user = null;
      return next();
    }

    req.user = user;
    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
});

