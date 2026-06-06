---
project: "Recos-BnM"
owner: "Equipo de desarrollo"
status: "Approved"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [engineering, pr, checklist]
---

# PR Checklist — Recos-BnM

> Verificar esta lista antes de solicitar review en cualquier PR.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## ✅ Checklist general (todos los PRs)

### Colaboración IA (verificar PRIMERO)
- [ ] DevLog entry creada en `DevLog/YYYY-MM-DD-{tu-nombre}.md` con campos `author_human` y `agent` completos
- [ ] Solo se modificaron archivos dentro de tu scope (ver `Sprint-1/contexts/{tu-nombre}-agent-context.md`)
- [ ] Si se tocó un archivo compartido o de otro colaborador: coordinado con su dueño y documentado en el DevLog

### Código
- [ ] El código hace exactamente lo que describe el título del PR
- [ ] Sin `console.log()` de debug (usar logger si es necesario)
- [ ] Sin comentarios TODO sin ticket asociado
- [ ] Sin código comentado (si se elimina algo, eliminarlo del todo)
- [ ] Sin secretos hardcodeados (API keys, passwords, tokens)
- [ ] Las variables de entorno nuevas están en `.env.example`

### Tests
- [ ] Al menos 1 test escrito para el comportamiento principal
- [ ] Los tests existentes siguen pasando (`npm test` verde)
- [ ] Si no hay test (ej. componente visual puro): está explicado en el PR

### Calidad
- [ ] Sin errores de lint (`npm run lint` sin warnings nuevos)
- [ ] Build sin errores (`npm run build` pasa)
- [ ] Probado en el emulador Firebase (no solo unitariamente)

### Seguridad
- [ ] Los endpoints nuevos tienen el middleware `auth.js` aplicado
- [ ] Las escrituras a Firestore verifican que `userId == req.user.uid`
- [ ] No se expone información sensible en respuestas de error (no stack traces en prod)

---

## ✅ Checklist adicional por tipo de cambio

### Si el PR agrega un endpoint nuevo (backend)
- [ ] El endpoint está documentado en [[03_Architecture/API_Specification|API Specification]]
- [ ] Responde correctamente a: 401 (sin token), 400 (params inválidos), 404 (no encontrado), 500 (error interno)
- [ ] Test de cada código de respuesta

### Si el PR agrega un componente React nuevo (frontend)
- [ ] Las props están documentadas (PropTypes o JSDoc)
- [ ] El componente tiene un estado de loading y un estado de error visible
- [ ] Probado en viewport de 375px de ancho (iPhone SE)
- [ ] Animaciones a ≈60fps (verificar en DevTools → Performance)

### Si el PR modifica `firestore.rules`
- [ ] Revisión adicional de seguridad requerida (taggear a Eduardo)
- [ ] Tests de reglas con Firebase Emulator
- [ ] `/security-review` ejecutado con Claude Code

### Si el PR modifica el schema de Firestore
- [ ] `docs/SCHEMA.md` actualizado por [[Sprint-1/01-Israel-Perez|Israel]]
- [ ] [[03_Architecture/Data_Model|Data Model]] actualizado en el vault
- [ ] Equipo notificado del cambio de schema

---

## 🚫 Razones para rechazar un PR automáticamente

Un PR puede ser rechazado sin review si:
1. Tiene secretos hardcodeados (API key, token, password)
2. Rompe el build (`npm run build` falla en CI)
3. Hace push directo a main sin PR
4. No tiene descripción en el cuerpo del PR

---

## Cómo ejecutar el review con Claude Code

```bash
# Desde la raíz del repo, con el PR abierto en GitHub:
/review

# Claude Code analiza el diff y reporta:
# - Tests ausentes
# - Problemas de seguridad
# - Malos patrones async
# - Inconsistencias con el PRD
```
