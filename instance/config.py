import os

SECRET_KEY = os.environ.get("SECRET_KEY", "talentstage-dev-secret")
DEBUG = os.environ.get("FLASK_ENV", "development") == "development"
