import jwt from 'jsonwebtoken';
export const verifyToken=(req,res,next)=>{ const t=req.headers.authorization?.split(' ')[1]; if(!t) return res.status(403).json({message:'Token não fornecido.'});
  try{ req.user=jwt.verify(t,process.env.JWT_SECRET); next(); }catch{ return res.status(401).json({message:'Token inválido ou expirado.'}); } };
const order=['viewer','comercial','editor','admin'];
export const requireRole=(roles=[])=> (req,res,next)=> roles.length===0 || roles.includes(req.user.role) ? next() : res.status(403).json({message:'Sem permissão.'});
export const requireRoleAtLeast=(min)=> (req,res,next)=> order.indexOf(req.user.role)>=order.indexOf(min) ? next() : res.status(403).json({message:'Sem permissão.'});
