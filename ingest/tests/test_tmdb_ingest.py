import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from models import ContentItem


def test_from_tmdb_creates_correct_fields():
    mock_details = {
        "id": 550,
        "title": "Fight Club",
        "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        "release_date": "1999-10-15",
        "genres": [{"name": "Drama"}, {"name": "Thriller"}],
        "overview": "A ticking time bomb of a movie.",
        "popularity": 85.5,
        "vote_average": 8.4,
        "credits": {
            "crew": [
                {"name": "David Fincher", "job": "Director"},
                {"name": "Someone Else", "job": "Producer"},
            ]
        },
    }
    mock_providers = ["Netflix", "Amazon Prime"]
    item = ContentItem.from_tmdb(mock_details, mock_providers)

    assert item.type == "movie"
    assert item.externalId == "550"
    assert item.source == "tmdb"
    assert item.title == "Fight Club"
    assert item.posterUrl == "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
    assert item.year == 1999
    assert item.creator == ["David Fincher"]
    assert item.genres == ["Drama", "Thriller"]
    assert item.description == "A ticking time bomb of a movie."
    assert item.popularity == 85.5
    assert item.rating == 8.4
    assert item.whereToWatch == ["Netflix", "Amazon Prime"]
    assert item.content_id == "tmdb_550"


def test_from_tmdb_missing_poster_returns_empty_string():
    mock_details = {"id": 999, "title": "No Poster"}
    item = ContentItem.from_tmdb(mock_details, [])
    assert item.posterUrl == ""


def test_from_tmdb_missing_release_date_returns_year_zero():
    mock_details = {"id": 100, "title": "No Date"}
    item = ContentItem.from_tmdb(mock_details, [])
    assert item.year == 0


def test_from_tmdb_handles_empty_genres():
    mock_details = {"id": 200, "title": "No Genres", "genres": []}
    item = ContentItem.from_tmdb(mock_details, [])
    assert item.genres == []


def test_from_tmdb_empty_watch_providers():
    mock_details = {"id": 300, "title": "No Providers"}
    item = ContentItem.from_tmdb(mock_details, [])
    assert item.whereToWatch == []


def test_from_tmdb_extracts_director():
    mock_details = {
        "id": 1,
        "title": "Test",
        "credits": {
            "crew": [
                {"name": "Christopher Nolan", "job": "Director"},
            ]
        },
    }
    item = ContentItem.from_tmdb(mock_details, [])
    assert item.creator == ["Christopher Nolan"]


def test_from_tmdb_no_credits_returns_empty_creator():
    mock_details = {"id": 2, "title": "No Credits"}
    item = ContentItem.from_tmdb(mock_details, [])
    assert item.creator == []


def test_from_google_books_creates_correct_fields():
    mock_volume = {
        "id": "abc123",
        "volumeInfo": {
            "title": "The Great Gatsby",
            "authors": ["F. Scott Fitzgerald"],
            "imageLinks": {"thumbnail": "http://books.google.com/cover.jpg"},
            "publishedDate": "1925-04-10",
            "categories": ["Fiction", "Classic"],
            "description": "A story of the jazz age.",
            "averageRating": 4.5,
        },
    }
    item = ContentItem.from_google_books(mock_volume)

    assert item.type == "book"
    assert item.externalId == "abc123"
    assert item.source == "google_books"
    assert item.title == "The Great Gatsby"
    assert item.posterUrl == "http://books.google.com/cover.jpg"
    assert item.year == 1925
    assert item.creator == ["F. Scott Fitzgerald"]
    assert item.genres == ["Fiction", "Classic"]
    assert item.description == "A story of the jazz age."
    assert item.popularity == 0.0
    assert item.rating == 9.0
    assert item.whereToWatch == []
    assert item.content_id == "google_books_abc123"


def test_book_rating_multiplied_by_two():
    mock_volume = {"id": "x1", "volumeInfo": {"averageRating": 3.0}}
    item = ContentItem.from_google_books(mock_volume)
    assert item.rating == 6.0


def test_book_rating_zero_when_missing():
    mock_volume = {"id": "x2", "volumeInfo": {}}
    item = ContentItem.from_google_books(mock_volume)
    assert item.rating == 0.0


def test_book_rating_max_five_becomes_ten():
    mock_volume = {"id": "x3", "volumeInfo": {"averageRating": 5.0}}
    item = ContentItem.from_google_books(mock_volume)
    assert item.rating == 10.0


def test_book_missing_cover_returns_empty_string():
    mock_volume = {"id": "x4", "volumeInfo": {}}
    item = ContentItem.from_google_books(mock_volume)
    assert item.posterUrl == ""


def test_book_missing_categories_returns_empty_list():
    mock_volume = {"id": "x5", "volumeInfo": {}}
    item = ContentItem.from_google_books(mock_volume)
    assert item.genres == []


def test_book_missing_description_returns_empty_string():
    mock_volume = {"id": "x6", "volumeInfo": {}}
    item = ContentItem.from_google_books(mock_volume)
    assert item.description == ""


def test_book_extracts_authors():
    mock_volume = {"id": "x7", "volumeInfo": {"authors": ["Author One", "Author Two"]}}
    item = ContentItem.from_google_books(mock_volume)
    assert item.creator == ["Author One", "Author Two"]


def test_book_missing_authors_returns_empty_list():
    mock_volume = {"id": "x8", "volumeInfo": {}}
    item = ContentItem.from_google_books(mock_volume)
    assert item.creator == []


def test_content_id_format():
    tmdb_item = ContentItem.from_tmdb({"id": 42}, [])
    assert tmdb_item.content_id == "tmdb_42"

    books_item = ContentItem.from_google_books({"id": "book1", "volumeInfo": {}})
    assert books_item.content_id == "google_books_book1"


def test_to_firestore_dict_includes_all_fields():
    mock = {"id": 1, "title": "Test"}
    item = ContentItem.from_tmdb(mock, [])
    d = item.to_firestore_dict()
    assert d["type"] == "movie"
    assert d["externalId"] == "1"
    assert d["source"] == "tmdb"
    assert d["title"] == "Test"
    assert d["rating"] == 0.0
    assert isinstance(d["syncedAt"], str)


def test_extract_year():
    assert ContentItem._extract_year("1999-10-15") == 1999
    assert ContentItem._extract_year("2000") == 2000
    assert ContentItem._extract_year("") == 0
    assert ContentItem._extract_year("invalid") == 0
    assert ContentItem._extract_year("95 BC") == 0
