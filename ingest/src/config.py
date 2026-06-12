import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


def get_tmdb_api_key() -> str:
    key = os.environ.get("TMDB_API_KEY", "")
    if not key:
        raise RuntimeError("TMDB_API_KEY not set in environment or .env")
    return key


def get_google_books_api_key() -> str:
    key = os.environ.get("GOOGLE_BOOKS_API_KEY", "")
    if not key:
        raise RuntimeError("GOOGLE_BOOKS_API_KEY not set in environment or .env")
    return key


def get_firestore_project_id() -> str:
    return os.environ.get("FIRESTORE_PROJECT_ID", "")


def is_emulator() -> bool:
    return bool(os.environ.get("FIRESTORE_EMULATOR_HOST"))
