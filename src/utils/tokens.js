import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


export const generateToken = async (user) => {
  try {
    const payload = {
      userId: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    console.log(process.env.JWT_ACCESS_SECRET);
    
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(`Token yaratishda xatolik: ${error.message}`);
  }
};
