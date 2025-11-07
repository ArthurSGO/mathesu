import express from 'express'; import { verifyToken } from '../middleware/authMiddleware.js'; import { summary,charts,commissions } from '../controllers/dashboardController.js';
const r=express.Router(); r.get('/summary',verifyToken,summary); r.get('/charts',verifyToken,charts); r.get('/commissions',verifyToken,commissions); export default r;
