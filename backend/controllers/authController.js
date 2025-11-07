import bcrypt from 'bcrypt'; import jwt from 'jsonwebtoken'; import { db } from '../db.js';
export const login=async(req,res)=>{ const {email,password}=req.body; const[rows]=await db.query('SELECT id,name,email,password,role FROM users WHERE email=?',[email]);
 if(!rows.length) return res.status(401).json({message:'E-mail não encontrado.'}); const u=rows[0];
 const ok=await bcrypt.compare(password,u.password); if(!ok) return res.status(401).json({message:'Senha incorreta.'});
 const token=jwt.sign({id:u.id,role:u.role},process.env.JWT_SECRET,{expiresIn:'1d'}); res.json({token,user:{id:u.id,name:u.name,role:u.role}}); };
