const jwt = require('jsonwebtoken');

const generateToken = async (user) => {
  try {
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
  } catch (error) {
    throw new Error(`Token yaratishda xatolik: ${error.message}`);
  }
};

module.exports = {
  generateToken,
};