# Sprint 1 — Edgar Coronel (Project Manager)
**Rol:** PM | **Wave:** 🔴 -1 (ANTES que todos — desbloqueante de infraestructura)

---

## 🎯 Tu misión

Tu trabajo es **eliminar bloqueos antes de que ocurran**. No escribes código, pero sin lo que tú configuras, nadie puede empezar. Tienes dos tipos de tareas: **setup técnico de infraestructura** (crear proyectos, dar accesos, configurar secrets) y **coordinación del equipo** (asegurarte de que cada persona sepa qué hacer, cuándo empezar y a quién esperar).

---

## 📋 Tus entregables por prioridad

### 🔴 URGENTE — Hacer HOY antes de que el equipo empiece

#### 1. Crear el proyecto GCP + Firebase

**Paso a paso:**

1. Ir a [console.firebase.google.com](https://console.firebase.google.com)
2. Clic en "Agregar proyecto"
3. Nombre del proyecto: `recos-bnm`
4. Habilitar Google Analytics (puede ser con cuenta existente)
5. En [console.cloud.google.com](https://console.cloud.google.com) → el mismo proyecto `recos-bnm` → habilitar estas APIs:
   ```
   Cloud Run API
   Cloud Scheduler API
   Cloud Firestore API
   Firebase Management API
   Google Books API
   ```
6. En Firebase Console → Authentication → Comenzar → habilitar:
   - Correo electrónico/contraseña
   - Google
7. En Firebase Console → Firestore Database → Crear base de datos → **Modo producción** → región `us-central1`
8. En Firebase Console → Hosting → Comenzar (seguir los pasos del wizard)

---

#### 2. Crear el repositorio de GitHub

**Paso a paso:**

1. Ir a [github.com/new](https://github.com/new)
2. Nombre: `recos-bnm`
3. Visibilidad: **Privado**
4. Inicializar con README: ✅
5. Clic "Create repository"
6. Ir a Settings → Collaborators → Invitar a todos los miembros del equipo:
   - Añadir sus emails o usernames de GitHub
7. Ir a Settings → Branches → Add branch protection rule:
   - Branch name: `main`
   - ✅ Require pull request before merging
   - ✅ Require at least 1 approving review
   - ✅ Require status checks to pass before merging (añadir cuando el CI esté listo con Germán)

---

#### 3. Obtener y distribuir API Keys

**TMDB:**
1. Crear cuenta en [themoviedb.org](https://www.themoviedb.org)
2. Ir a Settings → API → Request an API Key → Developer
3. Copiar la **API Key (v3 auth)**
4. Compartir con Manuel por canal privado (NO por correo abierto ni Slack público)

**Google Books:**
1. En [console.cloud.google.com](https://console.cloud.google.com) → proyecto `recos-bnm`
2. APIs y servicios → Credenciales → Crear credenciales → Clave de API
3. Restringir la clave a "Books API" (opcional pero recomendado)
4. Copiar la clave y compartir con Manuel

**Firebase Config (para el frontend):**
1. En Firebase Console → Configuración del proyecto → Tu aplicación web
2. Registrar app web con nombre "recos-bnm-pwa"
3. Copiar el objeto `firebaseConfig` y compartir con Andrés

---

#### 4. Configurar GitHub Secrets (con Germán)

Ir al repo GitHub → Settings → Secrets and variables → Actions → New repository secret.

| Secret | Valor | Quién lo necesita |
|---|---|---|
| `FIREBASE_TOKEN` | Generar con `firebase login:ci` (Germán lo hace) | [[09-German-Pacheco\|Germán]] |
| `VITE_FIREBASE_API_KEY` | Del firebaseConfig | [[09-German-Pacheco\|Germán]] |
| `VITE_FIREBASE_AUTH_DOMAIN` | Del firebaseConfig | [[09-German-Pacheco\|Germán]] |
| `VITE_FIREBASE_PROJECT_ID` | `recos-bnm` | [[09-German-Pacheco\|Germán]] |
| `VITE_FIREBASE_APP_ID` | Del firebaseConfig | [[09-German-Pacheco\|Germán]] |

> 📌 Coordinar con [[09-German-Pacheco|Germán]] para que genere el `FIREBASE_TOKEN` con `firebase login:ci` y tú lo añadas a los secrets.

---

#### 5. Resolver la discrepancia de `GET /api/collections`

El sprint tiene un **endpoint sin asignar** que bloquea a [[12-Diana-Alvarez|Diana]].

**Decisión que tú debes tomar:**
- `GET /api/collections` no está asignado a nadie (ver [[00-Sprint1-Overview]])
- El candidato lógico es [[06-Christian-Ruiz|Christian]] (ya tiene el resto del CRUD)
- **Acción:** Hablar con Christian hoy y confirmarle que también hace el GET
- Cuando confirmes, actualizar el archivo [[06-Christian-Ruiz]] para marcar el GET como asignado

---

### 🟠 IMPORTANTE — Primer día del sprint

#### 6. Briefing de Wave Order con el equipo

Compartir el archivo [[00-Sprint1-Overview]] con todos y explicar el orden de trabajo. Puntos clave a comunicar:

1. **[[01-Israel-Perez|Israel]] empieza hoy, solo y primero.** Todos lo esperan.
2. **[[02-Andres-Gonzalez|Andrés]] y [[03-Manuel-Serrania|Manuel]]** empiezan en paralelo tan pronto Israel termina (Wave 1).
3. **Wave 2** (Luis, Héctor, Christian, Edgar, Juan Carlos, Germán) puede iniciar con mocks mientras Wave 1 termina — no están bloqueados del todo.
4. **[[09-German-Pacheco|Germán]] debe tener un "Hello World" desplegado el sábado 7** para validar el pipeline.

#### 7. Crear canal de comunicación de bloqueantes

- Canal de Slack/WhatsApp/Discord dedicado al sprint
- Tema fijo: **"Si estás bloqueado → escríbelo aquí INMEDIATAMENTE"**
- Tú eres quien destraba los bloqueos

---

### 🟡 DURANTE EL SPRINT — Seguimiento diario

#### Checklist diario (5-10 min)

**Lunes 2 jun:**
- [ ] Proyecto GCP + Firebase creado
- [ ] Repo GitHub creado + equipo invitado
- [ ] API Keys distribuidas a Manuel
- [ ] Firebase Config entregada a Andrés
- [ ] [[01-Israel-Perez|Israel]] ya arrancó con `firebase init`
- [ ] Discrepancia GET /api/collections resuelta con [[06-Christian-Ruiz|Christian]]

**Martes 3 – Miércoles 4 jun:**
- [ ] [[01-Israel-Perez|Israel]] entregó schema + emulador → notificar a [[02-Andres-Gonzalez|Andrés]] y [[03-Manuel-Serrania|Manuel]]
- [ ] PRs de Wave 1 abiertos

**Jueves 5 – Viernes 6 jun:**
- [ ] Wave 1 (Andrés + Manuel) terminada → notificar a Wave 2
- [ ] [[09-German-Pacheco|Germán]] configurando CI

**Sábado 7 jun:**
- [ ] **"Hello World" desplegado en Firebase Hosting** ← fecha límite de Germán
- [ ] Verificar que la URL pública funciona

**Lunes 9 jun:**
- [ ] Wave 2 terminada → notificar a [[10-Monserrat-Miranda|Monserrat]] y [[11-Marina-Garcia|Marina]]
- [ ] [[13-Ulises-Chaparro|Ulises]] empieza QA

**Martes 10 jun (demo):**
- [ ] URL final compartida con el Dr.
- [ ] Happy path verificado por [[13-Ulises-Chaparro|Ulises]]
- [ ] [[13-Ulises-Chaparro|Ulises]] entregó `docs/ROADMAP.md`

---

### ⚪ DEMO — Martes 10 jun

**Qué debe funcionar para la demo:**
1. Login con Google (máximo 2 clics)
2. Onboarding de 5 tarjetas
3. Feed de swipe con películas y libros
4. DetailSheet al tocar una tarjeta (con watchProviders o placeholder)
5. Guardar un título → aparece en Biblioteca

**Quién presenta cada módulo:**
Tú coordinas quién hace la demo. Sugerencia: Andrés presenta auth, Monserrat hace el swipe en vivo, Diana muestra la biblioteca.

---

## 📌 Tus referencias rápidas

### Archivos del equipo
| Wave | Persona | Archivo |
|---|---|---|
| 0 | Israel | [[01-Israel-Perez]] |
| 1 | Andrés | [[02-Andres-Gonzalez]] |
| 1 | Manuel | [[03-Manuel-Serrania]] |
| 2 | Luis | [[04-Luis-Tellez]] |
| 2 | Héctor | [[05-Hector-Morales]] |
| 2 | Christian | [[06-Christian-Ruiz]] |
| 2 | Edgar | [[07-Edgar-Coronel]] |
| 2 | Juan Carlos | [[08-Juan-Carlos-Macias]] |
| 2 | Germán | [[09-German-Pacheco]] |
| 3 | Monserrat | [[10-Monserrat-Miranda]] |
| 3 | Marina | [[11-Marina-Garcia]] |
| 4 | Diana | [[12-Diana-Alvarez]] |
| 5 | Ulises | [[13-Ulises-Chaparro]] |

### Regla de oro para el sprint
> Si alguien dice "estoy esperando a X para empezar" → pregúntate si puede avanzar con mocks. En el 80% de los casos puede. Solo [[01-Israel-Perez|Israel]] es un bloqueante absoluto.
