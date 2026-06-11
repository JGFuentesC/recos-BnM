---
persona: "Juan Carlos Macías"
prioridad: "🔒 Resuelto — pendiente rotación de claves"
tipo: ["seguridad", "limpieza"]
fecha: "2026-06-07"
updated: "2026-06-10"
estado: "resuelto-parcial"
---

# 🔒 Alerta — Juan Carlos Macías (ACTUALIZADO 2026-06-10)

## ✅ Estado al cierre del Sprint (2026-06-10)

- **Entregable de código:** ✅ Mergeado en PR #22 — Onboarding, TabSelector, FeedContext
- **Seguridad:** 🔒 `jc.env` eliminado del tracking en PR #25 (2026-06-08)
- **Pendiente:** ⚠️ Confirmar que las API keys fueron rotadas en los paneles externos

---

## Entregables planificados
- ✅ `Onboarding.jsx` — flujo de 3 pasos (mergeado PR #22)
- ✅ `TabSelector.jsx` — selector Películas/Libros
- ✅ `FeedContext.jsx` — contexto global
- ✅ Tests: `Onboarding.test.jsx`, `TabSelector.test.jsx`

## 🔒 RESUELTO — `jc.env` eliminado (PR #25, 2026-06-08)

El archivo `jc.env` fue removido del tracking Git y `.gitignore` actualizado. Sin embargo, **las claves estuvieron expuestas públicamente** — ver acciones pendientes abajo.

## Detalle del problema original — API Keys expuestas en el repo

El archivo `jc.env` fue commiteado en la raíz del repo dentro del PR #22 y ahora está en `main` en GitHub público.

**Contiene credenciales reales:**
```
TMDB_API_KEY=eyJhbGci...        ← JWT de TMDB (API read token)
GOOGLE_BOOKS_API_KEY=AIzaSy...  ← Google Books API key
VITE_FIREBASE_API_KEY=AIzaSy... ← Firebase Web API key
VITE_FIREBASE_PROJECT_ID=...    ← Firebase project ID real
VITE_FIREBASE_APP_ID=...        ← Firebase App ID real
```

**Riesgo:** Cualquier persona que vea el repo en GitHub puede copiar estas claves y hacer llamadas a las APIs con la cuota del proyecto.

## ⚠️ Acciones aún pendientes

### 1. Revocar/regenerar las claves comprometidas
- **TMDB:** https://www.themoviedb.org/settings/api → regenerar API Read Token
- **Google Books:** https://console.cloud.google.com → APIs & Services → Credentials → borrar y crear nueva
- **Firebase:** https://console.firebase.google.com → Project Settings → regenerar Web API Key

### 2. Eliminar `jc.env` del historial de git
```bash
# Agregar al .gitignore primero
echo "jc.env" >> .gitignore
echo "*.env" >> .gitignore

# Eliminar el archivo del tracking de git
git rm --cached jc.env
git commit -m "fix: elimina jc.env con credenciales del repo"
git push
```

### 3. Mover las variables al archivo correcto
Las variables de entorno van en `frontend/.env.local` (nunca commiteado):
```bash
cp jc.env frontend/.env.local
# verificar que frontend/.env.local está en .gitignore
```

## Problema secundario — Archivos en raíz incorrecta

`PRD.md` y `sprint.md` fueron commiteados en la raíz del repo. Deberían estar en:
- `PRD.md` → ya existe en `Book-recos-BnM_Vault/01_Product/PRD.md`
- `sprint.md` → ya existe en `docs/sprint.md`

**Acción:** Eliminar los duplicados de la raíz en un PR de limpieza.

## Estado de entregables reales
| Entregable | Estado |
|---|---|
| Onboarding.jsx | ✅ Completo |
| TabSelector.jsx | ✅ Completo |
| FeedContext.jsx | ✅ Completo |
| Tests | ✅ Completo |
| jc.env | 🔒 Eliminado del tracking (PR #25) |
| Rotación de API keys | ⚠️ Confirmar con Juan Carlos |
| PRD.md / sprint.md en raíz | ⚠️ Aún presentes — limpieza pendiente |
