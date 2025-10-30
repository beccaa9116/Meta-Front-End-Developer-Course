# Little Lemon – Django Menu Site

## Run
```
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Go to /admin to add MenuItem entries, then /menu to view them.
