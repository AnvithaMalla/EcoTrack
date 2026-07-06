from __future__ import annotations

from flask import Blueprint, jsonify

from backend.services.badges import evaluate_badges
from backend.services.storage import get_store
from backend.utils.auth import resolve_current_user, require_auth


badges_bp = Blueprint('badges', __name__, url_prefix='/api')


@badges_bp.get('/badges')
@require_auth
def badges():
    user = resolve_current_user()
    store = get_store()
    logs = store.list_docs('daily_logs', lambda item: item.get('user_id') == user['uid'])
    return jsonify({'badges': evaluate_badges(logs)})
