import time
import requests
from config import get_tmdb_api_key

TMDB_BASE = "https://api.themoviedb.org/3"
TMDB_ATTRIBUTION = "This product uses the TMDB API but is not endorsed or certified by TMDB."


class TMDBClient:
    def __init__(self):
        self.api_key = get_tmdb_api_key()
        self.session = requests.Session()
        self.session.headers.update({"Authorization": f"Bearer {self.api_key}"})

    def _get(self, path: str, params: dict | None = None) -> dict:
        url = f"{TMDB_BASE}{path}"
        params = params or {}
        params.setdefault("language", "es-MX")
        resp = self.session.get(url, params=params)
        resp.raise_for_status()
        return resp.json()

    def get_popular_movies(self, max_pages: int = 15) -> list[dict]:
        movies = []
        for p in range(1, max_pages + 1):
            data = self._get("/movie/popular", {"page": p})
            movies.extend(data.get("results", []))
            if p >= data.get("total_pages", 1):
                break
            time.sleep(0.25)
        return movies

    def get_top_rated_movies(self, max_pages: int = 5) -> list[dict]:
        movies = []
        for p in range(1, max_pages + 1):
            data = self._get("/movie/top_rated", {"page": p})
            movies.extend(data.get("results", []))
            if p >= data.get("total_pages", 1):
                break
            time.sleep(0.25)
        return movies

    def get_movie_details(self, movie_id: int) -> dict:
        return self._get(f"/movie/{movie_id}", {"append_to_response": "credits"})

    def get_watch_providers(self, movie_id: int) -> list[str]:
        data = self._get(f"/movie/{movie_id}/watch/providers")
        results = data.get("results", {})
        for region in ("MX", "US", "CA", "GB"):
            region_data = results.get(region, {})
            providers = region_data.get("flatrate", []) + region_data.get("rent", []) + region_data.get("buy", [])
            if providers:
                return list({p["provider_name"] for p in providers})
        return []

    def fetch_all(self, target: int = 300) -> list[dict]:
        popular = self.get_popular_movies(max_pages=15)
        top_rated = self.get_top_rated_movies(max_pages=5)
        seen_ids: set[int] = set()
        candidates = []
        for m in popular + top_rated:
            mid = m["id"]
            if mid not in seen_ids:
                seen_ids.add(mid)
                candidates.append(m)
        print(f"[TMDB] {len(candidates)} unique candidates ({len(popular)} popular + {len(top_rated)} top_rated)")
        items = []
        for i, movie in enumerate(candidates):
            if len(items) >= target:
                break
            try:
                details = self.get_movie_details(movie["id"])
                providers = self.get_watch_providers(movie["id"])
                items.append({"details": details, "providers": providers})
                safe_title = (details.get('title', '?') or '?').encode('utf-8', errors='replace').decode('utf-8')
                print(f"[TMDB] {i+1}/{len(candidates)}: {safe_title}")
                time.sleep(0.25)
            except requests.HTTPError as e:
                print(f"[TMDB] Error on movie {movie['id']}: {e}")
                continue
        print(f"[TMDB] Fetched {len(items)} movies ({TMDB_ATTRIBUTION})")
        return items
