---
persona: "Ulises Chaparro"
prioridad: "🟠 Normal"
tipo: ["sin-iniciar", "bloqueado-por-wave3"]
fecha: "2026-06-07"
wave: 5
---

# 🟠 Alerta — Ulises Chaparro

## Entregables planificados (Wave 5 — QA)
- ❌ Casos de prueba documentados para cada HU
- ❌ Verificación de endpoints backend contra emulador
- ❌ Reporte de bugs encontrados

## Estado actual
Branch `feat/Uly` solo contiene el archivo de contributor.
**No hay trabajo de QA iniciado.**

## Lo que ya puede verificar hoy (sin esperar Wave 3)

Los siguientes endpoints están en `main` y listos para QA:

### Backend disponible ✅
| Endpoint | Cómo probar |
|---|---|
| `GET /api/feed` | Ver guía de pruebas en `backend/scripts/seed.js` |
| `POST /api/swipe` | curl con token del emulador |
| `GET /api/private/ping` | Verifica auth middleware |

### Cómo arrancar el entorno de QA
```bash
# Terminal 1 — Emuladores
firebase emulators:start --only auth,firestore --project recos-bnm

# Terminal 2 — Backend
cd backend
FIRESTORE_EMULATOR_HOST=localhost:8080 node src/app.js

# Terminal 3 — Seed + pruebas
node scripts/seed.js <uid>
```

## Casos de prueba mínimos requeridos

### Feed
- [ ] Sin token → 401
- [ ] Con token inválido → 401
- [ ] Sin `type` → 400
- [ ] `type` = "movie" → 200, array de películas
- [ ] `type` = "book" → 200, array de libros
- [ ] Después de swipe → ítem desaparece del feed
- [ ] `cursor` = 10 → segunda página distinta de primera

### Swipe
- [ ] Like válido → 204
- [ ] Dislike válido → 204
- [ ] `action` = "superlike" → 400
- [ ] Sin `contentId` → 400
- [ ] Sin token → 401

## Formato de reporte esperado
Crear `Book-recos-BnM_Vault/06_QA_Validation/QA-Report-Sprint1.md` con:
- Casos ejecutados
- Resultado (PASS/FAIL)
- Bugs encontrados con reproducción

## Fecha límite
**Miércoles 10 jun 2026** — el reporte de QA es el último paso antes del release.
