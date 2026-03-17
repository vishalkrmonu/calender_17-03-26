from pathlib import Path
import os
import dj_database_url
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-$wzg#m%9g)moj%dc$%+idpggrt8u!mk(fc^=f1^r)$ga6v5db7'

DEBUG = True

ALLOWED_HOSTS = ["*"]   # IMPORTANT for development / deployment

# ✅ INSTALLED APPS
INSTALLED_APPS = [
    'corsheaders',   # ✅ ADD THIS
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'app'
]

# ✅ MIDDLEWARE
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',   # ✅ MUST BE FIRST
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.gzip.GZipMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ✅ DATABASE (keep as is, but better add HOST & PORT)
DATABASES = {
    'default': dj_database_url.parse(os.environ.get("DATABASE_URL"))
}

# ✅ PASSWORD VALIDATION
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ✅ INTERNATIONAL
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ✅ STATIC
STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ============================================
# 🔥🔥 MOST IMPORTANT (CORS FIX)
# ============================================

CORS_ALLOW_ALL_ORIGINS = True

# OR (production best practice)
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "https://your-frontend-domain.com"
# ]

# If using cookies / auth
CORS_ALLOW_CREDENTIALS = True

# Allow all headers
from corsheaders.defaults import default_headers

CORS_ALLOW_HEADERS = list(default_headers) + [
    'content-type',
]

# ============================================
# 🔥 OPTIONAL (CSRF FIX for React)
# ============================================

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
]
