import express from 'express';


const router = express.Router();

//admin
router.get('/api/admin/stats')
router.get('/api/admin/news',)
router.patch('/api/admin/news/:id/approve')
router.patch('/api/admin/news/:id/reject')

//admin users
router.get('/api/admin/users',)
router.get('/api/admin/users/:id/news',)
router.patch('/api/admin/users/:id/block')
router.patch('/api/admin/users/:id/unblock')


// admin kategoriya vs tegs
router.post('/api/admin/categories',)
router.patch('/api/admin/categories/:id',)
router.delete('/api/admin/categories/:id',)
router.post('/api/admin/tags',)
router.patch('/api/admin/tags/:id',)
router.delete('/api/admin/tags/:id',)


export default router;  