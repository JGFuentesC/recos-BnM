---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Approved"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [security, secrets, governance]
---

# Security Model — Recos-BnM

> Política de manejo de secretos, accesos a infraestructura y reglas de seguridad del proyecto.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Política de secretos

### Regla fundamental

> ❌ **NUNCA** commitear secretos al repositorio. Ningún API key, token, contraseña, ni service account JSON debe estar en el código.

### Dónde viven los secretos

| Secreto | Dónde se guarda | Quién tiene acceso |
|---|---|---|
| `VITE_FIREBASE_*` (frontend) | GitHub Secrets (CI/CD) | Eduardo + Germán (CI setup) |
| `TMDB_API_KEY` | GitHub Secrets + `.env.local` dev | Eduardo, Manuel |
| `GOOGLE_BOOKS_API_KEY` | GitHub Secrets + `.env.local` dev | Eduardo, Manuel |
| `FIREBASE_TOKEN` (CI) | GitHub Secrets | Eduardo + Germán |
| `GOOGLE_APPLICATION_CREDENTIALS` | Solo en producción Cloud Run | Solo Cloud Run (service account) |

### Distribución de secretos al equipo

- Eduardo distribuye los valores de `.env.local` **por canal privado** (DM directo, no Slack público ni correo con CC)
- Cada dev crea su propio `.env.local` local con los valores recibidos
- Los valores de producción (Cloud Run) nunca salen de GCP Console

---

## Accesos a infraestructura GCP

| Recurso | Quién tiene acceso | Nivel de acceso |
|---|---|---|
| GCP Console (proyecto recos-bnm) | **Solo Eduardo** | Owner |
| Firebase Console | **Solo Eduardo** | Admin |
| Firestore (producción) | Nadie del equipo directamente | — (todo pasa por API) |
| Cloud Run (producción) | **Solo Eduardo** | Deploy via GitHub Actions |
| GitHub Actions | Eduardo + Germán | Setup de secrets y workflows |

### Regla de acceso a producción

> El equipo trabaja **exclusivamente contra el emulador** (`localhost:8080/9099`). Nadie tiene credenciales para acceder directamente a Firestore de producción, salvo Eduardo para tareas de mantenimiento.

---

## Reglas de seguridad de Firestore

Las reglas canónicas están en `firestore.rules`. Resumen:

```javascript
// users/{userId} — Solo el dueño puede leer/escribir
allow read, write: if request.auth != null && request.auth.uid == userId;

// swipes/{swipeId} — Solo el dueño puede crear swipes propios
allow read, write: if request.auth != null
  && request.resource.data.userId == request.auth.uid;

// collections/{collectionId} — Solo el dueño puede CRUD
allow read, write: if request.auth != null
  && (resource == null || resource.data.userId == request.auth.uid);

// content/{contentId} — Todos los usuarios autenticados pueden LEER
// NADIE puede escribir directamente (solo el ingest job via Admin SDK)
allow read: if request.auth != null;
allow write: if false;
```

> **Cambios en `firestore.rules` requieren:**
> 1. `/security-review` con Claude Code
> 2. Review adicional de Eduardo
> 3. Tests de reglas en el emulador antes de deploy

---

## Middleware de autenticación (backend)

Todos los endpoints de `/api/*` están protegidos por `backend/src/middleware/auth.js`:

```javascript
// Comportamiento esperado:
// - Request sin header Authorization → 401
// - Request con token inválido/expirado → 401
// - Request con token válido → req.user = { uid, email } → siguiente middleware
```

**Regla de seguridad de backend:**
- Los endpoints verifican que `req.user.uid === userId` del body/query
- Un usuario nunca puede leer o modificar datos de otro usuario
- Los errores de autenticación responden solo "Unauthorized" (sin detalle del error real)

---

## Escaneo de dependencias

```bash
# Correr antes de cada release
npm audit --audit-level=high

# Si hay vulnerabilidades HIGH/CRITICAL:
# 1. Identificar la dependencia afectada
# 2. Actualizar o buscar alternativa
# 3. No hacer deploy hasta que npm audit pase sin HIGH/CRITICAL
```

El CI (GitHub Actions) incluye `npm audit` en el pipeline de build.

---

## Incidentes de seguridad

Si se sospecha que un secreto fue comprometido:

1. **Inmediatamente:** Notificar a Eduardo por teléfono (no Slack)
2. Eduardo rota el secreto en GCP/GitHub Secrets
3. Eliminar el commit del historial si el secreto fue commiteado (git filter-branch o BFG)
4. Revisar los logs de Cloud Run de las últimas 24h para detectar uso no autorizado
5. Registrar el incidente en [[09_Risk_Governance/Decision_Log|Decision Log]]
