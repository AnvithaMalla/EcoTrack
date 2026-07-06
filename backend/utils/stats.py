from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any


def _parse_date(value: str) -> datetime:
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def summarize_logs(logs: list[dict[str, Any]], budget: float) -> dict[str, Any]:
    ordered = sorted(logs, key=lambda item: item.get('date', ''))
    totals = {'travel': 0.0, 'food': 0.0, 'energy': 0.0}
    for log in ordered:
        totals['travel'] += float(log.get('travel', {}).get('emission', 0))
        totals['food'] += float(log.get('food', {}).get('emission', 0))
        totals['energy'] += float(log.get('energy', {}).get('emission', 0))
    total_emission = round(sum(totals.values()), 3)
    current_streak, longest_streak = calculate_streaks(ordered)
    latest_log = ordered[-1] if ordered else None
    weekly_total = round(sum(float(item.get('totalEmission', 0)) for item in ordered[-7:]), 3)
    monthly_total = round(sum(float(item.get('totalEmission', 0)) for item in ordered[-30:]), 3)
    return {
        'totalEmission': total_emission,
        'budget': budget,
        'budgetRemaining': round(budget - (latest_log.get('totalEmission', 0) if latest_log else 0), 3),
        'totals': totals,
        'currentStreak': current_streak,
        'longestStreak': longest_streak,
        'latestLog': latest_log,
        'weeklyTotal': weekly_total,
        'monthlyTotal': monthly_total,
        'weeklyAverage': round(weekly_total / min(7, len(ordered)) if ordered else 0, 3),
        'mostPollutingCategory': max(totals, key=totals.get) if ordered else 'travel',
    }


def calculate_streaks(logs: list[dict[str, Any]]) -> tuple[int, int]:
    if not logs:
        return 0, 0
    dates = sorted({_parse_date(log['date']).date() for log in logs if log.get('date')})
    if not dates:
        return 0, 0
    longest = 1
    current = 1
    run = 1
    for previous, current_date in zip(dates, dates[1:]):
        if current_date - previous == timedelta(days=1):
            run += 1
        else:
            longest = max(longest, run)
            run = 1
    longest = max(longest, run)
    today = datetime.now(timezone.utc).date()
    current_run = 0
    cursor = today
    for date_value in reversed(dates):
        if date_value == cursor:
            current_run += 1
            cursor = cursor - timedelta(days=1)
        elif date_value < cursor:
            break
    return current_run, longest


def build_calendar_heatmap(logs: list[dict[str, Any]], days: int = 30) -> list[dict[str, Any]]:
    latest = datetime.now(timezone.utc).date()
    by_date = {log['date'][:10]: float(log.get('totalEmission', 0)) for log in logs if log.get('date')}
    entries = []
    for offset in range(days - 1, -1, -1):
        day = latest - timedelta(days=offset)
        value = by_date.get(day.isoformat(), 0)
        entries.append({'date': day.isoformat(), 'value': value})
    return entries


def build_time_series(logs: list[dict[str, Any]], days: int = 30) -> list[dict[str, Any]]:
    heatmap = build_calendar_heatmap(logs, days)
    return [
        {
            'date': item['date'],
            'totalEmission': item['value'],
            'travel': 0,
            'food': 0,
            'energy': 0,
        }
        for item in heatmap
    ]
