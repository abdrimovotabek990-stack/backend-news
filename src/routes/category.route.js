import express from 'express';
import { createCategory } from '../controllers/category.controller.js';


const router = express.Router();

router.post('/api/categories', createCategory)


export default router;  