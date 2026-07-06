from __future__ import annotations

from dataclasses import asdict
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request

from backend.models.schemas import LogEntry
from backend.services.badges import evaluate_badges
from backend.services.carbon import calculate_daily_footprint
from backend.services.storage import get_store
from backend.utils.auth import get_or_create_profile, resolve_current_user, require_auth
from backend.utils.stats import calculate_streaks
from backend.utils.validation import ensure_allowed, positive_number

logs_bp = Blueprint('logs', __name__, url_prefix='/api')


@logs_bp.post('/log')
@require_auth
def create_log():
    payload = request.get_json(silent=True) or {}
    user = resolve_current_user()
    profile = get_or_create_profile(user)
    budget = positive_number(payload.get('budget', profile.get('daily_budget', 7)), 'budget')
    calculation = calculate_daily_footprint({**payload, 'budget': budget})
    date_value = payload.get('date') or datetime.now(timezone.utc).date().isoformat()
    timestamp = payload.get('timestamp') or datetime.now(timezone.utc).isoformat()
    log = LogEntry(
        user_id=user['uid'],
        date=date_value,
        travel=calculation['travel'],
        food=calculation['food'],
        energy=calculation['energy'],
        total_emission=calculation['totalEmission'],
        budget_remaining=calculation['budgetRemaining'],
        timestamp=timestamp,
    )
    store = get_store()
    doc_id = f"{user['uid']}:{date_value[:10]}"
    store.set_doc('daily_logs', doc_id, {
        **asdict(log),
        'totalEmission': log.total_emission,
        'budgetRemaining': log.budget_remaining,
    })
    logs = store.list_docs('daily_logs', lambda item: item.get('user_id') == user['uid'])
    badges = evaluate_badges(logs)
    store.set_doc('badges', user['uid'], {'user_id': user['uid'], 'items': badges, 'timestamp': datetime.now(timezone.utc).isoformat()})
    current_streak, longest_streak = calculate_streaks(logs)
    store.set_doc('streaks', user['uid'], {
        'user_id': user['uid'],
        'currentStreak': current_streak,
        'longestStreak': longest_streak,
        'updated_at': datetime.now(timezone.utc).isoformat(),
    })
    return jsonify({'ok': True, 'log': store.get_doc('daily_logs', doc_id), 'badges': badges, 'calculation': calculation})
