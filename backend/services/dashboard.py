from __future__ import annotations

from typing import Any

from backend.services.storage import get_store
from backend.utils.stats import summarize_logs


def get_dashboard_payload(user_id: str) -> dict[str, Any]:
    store = get_store()
    profile = store.get_doc('users', user_id) or {'daily_budget': 7.0, 'name': 'EcoTrack User'}
    logs = store.list_docs('daily_logs', lambda item: item.get('user_id') == user_id)
    suggestions = store.list_docs('suggestions', lambda item: item.get('user_id') == user_id)
    badges = store.list_docs('badges', lambda item: item.get('user_id') == user_id)
    stats = summarize_logs(logs, float(profile.get('daily_budget', 7.0)))
    recent_logs = list(reversed(logs[-5:]))
    latest_badge = next((badge for badge in reversed(badges) if badge.get('unlocked')), badges[-1] if badges else None)

    category_totals = stats['totals']
    weekly_summary = {
        'title': 'Weekly summary',
        'value': stats['weeklyTotal'],
        'average': stats['weeklyAverage'],
    }
    monthly_summary = {
        'title': 'Monthly summary',
        'value': stats['monthlyTotal'],
    }

    return {
        'profile': profile,
        'stats': stats,
        'categoryTotals': category_totals,
        'weeklySummary': weekly_summary,
        'monthlySummary': monthly_summary,
        'recentLogs': recent_logs,
        'latestBadge': latest_badge,
        'suggestions': list(reversed(suggestions[-3:])),
    }
