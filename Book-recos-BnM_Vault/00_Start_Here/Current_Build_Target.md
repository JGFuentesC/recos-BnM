---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Active"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [sprint, build-target]
---

# Current Build Target — Sprint 1

> Actualizar este archivo cada lunes con el objetivo de la semana.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## 🎯 Objetivo de esta semana (4–10 jun 2026)

**Entregar un MVP funcional** con Auth, Feed de swipe, Detalle y Biblioteca desplegado en Firebase Hosting para la demo del Dr. el martes 10 de junio.

---

## 🔴 Bloqueante absoluto — Empieza AHORA

| Quién | Tarea | Por qué es bloqueante |
|---|---|---|
| [[Sprint-1/01-Israel-Perez\|Israel Pérez]] | Schema Firestore + reglas de seguridad + emulador | **12 personas dependen de este trabajo**. Sin schema, nadie puede escribir código que funcione. |

**Israel debe entregar antes de que cualquier otro empiece a integrar.**

---

## 📅 Orden de trabajo esta semana

```
Hoy (jun 4):   Israel → Schema + Emulador
                Eduardo → GCP + Firebase + GitHub repo + API keys

Día 2 (jun 5): Andrés → Firebase Auth + middleware
                Manuel → Ingest job TMDB/Books + scoring.js

Día 3 (jun 6): Luis, Héctor, Christian → APIs backend
                Edgar, Juan Carlos, Germán → UI con mocks

Sábado (jun 7): ← Germán: "Hello World" en Firebase Hosting

Lunes (jun 9):  Monserrat + Marina → UI integrada

Martes (jun 10): Demo → App funcional en URL pública
```

---

## ✅ Checklist de listo para demo

- [ ] Login con Google funciona end-to-end
- [ ] Onboarding de 5 tarjetas completo
- [ ] Feed de swipe con películas y libros reales (desde Firestore)
- [ ] DetailSheet abre al tocar tarjeta
- [ ] "Guardar" → ítem aparece en Biblioteca
- [ ] URL pública de Firebase Hosting activa
- [ ] Happy path sin bugs bloqueantes (Ulises certifica)

---

## ✅ Discrepancia resuelta (2026-06-05)

| Endpoint | Estado | Responsable |
|---|---|---|
| `GET /api/collections` | ✅ **Asignado a Christian** | [[Sprint-1/06-Christian-Ruiz\|Christian Ruiz]] tiene el CRUD completo |

---

## 📊 Estado del Sprint por Wave

| Wave | Personas | Estado |
|---|---|---|
| -1 (PM) | [[PM-Edgar-Coronel\|Eduardo]] | 🔄 En proceso |
| 0 | [[Sprint-1/01-Israel-Perez\|Israel]] | ⏳ Pendiente |
| 1 | [[Sprint-1/02-Andres-Gonzalez\|Andrés]], [[Sprint-1/03-Manuel-Serrania\|Manuel]] | ⏳ Esperando Wave 0 |
| 2 | Luis, Héctor, Christian, Edgar, Juan Carlos, Germán | ⏳ Esperando Wave 1 |
| 3 | Monserrat, Marina | ⏳ Esperando Wave 2 |
| 4 | Diana | ⏳ Esperando Wave 3 |
| 5 | Ulises | ⏳ Esperando todo |
