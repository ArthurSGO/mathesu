import bcrypt from 'bcrypt'; import { db } from '../db.js';
export const listUsers=async(_req,res)=>{ const [rows]=await db.query('SELECT id,name,email,role,created_at FROM users ORDER BY created_at DESC'); res.json({items:rows}); };
export const createUser=async(req,res)=>{ const {name,email,password,role}=req.body; if(!name||!email||!password||!role) return res.status(400).json({message:'Campos obrigatórios'});
 const hash=await bcrypt.hash(password,10); await db.query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)',[name,email,hash,role]); res.json({ok:true}); };
export const updateUser=async(req,res)=>{ const id=req.params.id; const {name,email,password,role}=req.body; const f=[]; const v=[];
 if(name){f.push('name=?');v.push(name);} if(email){f.push('email=?');v.push(email);} if(password){f.push('password=?');v.push(await bcrypt.hash(password,10));} if(role){f.push('role=?');v.push(role);}
 if(!f.length) return res.status(400).json({message:'Nada para atualizar'}); await db.query(`UPDATE users SET ${f.join(', ')} WHERE id=?`,[...v,id]); res.json({ok:true}); };
export const deleteUser=async(req,res)=>{ await db.query('DELETE FROM users WHERE id=?',[req.params.id]); res.json({ok:true}); };
