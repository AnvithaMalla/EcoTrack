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


import json

config = Config()

if not firebase_admin._apps:
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": config.firebase_project_id,
        "private_key": config.firebase_private_key,
        "client_email": config.firebase_client_email,
        "token_uri": "https://oauth2.googleapis.com/token"
    })

    firebase_admin.initialize_app(
        cred,
        {
            "databaseURL": config.firebase_database_url
        }
    )
app = create_app()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Config().port, debug=Config().secret_key == 'dev-secret-key')
