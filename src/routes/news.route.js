import express from 'express';
import { createNews, deleteNews, getAllNews, getNewsBySearch, getNewsByslug, updateNews } from '../controllers/news.controller';


const router = express.Router();


router.get('/api/news', getAllNews)
router.get('/api/news/search', getNewsBySearch)
router.get('/api/news/:slug', getNewsByslug)
router.post('/api/news', createNews)
router.patch('/api/news/:id', updateNews)
router.delete('/api/news/:id', deleteNews)

export default router;  