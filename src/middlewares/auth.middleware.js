import jwt from 'jsonwebtoken';


export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'Token topilmadi' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id); 
    if (!user) {
      return res.status(401).json({ message: 'Foydalanuvchi tizimda yoq' });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Token muddati tugagan yoki yaroqsiz",
      error: error.message,
    });
  }
};

export const authRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Sizda bu amal uchun ruxsat yo'q" });
      }

      return next();
    } catch (error) {
      return res.status(500).json({
        message: "Kirish qismida xatolik yuz berdi yani siz avtorizatsiya o'tmagansiz",
        error: error.message,
      });
    }
  };
};