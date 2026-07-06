from __future__ import annotations

from datetime import datetime, timezone

from flask import Blueprint, jsonify, request

from backend.services.suggestions import generate_suggestions
from backend.services.storage import get_store
from backend.utils.auth import get_or_create_profile, resolve_current_user, require_auth


suggestions_bp = Blueprint('suggestions', __name__, url_prefix='/api')


@suggestions_bp.post('/suggestions')
@require_auth
def suggestions():
    payload = request.get_json(silent=True) or {}
    user = resolve_current_user()
    profile = get_or_create_profile(user)
    breakdown = {
        'travel': float(payload.get('travel', 0)),
        'food': float(payload.get('food', 0)),
        'energy': float(payload.get('energy', 0)),
        'totalEmission': float(payload.get('totalEmission', 0)),
        'budget': float(profile.get('daily_budget', 7)),
    }
    items = generate_suggestions(breakdown)
    store = get_store()
    store.set_doc('suggestions', user['uid'], {
        'user_id': user['uid'],
        'items': items,
        'breakdown': breakdown,
        'timestamp': datetime.now(timezone.utc).isoformat(),
    })
    return jsonify({'suggestions': items})
