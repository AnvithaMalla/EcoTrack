from __future__ import annotations

from collections import defaultdict
from copy import deepcopy
from datetime import datetime
from typing import Any

from backend.firebase.config import get_firestore_client


class MemoryStore:
    def __init__(self) -> None:
        self._collections: dict[str, dict[str, dict[str, Any]]] = defaultdict(dict)

    def get_doc(self, collection: str, doc_id: str) -> dict[str, Any] | None:
        document = self._collections[collection].get(doc_id)
        return deepcopy(document) if document else None

    def set_doc(self, collection: str, doc_id: str, data: dict[str, Any]) -> dict[str, Any]:
        payload = deepcopy(data)
        payload['_id'] = doc_id
        self._collections[collection][doc_id] = payload
        return deepcopy(payload)

    def upsert_doc(self, collection: str, doc_id: str, data: dict[str, Any]) -> dict[str, Any]:
        existing = self._collections[collection].get(doc_id, {})
        merged = {**existing, **deepcopy(data), '_id': doc_id}
        self._collections[collection][doc_id] = merged
        return deepcopy(merged)

    def list_docs(self, collection: str, predicate=None) -> list[dict[str, Any]]:
        items = list(self._collections[collection].values())
        if predicate is not None:
            items = [item for item in items if predicate(item)]
        items.sort(key=lambda item: item.get('timestamp', item.get('updated_at', '')))
        return deepcopy(items)

    def delete_doc(self, collection: str, doc_id: str) -> None:
        self._collections[collection].pop(doc_id, None)


class FirestoreStore:
    def __init__(self) -> None:
        client = get_firestore_client()
        if client is None:
            raise RuntimeError('Firestore client is unavailable')
        self.client = client

    def get_doc(self, collection: str, doc_id: str) -> dict[str, Any] | None:
        snapshot = self.client.collection(collection).document(doc_id).get()
        return snapshot.to_dict() | {'_id': doc_id} if snapshot.exists else None

    def set_doc(self, collection: str, doc_id: str, data: dict[str, Any]) -> dict[str, Any]:
        self.client.collection(collection).document(doc_id).set(data)
        return {**data, '_id': doc_id}

    def upsert_doc(self, collection: str, doc_id: str, data: dict[str, Any]) -> dict[str, Any]:
        self.client.collection(collection).document(doc_id).set(data, merge=True)
        return {**data, '_id': doc_id}

    def list_docs(self, collection: str, predicate=None) -> list[dict[str, Any]]:
        snapshots = self.client.collection(collection).stream()
        items = []
        for snapshot in snapshots:
            document = snapshot.to_dict() or {}
            document['_id'] = snapshot.id
            if predicate is None or predicate(document):
                items.append(document)
        items.sort(key=lambda item: item.get('timestamp', item.get('updated_at', '')))
        return items

    def delete_doc(self, collection: str, doc_id: str) -> None:
        self.client.collection(collection).document(doc_id).delete()


_store_instance = None


def get_store():
    global _store_instance
    if _store_instance is None:
        try:
            _store_instance = FirestoreStore()
        except Exception:
            _store_instance = MemoryStore()
    return _store_instance


def reset_store_for_tests():
    global _store_instance
    _store_instance = MemoryStore()
