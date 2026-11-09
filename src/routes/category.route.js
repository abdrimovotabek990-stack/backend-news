import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getOneCategory, updateCategory } from '../controllers/category.controller.js';


const router = express.Router();


router.get('/api/categories', getAllCategories)
router.get('/api/categories/:id', getOneCategory)
router.post('/api/categories', createCategory)
router.patch('/api/categories/:id', updateCategory)
router.delete('/api/categories/:id', deleteCategory)


export default router;  