import express from 'express';
import { createCategory, deleteCategory, updateCategory } from '../controllers/category.controller.js';


const router = express.Router();

router.post('/api/categories', createCategory)
router.patch('/api/categories/:id', updateCategory)
router.delete('/api/categories/:id', deleteCategory)


export default router;  