---
type: "dashboard-ejecutivo"
proyecto: "Recos-BnM"
fecha: "2026-06-10"
sprint: 1
auditor: "Claude Code + Luis Téllez Domínguez"
poc1: "2026-06-12"
poc2_final: "2026-06-15"
---

# Dashboard Ejecutivo — Sprint 1
### Recos-BnM · Actualizado: martes 10 jun 2026 · PM: Edgar Coronel

---

## ⏱️ Cuenta regresiva

```
╔══════════════════════════════════════════════════════════════╗
║  HOY: mar 10 jun          PoC 1: vie 12 jun   PoC 2: lun 15 jun  ║
║                                                                    ║
║  ██████████████████████░░░░░░░░░░░░░░░░░░░  Sprint 1              ║
║  ◄────── 6 días transcurridos ──────►  ◄── 5 días restantes ──►   ║
║                                                                    ║
║  🎯 PoC 1 en 2 días   🏁 Entrega final en 5 días                  ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 📊 Salud general del proyecto

```
ENTREGABLES COMPLETADOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Personas  ████████████░  12/13  ≈ 92%
  PRs       ████████████░  47/49  (2 cerrados sin merge)
  Tests     ████████████░  77 casos en 12 archivos

RIESGO GLOBAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🟡 MEDIO — 1 entregable crítico faltante (Library.jsx / Diana)
            + GCP deployment no funcional (secrets no configurados)
```

---

## 🗓️ Calendario vs realidad

| Fecha | Hito planificado | Estado real |
|---|---|---|
| Sáb 7 jun | Hotfixes Wave 0 (Israel) | ✅ Entregado (PR #19) |
| Dom 8 jun | Hotfixes Wave 1 (Andrés + Manuel) | ✅ Entregado (PR #16, #20) |
| Lun 9 – Mié 11 jun | Wave 2 completa (APIs + UI) | ✅ 11/12 entregados — Diana pendiente |
| **Vie 12 jun** | **🎯 PoC 1 — demo en Firebase Hosting** | ⚠️ EN RIESGO — deploy no configurado |
| Sáb 13 – Dom 14 jun | Fixes post-PoC 1 (Diana + Ulises) | 🔵 Diana: sin iniciar |
| **Lun 15 jun** | **🏁 PoC 2 / Entrega final** | ⚠️ Depende de PoC 1 + Diana |

---

## 👥 Semáforo por persona

```
Wave 0 ─────────────────────────────────────────
  🟢 Israel Pérez         Schema, índices, tests, guía Git      PRs #19 #23 #37
  
Wave 1 ─────────────────────────────────────────
  🟢 Andrés González      Auth, scaffold, FeedProvider, App     PRs #11-16 #27-32 #35 #39 #48
  🟢 Manuel Serranía      scoring.js, ingest TMDB+Books, 30+ tests  PR #20
  
Wave 2 Backend ─────────────────────────────────
  🟢 Luis Téllez          feed.js, swipe.js, 12 tests, DevLog   PR #24
  🟢 Héctor Morales       content.js, tests, DevLog             PRs #29 #34
  🟢 Imanol / Christian   collections.js, CRUD, tests           PR #30 #49
  
Wave 2 Front/Infra ─────────────────────────────
  🟢 Edgar Coronel        ContentCard, 8 tests, 126+ casos QA   PRs #26 #44-47
  🟡 Juan Carlos Macías   Onboarding, TabSelector, FeedContext  PR #22 — ⚠️ rotación API keys pendiente
  🟡 Germán Pacheco       CI/CD pipeline corregido              PRs #40 #43 — ⚠️ FIREBASE_TOKEN faltante
  
Wave 3 ─────────────────────────────────────────
  🟢 Monserrat Miranda    SwipeDeck + DetailSheet integration   PRs #33 #42
  🟢 Marina García        DetailSheet.jsx, DevLog              PR #38
  
Wave 4 ─────────────────────────────────────────
  🔴 Diana Álvarez        Library.jsx — SIN ENTREGAR           Sin rama activa
  
Wave 5 ─────────────────────────────────────────
  🟢 Ulises Chaparro      QA Suite, ROADMAP, API Collection    PR #36
```

---

## 🚨 Riesgos activos

| Prioridad | Riesgo | Impacto | Acción |
|---|---|---|---|
| 🔴 Alta | `Library.jsx` no entregada (Diana) | PoC 2 incompleto — flujo de Biblioteca roto | Escalar a Edgar (PM): reasignar o mover a Sprint 2 |
| 🔴 Alta | Secrets GCP no configurados (`FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_TOKEN`) | El deploy automático **nunca ha funcionado** — PoC 1 no es posible sin esto | Germán + Edgar: configurar en GitHub Settings esta semana |
| 🟡 Media | API keys expuestas en historial Git (`jc.env`) | Claves potencialmente comprometidas | Juan Carlos: confirmar rotación en TMDB, Google, Firebase Console |
| 🟡 Media | No hay deploy de Cloud Run configurado | Backend solo corre en local — PoC 1 solo funcionaría con frontend mock | Andrés o PM: crear `cloudbuild.yaml` o `Dockerfile` para backend |
| 🟠 Baja | `LibraryPlaceholder.jsx` en producción | Usuarios ven pantalla vacía en `/library` | Bloqueado por Diana |

---

## 📈 Velocity del equipo

```
Commits a main por día (desde Jun 7):
                                                          
  Jun 7   ████████████████████  ~20 commits  (PRs #19-24)
  Jun 8   ████████████████████████████  ~28 commits  (PRs #25-32)
  Jun 9   ████████████████████████  ~24 commits  (PRs #33-39)
  Jun 10  ████████████████████████████████  ~32 commits  (PRs #40-49)
                                                          
  Promedio: ~26 commits/día  ⬆️ Aceleración en últimas 24 hrs
```

---

## 🔗 Dependencias críticas para PoC 1 (Vie 12 jun)

```
[Auth ✅] ──► [Feed API ✅] ──► [SwipeDeck ✅] ──► [Demo PoC 1]
                                                          ↑
[ContentCard ✅] ─────────────────────────────────────────┘
                                                          ↑
[DetailSheet ✅] ─────────────────────────────────────────┘
                                                          ↑
[Firebase Hosting deploy ❌] ──────── BLOQUEANTE ─────────┘
```

**La única barrera para PoC 1 es el deploy de GCP.** Todo el código está listo.

---

## 📋 Action Items para las próximas 48h (antes de PoC 1)

| # | Acción | Responsable | Deadline |
|---|---|---|---|
| 1 | Configurar `FIREBASE_SERVICE_ACCOUNT` en GitHub Secrets | Germán / Edgar | **Hoy mié 10** |
| 2 | Configurar `VITE_FIREBASE_*` secrets en GitHub | Germán / Andrés | **Hoy mié 10** |
| 3 | Verificar que CI/CD corre verde en push a main | Germán | **Jue 11** |
| 4 | Confirmar rotación de API keys TMDB/Google/Firebase | Juan Carlos | **Hoy mié 10** |
| 5 | Escalar Library.jsx a Diana o reasignar | Edgar (PM) | **Hoy mié 10** |
| 6 | Deploy manual de backend a Cloud Run (si CI no está listo) | Andrés | **Jue 11** |
| 7 | Seed de Firestore con datos reales (no emulador) | Luis / Manuel | **Jue 11** |

---

*Generado: 2026-06-10 | Basado en 49 PRs analizados, 12 archivos de test, estado de ramas en GitHub*
