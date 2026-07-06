from backend.routes.badges import badges_bp
from backend.routes.dashboard import dashboard_bp
from backend.routes.history import history_bp
from backend.routes.logs import logs_bp
from backend.routes.profile import profile_bp
from backend.routes.reports import reports_bp
from backend.routes.suggestions import suggestions_bp


BLUEPRINTS = [
    logs_bp,
    dashboard_bp,
    history_bp,
    suggestions_bp,
    badges_bp,
    reports_bp,
    profile_bp,
]
