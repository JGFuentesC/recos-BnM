from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Literal


ContentType = Literal["movie", "book"]
SourceType = Literal["tmdb", "google_books"]


@dataclass
class ContentItem:
    type: ContentType
    externalId: str
    source: SourceType
    title: str
    cover: str
    year: int
    creator: list[str] = field(default_factory=list)
    genres: list[str] = field(default_factory=list)
    synopsis: str = ""
    popularity: float = 0.0
    rating: float = 0.0
    watchProviders: list[str] = field(default_factory=list)
    syncedAt: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    @property
    def content_id(self) -> str:
        return f"{self.source}_{self.externalId}"

    def to_firestore_dict(self) -> dict:
        d = asdict(self)
        d["titleLower"] = self.title.lower()
        return d

    @classmethod
    def from_tmdb(cls, details: dict, watch_providers: list[str]) -> "ContentItem":
        crew = details.get("credits", {}).get("crew", [])
        directors = [m["name"] for m in crew if m.get("job") == "Director"]
        return cls(
            type="movie",
            externalId=str(details["id"]),
            source="tmdb",
            title=details.get("title", ""),
            cover=f"https://image.tmdb.org/t/p/w500{details.get('poster_path', '')}" if details.get("poster_path") else "",
            year=cls._extract_year(details.get("release_date", "")),
            creator=directors,
            genres=[g["name"] for g in details.get("genres", [])],
            synopsis=details.get("overview", ""),
            popularity=details.get("popularity", 0.0),
            rating=details.get("vote_average", 0.0),
            watchProviders=watch_providers,
        )

    @classmethod
    def from_google_books(cls, volume: dict) -> "ContentItem":
        info = volume.get("volumeInfo", {})
        image_links = info.get("imageLinks", {})
        raw_rating = info.get("averageRating", 0.0)
        return cls(
            type="book",
            externalId=volume["id"],
            source="google_books",
            title=info.get("title", ""),
            cover=image_links.get("thumbnail", ""),
            year=cls._extract_year(info.get("publishedDate", "")),
            creator=info.get("authors", []),
            genres=info.get("categories", []),
            synopsis=info.get("description", ""),
            popularity=0.0,
            rating=raw_rating * 2.0,
        )

    @staticmethod
    def _extract_year(date_str: str) -> int:
        if not date_str:
            return 0
        try:
            return int(date_str[:4])
        except (ValueError, IndexError):
            return 0
