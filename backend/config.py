from dataclasses import dataclass
import os

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Config:
    secret_key: str = os.getenv('SECRET_KEY', 'dev-secret-key')
    frontend_origin: str = os.getenv('FRONTEND_ORIGIN', 'https://ecotrack-frontend-7uil.onrender.com')
    port: int = int(os.getenv('PORT', '5000'))
    carbon_interface_api_key: str = os.getenv('CARBON_INTERFACE_API_KEY', '')
    carbon_interface_base_url: str = os.getenv('CARBON_INTERFACE_BASE_URL', 'https://www.carboninterface.com/api/v1')
    groq_api_key: str = os.getenv('GROQ_API_KEY', '')
    groq_model: str = os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile')
    firebase_project_id: str = os.getenv('FIREBASE_PROJECT_ID', '')
    firebase_client_email: str = os.getenv('FIREBASE_CLIENT_EMAIL', '')
    firebase_private_key: str = os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n')
    firebase_database_url: str = os.getenv('FIREBASE_DATABASE_URL', '')
    rate_limit_per_minute: int = int(os.getenv('RATE_LIMIT_PER_MINUTE', '60'))
    dev_allow_anonymous: bool = os.getenv('DEV_ALLOW_ANONYMOUS', '0') == '1'
