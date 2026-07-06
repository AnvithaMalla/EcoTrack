from __future__ import annotations

import csv
import io

from flask import Blueprint, jsonify, make_response, request

from backend.services.history import get_history_payload
from backend.utils.auth import resolve_current_user, require_auth


history_bp = Blueprint('history', __name__, url_prefix='/api')


@history_bp.get('/history')
@require_auth
def history():
    user = resolve_current_user()
    payload = get_history_payload(user['uid'], request.args.get('from'), request.args.get('to'))
    if request.args.get('format') == 'csv':
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=['date', 'travel', 'food', 'energy', 'totalEmission', 'budgetRemaining'])
        writer.writeheader()
        for log in payload['logs']:
            writer.writerow({
                'date': log.get('date', ''),
                'travel': log.get('travel', {}).get('emission', 0),
                'food': log.get('food', {}).get('emission', 0),
                'energy': log.get('energy', {}).get('emission', 0),
                'totalEmission': log.get('totalEmission', 0),
                'budgetRemaining': log.get('budgetRemaining', 0),
            })
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = 'attachment; filename=ecotrack-history.csv'
        return response
    return jsonify(payload)
