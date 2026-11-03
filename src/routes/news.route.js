import express from 'express';
import { optionalAuth, getNewsBySlug} from '../middlewares/auth.middleware.js';


const router = express.Router();


router.get('/api/news', optionalAuth)
router.get('/api/news/search', optionalAuth)
router.get('/api/news/:slug', optionalAuth, getNewsBySlug)
router.post('/api/news', optionalAuth)
router.patch('/api/news/:id', optionalAuth)
router.delete('/api/news/:id', optionalAuth)

export default router;  