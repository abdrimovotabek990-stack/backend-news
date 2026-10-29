import express from 'express';

// src/routes/auth.route.js
import { authenticate } from '../middlewares/auth.middleware.js';
import rateLimiter from '../middlewares/rateLimiter.middleware.js';
import { changePassword, login, logout, refreshToken, register, updateProfil } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/api/auth/register', rateLimiter, register);
router.post('/api/auth/login', login);
router.post('/api/auth/logout', logout);
router.post('/api/auth/refresh', refreshToken );
router.patch('/api/auth/change-password',authenticate, changePassword)
router.patch('/api/auth/updateProfile', authenticate, updateProfil);
// router.get('/api/auth/me')

router.get('/profile', authenticate, (req, res) => {
  res.json({ message: "Profil ma'lumotlari", user: req.user });
});

export default router;   
