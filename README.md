# Sistema-Propostas (Rebuild)
## Passos
1. MySQL (XAMPP) → crie DB `tcc_propostas` e rode os SQLs em `backend/sql` (na ordem).
2. Backend:
```bash
cd backend
copy .env.example .env  # ou cp .env.example .env
npm install
npm start
```
3. Frontend: abra **via HTTP**: `http://localhost/Sistema-Propostas-Rebuild/frontend/login.html`
- Evite `file:///...` para não bloquear JS/CSS.
4. Login seed: **admin@empresa.com / admin123**
