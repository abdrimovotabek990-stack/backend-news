import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/tokens.js'; 
import { cookieOptions } from '../config/cookie.js'; 
import User from '../models/user.model.js'; 

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "E-mail allaqachon ro'yxatdan o'tgan" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = new User({
      name: name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Ro'yxatdan muvaffaqiyatli o'tdingiz",
      user: {email: newUser.email, name: newUser.name},
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ro'yxatdan o'tishda xatolik yuz berdi",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email yoki parol noto'g'ri" });
    }

    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
      return res.status(400).json({ message: "Email yoki parol noto'g'ri" });
    }

    const { accessToken, refreshToken } = await generateToken({
      userId: user.userId,
      role: user.role,
      tokenVersion: user.tokenVersion || 0,
    });

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,    
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.status(200).json({
      message: "Tizimga kiridingiz",
      user: {
        id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Kirish jarayonida xatolik yuz berdi, itimos qaytadan urinib ko'ring",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    return res.status(200).json({ message: "Tizimdan muvaffaqiyatli chiqdingiz" });
  } catch (error) {
    return res.status(500).json({
      message: "Chiqishda xatolik yuz berdi, qaytadan urinib ko'ring",
      error: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const checkRefreshToken = req.cookies.refreshToken;

    if (!checkRefreshToken) {
      return res.status(401).json({ message: "Refresh token topilmadi" });
    }

    let decoded;
    try {
      decoded = jwt.verify(checkRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie('refreshToken', cookieOptions);
      return res.status(401).json({ message: "Refresh token muddati tugagan yoki yaroqsiz" });
    }

    const user = await User.findById(decoded.userId);

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie('refreshToken', cookieOptions);
      return res.status(401).json({ message: "Token yaroqsizlig uchun bekor qilingan, qaytadan kiring" });
    }

    const tokens = await generateToken({
      userId: user.userId,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minut ishlaydi
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 kun ishlaydi
    });

    return res.status(200).json({ message: "Tokeningiz yangilandi" });
  } catch (error) {
    return res.status(500).json({
      message: "Tokenni yangilashda server xatoligi yuz berdi, qaytadan urinib ko'ring",
      error: error.message,
    });
  }
};

export const currentUser = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}