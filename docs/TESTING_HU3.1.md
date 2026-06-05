# Testing — HU 3.1 Ingesta de Catálogo & Score Normalizado

## Prerrequisitos

- Python 3.11+
- Node.js 18+
- Firebase CLI o gcloud CLI (para Firestore Emulator)
- API keys de TMDB y Google Books

---

## 1. Obtener API keys

### TMDB
1. Ir a https://www.themoviedb.org/settings/api
2. Crear cuenta o iniciar sesión
3. Solicitar **API Key v4 (Bearer)** — es la que acepta el header `Authorization: Bearer <key>`
4. Copiar la clave

### Google Books
1. Ir a https://console.cloud.google.com
2. Crear o seleccionar un proyecto
3. Habilitar **Books API** (Biblioteca de APIs → buscar "Books API" → Habilitar)
4. Ir a Credenciales → **Crear credenciales → API Key**
5. Copiar la clave

---

## 2. Configurar variables de entorno

Crear archivo `.env` en la **raíz del proyecto** (ya está en `.gitignore`):

```env
TMDB_API_KEY=tu_tmdb_bearer_key_aqui
GOOGLE_BOOKS_API_KEY=tu_google_books_key_aqui
FIRESTORE_PROJECT_ID=recos-bnm
FIRESTORE_EMULATOR_HOST=localhost:8080
```

---

## 3. Instalar dependencias

### Python (ingesta)

```bash
pip install -r ingest/requirements.txt
```

Opcional — usar entorno virtual:

```bash
python -m venv .venv
.\.venv\Scripts\activate   # Windows
pip install -r ingest/requirements.txt
```

### Node.js (scoring — solo para probar)

No requiere instalación de dependencias; es JavaScript vanilla.

---

## 4. Iniciar Firestore Emulator

### Con Firebase CLI

```bash
firebase emulators:start --only firestore
```

### Con gcloud CLI

```bash
gcloud beta emulators firestore start --host-port=localhost:8080
```

El emulator debe quedar corriendo en `http://localhost:8080`.

---

## 5. Ejecutar la ingesta

En otra terminal:

```bash
python ingest/main.py
```

### Qué esperar

1. Fetch de ~300 películas desde TMDB (con progreso por consola)
2. Fetch de ~250 libros desde Google Books (10 categorías)
3. Batch write a Firestore emulator
4. Output final: `{"status": "ok", "count": 550}`

Si no hay API keys configuradas, fallará con:

```
RuntimeError: TMDB_API_KEY not set in environment or .env
```

---

## 6. Probar el scoring.js

```bash
node -e "
const { computeScore } = require('./services/scoring');
const items = [
  { title: 'Película A', popularity: 100, rating: 8.0 },
  { title: 'Película B', popularity: 50,  rating: 9.5 },
  { title: 'Película C', popularity: 10,  rating: 5.0 },
  { title: 'Película D', popularity: 200, rating: 7.0 },
];
const result = computeScore(items);
console.log('Ranking:');
result.forEach((i, idx) => {
  console.log(`${idx + 1}. ${i.title} — score: ${i.score.toFixed(4)} (pop: ${i.norm_popularity.toFixed(4)}, rating: ${i.norm_rating.toFixed(4)})`);
});
"
```

### Output esperado

```
Ranking:
1. Película D — score: 0.7500 (pop: 1.0000, rating: 0.4444)
2. Película A — score: 0.4737 (pop: 0.4737, rating: 0.3333)
3. Película B — score: 0.4737 (pop: 0.2105, rating: 1.0000)
4. Película C — score: 0.0000 (pop: 0.0000, rating: 0.0000)
```

---

## 7. Probar caso borde — valores idénticos

```bash
node -e "
const { computeScore } = require('./services/scoring');
const items = [
  { title: 'X', popularity: 5, rating: 6 },
  { title: 'Y', popularity: 5, rating: 6 },
];
console.log(computeScore(items));
"
```

Debe asignar `norm_* = 0.5` a todos (evita división entre cero).

---

## Troubleshooting

| Error | Causa | Solución |
|---|---|---|
| `TMDB_API_KEY not set` | Falta `.env` o variable | Crear `.env` con la key |
| `ModuleNotFoundError: firebase_admin` | Dependencias no instaladas | `pip install -r ingest/requirements.txt` |
| `503 UNAVAILABLE` | Firestore emulator no corriendo | Iniciar emulator primero |
| `403 Forbidden` (TMDB) | API Key inválida o formato incorrecto | Usar Bearer v4 key, no la v3 |
| `403 Forbidden` (Google Books) | Books API no habilitada | Habilitar en GCP Console |
