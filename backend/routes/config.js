import express from 'express'; import { verifyToken,requireRole } from '../middleware/authMiddleware.js'; import { getTheme,setTheme } from '../controllers/configController.js';
const r=express.Router(); r.get('/theme',verifyToken,requireRole(['admin']),getTheme); r.post('/theme',verifyToken,requireRole(['admin']),setTheme); export default r;
