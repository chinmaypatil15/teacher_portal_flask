# Teacher Portal - Local Development Guide

## Prerequisites
- Python 3.6+
- pip package manager

## Setup Instructions

1. **Clone the repository** (if applicable)
```bash
git clone [your-repository-url]
cd teacher_port
```

2. **Create virtual environment**
```bash
python -m venv venv
```

3. **Activate virtual environment**
- Windows:
```cmd
.\venv\Scripts\activate
```
- macOS/Linux:
```bash
source venv/bin/activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Initialize database**
```bash
python init_db.py
```

6. **Run the application**
```bash
python app.py
```

## Access the Application
- Visit: http://localhost:5000
- Default admin credentials:
  - Username: admin
  - Password: admin

## Key Features
- Login authentication
- Student record management
- Marks updating system
- Responsive web interface

## Project Structure
```
teacher_port/
├── app.py             # Main application entry point
├── models.py          # Database models
├── init_db.py         # Database initialization
├── requirements.txt   # Dependencies
├── static/            # Static assets
│   ├── style.css
│   └── script.js
└── templates/         # HTML templates
    ├── home.html
    └── login.html
```

## Troubleshooting
- If you get import errors: Reinstall requirements
```bash
pip install -r requirements.txt
```
- If database issues occur: Delete instance/portal.db and rerun init_db.py
