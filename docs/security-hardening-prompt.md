# PROMPT — Correcciones de seguridad y buenas prácticas · Repo recos-BnM

Eres un ingeniero ejecutando un saneamiento de seguridad sobre el repositorio
`recos-BnM` (https://github.com/JGFuentesC/recos-BnM). Trabaja con cuidado:
algunas tareas reescriben el historial de git y afectan a TODO el equipo, así
que respeta las puertas de aprobación marcadas con ⚠️.

## Contexto del hallazgo
El archivo `jc.env` se commiteó con CLAVES REALES en el commit `481b646` y se
quitó del tracking en `c71b4da`/`1f99e22`, pero NO del historial. Las claves
siguen vivas en `origin/main` y casi todas las ramas:
- TMDB_API_KEY (JWT, scope api_read)  ← SENSIBLE
- GOOGLE_BOOKS_API_KEY (AIzaSy…86ms)  ← SENSIBLE
- VITE_FIREBASE_API_KEY (AIzaSy…acGA) ← bajo riesgo (es pública del frontend)

## Reglas de propiedad (CLAUDE.md) — NO violar
- `.github/workflows/deploy.yml`, `frontend/public/*` → Germán (CI/CD)
- `firestore.rules`/indexes (en `src/firestore/`) → Israel
- No modifiques archivos fuera de tu propiedad sin coordinar con su dueño.

---

## TAREA 0 (⚠️ MANUAL, BLOQUEANTE — debe ir PRIMERO)
Rotar las claves NO se puede automatizar y solo Eduardo (PM) tiene acceso a las
consolas. Antes de tocar el historial:
1. Pide a Eduardo que ROTE en TMDB, Google Cloud y Firebase Console las 3 claves.
2. Restringe `GOOGLE_BOOKS_API_KEY` y las keys de Firebase por dominio HTTP y por
   API en GCP Console (Application restrictions).
3. Confirma por escrito que las claves viejas ya están invalidadas.
> Hasta que esto pase, purgar el historial NO sirve: las claves siguen válidas
> en cualquier clon existente.

---

## TAREA 1 — Higiene del repo (segura, sin reescribir historial)
Crea una rama: `git checkout -b chore/security-hardening`

1. Dejar de trackear `.DS_Store`:
   `git rm --cached .DS_Store`
2. Reemplazar el bloque reactivo del `.gitignore` por un patrón robusto.
   Sustituye las líneas `.env`, `*.env`, `jc.env`, `env.jc` por:
   ```
   # Secrets — nunca commitear ningún .env real
   *.env
   *.env.*
   !*.env.example
   .DS_Store
   ```
   (mantén el resto del .gitignore intacto).
3. Verifica que no quede ningún secreto en el árbol de trabajo:
   `git grep -nI 'AIzaSy\|BEGIN PRIVATE KEY\|eyJhbGci' || echo "limpio"`
4. Commit: `git commit -am "chore(security): deja de trackear .DS_Store y endurece .gitignore"`

## TAREA 2 — CI/CD: cerrar brechas (⚠️ requiere OK de Germán, dueño del archivo)
En `.github/workflows/deploy.yml`:
1. Añadir un step de auditoría de dependencias ANTES del build:
   ```yaml
   - name: Audit dependencies
     run: npm audit --audit-level=high
     working-directory: frontend
   ```
2. Añadir un job/step que despliegue las reglas e índices de Firestore (hoy NO
   se despliegan por CI, solo hosting → riesgo de drift):
   ```yaml
   - name: Deploy Firestore rules & indexes
     run: npx firebase-tools deploy --only firestore:rules,firestore:indexes --project recos-bnm
     env:
       FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
   ```
   (usar el secret/credencial de servicio que ya exista en el repo).
3. Verifica que el workflow sigue siendo válido y abre PR para que Germán revise.

## TAREA 3 (⚠️ DESTRUCTIVA — requiere OK de Eduardo + Germán y aviso a TODO el equipo)
Purgar `jc.env` del historial. Solo ejecutar DESPUÉS de la Tarea 0.
1. Haz un backup/clon espejo antes:
   `git clone --mirror https://github.com/JGFuentesC/recos-BnM repo-backup.git`
2. Instala git-filter-repo (`brew install git-filter-repo` o pip).
3. En un clon fresco:
   `git filter-repo --path jc.env --invert-paths`
4. Re-añade el remoto y fuerza el push de todas las ramas y tags:
   `git push origin --force --all && git push origin --force --tags`
5. Avisa al equipo: TODOS deben RE-CLONAR (los clones viejos conservan los
   secretos). Cierra/rebasa las PRs abiertas que dependan de los SHAs viejos.

---

## Criterios de aceptación
- [ ] Eduardo confirma las 3 claves rotadas e invalidadas (Tarea 0).
- [ ] `git ls-files | grep .DS_Store` no devuelve nada.
- [ ] `.gitignore` usa `*.env.*` + `!*.env.example`; sin parches por nombre.
- [ ] `deploy.yml` corre `npm audit` y despliega `firestore:rules,indexes`.
- [ ] `git log --all -S 'AIzaSyAUMdDfAqOVDWSrQ3lwjGgd5SMpHYw86ms'` no devuelve commits.
- [ ] No se modificó ningún archivo fuera de la propiedad sin OK del dueño.

## NO hacer
- No commitear ningún `.env` real ni valores de claves.
- No reescribir historial (Tarea 3) sin la Tarea 0 hecha y sin OK de Eduardo/Germán.
- No tocar `backend/src/routes/`, `frontend/src/components|pages|contexts`,
  ni `firestore.rules` salvo coordinación con su dueño.
