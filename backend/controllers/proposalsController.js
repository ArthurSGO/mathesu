import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'; import fs from 'fs/promises'; import path from 'path'; import crypto from 'crypto'; import { fileURLToPath } from 'url'; import { db } from '../db.js';
const __filename=fileURLToPath(import.meta.url); const __dirname=path.dirname(__filename);
const ensureDir=async(p)=>{ await fs.mkdir(p,{recursive:true}); };
export const generateProposal=async(req,res)=>{ try{
 const { company={}, services=[], planType='', value=0, dueDate='', consent={}, city='', date='', signatureDataUrl='' } = req.body;
 const templatePath=path.resolve(__dirname,'../assets/proposta_template.pdf'); const bytes=await fs.readFile(templatePath);
 const pdfDoc=await PDFDocument.load(bytes); const page=pdfDoc.getPages()[0]; const font=await pdfDoc.embedFont(StandardFonts.Helvetica);
 const draw=(t,x,y,s=10)=>page.drawText(String(t??''),{x,y,size:s,font,color:rgb(0,0,0)});
 let y=705; draw(company.corporate_name,150,y); y-=18; draw(company.fantasy_name,200,y); y-=18; draw(company.address,100,y); draw(company.zip,390,y); y-=18;
 draw(company.email,80,y); draw(company.instagram,300,y); draw(company.phone,500,y); y-=18; draw(company.city,60,y); draw(company.state,250,y); draw(company.cel,330,y); draw(company.whatsapp,460,y); y-=18;
 draw(company.cnpj,60,y); draw(company.ie,300,y); y-=18; draw(company.business_activity,160,y); y-=18; draw(company.foundation_date,120,y); draw(company.employees_qty,330,y); draw(company.sector,470,y); y-=18;
 draw(company.accounting,150,y); draw(company.referral,420,y); y-=18; draw(company.notes,100,y);
 draw((services||[]).join(', '),120,530); draw(planType,80,495); draw(value,150,495); draw(dueDate,275,495);
 const auths=[ consent.site?'Site: Sim':'Site: Não', consent.whatsapp?'WhatsApp: Sim':'WhatsApp: Não', consent.email?'E-mail: Sim':'E-mail: Não' ].join(' | ');
 draw(auths,90,470); draw(city,90,170); draw(date,210,170);
 let signatureHash=null; if(signatureDataUrl && signatureDataUrl.startsWith('data:image')){ const buf=Buffer.from(signatureDataUrl.split(',')[1],'base64'); signatureHash=crypto.createHash('sha256').update(buf).digest('hex');
  const img=await pdfDoc.embedPng(buf); const dims=img.scale(0.5); page.drawImage(img,{x:100,y:110,width:dims.width,height:dims.height}); }
 const out=await pdfDoc.save(); const companyId=Number(company.id)||null;
 const folder=path.resolve(__dirname,`../storage/proposals/${new Date().getFullYear()}/${companyId||'sem_empresa'}`); await ensureDir(folder);
 const filename=`proposta_${Date.now()}.pdf`; const filePath=path.join(folder,filename); await fs.writeFile(filePath,out);
 await db.query('INSERT INTO proposals (company_id,created_by,services_json,plan_type,value,due_date,consent_json,file_path,signature_sha256,status) VALUES (?,?,?,?,?,?,?,?,?,?)',
  [companyId,req.user.id,JSON.stringify(services),planType,value||0,dueDate||null,JSON.stringify(consent),filePath,signatureHash,'pendente']);
 res.setHeader('Content-Type','application/pdf'); res.setHeader('Content-Disposition',`attachment; filename="${filename}"`); res.send(Buffer.from(out));
}catch(e){ res.status(500).json({message:'Erro ao gerar PDF', error:e.message}); } };
export const listProposals=async(req,res)=>{ const {company_id,status,period}=req.query; const params=[]; let where='1=1';
 if(company_id){ where+=' AND company_id=?'; params.push(company_id); } if(status){ where+=' AND status=?'; params.push(status); } if(period){ where+=' AND DATE_FORMAT(created_at,"%Y-%m")=?'; params.push(period); }
 const [rows]=await db.query(`SELECT * FROM proposals WHERE ${where} ORDER BY created_at DESC`, params); res.json({items:rows}); };
export const uploadSigned=async(req,res)=>{ const id=req.params.id; if(!req.file) return res.status(400).json({message:'Arquivo obrigatório'}); const rel=req.file.path; await db.query('UPDATE proposals SET uploaded_signed_path=? WHERE id=?',[rel,id]); res.json({ok:true,path:rel}); };
export const approveProposal=async(req,res)=>{ const id=req.params.id; await db.query('UPDATE proposals SET status="aprovada", approved_by=?, approved_at=NOW() WHERE id=?',[req.user.id,id]);
 await db.query('INSERT INTO audit_logs(user_id,entity,entity_id,action) VALUES (?,?,?,?)',[req.user.id,'proposal',id,'APPROVE']); res.json({ok:true}); };
export const rejectProposal=async(req,res)=>{ const id=req.params.id; const reason=req.body?.reason||null; await db.query('UPDATE proposals SET status="reprovada" WHERE id=?',[id]);
 await db.query('INSERT INTO audit_logs(user_id,entity,entity_id,action,after_json) VALUES (?,?,?,?,?)',[req.user.id,'proposal',id,'REJECT',JSON.stringify({reason})]); res.json({ok:true}); };
export const downloadProposal=async(req,res)=>{ const id=req.params.id; const [[p]]=await db.query('SELECT file_path FROM proposals WHERE id=?',[id]); if(!p?.file_path) return res.status(404).json({message:'Não encontrado'}); res.download(p.file_path); };
