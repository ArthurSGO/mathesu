import { db } from '../db.js';
export const createAssociate=async(req,res)=>{ const {company_id,consultant_id,monthly_fee,commission_rate,start_date,end_date}=req.body;
 if(!company_id||!consultant_id||!monthly_fee||!commission_rate||!start_date) return res.status(400).json({message:'Campos obrigatórios'});
 const [r]=await db.query('INSERT INTO associates (company_id,consultant_id,monthly_fee,commission_rate,start_date,end_date) VALUES (?,?,?,?,?,?)',[company_id,consultant_id,monthly_fee,commission_rate,start_date,end_date||null]);
 res.json({ok:true,id:r.insertId}); };
export const listAssociates=async(req,res)=>{ const companyId=req.params.companyId;
 const [rows]=await db.query('SELECT a.*, u.name AS consultant_name FROM associates a JOIN users u ON u.id=a.consultant_id WHERE a.company_id=? ORDER BY a.start_date DESC',[companyId]);
 res.json({items:rows}); };
export const deleteAssociate=async(req,res)=>{ const id=req.params.id; await db.query('DELETE FROM associates WHERE id=?',[id]); res.json({ok:true}); };
