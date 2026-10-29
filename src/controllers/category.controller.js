import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createNewsSchema, updateNewsSchema } from '../validators/news.js';

export const createNews = async (req, res) => {
  try {
    const { error, value } = createNewsSchema.validate(req.body, { abortEarly: false,});

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map(mess => mess.message)
      });
    }


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Yangilikni tahrirlashda xatolik yuz berdi",
      error: error.message
    });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { error, value } = updateNewsSchema.validate(req.body, { abortEarly: false,}); 

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map(mess => mess.message)
      });
    }


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Yangilikni tahrirlashda xatolik yuz berdi",
      error: error.message
    });
  }
};