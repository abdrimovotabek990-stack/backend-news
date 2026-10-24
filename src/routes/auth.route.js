const express = require('express');
const {
  login,
  refreshToken,
  logout,
  logoutAllDevices,
  register,
} = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/logout-all', authenticate, logoutAllDevices);

router.get('/profile', authenticate, (req, res) => {
  res.json({ message: "Profil ma'lumotlari", user: req.user });
});

module.exports = router;   