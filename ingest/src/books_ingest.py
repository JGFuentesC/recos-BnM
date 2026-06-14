import sys
import time
import requests
from config import get_google_books_api_key

sys.stdout.reconfigure(encoding="utf-8")

BOOKS_BASE = "https://www.googleapis.com/books/v1"


class GoogleBooksClient:
    def __init__(self):
        self.api_key = get_google_books_api_key()

    def _get(self, path: str, params: dict | None = None) -> dict:
        url = f"{BOOKS_BASE}{path}"
        params = params or {}
        params["key"] = self.api_key

        resp = requests.get(url, params=params, timeout=20)
        resp.raise_for_status()
        return resp.json()

    def search_volumes(
        self,
        query: str,
        max_results: int = 40,
        start_index: int = 0,
    ) -> list[dict]:
        data = self._get(
            "/volumes",
            {
                "q": query,
                "maxResults": min(max_results, 40),
                "startIndex": start_index,
                "orderBy": "relevance",
            },
        )
        return data.get("items", [])

    def fetch_all(self, target: int = 250) -> list[dict]:
        book_categories = [
            "subject:fiction",
            "subject:fantasy",
            "subject:science+fiction",
            "subject:romance",
            "subject:mystery",
            "subject:thriller",
            "subject:nonfiction",
            "subject:history",
            "subject:biography",
            "subject:self+help",
            "subject:philosophy",
            "subject:science",
            "subject:travel",
            "subject:poetry",
            "subject:cooking",
            "subject:art",
            "subject:sports",
        ]

        seen_ids: set[str] = set()
        items: list[dict] = []

        for category in book_categories:
            if len(items) >= target:
                break

            try:
                for start_index in (0, 40):
                    results = self.search_volumes(
                        category,
                        max_results=40,
                        start_index=start_index,
                    )

                    if not results:
                        break

                    for volume in results:
                        volume_id = volume.get("id")

                        if not volume_id or volume_id in seen_ids:
                            continue

                        seen_ids.add(volume_id)
                        items.append(volume)

                        volume_info = volume.get("volumeInfo", {})
                        safe_title = (
                            volume_info.get("title", "?") or "?"
                        ).encode("utf-8", errors="replace").decode("utf-8")

                        print(f"[Books] {len(items)} fetched -> {safe_title}")

                        if len(items) >= target:
                            break

                    if len(items) >= target:
                        break

                    time.sleep(0.3)

                time.sleep(0.5)

            except requests.HTTPError as error:
                print(f"[Books] HTTP error on category '{category}': {error}")
                continue

            except requests.RequestException as error:
                print(f"[Books] Request error on category '{category}': {error}")
                continue

        print(f"[Books] Fetched {len(items)} books")
        return items


if __name__ == "__main__":
    client = GoogleBooksClient()
    books = client.fetch_all(target=250)
    print(
        "[Books] Standalone fetch completed. "
        "Run ingest/src/main.py to normalize and write books to Firestore."
    )
    print(f"[Books] Total fetched: {len(books)}")
