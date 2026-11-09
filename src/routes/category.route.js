import express from 'express';
import { createCategory } from '../controllers/category.controller';


const router = express.Router();

router.get('/api/categories', createCategory)


export default router;  