from __future__ import annotations

from flask import Blueprint, Response, jsonify, request

from backend.services.history import get_history_payload
from backend.services.report import build_pdf_report
from backend.services.storage import get_store
from backend.utils.auth import get_or_create_profile, resolve_current_user, require_auth
from backend.utils.stats import summarize_logs


reports_bp = Blueprint('reports', __name__, url_prefix='/api')


@reports_bp.post('/report')
@require_auth
def report():
    payload = request.get_json(silent=True) or {}
    user = resolve_current_user()
    profile = get_or_create_profile(user)
    store = get_store()
    logs = store.list_docs('daily_logs', lambda item: item.get('user_id') == user['uid'])
    history_payload = get_history_payload(user['uid'])
    report_payload = {
        'travel': payload.get('travel') or history_payload['stats']['totals']['travel'],
        'food': payload.get('food') or history_payload['stats']['totals']['food'],
        'energy': payload.get('energy') or history_payload['stats']['totals']['energy'],
        'totalEmission': payload.get('totalEmission') or history_payload['stats']['totalEmission'],
        'budget': profile.get('daily_budget', 7),
        'budgetRemaining': history_payload['stats']['budgetRemaining'],
        'stats': history_payload['stats'],
        'history': history_payload['history'],
        'suggestions': store.get_doc('suggestions', user['uid'])['items'] if store.get_doc('suggestions', user['uid']) else [],
    }
    pdf_bytes = build_pdf_report(report_payload)
    return Response(pdf_bytes, mimetype='application/pdf', headers={'Content-Disposition': 'attachment; filename=ecotrack-report.pdf'})
