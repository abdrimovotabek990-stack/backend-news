import express from 'express';

// src/routes/auth.route.js
import { authenticate } from '../middlewares/auth.middleware.js';
import rateLimiter from '../middlewares/rateLimiter.middleware.js';
import { login, logout, logoutAllDevices, refreshToken, register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', rateLimiter, register);
router.post('/refresh', refreshToken );
router.post('/logout', logout);
router.post('/logout-all', authenticate, logoutAllDevices);

router.get('/profile', authenticate, (req, res) => {
  res.json({ message: "Profil ma'lumotlari", user: req.user });
});

export default router;   
