from __future__ import annotations

from dataclasses import asdict
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request

from backend.models.schemas import Profile
from backend.services.storage import get_store
from backend.utils.auth import get_or_create_profile, resolve_current_user, require_auth
from backend.utils.validation import ALLOWED_THEMES, ALLOWED_UNITS, ensure_allowed, positive_number


profile_bp = Blueprint('profile', __name__, url_prefix='/api')


@profile_bp.get('/profile')
@require_auth
def profile_get():
    user = resolve_current_user()
    return jsonify(get_or_create_profile(user))


@profile_bp.put('/profile')
@require_auth
def profile_put():
    payload = request.get_json(silent=True) or {}
    user = resolve_current_user()
    store = get_store()
    existing = get_or_create_profile(user)
    profile = Profile(
        user_id=user['uid'],
        name=str(payload.get('name', existing.get('name', 'EcoTrack User'))),
        photo_url=str(payload.get('photo_url', existing.get('photo_url', ''))),
        daily_budget=positive_number(payload.get('daily_budget', existing.get('daily_budget', 7)), 'daily_budget'),
        preferred_units=ensure_allowed(payload.get('preferred_units', existing.get('preferred_units', 'metric')), ALLOWED_UNITS, 'preferred units'),
        theme=ensure_allowed(payload.get('theme', existing.get('theme', 'system')), ALLOWED_THEMES, 'theme'),
        created_at=existing.get('created_at', datetime.now(timezone.utc).isoformat()),
        updated_at=datetime.now(timezone.utc).isoformat(),
    )
    return jsonify(store.set_doc('users', user['uid'], asdict(profile)))
