python -c "import time; time.sleep(3)"
bash -c 'daphne -b 0.0.0.0 -p 8001 project.asgi:application'
python manage.py runworker --only-channels=http.* --only-channels=websocket.* -v2