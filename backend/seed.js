process.env.GOOGLE_APPLICATION_CREDENTIALS = "./serviceAccountKey.json";

const admin = require('./src/firebase/admin.js');
const db = admin.firestore();

const movies = [
    {
      type: "movie",
      title: "Inception",
      genres: ["Ciencia Ficción"],
      synopsis: "Un ladrón que roba secretos corporativos a través del uso de la tecnología de compartir sueños.",
      cover: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500", // Imagen de Cine
      year: 2010,
      rating: 4.8,
      creator: ["Christopher Nolan"],
      watchProviders: ["Netflix", "Max"],
      source: "local"
    },
    {
      type: "movie",
      title: "The Dark Knight",
      genres: ["Acción"],
      synopsis: "Cuando la amenaza conocida como el Guasón causa estravos y caos en Gotham.",
      cover: "https://images.unsplash.com/photo-1478720143033-6a972678aa30?w=500", // Reemplaza esta línea por:
      // cover: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500", // Luces de cine/neon estables
      year: 2008,
      rating: 4.9,
      creator: ["Christopher Nolan"],
      watchProviders: ["Max"],
      source: "local"
    },
    {
      type: "movie",
      title: "Interstellar",
      genres: ["Ciencia Ficción"],
      synopsis: "Un equipo de exploradores viaja a través de un agujero de gusano en el espacio para asegurar la supervivencia de la humanidad.",
      cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500", // Galaxia estable
      year: 2014,
      rating: 4.7,
      creator: ["Christopher Nolan"],
      watchProviders: ["Prime Video"],
      source: "local"
    }
  ];

async function seedDatabase() {
  console.log('🎬 Iniciando la carga de películas corregidas en Firestore...');
  const collectionRef = db.collection('content');

  for (const movie of movies) {
    await collectionRef.add(movie);
    console.log(`✅ Película agregada con esquema correcto: ${movie.title}`);
  }
  
  console.log('🚀 ¡Ingesta de datos completada con éxito!');
  process.exit(0);
}

seedDatabase().catch(err => {
  console.error('❌ Error inyectando datos:', err);
  process.exit(1);
});