import express from 'express';
import { createNews, deleteNews, getAllNews, getMyNews, getNewsBySearch, getNewsByslug, updateNews } from '../controllers/news.controller.js';
import { authenticate, checkBlocked } from '../middlewares/auth.middleware.js';
import { parseNewsBody, uploadNewsImages } from '../middlewares/upload.middleware.js';


const router = express.Router();


router.post('/api/news',authenticate, checkBlocked, uploadNewsImages, parseNewsBody, createNews);
router.patch('/api/news/:id', authenticate, checkBlocked, uploadNewsImages, updateNews);
router.delete('/api/news/:id',authenticate, checkBlocked, deleteNews)
router.get('/api/news', getAllNews)
router.get('/api/news/my',authenticate, getMyNews)
router.get('/api/news/search', getNewsBySearch)
router.get('/api/news/:slug', getNewsByslug)

export default router;  