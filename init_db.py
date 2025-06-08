from app import app, db
from models import Teacher

with app.app_context():
    db.create_all()
    db.session.add(Teacher(username='admin', password='admin'))
    db.session.commit()
    print("Database initialized and admin user created.")
