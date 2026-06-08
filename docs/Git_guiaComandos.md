# Guía Git, GitHub y Terminal

**Israel Pérez García (#ByHumanVision)**

Esta guía está diseñada para que todos, sin importar si es su primera vez usando la terminal o si ya son expertos, podamos colaborar en el proyecto.

### * Nivel 1: El Flujo de Trabajo Diario (Evita el 90% de los problemas)

*La regla de oro antes de escribir una sola línea de código es asegurarnos de que estamos trabajando sobre la versión más reciente.*

**1. Actualizar la base en nuestros equipos (Realizar esto todos los días al empezar):**

Abre Terminal en Cursor o PowerShell para asegurar de estar en la rama principal:

PowerShell

```
git checkout main
git pull origin main

```

**2. Crea tu espacio de trabajo:**

Nunca trabajar directamente en `main`. Crea nuestra propia rama:

PowerShell

```
git checkout -b feature/tu-nombre-tarea

```

**3. Guarda tu progreso:**

Estas instrucción empaqueta lo que hicieron:

PowerShell

```
git add .
git commit -m "feat: descripcion clara de lo que hiciste"
git push origin feature/tu-nombre-tarea

```

### * Nivel 2: Pull Requests (El Control de Calidad)*.*

1. **Abre el PR en GitHub:** Ve a la página del repositorio y dale clic al botón verde *Compare & pull request*.
2. **Documenta el valor:** No pongas solo "subo cambios". Explica brevemente qué archivos tocaste y qué problema resuelve.
3. **Regla de los 4 Ojos:** Nunca apruebes tu propio PR (*Merge*). Pide a un compañero que lo revise. Esto garantiza que la rama `main` siempre esté estable y funcional.

### * Nivel 3: Alerta Roja - Resolviendo Conflictos

*Un conflicto de merge asusta, pero solo significa una cosa: tú y otro compañero modificaron el mismo archivo en las mismas líneas. Git es inteligente, pero no adivina qué versión queremos conservar, así que te pide a ti que decidas.*

**Paso a paso para destrabar tu rama:**

**Paso 1: Trae los cambios conflictivos a tu computadora**

Asegúrate de estar en tu rama y dile a Git que intente fusionar lo que hay en `main`:

PowerShell

```
git checkout tu-rama
git merge main

```

*Aquí la terminal arrojará un mensaje amarillo/rojo diciendo* `CONFLICT (content): Merge conflict in...`

**Paso 2: Resuelve visualmente en Cursor / VS Code**

Abre los archivos que marcaron conflicto. Verás unas líneas con `<<<<<<< HEAD` y `======`.

Tu editor (Cursor) te pondrá unos botones arriba del código:

- **Accept Current Change:** Te quedas con tu código.
- **Accept Incoming Change:** Te quedas con el código de tu compañero.
- **Accept Both Changes:** Conservas ambos y tú acomodas el texto.

**Paso 3: Sella la paz**

Una vez que elegiste y guardaste los archivos (`Ctrl + S`), dile a Git que el conflicto terminó:

PowerShell

```
git add .
git commit -m "fix: resolucion de conflictos de merge con main"
git push origin tu-rama

```

¡Listo! Tu PR en GitHub automáticamente se pondrá en verde y estará listo para fusionarse.

### 💡 Pro-Tips para la Terminal (PowerShell)

- ¿No sabes en qué rama estás o qué archivos modificaste? Usa `git status`. Es tu mejor amigo.
- ¿Te equivocaste y quieres regresar tu archivo a como estaba en el último commit? Usa `git restore nombre-del-archivo.js`.
- Si la terminal te abre una pantalla rara de texto (Vim) al hacer un merge, simplemente escribe `:wq` y presiona Enter para salir y guardar.

