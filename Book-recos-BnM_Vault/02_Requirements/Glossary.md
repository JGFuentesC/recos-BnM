---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Approved"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [requirements, glossary, domain]
---

# Glossary — Recos-BnM

> Términos del dominio del proyecto. Referencia para todo el equipo.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Términos del producto

| Término | Definición |
|---|---|
| **Swipe** | Gesto táctil horizontal sobre una tarjeta de contenido: derecha = like, izquierda = dislike |
| **Like** | Acción de swipe derecha; registrada como `action: "like"` en la colección `swipes` |
| **Dislike** | Acción de swipe izquierda; registrada como `action: "dislike"` en la colección `swipes` |
| **Feed** | Secuencia paginada de tarjetas de contenido ordenadas por score. Ver `GET /api/feed` |
| **Stack** | El grupo visual de tarjetas superpuestas que el usuario ve en la pantalla principal |
| **Cold Start** | Estado inicial de un usuario nuevo sin historial de swipes. El feed usa popularidad pura |
| **Onboarding** | Flujo de calibración inicial: 5–10 tarjetas + selección de géneros/autores/directores |
| **ContentCard** | Componente React que muestra una tarjeta de película o libro en el feed |
| **SwipeDeck** | Componente React que gestiona el stack de ContentCards y los gestos de swipe |
| **DetailSheet** | Modal slide-up que muestra el detalle completo de un título al tocarlo |
| **Biblioteca / Colección** | Vista de los títulos guardados por el usuario, organizados por tipo y lista |
| **Tab Selector** | Control de navegación para alternar entre feeds de Películas y Libros |
| **BottomNav** | Barra de navegación inferior con acceso a Feed, Búsqueda y Biblioteca |
| **Watch Providers** | Plataformas de streaming donde está disponible una película. Fuente: TMDB |
| **PWA** | Progressive Web App. La app se entrega como web app instalable, no como app nativa |

---

## Términos técnicos

| Término | Definición |
|---|---|
| **Firestore** | Base de datos NoSQL en tiempo real de Google Cloud (Firebase). Almacena users, swipes, collections, content |
| **Cloud Run** | Servicio de contenedores serverless de GCP donde corre la API Node.js |
| **Firebase Hosting** | CDN de Firebase donde se despliega la PWA |
| **Firebase Auth** | Servicio de autenticación de Firebase. Soporta Email/Password y Google Sign-In |
| **Service Worker** | Script del navegador que intercepta peticiones de red y permite caché offline |
| **Cloud Scheduler** | Servicio de cron jobs de GCP que dispara el job de ingesta de catálogo |
| **Ingest Job** | Script (Python) que sincroniza contenido de TMDB y Google Books a la colección `content` |
| **contentId** | ID único de un ítem en Firestore (`content/{contentId}`). Diferente al ID externo de TMDB/Google |
| **externalId** | ID del ítem en su fuente original (ej. ID de TMDB, ID de Google Books) |
| **cursor** | Token de paginación para el feed. Permite continuar desde el último ítem visto |
| **score** | Valor calculado para ordenar el feed: `0.7 × norm(popularity) + 0.3 × norm(rating)` |
| **norm(x)** | Normalización min-max: `(x − min) / (max − min)` sobre el conjunto candidato |
| **Bearer token** | Token JWT de Firebase Auth enviado en el header `Authorization: Bearer <token>` |
| **min-instances** | Configuración de Cloud Run para mantener al menos N instancias activas (evita cold start) |
| **LCP** | Largest Contentful Paint. Métrica de rendimiento web. Meta: < 2.5s en 4G |
| **WAU** | Weekly Active Users. Usuarios activos semanales |
| **D7** | Retención al día 7: porcentaje de usuarios que vuelven 7 días después del registro |
| **MAU** | Monthly Active Users. Usuarios activos mensuales |

---

## Fuentes de datos externas

| Fuente | Tipo de contenido | Uso |
|---|---|---|
| **TMDB** (The Movie Database) | Películas | Fuente primaria: metadatos, popularidad, rating, watchProviders. Requiere atribución |
| **Google Books API** | Libros | Fuente primaria: metadatos, portadas, ratings |
| **IMDb vía RapidAPI** | Películas | Fuente de enriquecimiento opcional (no MVP) |

**Atribución TMDB requerida:** `"This product uses the TMDB API but is not endorsed or certified by TMDB"`  
Ver: [[09_Risk_Governance/TMDB_Compliance|TMDB Compliance]]

---

## Acrónimos del equipo

| Acrónimo | Significado |
|---|---|
| **PM** | Project Manager — Eduardo Coronel |
| **GCP** | Google Cloud Platform |
| **PWA** | Progressive Web App |
| **CRUD** | Create, Read, Update, Delete |
| **DoD** | Definition of Done — ver [[05_Engineering/Definition_of_Done|Definition of Done]] |
| **PR** | Pull Request |
| **NFR** | Non-Functional Requirements (Requerimientos No Funcionales) |
| **MVP** | Minimum Viable Product |
| **DEC** | Decision — entrada en el [[09_Risk_Governance/Decision_Log|Decision Log]] |
| **R0x** | Risk — entrada en el [[09_Risk_Governance/Risk_Register|Risk Register]] |
