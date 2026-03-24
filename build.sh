#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python src/podfolio_db_backend/manage.py makemigrations
python src/podfolio_db_backend/manage.py migrate