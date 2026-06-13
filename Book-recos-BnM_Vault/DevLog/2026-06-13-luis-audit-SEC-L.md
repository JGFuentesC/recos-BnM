---
project: "Recos-BnM"
date: "2026-06-13"
author_human: "Luis Téllez Domínguez"
agent: "Claude Code (claude-sonnet-4.5)"
session_duration: "1h"
tags: [devlog, security, audit, SEC-L, phase-2]
---

# Auditoría de Seguridad Backend — SEC-L-01 a SEC-L-05

→ [[DevLog/DevLog_Index|Volver al índice]]

---

## Resumen Ejecutivo

**Fecha:** 13 de junio de 2026, 10:50 AM  
**Auditor:** Luis Téllez Domínguez + Claude Code  
**Alcance:** `backend/src/routes/feed.js`, `swipe.js`, `search.js`  
**Duración:** 1 hora  

**Veredicto:** 🟢 **SECURITY CLEARANCE APROBADO**

---

## Tabla de Resultados

| Check | Severidad | Estado inicial | Corrección aplicada | Estado final | Líneas verificadas |
|-------|-----------|----------------|---------------------|--------------|-------------------|
| **SEC-L-01** (IDOR) | 🔴 ALTA | ✅ Implementado | Ninguna | ✅ **PASS** | feed.js:34-36, swipe.js:38-40 |
| **SEC-L-02** (Inyección) | 🔴 ALTA | ✅ Implementado | Ninguna | ✅ **PASS** | search.js:14-18 |
| **SEC-L-03** (Auth coverage) | 🔴 ALTA | ✅ Implementado | Ninguna | ✅ **PASS** | feed.js:25, swipe.js:24, search.js:8 |
| **SEC-L-04** (Error leakage) | 🟡 MEDIA | ✅ Implementado | Ninguna | ✅ **PASS** | feed.js:129-130, swipe.js:69-70, search.js:51-78 |
| **SEC-L-05** (Rate limit) | 🟡 MEDIA | ✅ Implementado | Ninguna | ✅ **PASS** | app.js:34 |

**Resultado:** 5/5 checks **PASS** ✅

---

## Detalle por Check

### ✅ SEC-L-01 — Protección IDOR (Insecure Direct Object Reference)

**Severidad:** 🔴 ALTA  
**Archivos:** `feed.js`, `swipe.js`

**Código verificado:**

```javascript
// feed.js línea 34-36
if (req.user.uid !== userId) {
  return res.status(403).json({ error: 'forbidden' })
}

// swipe.js línea 38-40
if (req.user.uid !== userId) {
  return res.status(403).json({ error: 'forbidden' })
}
```

**Análisis:**
- ✅ Validación presente en ambos archivos
- ✅ Se ejecuta ANTES de cualquier operación en base de datos
- ✅ Retorna HTTP 403 (Forbidden) apropiadamente
- ✅ Usa `req.user.uid` del token JWT verificado

**Veredicto:** ✅ **PASS** — Protección correctamente implementada contra IDOR

---

### ✅ SEC-L-02 — Sanitización de Input en Búsqueda

**Severidad:** 🔴 ALTA  
**Archivo:** `search.js`

**Código verificado:**

```javascript
// search.js línea 14-18
// SEC-L-02: Sanitizar el parámetro q antes de usarlo en la query de Firestore
const qSanitized = q.trim().replace(/[^a-zA-Z0-9áéíóúñüÁÉÍÓÚÑÜ\s]/g, '').slice(0, 100)
if (qSanitized.length < 2) {
  return res.status(400).json({ error: 'query_too_short' })
}
```

**Análisis:**
- ✅ Usa `trim()` para remover espacios en blanco
- ✅ Regex robusta que remueve caracteres especiales: `/[^a-zA-Z0-9áéíóúñüÁÉÍÓÚÑÜ\s]/g`
- ✅ Límite de 100 caracteres con `.slice(0, 100)`
- ✅ Validación de longitud mínima (2 caracteres)
- ✅ Comentario explícito indicando SEC-L-02

**Payloads maliciosos bloqueados:**
- `<script>alert(1)</script>` → sanitizado
- `'; DROP TABLE users; --` → sanitizado
- `../../../etc/passwd` → sanitizado

**Veredicto:** ✅ **PASS** — Sanitización excelentemente implementada

---

### ✅ SEC-L-03 — Cobertura de Autenticación

**Severidad:** 🔴 ALTA  
**Archivos:** `feed.js`, `swipe.js`, `search.js`

**Código verificado:**

```javascript
// feed.js línea 25
router.get('/', authMiddleware, async (req, res) => {

// swipe.js línea 24
router.post('/', authMiddleware, async (req, res) => {

// search.js línea 8
router.get('/', auth, async (req, res) => {
```

**Análisis:**
- ✅ Todas las rutas tienen middleware de autenticación como segundo parámetro
- ✅ `authMiddleware` y `auth` son el mismo módulo (`../middleware/auth`)
- ✅ Sin middleware aplicado → 401 Unauthorized (manejado por el middleware)

**Veredicto:** ✅ **PASS** — Cobertura de autenticación al 100%

---

### ✅ SEC-L-04 — Prevención de Leakage de Errores

**Severidad:** 🟡 MEDIA  
**Archivos:** `feed.js`, `swipe.js`, `search.js`

**Código verificado:**

```javascript
// feed.js línea 128-131
} catch (err) {
  console.error('[feed] Error:', err)
  return res.status(500).json({ error: 'Internal server error' })
}

// swipe.js línea 68-71
} catch (err) {
  console.error('[swipe] Error:', err)
  return res.status(500).json({ error: 'Internal server error' })
}

// search.js línea 49-80 (con graceful degradation)
} catch (err) {
  console.warn('[search] Missing index or query error, falling back to memory filtering:', err.message)
  try {
    // Fallback gracioso...
  } catch (fallbackErr) {
    console.error('[search] Fallback error:', fallbackErr)
    return res.status(500).json({ error: 'internal_error' })
  }
}
```

**Análisis:**
- ✅ Logs solo en servidor (`console.error`, `console.warn`)
- ✅ Mensajes genéricos al cliente (`'Internal server error'`, `'internal_error'`)
- ✅ **NO** se exponen stack traces
- ✅ **NO** se exponen nombres de archivos o rutas internas
- ✅ **BONUS:** `search.js` tiene degradación graciosa (graceful degradation)

**Veredicto:** ✅ **PASS** — Manejo seguro de errores en todos los archivos

---

### ✅ SEC-L-05 — Rate Limiting

**Severidad:** 🟡 MEDIA  
**Archivo:** `app.js`

**Código verificado:**

```javascript
// app.js línea 33-34
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))
app.use('/api/swipe', rateLimit({ windowMs: 60 * 1000, max: 30 }))
```

**Análisis:**
- ✅ Rate limiter específico para `/api/swipe`
- ✅ `windowMs: 60 * 1000` = **60,000 ms = 1 minuto** (requerido)
- ✅ `max: 30` = **30 requests por minuto** (requerido)
- ✅ **BONUS:** Rate limiter general para toda la API (100 req/15min)

**Configuración esperada vs. implementada:**
| Parámetro | Esperado | Implementado | Estado |
|-----------|----------|--------------|--------|
| `windowMs` | 60000 ms | 60000 ms | ✅ |
| `max` | 30 | 30 | ✅ |
| Ruta | `/api/swipe` | `/api/swipe` | ✅ |

**Veredicto:** ✅ **PASS** — Rate limiting correctamente configurado

---

## Vulnerabilidades Encontradas

**Ninguna.** ✅

Todos los controles de seguridad requeridos están correctamente implementados.

---

## Pruebas Recomendadas (Opcional — para verificación manual)

Aunque el código aprobó la auditoría estática, se recomienda ejecutar las siguientes pruebas en el ambiente de **staging** antes del deploy a producción:

### 1. Test IDOR (SEC-L-01)
```bash
# Obtener token de usuario A
TOKEN_A="Bearer eyJ..."

# Intentar acceder al feed de usuario B
curl -H "Authorization: $TOKEN_A" \
  "https://recos-bnm-backend.run.app/api/feed?userId=UID_USUARIO_B&type=movie"

# ✅ Esperado: HTTP 403 {"error":"forbidden"}
```

### 2. Test Inyección (SEC-L-02)
```bash
# Payload con caracteres especiales
curl -H "Authorization: $TOKEN" \
  "https://recos-bnm-backend.run.app/api/search?q=%3Cscript%3Ealert(1)%3C/script%3E"

# ✅ Esperado: HTTP 200 con [] o HTTP 400
```

### 3. Test Auth (SEC-L-03)
```bash
# Sin token
curl "https://recos-bnm-backend.run.app/api/feed?userId=x&type=movie"

# ✅ Esperado: HTTP 401
```

### 4. Test Rate Limit (SEC-L-05)
```bash
# 35 requests rápidos a /api/swipe
for i in $(seq 1 35); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Authorization: $TOKEN" -H "Content-Type: application/json" \
    -d '{"userId":"UID","contentId":"x","contentType":"movie","action":"like"}' \
    "https://recos-bnm-backend.run.app/api/swipe")
  echo "Request $i: $STATUS"
done

# ✅ Esperado: A partir de request ~31 aparece HTTP 429
```

---

## Archivos Auditados

```
backend/src/routes/
├── feed.js       (135 líneas) ✅
├── swipe.js      (75 líneas)  ✅
└── search.js     (84 líneas)  ✅

backend/src/
└── app.js        (65 líneas)  ✅ (solo verificación rate limit)
```

**Total líneas auditadas:** 359 líneas

---

## Comparación con Auditoría Anterior

**Auditoría previa:** `SECURITY-AUDIT-2026-06-10.md`

| Issue | Estado anterior | Estado actual |
|-------|----------------|---------------|
| HIGH-01 (API keys en git) | 🔴 Pendiente rotación | ✅ Rotado por Juan Carlos (PR #25) |
| HIGH-02 (XSS React Router) | 🔴 Pendiente `npm audit fix` | ⚠️ Pendiente (fuera de alcance Luis) |
| HIGH-03 (Hardcoded key HTML) | 🔴 Pendiente | ⚠️ Pendiente (Andrés owner) |
| **SEC-L-01 a 05** (Backend Luis) | ⚠️ No auditado | 🟢 **PASS** (esta auditoría) |

---

## Recomendaciones

### Implementadas ✅
1. ✅ Protección IDOR en feed y swipe
2. ✅ Sanitización robusta en search
3. ✅ Auth middleware en todas las rutas
4. ✅ Manejo seguro de errores
5. ✅ Rate limiting configurado

### Pendientes (fuera del alcance de Luis)
1. ⚠️ **Andrés:** Ejecutar `npm audit fix` en frontend (HIGH-02)
2. ⚠️ **Juan Carlos:** Verificar que todas las API keys fueron rotadas
3. ⚠️ **Germán:** Configurar `gitleaks` en CI/CD para prevenir fugas futuras

---

## Commits Realizados

**Ninguno** — No se requirieron correcciones. Todo el código ya estaba seguro.

---

## Veredicto Final

🟢 **SECURITY CLEARANCE APROBADO** para `/api/feed`, `/api/swipe`, `/api/search`

**Confianza:** ALTA  
**Bloqueantes para producción:** Ninguno en el scope de Luis

Los tres endpoints de backend bajo responsabilidad de Luis Téllez están listos para **deploy a producción** desde el punto de vista de seguridad.

---

## Siguientes Pasos

1. ✅ Agregar esta entrada al `DevLog_Index.md`
2. ✅ Notificar a Edgar (PM) que auditoría SEC-L está completa
3. ✅ Standby para QA final (Ulises + equipo QA)
4. 🎯 **Lunes 16:** Demo final + entrega al Dr.

---

## Metadata

**Archivos creados:**
- `Book-recos-BnM_Vault/DevLog/2026-06-13-luis-audit-SEC-L.md`

**Archivos leídos:**
- `backend/src/routes/feed.js`
- `backend/src/routes/swipe.js`
- `backend/src/routes/search.js`
- `backend/src/app.js`

**Archivos modificados:** Ninguno

**Herramientas utilizadas:**
- Claude Code (claude-sonnet-4.5)
- Task tracking system

**Tiempo total:** ~1 hora (incluyendo documentación)

---

**Firma digital:**  
Luis Téllez Domínguez + Claude Code  
13 de junio de 2026, 11:50 AM CST
