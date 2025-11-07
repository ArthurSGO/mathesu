import multer from 'multer'; import path from 'path'; import { fileURLToPath } from 'url';
const __filename=fileURLToPath(import.meta.url); const __dirname=path.dirname(__filename);
const storage=multer.diskStorage({ destination: (_r,_f,cb)=>cb(null, path.resolve(__dirname,'../storage/uploads')), filename:(_r,f,cb)=>cb(null, Date.now()+'_'+f.originalname.replace(/[^a-zA-Z0-9_.-]/g,'_')) });
export const upload = multer({ storage, limits:{ fileSize: 5*1024*1024 } });
