from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


@dataclass(slots=True)
class Profile:
    user_id: str
    name: str = 'EcoTrack User'
    photo_url: str = ''
    daily_budget: float = 7.0
    preferred_units: str = 'metric'
    theme: str = 'system'
    created_at: str = field(default_factory=lambda: utc_now().isoformat())
    updated_at: str = field(default_factory=lambda: utc_now().isoformat())


@dataclass(slots=True)
class LogEntry:
    user_id: str
    date: str
    travel: dict[str, Any]
    food: dict[str, Any]
    energy: dict[str, Any]
    total_emission: float
    budget_remaining: float
    timestamp: str = field(default_factory=lambda: utc_now().isoformat())


@dataclass(slots=True)
class Suggestion:
    title: str
    description: str
    estimated_savings: float
    difficulty: str
    category: str


@dataclass(slots=True)
class BadgeDefinition:
    badge_id: str
    name: str
    description: str
    icon: str
    target: float
    metric: str
