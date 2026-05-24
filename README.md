# ESG Backend API Platform

A Django REST Framework based ESG (Environmental, Social, Governance) backend platform for ingesting, normalizing, reviewing, and auditing sustainability data.

---

# Features

## ESG Data Ingestion
- Upload SAP CSV files
- Store raw uploaded records
- Track upload batches
- Track data sources

## Data Normalization
- Normalize ESG activity data
- Standardize units
- Categorize emission scopes
- Flag suspicious records automatically

## Review Workflow
- Approve records
- Reject records
- Lock records
- Review status tracking

## Audit Logging
- Complete audit trail
- Track old and new values
- Action history logging

## Dashboard Analytics
- Total records count
- Approved records count
- Rejected records count
- Locked records count
- Pending records count
- Suspicious records count

## API Documentation
- Swagger UI integration

---

# Tech Stack

- Python
- Django
- Django REST Framework
- drf-yasg (Swagger)
- SQLite
- Postman

---

# Project Structure

```text
backend/
├── audit/
├── companies/
├── dashboard/
├── ingestion/
├── normalization/
├── config/
├── manage.py
├── requirements.txt
└── db.sqlite3
```

---

# Installed Apps

- audit
- companies
- dashboard
- ingestion
- normalization
- rest_framework
- drf_yasg

---

# API Endpoints

## Upload APIs

### Upload SAP CSV

```http
POST /api/upload/sap/
```

Form Data:
- file → CSV file

---

## Records APIs

### Get All Records

```http
GET /api/records/
```

### Filter Suspicious Records

```http
GET /api/records/?suspicious=true
```

### Approve Record

```http
POST /api/records/{record_id}/approve/
```

### Reject Record

```http
POST /api/records/{record_id}/reject/
```

### Lock Record

```http
POST /api/records/{record_id}/lock/
```

---

## Dashboard APIs

### Dashboard Statistics

```http
GET /api/dashboard/stats/
```

Example Response:

```json
{
  "total_records": 3,
  "approved_records": 1,
  "rejected_records": 1,
  "locked_records": 1,
  "pending_records": 0,
  "suspicious_records": 1
}
```

---

# Swagger Documentation

Swagger UI:

```text
http://127.0.0.1:8000/swagger/
```

---

# Admin Panel

Django Admin:

```text
http://127.0.0.1:8000/admin/
```

---

# Setup Instructions

## Clone Repository

```bash
git clone <your-repository-url>
cd backend
```

---

## Create Virtual Environment

```bash
python -m venv venv
```

Activate environment:

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Create Superuser

```bash
python manage.py createsuperuser
```

---

## Run Server

```bash
python manage.py runserver
```

---

# Sample Workflow

1. Upload SAP CSV
2. Raw records stored
3. Records normalized
4. Suspicious records flagged
5. Review records
6. Approve / Reject / Lock
7. Audit logs created
8. Dashboard analytics updated

---

# Sample CSV Format

```csv
activity_type,quantity,unit,date
Diesel,15000,L,2026-01-20
Petrol,850,L,2026-01-18
Diesel,1200,L,2026-01-15
```

---

# Current Status

## Completed
- CSV ingestion
- Normalization
- Suspicious detection
- Review workflow
- Audit logging
- Dashboard analytics
- Swagger docs
- Django admin integration

## Upcoming Features
- JWT Authentication
- React Dashboard
- ESG Emission Calculations
- Role-based Access
- Export APIs

---

# Author

Developed as part of ESG Backend Assignment Project using Django REST Framework.
