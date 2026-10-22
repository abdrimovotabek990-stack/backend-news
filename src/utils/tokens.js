import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const token = {
    userId: user.userId,
    role: user.role,
    tokenVersion: user.tokenVersion,
  };
  const accessToken = jwt.sign(token, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(token, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};
