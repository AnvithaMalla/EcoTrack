from __future__ import annotations

import json
from typing import Any

import requests

from backend.config import Config
from backend.models.schemas import Suggestion


SUGGESTION_CATEGORIES = ['travel', 'food', 'energy']


def build_local_suggestions(breakdown: dict[str, Any]) -> list[dict[str, Any]]:
    suggestions: list[dict[str, Any]] = []
    travel = float(breakdown.get('travel', 0))
    food = float(breakdown.get('food', 0))
    energy = float(breakdown.get('energy', 0))

    ranked = sorted(
        [('travel', travel), ('food', food), ('energy', energy)],
        key=lambda item: item[1],
        reverse=True,
    )

    for category, emission in ranked[:3]:
        if category == 'travel':
            suggestions.append(_travel_tip(emission))
        elif category == 'food':
            suggestions.append(_food_tip(emission))
        else:
            suggestions.append(_energy_tip(emission))

    return suggestions


def generate_suggestions(breakdown: dict[str, Any]) -> list[dict[str, Any]]:
    config = Config()
    if config.groq_api_key:
        groq_suggestions = _groq_suggestions(breakdown)
        if groq_suggestions:
            return groq_suggestions
    return build_local_suggestions(breakdown)


def _groq_suggestions(breakdown: dict[str, Any]) -> list[dict[str, Any]] | None:
    config = Config()
    prompt = {
        'role': 'system',
        'content': (
            'You are an expert sustainability coach. Return exactly three JSON objects in an array. '
            'Each object must contain title, description, estimated_savings, difficulty, and category. '
            'Keep advice practical, personalized, and specific to carbon reduction.'
        )
    }
    user_message = {
        'role': 'user',
        'content': json.dumps(
            {
                'model': config.groq_model,
                'breakdown': breakdown,
                'instruction': 'Create three actionable eco-friendly suggestions.'
            }
        )
    }
    try:
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={'Authorization': f'Bearer {config.groq_api_key}', 'Content-Type': 'application/json'},
            json={
                'model': config.groq_model,
                'messages': [prompt, user_message],
                'temperature': 0.4,
                'response_format': {'type': 'json_object'}
            },
            timeout=20,
        )
        response.raise_for_status()
        content = response.json()['choices'][0]['message']['content']
        payload = json.loads(content)
        items = payload.get('suggestions') if isinstance(payload, dict) else payload
        if not isinstance(items, list):
            return None
        normalized = []
        for item in items[:3]:
            normalized.append(_normalize_suggestion(item))
        return normalized
    except Exception:
        return None


def _normalize_suggestion(item: dict[str, Any]) -> dict[str, Any]:
    suggestion = Suggestion(
        title=str(item.get('title', 'Reduce footprint')),
        description=str(item.get('description', 'Make a small daily improvement.')),
        estimated_savings=float(item.get('estimated_savings', 0.5)),
        difficulty=str(item.get('difficulty', 'Easy')),
        category=str(item.get('category', 'general')),
    )
    return {
        'title': suggestion.title,
        'description': suggestion.description,
        'estimated_savings': round(suggestion.estimated_savings, 2),
        'difficulty': suggestion.difficulty,
        'category': suggestion.category,
    }


def _travel_tip(emission: float) -> dict[str, Any]:
    return {
        'title': 'Shift one commute',
        'description': 'Replace one solo car trip this week with public transport, cycling, or a carpool to cut daily transport emissions.',
        'estimated_savings': round(max(0.3, emission * 0.18), 2),
        'difficulty': 'Easy',
        'category': 'travel'
    }


def _food_tip(emission: float) -> dict[str, Any]:
    return {
        'title': 'Lower-carbon meal swap',
        'description': 'Choose one plant-forward meal per day and reduce food waste by planning portions more accurately.',
        'estimated_savings': round(max(0.25, emission * 0.12), 2),
        'difficulty': 'Medium',
        'category': 'food'
    }


def _energy_tip(emission: float) -> dict[str, Any]:
    return {
        'title': 'Trim energy demand',
        'description': 'Lower heating or cooling by one degree, and switch off standby loads to reduce household energy emissions.',
        'estimated_savings': round(max(0.2, emission * 0.14), 2),
        'difficulty': 'Easy',
        'category': 'energy'
    }
