from config import get_firestore_project_id
from models import ContentItem
from google.cloud import firestore


class FirestoreClient:
    def __init__(self):
        project_id = get_firestore_project_id()
        self.db = firestore.Client(project=project_id)

    def batch_upsert(self, items: list[ContentItem], batch_size: int = 400) -> int:
        written = 0
        for i in range(0, len(items), batch_size):
            batch = self.db.batch()
            chunk = items[i : i + batch_size]
            for item in chunk:
                doc_ref = self.db.collection("content").document(item.content_id)
                batch.set(doc_ref, item.to_firestore_dict(), merge=True)
            batch.commit()
            written += len(chunk)
            print(f"[Firestore] Wrote {written}/{len(items)} documents")
        return written
