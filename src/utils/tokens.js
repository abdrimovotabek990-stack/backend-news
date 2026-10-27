import jwt from 'jsonwebtoken'

export const generateToken = async (user) => {
  try {
    const token = {
      userId: user.userId,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = jwt.sign(token, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES
    });

    const refreshToken = jwt.sign(token, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(`Token yaratishda xatolik: ${error.message}`);
  }
};
