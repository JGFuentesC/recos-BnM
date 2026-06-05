# # Contrato de Datos (Firestore Schema) - recos-BnM



## 1. Colección: `users`

* **Descripción:** Perfiles de los usuarios de la aplicación.

* **Documento (ID):** `userId` (generado por Firebase Auth)

* **Campos:**

  * `email` (string)

  * `displayName` (string)

  * `photoUrl` (string) - Avatar del usuario

  * `preferences` (array of strings) - ej. ["Action", "Sci-Fi"]

  * `createdAt` (timestamp)

  * `updatedAt` (timestamp)



## 2. Colección: `content`

* **Descripción:** Catálogo de películas, series y libros (Solo lectura).

* **Documento (ID):** Auto-generado

* **Campos:**

  * `title` (string)

  * `type` (string) - "movie" | "series" | "book"

  * `creator` (array of strings) - Autores (libros) o Directores (películas)

  * `genres` (array of strings)

  * `description` (string)

  * `posterUrl` (string) - URL del póster o portada del libro

  * `year` (number) - Año de lanzamiento o publicación

  * `rating` (number) - Calificación promedio (para función de scoring)

  * `popularity` (number) - Métrica de popularidad (TMDB, etc.)

  * `source` (string) - Origen de los datos (ej. "TMDB", "Google Books")

  * `whereToWatch` (array of strings) - Plataformas de disponibilidad



## 3. Colección: `swipes`

* **Descripción:** Registro de interacciones (likes/dislikes).

* **Documento (ID):** Auto-generado

* **Campos:**

  * `userId` (string) - Referencia al usuario que hizo el swipe

  * `contentId` (string) - Referencia al contenido

  * `action` (string) - "like" | "dislike"

  * `timestamp` (timestamp)



## 4. Colección: `collections`

* **Descripción:** Listas personalizadas (ej. "Favoritos", "Ver después").

* **Documento (ID):** Auto-generado

* **Campos:**

  * `userId` (string) - Dueño de la lista

  * `name` (string) - Nombre de la lista

  * `items` (array of strings) - IDs del contenido guardado

  * `createdAt` (timestamp)

  * `updatedAt` (timestamp)

