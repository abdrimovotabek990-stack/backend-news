import express from 'express';
import { createTags, deleteTagsById, getOneTag, getTags, updateTagsById } from '../controllers/tag.controller.js';


const router = express.Router();

router.get('/api/tags', getTags)
router.get('/api/tags/:id', getOneTag);
router.post('/api/tags',createTags)
router.patch('/api/tags/:id',updateTagsById)
router.delete('/api/tags/:id',deleteTagsById)

export default router;  