Integración con OpenCode

Esta guía rápida muestra cómo usar OpenCode en este repositorio.

Recomendación: en Windows usa WSL para mejor compatibilidad. Si prefieres no usar WSL, los instaladores por choco, scoop o npm funcionan también.

Instalación (Windows - PowerShell):

Usando Chocolatey:

    choco install opencode

O usando npm (requiere Node.js 18+):

    npm install -g opencode-ai

O con Docker (sin instalar localmente):

    docker run -it --rm ghcr.io/anomalyco/opencode

Usando WSL (recomendado):

    curl -fsSL https://opencode.ai/install | bash

    # Luego desde la raíz del repo:
    cd /path/to/recos-BnM
    opencode

Inicializar OpenCode para este proyecto:

1. Desde la raíz del repositorio ejecuta `opencode`.
2. En la interfaz TUI escribe el comando `/init` para que OpenCode analice el proyecto.
3. OpenCode generará un archivo `AGENTS.md` en la raíz; revisa y commitea ese archivo.

Configuración de proveedores:

- OpenCode usa proveedores LLM (p. ej. OpenAI, Claude). Conecta tus claves desde el comando `/connect` dentro de la TUI o vía `opencode` CLI.
- Revisa https://opencode.ai/docs/providers/ para más detalles.

Privacidad y seguridad:

- No subas claves al repositorio. Usa variables de entorno o gestores de secretos.
- Este repo ya incluye `opencodesession.txt` en `.gitignore`.

Ejemplos de uso dentro del proyecto:

- Preguntar sobre el código: presiona `@` dentro de OpenCode para buscar archivos.
- Pedir una tarea: en modo Plan (`TAB`) pide un plan; en modo Build (`TAB` para volver) pídele que haga cambios.
