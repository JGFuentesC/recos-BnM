---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Approved"
version: "2.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [prd, product]
---

# PRD — Recos-BnM

> El PRD canónico vive en la raíz del vault: [[PRD Recos-BnM]]  
> Este archivo es un puntero de la estructura 01_Product/ hacia el documento principal.

---

## Resumen ejecutivo

**Proyecto:** Tinder de Contenidos (Películas y Libros)  
**Versión:** 2.0 (refactor: catálogo, métricas, riesgos y contratos de API)  
**Stack:** Firebase Auth · Cloud Run · Firestore · Firebase Hosting  
**APIs externas:** TMDB (primaria) · Google Books · IMDb vía RapidAPI (fallback opcional)

**North Star:** Swipes calificados por usuario activo semanal

---

## Secciones clave del PRD

| Sección | Contenido                                                                      |
| ------- | ------------------------------------------------------------------------------ |
| §2      | Visión, North Star, objetivos del MVP                                          |
| §3      | Alcance (dentro y fuera del MVP)                                               |
| §4      | Supuestos y dependencias                                                       |
| §5      | Arquitectura de alto nivel → [[03_Architecture/System_Design\|System Design]]  |
| §6      | Modelo de datos → [[03_Architecture/Data_Model\|Data Model]]                   |
| §7      | Épicas e historias de usuario → [[02_Requirements/User_Stories\|User Stories]] |
| §8      | Contratos de API → [[03_Architecture/API_Specification\|API Specification]]    |
| §9      | Requerimientos no funcionales + reglas Firestore                               |
| §10     | Eventos de analítica → [[06_QA_Validation/Test_Plan\|Test Plan]]               |
| §11     | Riesgos y mitigaciones → [[09_Risk_Governance/Risk_Register\|Risk Register]]   |
| §12     | Despliegue → [[08_Release/Deployment_Guide\|Deployment Guide]]                 |
| §13     | Roadmap → [[07_Roadmap/Roadmap\|Roadmap]]                                      |

→ **[[PRD Recos-BnM|Ver el PRD completo]]**
