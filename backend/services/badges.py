from __future__ import annotations

from dataclasses import asdict
from typing import Any

from backend.models.schemas import BadgeDefinition
from backend.utils.stats import calculate_streaks

BADGES = [
    BadgeDefinition('first_log', 'First Log', 'Complete your first footprint entry.', 'leaf', 1, 'logs'),
    BadgeDefinition('seven_day_streak', '7 Day Streak', 'Log seven days in a row.', 'fire', 7, 'streak'),
    BadgeDefinition('thirty_day_streak', '30 Day Streak', 'Keep a month-long streak alive.', 'crown', 30, 'streak'),
    BadgeDefinition('hundred_kg_saved', '100 kg Saved', 'Reduce or avoid 100 kg of CO2e.', 'seedling', 100, 'saved'),
    BadgeDefinition('vegetarian_week', 'Vegetarian Week', 'Choose vegetarian meals for a full week.', 'carrot', 7, 'vegetarian_days'),
    BadgeDefinition('public_transport_hero', 'Public Transport Hero', 'Use transit for ten logged trips.', 'bus', 10, 'public_transport_days'),
    BadgeDefinition('eco_warrior', 'Eco Warrior', 'Hit all major sustainability milestones.', 'star', 1, 'combined'),
]


def evaluate_badges(logs: list[dict[str, Any]], suggestions: list[dict[str, Any]] | None = None) -> list[dict[str, Any]]:
    current_streak, longest_streak = calculate_streaks(logs)
    total_logs = len(logs)
    total_saved = sum(max(0, 7 - float(log.get('totalEmission', 0))) for log in logs)
    vegetarian_days = sum(1 for log in logs if log.get('food', {}).get('diet') in {'vegetarian', 'vegan'})
    public_transport_days = sum(1 for log in logs if log.get('travel', {}).get('mode') in {'bus', 'metro', 'train'})

    results = []
    for badge in BADGES:
        progress = 0.0
        unlocked = False
        if badge.metric == 'logs':
            progress = min(1.0, total_logs / badge.target)
            unlocked = total_logs >= badge.target
        elif badge.metric == 'streak':
            value = current_streak if badge.badge_id == 'seven_day_streak' else longest_streak
            progress = min(1.0, value / badge.target)
            unlocked = value >= badge.target
        elif badge.metric == 'saved':
            progress = min(1.0, total_saved / badge.target)
            unlocked = total_saved >= badge.target
        elif badge.metric == 'vegetarian_days':
            progress = min(1.0, vegetarian_days / badge.target)
            unlocked = vegetarian_days >= badge.target
        elif badge.metric == 'public_transport_days':
            progress = min(1.0, public_transport_days / badge.target)
            unlocked = public_transport_days >= badge.target
        elif badge.metric == 'combined':
            combined = 1 if total_logs >= 5 and current_streak >= 3 and total_saved >= 10 else 0
            progress = float(combined)
            unlocked = bool(combined)
        results.append({
            **asdict(badge),
            'progress': round(progress, 3),
            'unlocked': unlocked,
        })
    return results
