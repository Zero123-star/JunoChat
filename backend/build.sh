#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt
pip install gunicorn whitenoise

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate
