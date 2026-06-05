import time
import requests
from config import get_google_books_api_key

BOOKS_BASE = "https://www.googleapis.com/books/v1"


class GoogleBooksClient:
    def __init__(self):
        self.api_key = get_google_books_api_key()

    def _get(self, path: str, params: dict | None = None) -> dict:
        url = f"{BOOKS_BASE}{path}"
        params = params or {}
        params["key"] = self.api_key
        resp = requests.get(url, params=params)
        resp.raise_for_status()
        return resp.json()

    def search_volumes(self, query: str, max_results: int = 40, start_index: int = 0) -> list[dict]:
        data = self._get("/volumes", {
            "q": query,
            "maxResults": min(max_results, 40),
            "startIndex": start_index,
            "orderBy": "relevance",
        })
        return data.get("items", [])

    def fetch_all(self, target: int = 250) -> list[dict]:
        categories = [
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
        items = []

        for category in categories:
            if len(items) >= target:
                break
            try:
                for start in (0, 40):
                    results = self.search_volumes(category, max_results=40, start_index=start)
                    if not results:
                        break
                    for vol in results:
                        vid = vol.get("id")
                        if vid and vid not in seen_ids:
                            seen_ids.add(vid)
                            items.append(vol)
                            safe_title = (vol.get('volumeInfo', {}).get('title', '?') or '?').encode('utf-8', errors='replace').decode('utf-8')
                            print(f"[Books] {len(items)}: {safe_title}")
                            if len(items) >= target:
                                break
                    if len(items) >= target:
                        break
                    time.sleep(0.3)
                time.sleep(0.5)
            except requests.HTTPError as e:
                print(f"[Books] Error on category '{category}': {e}")
                continue

        print(f"[Books] Fetched {len(items)} books")
        return items
