---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Active"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [index, moc]
---

# Recos-BnM — Índice del Proyecto

> **Tinder de Contenidos**: PWA mobile-first para descubrir películas y libros mediante gestos de swipe.  
> **North Star:** Swipes calificados por usuario activo semanal  
> **MVP deadline:** Miércoles 10 de junio de 2026  
> **PM:** [[PM-Edgar-Coronel|Eduardo Coronel]]

---

## 🚀 Empieza aquí

| Documento | Propósito |
|---|---|
| [[00_Start_Here/Developer_Onboarding\|Developer Onboarding]] | Cómo configurar el entorno y arrancar el proyecto |
| [[00_Start_Here/Current_Build_Target\|Current Build Target]] | Qué se está construyendo esta semana |
| [[00_Start_Here/AI_Collaboration_Guide\|AI Collaboration Guide]] | Cómo usar Claude Code en este proyecto |
| [[Sprint-1/00-Sprint1-Overview\|Sprint 1 Overview]] | Orden de trabajo del sprint + waves de dependencias |

---

## 📦 Producto

| Documento | Contenido |
|---|---|
| [[01_Product/PRD\|PRD]] | Requerimientos completos del producto |
| [[02_Requirements/User_Stories\|User Stories]] | Épicas e historias de usuario (PRD §7) |
| [[02_Requirements/Glossary\|Glossary]] | Términos del dominio |

---

## 🏗 Arquitectura

| Documento | Contenido |
|---|---|
| [[03_Architecture/System_Design\|System Design]] | Arquitectura de alto nivel (PRD §5) |
| [[03_Architecture/API_Specification\|API Specification]] | Contratos de API (PRD §8) |
| [[03_Architecture/Data_Model\|Data Model]] | Schema Firestore (PRD §6) |
| [[03_Architecture/Technical_Guide\|Technical Guide]] | Stack + decisiones técnicas |

---

## 🎨 UX / Diseño

| Documento | Contenido |
|---|---|
| [[04_UX_Design/UX_Guidelines\|UX Guidelines]] | Sistema de diseño: colores, tipografía, animaciones |
| [[04_UX_Design/Screen_Specs\|Screen Specs]] | Especificaciones por pantalla/épica |

---

## ⚙️ Ingeniería

| Documento | Contenido |
|---|---|
| [[05_Engineering/Engineering_Workflow\|Engineering Workflow]] | Branching, PR policy, convenciones |
| [[05_Engineering/PR_Checklist\|PR Checklist]] | Checklist antes de cada merge |
| [[05_Engineering/Definition_of_Done\|Definition of Done]] | Criterios para considerar una tarea terminada |

---

## ✅ QA / Validación

| Documento | Contenido |
|---|---|
| [[06_QA_Validation/Test_Plan\|Test Plan]] | Happy path + casos borde + analítica |
| [[06_QA_Validation/CI_QA_Gates\|CI QA Gates]] | Gates automáticos antes de deploy |

---

## 🗺 Roadmap

| Documento | Contenido |
|---|---|
| [[07_Roadmap/Roadmap\|Roadmap]] | 3 fases del proyecto |
| [[07_Roadmap/Phases/Phase_01_MVP\|Fase 1 — MVP]] | Sprint actual |
| [[07_Roadmap/Phases/Phase_02_Engagement\|Fase 2 — Engagement]] | Señal de afinidad + notificaciones |
| [[07_Roadmap/Phases/Phase_03_ML\|Fase 3 — ML]] | Recomendación inteligente |

---

## 🚢 Release

| Documento | Contenido |
|---|---|
| [[08_Release/Release_Checklist\|Release Checklist]] | Pre-deploy checklist |
| [[08_Release/Deployment_Guide\|Deployment Guide]] | Comandos de deploy (PRD §12) |

---

## 🔐 Riesgos y Gobernanza

| Documento | Contenido |
|---|---|
| [[09_Risk_Governance/Risk_Register\|Risk Register]] | Riesgos identificados + mitigaciones (PRD §11) |
| [[09_Risk_Governance/Decision_Log\|Decision Log]] | Decisiones arquitectónicas registradas |
| [[09_Risk_Governance/Security_Model\|Security Model]] | Política de secretos + acceso a GCP |
| [[09_Risk_Governance/AI_Agent_Governance\|AI Agent Governance]] | Gobernanza de agentes IA en el flujo |
| [[09_Risk_Governance/TMDB_Compliance\|TMDB Compliance]] | Requisitos de atribución de TMDB |

---

## 🏃 Sprints

| Sprint | Estado | Archivo |
|---|---|---|
| Sprint 1 (jun 2026) | 🟢 Activo | [[Sprint-1/00-Sprint1-Overview\|Sprint 1 Overview]] |

---

## 📓 DevLog

[[DevLog/DevLog_Index|DevLog Index]] — Registro cronológico de sesiones de trabajo

---

## 🎯 Métricas del MVP

| Objetivo | Métrica | Meta |
|---|---|---|
| Activación | % completan onboarding + ≥20 swipes sesión 1 | ≥ 60% |
| Engagement | Swipes promedio / sesión | ≥ 30 |
| Retención | D7 retention | ≥ 25% |
| Conversión | % usuarios que guardan ≥1 título | ≥ 40% |
| Costo | USD / 1.000 usuarios activos | < $5 |
