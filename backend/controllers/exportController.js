import { db } from '../db.js'; import XLSX from 'xlsx';
export const exportCompaniesCSV=async(_req,res)=>{ const [rows]=await db.query('SELECT * FROM companies'); const header=Object.keys(rows[0]||{});
 const lines=[header.join(',')]; for(const r of rows){ lines.push(header.map(k=>{const v=r[k]; return v==null?'':String(v).replaceAll('"','""');}).join(',')); }
 res.setHeader('Content-Type','text/csv; charset=utf-8'); res.setHeader('Content-Disposition','attachment; filename="companies.csv"'); res.send(lines.join('\n')); };
export const exportCompaniesXLSX=async(_req,res)=>{ const [rows]=await db.query('SELECT * FROM companies'); const ws=XLSX.utils.json_to_sheet(rows); const wb=XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(wb,ws,'companies'); const buf=XLSX.write(wb,{type:'buffer',bookType:'xlsx'});
 res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); res.setHeader('Content-Disposition','attachment; filename="companies.xlsx"'); res.send(buf); };
