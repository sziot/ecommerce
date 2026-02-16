docker-compose up -d
cd backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000
cd ../frontend/dist/standalone
node server.js

