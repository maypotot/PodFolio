pip install django
pip install psycopg2-binary
pip install dj-database-url

python src\podfolio_db_backend\manage.py makemigrations
python src\podfolio_db_backend\manage.py migrate