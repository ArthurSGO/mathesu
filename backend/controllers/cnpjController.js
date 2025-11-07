export const getCNPJ=async(req,res)=>{ const token=process.env.RECEITAWS_TOKEN; const cnpj=(req.params.cnpj||'').replace(/\D/g,'');
 if(cnpj.length!==14) return res.status(400).json({message:'CNPJ inválido'});
 try{ const r=await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}?token=${token}`); const data=await r.json(); res.json(data); }
 catch(e){ res.status(500).json({message:'Erro ReceitaWS', error:e.message}); } };
