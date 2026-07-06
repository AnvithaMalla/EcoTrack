from __future__ import annotations

import json
import os
from functools import lru_cache

import firebase_admin
from firebase_admin import credentials, firestore

from backend.config import Config


@lru_cache(maxsize=1)
def initialize_firebase_app():
    if firebase_admin._apps:
        return firebase_admin.get_app()

    config = Config()
    credential = None

    if config.firebase_client_email and config.firebase_private_key and config.firebase_project_id:
        credential = credentials.Certificate(
            {
                'type': 'service_account',
                'project_id': config.firebase_project_id,
                'private_key_id': os.getenv('FIREBASE_PRIVATE_KEY_ID', ''),
                'private_key': config.firebase_private_key,
                'client_email': config.firebase_client_email,
                'client_id': os.getenv('FIREBASE_CLIENT_ID', ''),
                'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
                'token_uri': 'https://oauth2.googleapis.com/token',
                'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
                'client_x509_cert_url': os.getenv('FIREBASE_CLIENT_CERT_URL', '')
            }
        )
    elif os.getenv('GOOGLE_APPLICATION_CREDENTIALS'):
        credential = credentials.ApplicationDefault()

    if credential is None:
        return None

    options = {'projectId': config.firebase_project_id}
    if config.firebase_database_url:
        options['databaseURL'] = config.firebase_database_url

    return firebase_admin.initialize_app(credential, options)


@lru_cache(maxsize=1)
def get_firestore_client():
    if initialize_firebase_app() is None:
        return None
    return firestore.client()
