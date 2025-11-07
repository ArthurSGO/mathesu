(function(){
  const msg = (t)=>{ const p=document.getElementById('error-msg'); if(p) p.textContent=t||''; };
  msg('');
  window.addEventListener('error', e=>{ console.error(e.error||e.message); const p=document.getElementById('boot-msg'); if(p) p.textContent='Erro de script: '+(e.message||'ver console'); });
  const form=document.getElementById('login-form'); if(!form){ const p=document.getElementById('boot-msg'); if(p) p.textContent='form não encontrado'; return; }
  form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    try{
      const email=document.getElementById('email').value.trim();
      const password=document.getElementById('password').value.trim();
      const r=await fetch('http://localhost:3001/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
      const data=await r.json(); if(!r.ok) throw new Error(data.message||'Falha no login');
      localStorage.setItem('token', data.token); localStorage.setItem('role', data.user?.role||'');
      location.href='dashboard.html';
    }catch(err){ console.error(err); msg(err.message); }
  });
})();