# CLAUDE.md — Recos BnM

## AI Governance Rules

### Project Context
- **Proyecto:** Recos BnM — Plataforma de recomendación de libros y películas (PWA)
- **Stack:** React (Vite) frontend, Node.js backend, Firebase (Hosting + Firestore)
- **Repo:** https://github.com/JGFuentesC/recos-BnM

### File Ownership
- **frontend/src/App.jsx** → Andrés — NO MODIFICAR
- **frontend/src/main.jsx** → Andrés — NO MODIFICAR (ya tiene registro SW)
- **frontend/src/components/** → Edgar / Juan Carlos / Monserrat / Marina — NO MODIFICAR
- **frontend/src/pages/** → Juan Carlos / Monserrat / Marina / Diana — NO MODIFICAR
- **frontend/src/contexts/** → Andrés / Juan Carlos — NO MODIFICAR
- **frontend/src/firebase/** → Andrés — NO MODIFICAR
- **backend/src/routes/** → Luis / Héctor / Christian — NO MODIFICAR
- **backend/src/services/** → Manuel — NO MODIFICAR
- **ingest/** → Manuel — NO MODIFICAR
- **firestore.rules, firestore.indexes.json** → Israel — NO MODIFICAR
- **.github/workflows/deploy.yml, frontend/public/sw.js, frontend/public/manifest.json** → Germán (dueño CI/CD)
- **README.md, CLAUDE.md** → Germán Pacheco (dueño)

### Before any change
- Read the agent context file at `Book-recos-BnM_Vault/Sprint-1/contexts/<NOMBRE>-agent-context.md` for the relevant contributor
- Never modify a file outside your ownership without coordinating with its owner
- Never commit real secrets or API keys

### Setup Commands
```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend emulator
firebase emulators:start --only firestore

# Ingest (requires .env with API keys)
python ingest/src/main.py

# Tests
python -m pytest ingest/tests/ -v
```

### Build & Deploy
```bash
# Build frontend
cd frontend && npm run build

# Deploy (CI/CD via GitHub Actions on push to main)
git push origin main
```
