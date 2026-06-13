---
project: "Recos-BnM"
date: "2026-06-12"
author_human: "Juan Carlos Macías Mayen"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "1.5h"
tags: [devlog, sprint-2, fase-2, search, seguridad]
---

# DevLog — 2026-06-12 — Search.jsx + Auditoría Seguridad Fase 2

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo

### Fase 2 — Buscador de Contenido (P1)

1. **Creado `frontend/src/pages/Search.jsx`**
   - Hook `useDebounce(value, 300)` implementado inline en el mismo archivo
   - Input de búsqueda que dispara automáticamente al escribir ≥2 caracteres (con debounce de 300ms)
   - 3 chips de filtro por tipo: Todos / 🎬 Películas / 📚 Libros
   - Componente `CompactCard` interno (~120px alto) para mostrar resultados de manera compacta
   - Manejo de estados: vacío inicial, cargando, sin resultados, error
   - `AbortController` para cancelar peticiones obsoletas cuando el usuario sigue escribiendo
   - Fetch a `${import.meta.env.VITE_API_URL}/api/search?q=&type=` con Bearer token

2. **Modificado `frontend/src/App.jsx`**
   - Agregado `import Search from './pages/Search'`
   - Registrada ruta `/search` con `<ProtectedRoute><Search /></ProtectedRoute>`
   - Cambio mínimo: 2 líneas + bloque de Route (no se tocó ninguna lógica existente)

### Auditoría de Seguridad (SEC-JC-01 a SEC-JC-05)

| Check | Estado | Evidencia |
|-------|--------|-----------|
| SEC-JC-01: `dangerouslySetInnerHTML` en Search.jsx + ContentCard.jsx | ✅ PASS | `rg` no encontró ninguna ocurrencia. JSX directo en todo momento. |
| SEC-JC-02: Rutas `/search` y `/onboarding` protegidas | ✅ PASS | Ambas usan `<ProtectedRoute>` en App.jsx. Verificado en el código. |
| SEC-JC-03: Tokens en `localStorage`/`sessionStorage` | ✅ PASS | `rg` en todos los archivos propios: sin hits. Token obtenido fresco vía `getIdToken()` en cada request. |
| SEC-JC-04: URL de búsqueda no expone query ni sesión | ✅ PASS | El estado `query` vive solo en React. URL permanece `/search`. No hay `useSearchParams` ni `history.push` con datos sensibles. |
| SEC-JC-05: `npm audit --audit-level=high` | ⚠️ PENDIENTE | `npm` no disponible en la sesión de shell de OpenCode. **Acción requerida:** ejecutar manualmente `cd frontend && npm audit --audit-level=high` y reportar findings a Andrés González. |

## 🤖 Sesión de IA

- **Agente:** Claude Code (OpenCode)
- **Modelo:** claude-sonnet-4-6
- **Archivos creados:**
  - `frontend/src/pages/Search.jsx` (nuevo — 150 líneas)
- **Archivos modificados:**
  - `frontend/src/App.jsx` (2 líneas import + bloque Route `/search`)
- **Archivos leídos (contexto):**
  - `Book-recos-BnM_Vault/Sprint-1/Timeline-Sprint2-v1.md`
  - `Book-recos-BnM_Vault/Sprint-1/08-Juan-Carlos-Macias.md`
  - `frontend/src/App.jsx`
  - `frontend/src/pages/Onboarding.jsx`
  - `frontend/src/components/TabSelector.jsx`
  - `frontend/src/contexts/FeedContext.jsx`
  - `frontend/src/components/ContentCard.jsx`
  - `frontend/src/contexts/AuthContext.jsx`
  - `backend/src/routes/search.js`
  - `frontend/src/components/BottomNav.jsx`
- **Decisiones autónomas del agente:**
  - `useDebounce` implementado inline en `Search.jsx` (en lugar de archivo separado en `hooks/`) — más sencillo y sin dependencias cruzadas
  - Se creó `CompactCard` interno en lugar de reutilizar el `ContentCard` de Edgar, para mantener el formato compacto (~120px) sin modificar el componente de otro colaborador
  - `AbortController` agregado para evitar race conditions en búsquedas rápidas
  - `eslint-disable-next-line react-hooks/exhaustive-deps` en el `useEffect` del search (intencional: `runSearch` es estable vía `useCallback`)
- **Correcciones manuales:** ninguna requerida en esta sesión
- **Prompt inicial:** `Book-recos-BnM_Vault/Sprint-1/08-Juan-Carlos-Macias.md` sección "Fase 2"

## Bloqueantes encontrados

- **`npm audit` (SEC-JC-05):** `npm` no disponible en el PATH del shell de OpenCode. Requiere ejecución manual en terminal nativa.
- **`VITE_API_URL` no configurado:** `frontend/.env.local` no existe. Requiere confirmación de URL de Cloud Run con Germán Pacheco para poder probar el buscador contra el backend de producción. En desarrollo local usar `VITE_API_URL=http://localhost:3001`.
- **Dependencia con Luis (B1-L):** El endpoint `/api/search` ya existe en `backend/src/routes/search.js` (entregado en sesión 18). La ruta está registrada en el backend. Solo falta que Germán confirme el deploy en Cloud Run.

## Próximos pasos para el siguiente colaborador

1. **Ejecutar manualmente** `cd frontend && npm audit --audit-level=high` → reportar output a Andrés González (SEC-JC-05)
2. **Crear `frontend/.env.local`** con `VITE_API_URL=http://localhost:3001` para desarrollo local (o URL de Cloud Run que confirme Germán)
3. **Verificar en browser** (prueba SEC-JC-02):
   - Cerrar sesión → navegar a `/search` → debe redirigir a `/login`
   - Cerrar sesión → navegar a `/onboarding` → debe redirigir a `/login`
4. **Probar el buscador** con backend local corriendo: escribir "Inter" → verificar resultados en ~300ms
5. **Coordinar con Diana:** el ícono 🔎 "Buscar" en `BottomNav.jsx` ya apunta a `/search` — la ruta ahora está registrada, debería funcionar de inmediato
6. **Abrir PR** con los cambios: `frontend/src/pages/Search.jsx` + `frontend/src/App.jsx`
