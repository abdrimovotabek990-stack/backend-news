import express from 'express';
import { createNews, deleteNews, getAllNews, getNewsBySearch, getNewsByslug, updateNews } from '../controllers/news.controller.js';
import { authenticate, checkBlocked } from '../middlewares/auth.middleware.js';
import { parseNewsBody, uploadNewsImages } from '../middlewares/upload.middleware.js';


const router = express.Router();


router.post('/api/news',authenticate, checkBlocked, uploadNewsImages, parseNewsBody, createNews);
router.patch('/api/news/:id', authenticate, checkBlocked, uploadNewsImages, updateNews);
router.get('/api/news', getAllNews)
router.get('/api/news/search', getNewsBySearch)
router.get('/api/news/:slug', getNewsByslug)
router.delete('/api/news/:id', deleteNews)

export default router;  