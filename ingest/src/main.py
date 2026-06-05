import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models import ContentItem
from tmdb_ingest import TMDBClient
from books_ingest import GoogleBooksClient
from firestore_client import FirestoreClient


def run_ingest() -> dict:
    tmdb = TMDBClient()
    books = GoogleBooksClient()
    fs = FirestoreClient()

    all_items: list[ContentItem] = []

    print("--- Fetching TMDB movies ---")
    raw_movies = tmdb.fetch_all(target=300)
    for m in raw_movies:
        all_items.append(ContentItem.from_tmdb(m["details"], m["providers"]))

    print("--- Fetching Google Books ---")
    raw_books = books.fetch_all(target=250)
    for b in raw_books:
        all_items.append(ContentItem.from_google_books(b))

    print(f"--- Total items to write: {len(all_items)} ---")
    written = fs.batch_upsert(all_items)
    return {"status": "ok", "count": written}


def main(request=None):
    result = run_ingest()
    print(f"Done: {result}")
    return result


if __name__ == "__main__":
    main()
