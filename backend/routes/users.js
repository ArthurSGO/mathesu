import express from 'express'; import { verifyToken,requireRole } from '../middleware/authMiddleware.js'; import { listUsers,createUser,updateUser,deleteUser } from '../controllers/usersController.js';
const r=express.Router(); r.get('/list',verifyToken,requireRole(['admin']),listUsers); r.post('/create',verifyToken,requireRole(['admin']),createUser);
r.put('/:id',verifyToken,requireRole(['admin']),updateUser); r.delete('/:id',verifyToken,requireRole(['admin']),deleteUser); export default r;
