import express from 'express'; import { verifyToken } from '../middleware/authMiddleware.js'; import { getCNPJ } from '../controllers/cnpjController.js';
const r=express.Router(); r.get('/:cnpj',verifyToken,getCNPJ); export default r;
