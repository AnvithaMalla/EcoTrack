from __future__ import annotations

from datetime import datetime
from typing import Any


ALLOWED_TRAVEL_MODES = {
    'car_petrol',
    'car_diesel',
    'ev',
    'motorcycle',
    'bus',
    'metro',
    'train',
    'flight',
    'walking',
    'cycling'
}

ALLOWED_DIETS = {'meat_heavy', 'omnivore', 'vegetarian', 'vegan'}
ALLOWED_ENERGY_TYPES = {'electricity', 'natural_gas', 'lpg', 'solar'}
ALLOWED_THEMES = {'system', 'light', 'dark'}
ALLOWED_UNITS = {'metric', 'imperial'}


def parse_date(date_value: str) -> datetime:
    try:
        return datetime.fromisoformat(date_value.replace('Z', '+00:00'))
    except ValueError as exc:
        raise ValueError('Invalid date format') from exc


def positive_number(value: Any, field_name: str) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f'{field_name} must be a number') from exc
    if number < 0:
        raise ValueError(f'{field_name} must be non-negative')
    return number


def ensure_allowed(value: str, allowed: set[str], field_name: str) -> str:
    if value not in allowed:
        raise ValueError(f'Invalid {field_name}')
    return value
