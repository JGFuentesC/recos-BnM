# Suite de Pruebas Manuales (QA)

Este documento contiene los casos de prueba manuales y las verificaciones de eventos de analítica requeridos para la liberación.

## 1. Casos de Prueba: Happy Path

| ID | Escenario | Precondiciones | Pasos | Resultado Esperado |
|---|---|---|---|---|
| HP-01 | Flujo principal de usuario | App desplegada, backend activo | 1. Registro con Email o Google.<br>2. Completar onboarding seleccionando preferencias.<br>3. Hacer swipe a la derecha en una tarjeta.<br>4. Tocar una tarjeta para abrir la vista de detalle.<br>5. Guardar el contenido desde la vista de detalle en una lista. | El usuario logra registrarse, configurar su perfil, interactuar con el feed y guardar contenido en su colección exitosamente. |

## 2. Casos Borde

| ID | Escenario | Pasos | Resultado Esperado |
|---|---|---|---|
| CB-01 | Feed agotado | Hacer swipe hasta que no queden más tarjetas en el stack (o se llegue al límite). | Mostrar pantalla amigable indicando que no hay más contenido temporalmente o invitando a cambiar de categoría. |
| CB-02 | Contenido ya swipeado | Iniciar sesión con un usuario que ya calificó ciertas películas/libros. | El algoritmo no debe mostrar contenido que ya tiene un `like` o `dislike` en su historial. |
| CB-03 | Sin WatchProviders (Streaming) | Abrir el detalle de una película que no tiene proveedores de streaming en TMDB. | Se debe mostrar un placeholder neutro (ej. "No disponible por el momento") en lugar de inventar disponibilidad. |

## 3. Verificación de Analítica (Eventos PRD §10)

Para verificar esto, se debe revisar la consola de Firebase Analytics o el Network Tab en las herramientas de desarrollador web:

* [ ] **onboarding_completed:** Se dispara al finalizar la calibración de perfil inicial.
* [ ] **swipe:** Se dispara al realizar un swipe (derecha/izquierda). Debe incluir en el payload el `action` (like/dislike) y `type` (movie/book).
* [ ] **feed_exhausted:** Se dispara cuando el usuario consume todas las tarjetas cargadas y el sistema no devuelve más.
* [ ] **detail_opened:** Se dispara al hacer clic sobre una tarjeta para ver la sinopsis completa.
* [ ] **content_saved:** Se dispara cuando un usuario guarda un ítem en sus colecciones.
