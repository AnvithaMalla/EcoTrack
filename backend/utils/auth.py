from __future__ import annotations

from dataclasses import asdict
from functools import wraps
from typing import Any, Callable

from flask import Request, current_app, g, jsonify, request
from firebase_admin import auth as firebase_auth

from backend.config import Config
from backend.models.schemas import Profile
from backend.services.storage import get_store


def get_bearer_token(req: Request) -> str | None:
    header = req.headers.get('Authorization', '')
    if header.startswith('Bearer '):
        return header.split(' ', 1)[1].strip() or None
    return None


def resolve_current_user() -> dict[str, Any]:
    if hasattr(g, 'current_user') and g.current_user:
        return g.current_user

    config = Config()
    token = get_bearer_token(request)
    if token:
        decoded = firebase_auth.verify_id_token(token)
        user = {
            'uid': decoded['uid'],
            'email': decoded.get('email', ''),
            'name': decoded.get('name') or decoded.get('email', 'EcoTrack User'),
            'picture': decoded.get('picture', ''),
        }
        g.current_user = user
        return user

    if config.dev_allow_anonymous:
        user = {'uid': 'demo-user', 'email': 'demo@ecotrack.local', 'name': 'Demo User', 'picture': ''}
        g.current_user = user
        return user

    raise PermissionError('Authentication required')


def require_auth(view: Callable) -> Callable:
    @wraps(view)
    def wrapped(*args, **kwargs):
        try:
            resolve_current_user()
        except Exception as exc:
            return jsonify({'error': str(exc)}), 401
        return view(*args, **kwargs)

    return wrapped


def get_or_create_profile(user: dict[str, Any]) -> dict[str, Any]:
    store = get_store()
    profile = store.get_doc('users', user['uid'])
    if profile:
        return profile
    created = Profile(user_id=user['uid'], name=user.get('name', 'EcoTrack User'), photo_url=user.get('picture', ''))
    return store.set_doc('users', user['uid'], asdict(created))
