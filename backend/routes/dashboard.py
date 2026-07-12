from __future__ import annotations

from flask import Blueprint, jsonify

from backend.services.dashboard import get_dashboard_payload
from backend.utils.auth import resolve_current_user, require_auth


dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api')


@dashboard_bp.route("/dashboard", methods=["GET", "OPTIONS"])
@require_auth
def dashboard():
    user = resolve_current_user()
    return jsonify(get_dashboard_payload(user['uid']))
