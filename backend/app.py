from __future__ import annotations
import firebase_admin
from firebase_admin import credentials

import os
import sys

if __package__ is None or __package__ == '':
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS

from backend.config import Config
from backend.routes import BLUEPRINTS
from backend.utils.rate_limit import rate_limit


def create_app(test_config: dict | None = None) -> Flask:
    config = Config()
    app = Flask(__name__)
    app.config['SECRET_KEY'] = config.secret_key
    app.config['JSON_SORT_KEYS'] = False
    if test_config:
        app.config.update(test_config)

    CORS(app, origins=[config.frontend_origin], supports_credentials=True)

    @app.get('/api/health')
    @rate_limit
    def health():
        return jsonify({'status': 'ok', 'name': 'EcoTrack API'})

    for blueprint in BLUEPRINTS:
        app.register_blueprint(blueprint)

    @app.errorhandler(ValueError)
    def handle_value_error(error):
        return jsonify({'error': str(error)}), 400

    @app.errorhandler(PermissionError)
    def handle_permission_error(error):
        return jsonify({'error': str(error)}), 401

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        app.logger.exception('Unhandled error: %s', error)
        return jsonify({'error': 'Internal server error'}), 500

    return app


if not firebase_admin._apps:
    service_account_path = os.path.join(
        os.path.dirname(__file__),
        "firebase",
        "serviceAccountKey.json"
    )

    cred = credentials.Certificate(service_account_path)
    firebase_admin.initialize_app(cred)
app = create_app()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Config().port, debug=Config().secret_key == 'dev-secret-key')
