import express from 'express'; import { login } from '../controllers/authController.js'; import { verifyToken } from '../middleware/authMiddleware.js';
const r=express.Router(); r.post('/login',login); r.get('/me',verifyToken,(req,res)=>res.json({ok:true,user:{id:req.user.id,role:req.user.role}})); export default r;
