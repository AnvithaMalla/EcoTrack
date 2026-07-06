import os

os.environ['DEV_ALLOW_ANONYMOUS'] = '1'
os.environ['RATE_LIMIT_PER_MINUTE'] = '100'

from backend.app import create_app
from backend.services.storage import reset_store_for_tests


def setup_function():
    reset_store_for_tests()


def test_log_and_dashboard_flow():
    app = create_app({'TESTING': True})
    client = app.test_client()

    log_response = client.post('/api/log', json={
        'travel': {'mode': 'bus', 'distance': 12, 'passengers': 1},
        'food': {'diet': 'vegetarian', 'waste': False},
        'energy': {'type': 'electricity', 'units': 8},
    })
    assert log_response.status_code == 200
    body = log_response.get_json()
    assert body['calculation']['totalEmission'] > 0

    dashboard_response = client.get('/api/dashboard')
    assert dashboard_response.status_code == 200
    dashboard = dashboard_response.get_json()
    assert dashboard['stats']['totalEmission'] > 0
    assert dashboard['stats']['currentStreak'] >= 0


def test_history_and_profile_flow():
    app = create_app({'TESTING': True})
    client = app.test_client()

    profile_response = client.get('/api/profile')
    assert profile_response.status_code == 200

    update_response = client.put('/api/profile', json={
        'name': 'Test User',
        'daily_budget': 6.5,
        'preferred_units': 'metric',
        'theme': 'dark',
    })
    assert update_response.status_code == 200
    assert update_response.get_json()['name'] == 'Test User'

    history_response = client.get('/api/history')
    assert history_response.status_code == 200
