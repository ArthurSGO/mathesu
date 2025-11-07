import { db } from '../db.js';
export const createCompany=async(req,res)=>{ const b=req.body||{}; if(!b.fantasy_name) return res.status(400).json({message:'Nome fantasia é obrigatório'});
 const [r]=await db.query('INSERT INTO companies (fantasy_name,corporate_name,cnpj,ie,address,zip,city,state,phone,cel,whatsapp,email,instagram,business_activity,foundation_date,employees_qty,sector,accounting,referral,notes,status,updated_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
 [b.fantasy_name,b.corporate_name,b.cnpj,b.ie,b.address,b.zip,b.city,b.state,b.phone,b.cel,b.whatsapp,b.email,b.instagram,b.business_activity,b.foundation_date,b.employees_qty||0,b.sector,b.accounting,b.referral,b.notes,'pendente',req.user.id]);
 res.json({ok:true,id:r.insertId}); };
export const searchCompanies=async(req,res)=>{ const q=(req.query.q||'').trim(); const status=(req.query.status||'').trim();
 const params=[]; let where='1=1'; if(q){ where+=' AND (fantasy_name LIKE CONCAT("%",?,"%") OR cnpj LIKE CONCAT("%",?,"%") OR city LIKE CONCAT("%",?,"%"))'; params.push(q,q,q); }
 if(status){ where+=' AND status=?'; params.push(status); }
 const [rows]=await db.query("SELECT id,fantasy_name,cnpj,city,state,sector,status,updated_at FROM companies WHERE "+where+" ORDER BY updated_at DESC LIMIT 200", params);
 res.json({items:rows}); };
export const listCompanies=async(req,res)=>{ const limit=Math.min(parseInt(req.query.limit||'100',10),500); const offset=Math.max(parseInt(req.query.offset||'0',10),0);
 const [rows]=await db.query('SELECT id,fantasy_name,cnpj,city,state,sector,status,updated_at FROM companies ORDER BY updated_at DESC LIMIT ? OFFSET ?',[limit,offset]);
 res.json({items:rows}); };
export const updateCompany=async(req,res)=>{ const id=req.params.id; const data=req.body||{};
 const [prev]=await db.query('SELECT * FROM companies WHERE id=?',[id]); const before=prev[0]||null;
 const fields=[]; const values=[]; Object.entries(data).forEach(([k,v])=>{ fields.push(`${k}=?`); values.push(v); });
 fields.push('updated_by=?'); values.push(req.user.id);
 const sql=`UPDATE companies SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`; values.push(id); await db.query(sql,values);
 await db.query('INSERT INTO audit_logs(user_id,entity,entity_id,action,before_json,after_json) VALUES (?,?,?,?,?,?)',[req.user.id,'company',id,'UPDATE',JSON.stringify(before),JSON.stringify(data)]);
 res.json({ok:true}); };
export const approveCompany=async(req,res)=>{ const id=req.params.id; await db.query('UPDATE companies SET status="ativo", approved_by=?, approved_at=NOW() WHERE id=?',[req.user.id,id]);
 await db.query('INSERT INTO audit_logs(user_id,entity,entity_id,action) VALUES (?,?,?,?)',[req.user.id,'company',id,'APPROVE']); res.json({ok:true}); };
export const rejectCompany=async(req,res)=>{ const id=req.params.id; const reason=req.body?.reason||null;
 await db.query('INSERT INTO audit_logs(user_id,entity,entity_id,action,after_json) VALUES (?,?,?,?,?)',[req.user.id,'company',id,'REJECT',JSON.stringify({reason})]); res.json({ok:true}); };
export const inactivateCompany=async(req,res)=>{ const id=req.params.id; const reason=req.body?.reason; if(!reason) return res.status(400).json({message:'Motivo é obrigatório'});
 await db.query('UPDATE companies SET status="inativo", inactivation_reason=? WHERE id=?',[reason,id]);
 await db.query('INSERT INTO audit_logs(user_id,entity,entity_id,action,after_json) VALUES (?,?,?,?,?)',[req.user.id,'company',id,'INACTIVATE',JSON.stringify({reason})]); res.json({ok:true}); };
