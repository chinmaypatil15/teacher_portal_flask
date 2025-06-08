# models.py
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db

class Teacher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    _password = db.Column('password', db.String(128))

    @property
    def password(self):
        raise AttributeError('password is not readable')

    @password.setter
    def password(self, password):
        self._password = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self._password, password)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    subject = db.Column(db.String(100))
    marks = db.Column(db.Integer)
    
    __table_args__ = (
        db.UniqueConstraint('name', 'subject', name='uq_student_name_subject'),
    )

    def update_marks(self, new_marks):
        self.marks += int(new_marks)
        return self.marks
