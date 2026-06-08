---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Planned"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "ML"
source_of_truth: false
tags: [roadmap, phase-3, ml, personalization]
---

# Fase 3 — Personalización Avanzada

> Q4 2026 (Octubre – Diciembre). Por planificar en detalle.  
> → Regresa al [[07_Roadmap/Roadmap|Roadmap]] · [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Objetivo de la fase

Recomendación inteligente basada en ML. Meta: MAU 10,000+.

---

## Features planificadas

| Feature | Descripción | Complejidad |
|---|---|---|
| ML: Collaborative filtering | Recomendar basado en usuarios con gustos similares | Alta |
| Embeddings de preferencias | Vectores de usuario entrenados con historial de swipes | Alta |
| Streaming verificado por región | Disponibilidad de streaming en tiempo real, verificada geográficamente | Media |
| Monetización | Modelo de monetización por definir (suscripción, freemium, etc.) | Media |
| Recommendation ML Agent | Agente de batch nocturno que actualiza el modelo de recomendación | Alta |

---

## Métricas objetivo de la fase

| Métrica | Meta Fase 3 |
|---|---|
| MAU | ≥ 10,000 |
| Retención D30 | Por definir |
| Precisión del modelo | Por definir (A/B test vs score actual) |

---

## Dependencias técnicas

- Datos de historial de swipes suficientes para entrenar (estimado: >100 swipes/usuario en promedio)
- Infraestructura de ML: Vertex AI (GCP) o equivalente
- El Recommendation ML Agent requiere aprobación bajo [[09_Risk_Governance/AI_Agent_Governance|AI Agent Governance]]

---

## Notas de planificación

> Este documento se detallará al inicio de Q4 2026 con métricas reales de Fases 1 y 2.  
> La decisión de monetización depende del volumen de usuarios activos alcanzado en Fase 2.  
> El modelo de ML requiere un sprint dedicado de investigación antes de implementar.
