from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.services.storage import get_store
from backend.utils.stats import build_calendar_heatmap, build_time_series, summarize_logs


def get_history_payload(user_id: str, date_from: str | None = None, date_to: str | None = None) -> dict[str, Any]:
    store = get_store()
    profile = store.get_doc('users', user_id) or {'daily_budget': 7.0}
    logs = store.list_docs('daily_logs', lambda item: item.get('user_id') == user_id)

    if date_from:
        start = datetime.fromisoformat(date_from).date()
        logs = [log for log in logs if datetime.fromisoformat(log['date'].replace('Z', '+00:00')).date() >= start]
    if date_to:
        end = datetime.fromisoformat(date_to).date()
        logs = [log for log in logs if datetime.fromisoformat(log['date'].replace('Z', '+00:00')).date() <= end]

    stats = summarize_logs(logs, float(profile.get('daily_budget', 7.0)))
    history = build_time_series(logs, 30)
    heatmap = build_calendar_heatmap(logs, 30)
    return {
        'logs': logs,
        'stats': stats,
        'history': history,
        'heatmap': heatmap,
        'categorySeries': [
            {'label': 'Travel', 'values': [float(item.get('travel', {}).get('emission', 0)) for item in logs[-14:]]},
            {'label': 'Food', 'values': [float(item.get('food', {}).get('emission', 0)) for item in logs[-14:]]},
            {'label': 'Energy', 'values': [float(item.get('energy', {}).get('emission', 0)) for item in logs[-14:]]},
        ],
        'monthlyTotal': stats['monthlyTotal'],
        'bestDay': min(logs, key=lambda item: float(item.get('totalEmission', 9999))) if logs else None,
        'worstDay': max(logs, key=lambda item: float(item.get('totalEmission', 0))) if logs else None,
    }
