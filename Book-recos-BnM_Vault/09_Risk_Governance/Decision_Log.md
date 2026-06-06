---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Active"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [decisions, governance, adr]
---

# Decision Log — Recos-BnM

> Registro de decisiones arquitectónicas y de producto importantes. Cada entrada responde: ¿qué se decidió?, ¿por qué?, ¿qué alternativas se evaluaron?  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## DEC-001 — TMDB como fuente primaria de películas (no IMDb)

**Fecha:** Junio 2026  
**Estado:** ✅ Aprobada  
**Tomada por:** Eduardo Coronel (PM)

**Decisión:** Usar TMDB como API primaria para datos de películas, incluyendo metadatos, calificaciones y disponibilidad de streaming (Watch Providers). IMDb vía RapidAPI queda como enriquecimiento opcional.

**Alternativas evaluadas:**
- IMDb API oficial — No ofrece una API pública estable para este caso de uso
- IMDb vía RapidAPI — Costo adicional, sin garantía de SLA, solo como fallback

**Razón:** TMDB es gratuita, bien documentada, tiene endpoints de Watch Providers y es estable. No requiere costo adicional para el MVP.

**Impacto:** TMDB requiere atribución visible ("This product uses the TMDB API but is not endorsed or certified by TMDB"). Ver [[09_Risk_Governance/TMDB_Compliance|TMDB Compliance]].

---

## DEC-002 — Score normalizado del feed (0.7 popularidad + 0.3 rating)

**Fecha:** Junio 2026  
**Estado:** ✅ Aprobada  
**Tomada por:** Manuel Serranía (Tech) + Eduardo (PM)

**Decisión:** El algoritmo de ranking del feed usa:
```
score = 0.7 * norm(popularity) + 0.3 * norm(rating)
norm(x) = (x - min) / (max - min)  // sobre el conjunto candidato
```

**Alternativas evaluadas:**
- Solo popularidad → Sesga hacia blockbusters, ignora calidad
- Solo rating → Items con pocos votos pueden sesgarlo
- 50/50 → Sin sesgo hacia popularidad, pero la experiencia inicial puede ser peor

**Razón:** Para cold start, priorizar popularidad da una mejor primera experiencia. El ratio 70/30 es ajustable en Fase 2 con datos reales de uso.

**Revisión programada:** Fase 2 — ajustar pesos con señal de afinidad histórica.

---

## DEC-003 — PWA sobre Firebase Hosting (no App Store nativa)

**Fecha:** Junio 2026  
**Estado:** ✅ Aprobada  
**Tomada por:** Eduardo Coronel (PM)

**Decisión:** Entregar el MVP como PWA alojada en Firebase Hosting, no como app nativa iOS/Android.

**Alternativas evaluadas:**
- Flutter (iOS + Android) — Mayor esfuerzo, no justificado para MVP
- React Native — Mismo problema, deployment complejo
- PWA — Deploy simple, URL pública, sin App Store review

**Razón:** La velocidad de iteración del MVP es más importante que la distribución nativa. La PWA permite demo inmediata con URL pública y no requiere proceso de App Store.

**Impacto en UX:** El Service Worker permite funcionalidad offline parcial (shell + últimas 10 colecciones). Las notificaciones push quedan para Fase 2.

---

## DEC-004 — Feature branches → main (no GitFlow)

**Fecha:** 2026-06-04  
**Estado:** ✅ Aprobada  
**Tomada por:** Eduardo Coronel (PM)

**Decisión:** Usar feature branches simples con PR a main. No usar GitFlow (develop branch).

**Razón:** El equipo es de nivel bajo-medio y el proyecto tiene timeline corto (1 sprint MVP). GitFlow agrega overhead innecesario. Con branch protection en main y CI, el riesgo es manejable.

**Revisión:** Si hay múltiples versiones en paralelo en Fase 2, reconsiderar GitFlow o trunk-based.

---

## Cómo agregar una decisión

```markdown
## DEC-XXX — Título descriptivo de la decisión

**Fecha:** YYYY-MM-DD
**Estado:** 🔄 En evaluación | ✅ Aprobada | ❌ Rechazada | 🔁 Revisada
**Tomada por:** Nombre (Rol)

**Decisión:** Qué se decidió en 1-2 oraciones.

**Alternativas evaluadas:**
- Alternativa A — por qué no
- Alternativa B — por qué no

**Razón:** Por qué esta es la mejor opción dado el contexto.

**Impacto:** Qué cambia en el proyecto como resultado.
```
