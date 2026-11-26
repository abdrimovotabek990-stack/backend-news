import express from 'express';
import { approveNews, blockUser, getAdminNews, getAdminStats, getAdminUsers, getAdminUsersNews, rejectNews, unblockUser } from '../controllers/admin.controller.js';
import { authenticate, authorize, checkBlocked } from '../middlewares/auth.middleware.js';
import { createCategory, deleteCategory, updateCategory } from '../controllers/category.controller.js';
import { createTags, deleteTagsById, updateTagsById } from '../controllers/tag.controller.js';

const router = express.Router();


router.use('/api/admin', authenticate, checkBlocked, authorize('ADMIN'));
//admin
router.get('/api/admin/stats', getAdminStats)
router.get('/api/admin/news', getAdminNews)
router.patch('/api/admin/news/:id/approve', approveNews)
router.patch('/api/admin/news/:id/reject', rejectNews)

//admin users
router.get('/api/admin/users', getAdminUsers)
router.get('/api/admin/users/:id/news', getAdminUsersNews)
router.patch('/api/admin/users/:id/block', blockUser)
router.patch('/api/admin/users/:id/unblock', unblockUser)


// admin kategoriya vs tegs
router.post('/api/admin/categories',createCategory )
router.patch('/api/admin/categories/:id', updateCategory)
router.delete('/api/admin/categories/:id', deleteCategory)

router.post('/api/admin/tags', createTags)
router.patch('/api/admin/tags/:id', updateTagsById)
router.delete('/api/admin/tags/:id', deleteTagsById)


export default router;  