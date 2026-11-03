import express from 'express';
import * as adminController from '../controllers/admin.controller.js';

const router = express.Router();

//admin
router.get('/api/admin/stats', adminController.getAdminStats)
router.get('/api/admin/news', adminController.getAdminNews)
router.patch('/api/admin/news/:id/approve', adminController.approveNews)
router.patch('/api/admin/news/:id/reject', adminController.rejectNews)

//admin users
router.get('/api/admin/users', adminController.getAdminUsers)
router.get('/api/admin/users/:id/news', adminController.getAdminUsersNews)
router.patch('/api/admin/users/:id/block', adminController.blockUser)
router.patch('/api/admin/users/:id/unblock', adminController.unblockUser)


// admin kategoriya vs tegs
router.post('/api/admin/categories', adminController.createCategory)
router.patch('/api/admin/categories/:id', adminController.updateCategory)
router.delete('/api/admin/categories/:id', adminController.deleteCategory)

router.post('/api/admin/tags', adminController.createTags)
router.patch('/api/admin/tags/:id', adminController.updateTagsById)
router.delete('/api/admin/tags/:id', adminController.deleteTagsById)


export default router;  