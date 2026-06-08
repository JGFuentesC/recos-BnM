---
project: "Recos-BnM"
owner: "Héctor Morales Marbán"
status: "Active"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [legal, tmdb, attribution, compliance]
---

# TMDB Compliance — Recos-BnM

> Requisitos de atribución y uso de la API de TMDB según sus términos de servicio.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Requisito de atribución (obligatorio)

Según los términos de uso de TMDB, **cualquier producto que use su API debe mostrar la atribución siguiente de forma visible:**

```
"This product uses the TMDB API but is not endorsed or certified by TMDB"
```

### Dónde debe aparecer en la app

| Pantalla | Tipo de atribución | Implementación |
|---|---|---|
| DetailSheet (películas) | Campo `attribution` en la respuesta del API | [[Sprint-1/05-Hector-Morales\|Héctor]] lo incluye en `GET /api/content/{id}` |
| Cualquier pantalla con datos de TMDB | Texto pequeño al pie | Considerar un footer global o nota en la pantalla de About |
| About / Configuración | Texto completo de atribución | Pendiente para Fase 2 |

---

## Implementación en el backend

`GET /api/content/{id}` incluye el campo `attribution` cuando `source === "tmdb"`:

```json
{
  "contentId": "...",
  "type": "movie",
  "title": "Inception",
  "source": "tmdb",
  "attribution": "This product uses the TMDB API but is not endorsed or certified by TMDB",
  "watchProviders": ["Netflix", "HBO Max"]
}
```

El campo `attribution` es `undefined` para ítems de `source === "google_books"`.

---

## Logo de TMDB

TMDB también requiere el uso de su logo en ciertos contextos (sección "About" o créditos). El logo oficial está disponible en:
- https://www.themoviedb.org/about/logos-attribution

**Para el MVP:** Solo el texto de atribución es suficiente. El logo puede añadirse en Fase 2.

---

## Checklist de compliance

- [ ] Texto de atribución visible en DetailSheet para películas de TMDB
- [ ] Campo `attribution` incluido en la respuesta de `GET /api/content/{id}` (Héctor)
- [ ] Sin datos de TMDB usados sin atribución visible al usuario
- [ ] Sin afirmaciones de que la app está "certificada por TMDB"
- [ ] No almacenar más datos de TMDB de los necesarios para la función del producto

---

## Límites de uso de la API (cuotas)

TMDB tiene rate limiting en su plan gratuito:

| Métrica | Límite |
|---|---|
| Requests por segundo | 50 |
| Requests por día | Sin límite oficial, pero se monitorea |

**Mitigación implementada:**
- El ingest job usa `sleep(0.25)` entre requests (4 req/s)
- El catálogo se pre-indexa en Firestore; el feed no consulta TMDB en tiempo real
- Alert cuando el ingest job supera el 70% de uso estimado diario

Ver también: [[09_Risk_Governance/Risk_Register|Risk Register]] → R01
