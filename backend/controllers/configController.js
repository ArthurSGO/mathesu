import { db } from '../db.js';
export const getTheme=async(_req,res)=>{ const [[c]]=await db.query('SELECT `value` v FROM settings WHERE `key`="primary_color"'); const [[t]]=await db.query('SELECT `value` v FROM settings WHERE `key`="theme"');
 res.json({primary:c?.v||process.env.PRIMARY_COLOR||'#4f86ff', theme:t?.v||process.env.THEME||'dark'}); };
export const setTheme=async(req,res)=>{ const {primary,theme}=req.body||{};
 if(primary) await db.query('INSERT INTO settings(`key`,`value`) VALUES("primary_color",?) ON DUPLICATE KEY UPDATE `value`=VALUES(`value`)',[primary]);
 if(theme) await db.query('INSERT INTO settings(`key`,`value`) VALUES("theme",?) ON DUPLICATE KEY UPDATE `value`=VALUES(`value`)',[theme]);
 res.json({ok:true}); };
