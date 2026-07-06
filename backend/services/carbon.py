from __future__ import annotations

from dataclasses import asdict
from typing import Any

import requests

from backend.config import Config
from backend.utils.validation import ALLOWED_DIETS, ALLOWED_ENERGY_TYPES, ALLOWED_TRAVEL_MODES, ensure_allowed, positive_number

TRAVEL_FACTORS = {
    'car_petrol': 0.192,
    'car_diesel': 0.171,
    'ev': 0.053,
    'motorcycle': 0.103,
    'bus': 0.089,
    'metro': 0.035,
    'train': 0.041,
    'flight': 0.255,
    'walking': 0.0,
    'cycling': 0.0,
}

FOOD_FACTORS = {
    'meat_heavy': 7.2,
    'omnivore': 5.6,
    'vegetarian': 3.8,
    'vegan': 2.9,
}

ENERGY_FACTORS = {
    'electricity': 0.475,
    'natural_gas': 0.184,
    'lpg': 0.236,
    'solar': 0.0,
}


def calculate_travel_emission(travel: dict[str, Any]) -> dict[str, Any]:
    mode = ensure_allowed(travel.get('mode', 'car_petrol'), ALLOWED_TRAVEL_MODES, 'travel mode')
    distance = positive_number(travel.get('distance', 0), 'distance')
    passengers = max(1, int(positive_number(travel.get('passengers', 1), 'passengers') or 1))
    coefficient = TRAVEL_FACTORS[mode]
    total = distance * coefficient
    if mode in {'car_petrol', 'car_diesel', 'ev', 'motorcycle'}:
        total = total / passengers
    api_emission = _carbon_interface_travel(mode, distance, passengers)
    return {
        'mode': mode,
        'distance': distance,
        'passengers': passengers,
        'coefficient': coefficient,
        'emission': round(api_emission if api_emission is not None else total, 3),
        'source': 'carbon_interface' if api_emission is not None else 'fallback'
    }


def calculate_food_emission(food: dict[str, Any]) -> dict[str, Any]:
    diet = ensure_allowed(food.get('diet', 'omnivore'), ALLOWED_DIETS, 'diet')
    waste = bool(food.get('waste', False))
    base = FOOD_FACTORS[diet]
    total = base * (1.1 if waste else 1.0)
    return {
        'diet': diet,
        'waste': waste,
        'coefficient': base,
        'emission': round(total, 3),
        'source': 'fallback'
    }


def calculate_energy_emission(energy: dict[str, Any]) -> dict[str, Any]:
    energy_type = ensure_allowed(energy.get('type', 'electricity'), ALLOWED_ENERGY_TYPES, 'energy type')
    units = positive_number(energy.get('units', 0), 'units')
    coefficient = ENERGY_FACTORS[energy_type]
    total = units * coefficient
    api_emission = _carbon_interface_energy(energy_type, units)
    return {
        'type': energy_type,
        'units': units,
        'coefficient': coefficient,
        'emission': round(api_emission if api_emission is not None else total, 3),
        'source': 'carbon_interface' if api_emission is not None else 'fallback'
    }


def calculate_daily_footprint(payload: dict[str, Any]) -> dict[str, Any]:
    travel = calculate_travel_emission(payload.get('travel', {}))
    food = calculate_food_emission(payload.get('food', {}))
    energy = calculate_energy_emission(payload.get('energy', {}))
    total = round(travel['emission'] + food['emission'] + energy['emission'], 3)
    budget = positive_number(payload.get('budget', 7), 'budget')
    remaining = round(budget - total, 3)
    categories = {'travel': travel['emission'], 'food': food['emission'], 'energy': energy['emission']}
    return {
        'travel': travel,
        'food': food,
        'energy': energy,
        'totalEmission': total,
        'budget': budget,
        'budgetRemaining': remaining,
        'status': 'exceeded' if remaining < 0 else 'within_budget',
        'categories': categories,
    }


def equivalent_metrics(total_emission: float) -> dict[str, float]:
    total = float(total_emission)
    return {
        'treesPlanted': round(total / 21.77, 2),
        'kilometersDriven': round(total / 0.192, 2),
        'smartphoneCharges': round(total / 0.009, 2),
    }


def _carbon_interface_travel(mode: str, distance: float, passengers: int) -> float | None:
    config = Config()
    if not config.carbon_interface_api_key:
        return None
    if mode not in {'car_petrol', 'car_diesel', 'flight', 'train', 'bus', 'metro', 'ev'}:
        return None
    payload = {
        'type': 'vehicle' if mode != 'flight' else 'flight',
        'distance_unit': 'km',
        'distance_value': distance,
        'passengers': passengers,
    }
    if mode == 'car_petrol':
        payload['vehicle_model_id'] = 'petrol'
    elif mode == 'car_diesel':
        payload['vehicle_model_id'] = 'diesel'
    elif mode == 'ev':
        payload['vehicle_model_id'] = 'electric'
    elif mode == 'bus':
        payload['vehicle_model_id'] = 'bus'
    elif mode == 'metro':
        payload['vehicle_model_id'] = 'metro'
    elif mode == 'train':
        payload['vehicle_model_id'] = 'train'
    elif mode == 'flight':
        payload['type'] = 'flight'
    try:
        response = requests.post(
            f"{config.carbon_interface_base_url.rstrip('/')}/estimates",
            json=payload,
            headers={
                'Authorization': f"Bearer {config.carbon_interface_api_key}",
                'Content-Type': 'application/json'
            },
            timeout=8,
        )
        response.raise_for_status()
        data = response.json().get('data', {})
        attributes = data.get('attributes', {})
        return float(attributes.get('carbon_kg', 0)) if attributes else None
    except Exception:
        return None


def _carbon_interface_energy(energy_type: str, units: float) -> float | None:
    config = Config()
    if not config.carbon_interface_api_key:
        return None
    payload = {
        'type': 'electricity' if energy_type == 'electricity' else 'fuel',
        'fuel_source': energy_type,
        'electricity_value': units,
        'electricity_unit': 'kwh'
    }
    try:
        response = requests.post(
            f"{config.carbon_interface_base_url.rstrip('/')}/estimates",
            json=payload,
            headers={
                'Authorization': f"Bearer {config.carbon_interface_api_key}",
                'Content-Type': 'application/json'
            },
            timeout=8,
        )
        response.raise_for_status()
        data = response.json().get('data', {})
        attributes = data.get('attributes', {})
        return float(attributes.get('carbon_kg', 0)) if attributes else None
    except Exception:
        return None
