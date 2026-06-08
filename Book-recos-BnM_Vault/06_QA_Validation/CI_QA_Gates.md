---
project: "Recos-BnM"
owner: "Germán Pacheco"
status: "Active"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [qa, ci, gates, github-actions]
---

# CI QA Gates — Recos-BnM

> Gates automáticos de calidad que deben pasar antes de cualquier deploy a producción.  
> Implementados en GitHub Actions por [[Sprint-1/09-German-Pacheco|Germán Pacheco]].  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Resumen de gates

| Gate | Tipo | Cuándo corre | Bloquea deploy |
|---|---|---|---|
| G1 — Lint | Automático | Cada PR | ✅ Sí |
| G2 — Unit Tests (Backend) | Automático | Cada PR | ✅ Sí |
| G3 — Firestore Rules Tests | Automático | Cada PR que toca `firestore.rules` | ✅ Sí |
| G4 — Build Frontend | Automático | Cada PR | ✅ Sí |
| G5 — Lighthouse Score | Automático | Solo en merge a main | ⚠️ Advierte (no bloquea en MVP) |
| G6 — Security Audit | Automático | Cada PR | ✅ Sí |
| G7 — Deploy Preview | Automático | Cada PR (Firebase) | No bloquea |

---

## Gate G1 — Lint

**Herramienta:** ESLint (frontend + backend) + Prettier

```yaml
# .github/workflows/ci.yml
- name: Lint
  run: |
    cd frontend && npm run lint
    cd ../backend && npm run lint
```

**Criterio de fallo:** Cualquier error de ESLint (warnings permitidos en MVP)

**Configuración mínima (`.eslintrc.js`):**
```javascript
module.exports = {
  rules: {
    'no-console': 'warn',      // OK en dev, warn en CI
    'no-unused-vars': 'error', // Falla el gate
    'no-undef': 'error'
  }
};
```

---

## Gate G2 — Unit Tests (Backend)

**Herramienta:** Jest + Supertest  
**Responsables:** Cada developer del backend escribe sus propios tests. Ver [[05_Engineering/Definition_of_Done|DoD]].

```yaml
- name: Backend Tests
  run: cd backend && npm test
  env:
    FIRESTORE_EMULATOR_HOST: localhost:8080
    FIREBASE_AUTH_EMULATOR_HOST: localhost:9099
```

**Tests mínimos requeridos por endpoint:**

| Endpoint | Tests mínimos |
|---|---|
| `GET /api/feed` | 200 con token válido, 401 sin token, 400 sin `type` |
| `POST /api/swipe` | 204 con datos válidos, 401 sin token, 400 con action inválida |
| `GET /api/content/:id` | 200 con id válido, 404 con id inexistente, 401 sin token |
| `POST /api/collections` | 201 con body completo, 401 sin token, 400 con campos faltantes |
| `PATCH /api/collections/:id` | 200 propio, 403 ajeno, 401 sin token |
| `DELETE /api/collections/:id` | 204 propio, 403 ajeno, 404 inexistente |

**Criterio de fallo:** Coverage < 80% en rutas de la API, o cualquier test fallido.

---

## Gate G3 — Firestore Rules Tests

**Herramienta:** `@firebase/rules-unit-testing`  
**Responsable:** [[Sprint-1/01-Israel-Perez|Israel Pérez]]

```yaml
- name: Firestore Rules Tests
  if: contains(github.event.commits[*].modified, 'firestore.rules')
  run: cd firestore && npm test
  env:
    FIRESTORE_EMULATOR_HOST: localhost:8080
```

**Tests mínimos:**

| Regla | Test |
|---|---|
| `users/{userId}` lectura | ✅ Propio, ❌ Ajeno, ❌ Sin auth |
| `users/{userId}` escritura | ✅ Propio, ❌ Ajeno |
| `swipes/{swipeId}` escritura | ✅ Con userId propio, ❌ Con userId ajeno |
| `collections/{collectionId}` escritura | ✅ Con userId propio, ❌ Con userId ajeno |
| `content/{contentId}` lectura | ✅ Autenticado, ❌ Sin auth |
| `content/{contentId}` escritura | ❌ Siempre (cliente no puede escribir) |

---

## Gate G4 — Build Frontend

**Herramienta:** Vite build

```yaml
- name: Build Frontend
  run: cd frontend && npm run build
  env:
    VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
    VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
    VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
    VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
    VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
    VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
```

**Criterio de fallo:** Build de Vite falla (errores de TypeScript o imports rotos)

---

## Gate G5 — Lighthouse Score

**Herramienta:** Lighthouse CI (`lhci`)

```yaml
- name: Lighthouse CI
  if: github.ref == 'refs/heads/main'
  run: |
    npm install -g @lhci/cli
    lhci autorun
```

**Umbrales (`.lighthouserc.js`):**
```javascript
module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.8 }],
        'categories:pwa': ['warn', { minScore: 0.7 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }]
      }
    }
  }
};
```

**Notas:**
- Performance y PWA en modo `warn` para el MVP (no bloquea deploy)
- Accessibility en modo `error` (accesibilidad mínima siempre)
- Meta LCP < 2.5s viene del PRD §9 NFR

---

## Gate G6 — Security Audit

**Herramienta:** `npm audit`

```yaml
- name: Security Audit
  run: |
    cd frontend && npm audit --audit-level=high
    cd ../backend && npm audit --audit-level=high
```

**Criterio de fallo:** Vulnerabilidades de severity `high` o `critical`.  
**Política:** Vulnerabilidades `moderate` se registran en el [[09_Risk_Governance/Risk_Register|Risk Register]] para revisión.

---

## Gate G7 — Deploy Preview

**Herramienta:** Firebase Hosting Preview Channels

```yaml
- name: Deploy Preview
  uses: FirebaseExtended/action-hosting-deploy@v0
  with:
    repoToken: ${{ secrets.GITHUB_TOKEN }}
    firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
    projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
    channelId: pr-${{ github.event.number }}
```

**Resultado:** Un comment en el PR con la URL de preview (ej. `https://recos-bnm--pr-42-xyz.web.app`)

---

## Workflow completo (deploy.yml)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci

      - name: Start Firebase Emulators
        run: firebase emulators:start --only firestore,auth &
        
      - name: G1 - Lint
        run: |
          cd frontend && npm run lint
          cd ../backend && npm run lint

      - name: G2 - Backend Tests
        run: cd backend && npm test

      - name: G4 - Build Frontend
        run: cd frontend && npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          # ... resto de vars

      - name: G6 - Security Audit
        run: |
          cd frontend && npm audit --audit-level=high
          cd ../backend && npm audit --audit-level=high

  deploy:
    needs: quality
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Firebase Hosting
        # ... firebase deploy

      - name: Deploy Backend to Cloud Run
        # ... gcloud run deploy
```

Ver implementación completa en [[Sprint-1/09-German-Pacheco|Germán Pacheco]].

---

## NFR como CI Gates — Trazabilidad

| NFR (PRD §9) | Gate que lo verifica |
|---|---|
| LCP < 2.5s en 4G | G5 — Lighthouse (maxNumericValue: 2500) |
| Shell PWA cacheable | G5 — Lighthouse PWA score |
| Sin vulnerabilidades high/critical | G6 — npm audit |
| Build exitoso antes de deploy | G4 — Vite build |
| Reglas Firestore correctas | G3 — Rules unit tests |
| Auth funcional en endpoints | G2 — Unit tests (tests de 401) |
