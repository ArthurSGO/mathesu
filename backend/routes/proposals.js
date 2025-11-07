import express from 'express'; import { verifyToken,requireRole } from '../middleware/authMiddleware.js'; import { upload } from '../middleware/upload.js';
import { generateProposal,listProposals,uploadSigned,approveProposal,rejectProposal,downloadProposal } from '../controllers/proposalsController.js';
const r=express.Router(); r.post('/generate',verifyToken,requireRole(['admin','editor','comercial']),generateProposal); r.get('/list',verifyToken,listProposals);
r.post('/:id/upload-signed',verifyToken,requireRole(['admin','editor','comercial']),upload.single('file'),uploadSigned);
r.post('/:id/approve',verifyToken,requireRole(['admin','editor']),approveProposal); r.post('/:id/reject',verifyToken,requireRole(['admin','editor']),rejectProposal);
r.get('/:id/download',verifyToken,downloadProposal); export default r;
