import os
os.environ.setdefault("FIRESTORE_EMULATOR_HOST", "localhost:8080")

from google.cloud import firestore
from config import get_firestore_project_id

project_id = get_firestore_project_id()
db = firestore.Client(project=project_id)

limit = int(os.environ.get("SHOW", "20"))

movies = db.collection("content").where("type", "==", "movie").limit(limit // 2).stream()
books = db.collection("content").where("type", "==", "book").limit(limit // 2).stream()

print(f"\n=== Películas (mostrando {limit//2}) ===")
for doc in movies:
    d = doc.to_dict()
    print(f"  [{doc.id}] {d.get('title','?')} | rating: {d.get('rating','?')} | pop: {d.get('popularity','?')}")

print(f"\n=== Libros (mostrando {limit//2}) ===")
for doc in books:
    d = doc.to_dict()
    print(f"  [{doc.id}] {d.get('title','?')} | rating: {d.get('rating','?')} | pop: {d.get('popularity','?')}")

total = db.collection("content").count().get()[0][0].value
print(f"\n--- Total en colección content: {total} documentos ---")
