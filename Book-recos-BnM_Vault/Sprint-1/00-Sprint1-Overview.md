# Sprint 1 — Recos-BnM · Visión general y orden de trabajo

> 📋 Timeline detallado con PoCs → ver [[Timeline-Sprint1-v2]]

**⚠️ Fechas actualizadas (v2.0 — 2026-06-06):**
| Hito | Fecha | Descripción |
|---|---|---|
| Hotfixes Wave 0+1 | Sáb 7 – Dom 8 jun | Israel + Andrés + Manuel cierran sus correcciones |
| Wave 2 completa | Lun 9 – Mié 11 jun | Backend APIs + UI components listos |
| **PoC 1 en GCP** | **Vie 12 jun** | Demo en Firebase Hosting: login → swipe → guardar |
| Fixes post-PoC 1 | Sáb 13 – Dom 14 jun | Diana + Ulises + bugs del PoC 1 |
| **PoC 2 / Entrega final** | **Lun 15 jun** | MVP completo con Biblioteca + QA + ROADMAP |

**Project Manager:** [[PM-Edgar-Coronel|Eduardo Coronel]] ← empieza aquí

---

## Orden de ejecución (Waves)

> ⚠️ **No es posible trabajar todos en paralelo desde el día 1.**  
> Seguir este orden evita retrabajo y bloqueos.

```
WAVE -1 — Eduardo (PM) configura infraestructura ANTES que todos
└── Eduardo Coronel  → GCP, Firebase, GitHub repo, API keys, Secrets

WAVE 0-FIX  [SAT 7 JUN] — Hotfixes bloqueantes (Israel ya entregó, hay errores)
└── 🔴 Israel Pérez  → Corregir SCHEMA.md + índices vacíos + firebase.json incompleto + tests vacíos
                        ⏱️ Deadline: domingo 8 por la noche

WAVE 1-FIX  [SAT 7 – SUN 8 JUN] — Andrés y Manuel arrancan / corrigen
├── 🔴 Andrés González  → Construir todo desde cero (frontend React + backend + auth.js + app.js scaffold)
│                          ⏱️ Deadline: domingo 8 por la noche — BLOQUEA A 8 PERSONAS
└── 🟠 Manuel Serranía  → Fix models.py (nombres de campo) + re-ingest + scoring.js en backend/
                           ⏱️ Necesita schema de Israel (sáb) → termina domingo 8

WAVE 2  [MON 9 – WED 11 JUN] — En paralelo (todos arrancan el lunes)
├── 🟡 Luis Téllez      → API /feed + /swipe (necesita auth.js de Andrés ✅)
├── 🟡 Héctor Morales   → API /content/{id} (necesita auth.js + content poblado)
├── 🟡 Christian Ruiz   → API CRUD /collections GET+POST+PATCH+DELETE
├── 🟡 Edgar Coronel    → UI ContentCard ✅ INDEPENDIENTE — puede iniciar hoy con mocks
├── 🟡 Juan Carlos      → UI Onboarding + Tab Selector (necesita auth de Andrés)
└── 🟡 Germán Pacheco   → CI/CD ✅ INDEPENDIENTE — hello world antes del domingo 8

WAVE 3  [WED 11 – THU 12 JUN] — Integración
├── 🟢 Monserrat Miranda → UI SwipeDeck (necesita ContentCard + /api/feed)
└── 🟢 Marina García     → UI DetailSheet (necesita /api/content + /api/collections)

🎯 PoC 1  [FRI 12 JUN] — Demo en GCP: login → onboarding → swipe → detalle → guardar

WAVE 4  [SAT 13 – SUN 14 JUN] — Post-PoC 1 (fin de semana)
├── 🔵 Diana Álvarez     → UI Biblioteca completa con API real (puede empezar con mocks el mié 11)
└── ⚪ Ulises Chaparro   → QA manual + Postman + ROADMAP.md (puede empezar borrador el mié 11)

🎯 PoC 2 / ENTREGA FINAL  [MON 15 JUN] — MVP completo
```

---

## ✅ Discrepancia resuelta — `GET /api/collections`

| Campo | Detalle |
|---|---|
| Endpoint | `GET /api/collections?userId=&type=&listName=` |
| Quién lo necesita | [[12-Diana-Alvarez\|Diana]] (Biblioteca) |
| Asignado en Excel (incorrecto) | "Héctor" — error de asignación |
| **Asignado correctamente a** | **[[06-Christian-Ruiz\|Christian Ruiz]]** |
| Fecha de resolución | 2026-06-05 |
| Registrado en | [[00_Start_Here/Vault_Changelog\|Vault Changelog]] v1.1 |

---

## Mapa de dependencias

| Persona | Archivo | Necesita de... | La necesitan... |
|---|---|---|---|
| [[PM-Edgar-Coronel\|Eduardo (PM)]] | [[PM-Edgar-Coronel]] | — (primero) | Todos (infraestructura) |
| [[01-Israel-Perez\|Israel]] | [[01-Israel-Perez]] | Eduardo (infra) | [[02-Andres-Gonzalez\|Andrés]], [[03-Manuel-Serrania\|Manuel]], [[04-Luis-Tellez\|Luis]], [[05-Hector-Morales\|Héctor]], [[06-Christian-Ruiz\|Christian]], [[12-Diana-Alvarez\|Diana]] |
| [[02-Andres-Gonzalez\|Andrés]] | [[02-Andres-Gonzalez]] | [[01-Israel-Perez\|Israel]] | [[04-Luis-Tellez\|Luis]], [[05-Hector-Morales\|Héctor]], [[06-Christian-Ruiz\|Christian]], [[07-Edgar-Coronel\|Edgar]], [[08-Juan-Carlos-Macias\|Juan Carlos]], [[10-Monserrat-Miranda\|Monserrat]], [[11-Marina-Garcia\|Marina]], [[12-Diana-Alvarez\|Diana]], [[09-German-Pacheco\|Germán]] |
| [[03-Manuel-Serrania\|Manuel]] | [[03-Manuel-Serrania]] | [[01-Israel-Perez\|Israel]] | [[04-Luis-Tellez\|Luis]], [[05-Hector-Morales\|Héctor]], [[08-Juan-Carlos-Macias\|Juan Carlos]] |
| [[04-Luis-Tellez\|Luis]] | [[04-Luis-Tellez]] | [[02-Andres-Gonzalez\|Andrés]], [[03-Manuel-Serrania\|Manuel]], [[01-Israel-Perez\|Israel]] | [[10-Monserrat-Miranda\|Monserrat]], [[07-Edgar-Coronel\|Edgar]] |
| [[05-Hector-Morales\|Héctor]] | [[05-Hector-Morales]] | [[02-Andres-Gonzalez\|Andrés]], [[03-Manuel-Serrania\|Manuel]], [[01-Israel-Perez\|Israel]] | [[11-Marina-Garcia\|Marina]] |
| [[06-Christian-Ruiz\|Christian]] | [[06-Christian-Ruiz]] | [[02-Andres-Gonzalez\|Andrés]], [[01-Israel-Perez\|Israel]] | [[11-Marina-Garcia\|Marina]], [[12-Diana-Alvarez\|Diana]] |
| [[07-Edgar-Coronel\|Edgar]] | [[07-Edgar-Coronel]] | [[02-Andres-Gonzalez\|Andrés]] | [[10-Monserrat-Miranda\|Monserrat]], [[11-Marina-Garcia\|Marina]] |
| [[08-Juan-Carlos-Macias\|Juan Carlos]] | [[08-Juan-Carlos-Macias]] | [[02-Andres-Gonzalez\|Andrés]], [[03-Manuel-Serrania\|Manuel]] | [[10-Monserrat-Miranda\|Monserrat]] |
| [[09-German-Pacheco\|Germán]] | [[09-German-Pacheco]] | [[02-Andres-Gonzalez\|Andrés]] | [[13-Ulises-Chaparro\|Ulises]] |
| [[10-Monserrat-Miranda\|Monserrat]] | [[10-Monserrat-Miranda]] | [[07-Edgar-Coronel\|Edgar]], [[04-Luis-Tellez\|Luis]], [[02-Andres-Gonzalez\|Andrés]] | [[12-Diana-Alvarez\|Diana]] |
| [[11-Marina-Garcia\|Marina]] | [[11-Marina-Garcia]] | [[05-Hector-Morales\|Héctor]], [[06-Christian-Ruiz\|Christian]], [[07-Edgar-Coronel\|Edgar]] | [[12-Diana-Alvarez\|Diana]] |
| [[12-Diana-Alvarez\|Diana]] | [[12-Diana-Alvarez]] | [[02-Andres-Gonzalez\|Andrés]], [[06-Christian-Ruiz\|Christian]], [[10-Monserrat-Miranda\|Monserrat]] | — |
| [[13-Ulises-Chaparro\|Ulises]] | [[13-Ulises-Chaparro]] | [[04-Luis-Tellez\|Luis]], [[05-Hector-Morales\|Héctor]], [[09-German-Pacheco\|Germán]] | — |

---

## Standup diario async (mientras dure Sprint 1)

Cada mañana antes de las 9 AM, cada colaborador posta en el canal del equipo:

```
📅 [Nombre] — [fecha]
✅ Terminé: [qué entregué ayer]
🔄 En progreso: [en qué estoy hoy]
🔴 Bloqueado por: [quién / qué / o "nada"]
```

> Eduardo revisa los 🔴 y responde en <30 min. Si no hay mensaje → Eduardo hace ping directo.

---

## Archivos del sprint

| Wave | Archivo | Persona | Entregable clave |
|---|---|---|---|
| PM | [[PM-Edgar-Coronel]] | Eduardo Coronel | GCP, repo, secrets, coordinación |
| 0 | [[01-Israel-Perez]] | Israel Pérez García | Schema + reglas + emulador |
| 1 | [[02-Andres-Gonzalez]] | Andrés González Habib | Firebase Auth + middleware |
| 1 | [[03-Manuel-Serrania]] | Manuel Serranía Reinada | Ingest job + scoring.js |
| 2 | [[04-Luis-Tellez]] | Luis Téllez Domínguez | API /feed + /swipe |
| 2 | [[05-Hector-Morales]] | Héctor Morales Marbán | API /content/{id} |
| 2 | [[06-Christian-Ruiz]] | Christian Ruiz Hurtado | API CRUD /collections |
| 2 | [[07-Edgar-Coronel]] | Edgar Coronel Navarrete | UI ContentCard |
| 2 | [[08-Juan-Carlos-Macias]] | Juan Carlos Macías Mayen | UI Onboarding + Tab Selector |
| 2 | [[09-German-Pacheco]] | Germán Pacheco Castillo | CI/CD + Service Worker |
| 3 | [[10-Monserrat-Miranda]] | Monserrat Miranda Olivas | UI SwipeDeck |
| 3 | [[11-Marina-Garcia]] | Marina García del Buey | UI DetailSheet |
| 4 | [[12-Diana-Alvarez]] | Diana Álvarez Varela | UI Biblioteca |
| 5 | [[13-Ulises-Chaparro]] | Ulises Chaparro Ximello | QA + Postman + ROADMAP |
