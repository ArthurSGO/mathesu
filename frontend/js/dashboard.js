(function(){
  const t=localStorage.getItem('token'); if(!t){ document.getElementById('kpiUsers').textContent='—'; return; }
  const H={'Authorization':'Bearer '+t};
  fetch('http://localhost:3001/api/dashboard/summary',{headers:H}).then(r=>r.json()).then(d=>{
    document.getElementById('kpiUsers').textContent=d.totalUsers??'—';
    document.getElementById('kpiCompanies').textContent=d.totalCompanies??'—';
    const ul=document.getElementById('recentList'); ul.innerHTML='';
    (d.recent||[]).forEach(x=>{ const li=document.createElement('li'); li.textContent=`${x.fantasy_name} • ${x.updated_by_name||'—'} • ${new Date(x.updated_at).toLocaleString()}`; ul.appendChild(li); });
  }).catch(e=>{ console.error(e); });
})(); function logout(){ localStorage.removeItem('token'); location.replace('login.html'); }