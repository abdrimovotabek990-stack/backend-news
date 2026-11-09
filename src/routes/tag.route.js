import express from 'express';
import { createTags, deleteTagsById, getTags, updateTagsById } from '../controllers/tag.controller.js';


const router = express.Router();

router.get('/api/tags', getTags)
router.post('/api/tags',createTags)
router.patch('/api/tags/:id',updateTagsById)
router.delete('/api/tags/:id',deleteTagsById)

export default router;  