from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from extensions import db  # ← from extensions, not app
from models import Teacher, Student

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///portal.db'
db.init_app(app)


@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    teacher = Teacher.query.filter_by(username=username).first()
    
    if teacher and teacher.verify_password(password):
        session['teacher_id'] = teacher.id
        return redirect('/home')
    else:
        flash('Invalid username or password')
        return redirect('/')

@app.route('/home')
def home():
    if 'teacher_id' not in session:
        return redirect('/')
    students = Student.query.all()
    return render_template('home.html', students=students)

@app.route('/logout')
def logout():
    session.pop('teacher_id', None)
    return redirect(url_for('index'))



# @app.route('/add_student', methods=['POST'])
# def add_student():
#     if 'teacher_id' not in session:
#         return jsonify({"status": "error", "message": "Unauthorized"}), 401

#     data = request.get_json()
    
#     existing_student = Student.query.filter_by(
#         name=data['name'],
#         subject=data['subject']
#     ).first()

#     try:
#         if existing_student:
#             existing_student.marks += int(data['marks'])
#             db.session.commit()
#             return jsonify({
#                 "status": "updated",
#                 "new_marks": existing_student.marks
#             })
#         else:
#             new_student = Student(
#                 name=data['name'],
#                 subject=data['subject'],
#                 marks=data['marks']
#             )
#             db.session.add(new_student)
#             db.session.commit()
#             return jsonify({"status": "created"})
            
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"status": "error", "message": str(e)}), 400
@app.route('/add_student', methods=['POST'])
def add_student():
    if 'teacher_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401

    data = request.get_json()
    name = data['name'].strip()
    subject = data['subject'].strip()
    marks = int(data['marks'])  # ✅ Ensure it's an integer

    existing_student = Student.query.filter_by(name=name, subject=subject).first()

    try:
        if existing_student:
            existing_student.marks += marks  # ✅ Add marks to existing
            db.session.commit()
            return jsonify({
                "status": "updated",
                "message": f"Marks updated to {existing_student.marks}"
            })
        else:
            new_student = Student(name=name, subject=subject, marks=marks)
            db.session.add(new_student)
            db.session.commit()
            return jsonify({"status": "created", "message": "Student added"})
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400


@app.route('/update_student/<int:id>', methods=['POST'])
def update_student(id):
    data = request.get_json()
    student = Student.query.get(id)
    if not student:
        return jsonify({"status": "error", "message": "Student not found"})

    student.name = data['name']
    student.subject = data['subject']
    student.marks = data['marks']
    db.session.commit()
    return jsonify({"status": "updated"})


@app.route('/delete_student/<int:id>', methods=['POST'])
def delete_student(id):
    student = Student.query.get(id)
    if not student:
        return jsonify({"status": "error", "message": "Student not found"})

    db.session.delete(student)
    db.session.commit()
    return jsonify({"status": "deleted"})


if __name__ == '__main__':
    with app.app_context():  # to access db inside app context
        db.create_all()
    app.run(debug=True)
