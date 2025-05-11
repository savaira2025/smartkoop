# SmartKoop System

A comprehensive cooperative management system with modules for member management, accounting, sales, purchases, and more.

## Features

- **Member Onboarding Experience**: Create new members, record savings, report unpaid mandatory savings, calculate SHU per member, disburse SHU to members, and mobile member registration process.
- **Customer Management**: Create & modify customer data (entity name, payment terms, etc.).
- **Sales Management**: Create, edit, approve sales orders, create tax invoices, monitor & receive payments.
- **Supplier/Partner Management**: Create & modify supplier data (entity name, payment terms, etc.).
- **Purchase Management**: Create, modify, approve purchase orders, input supplier invoices, monitor and process payments.
- **Asset Management**: Create, modify, approve assets.
- **General Accounting**: Inputting data into journals, general ledger, trial balance, and generating balance sheet, profit & loss, and tax reports.
- **Payroll Processing**: Manage employee payroll.
- **Document Management**: Upload, store, and manage documents.

## Technology Stack

- **Backend**: Python with FastAPI
- **Frontend**: React with Material UI
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT-based auth system

## Project Structure

```
smartkoop/
├── backend/               # FastAPI backend
│   ├── app/               # Application code
│   │   ├── api/           # API endpoints
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   ├── db/            # Database configuration
│   │   ├── config.py      # Application configuration
│   │   └── main.py        # FastAPI application
│   ├── tests/             # Tests
│   ├── requirements.txt   # Python dependencies
│   └── run.py             # Run script
└── frontend/              # React frontend
    ├── public/            # Static files
    ├── src/               # Source code
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   ├── utils/         # Utility functions
    │   ├── assets/        # Assets (images, etc.)
    │   ├── hooks/         # Custom hooks
    │   ├── context/       # Context providers
    │   ├── App.js         # Main App component
    │   ├── index.js       # Entry point
    │   └── theme.js       # Material UI theme
    └── package.json       # NPM dependencies
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Running the Application

The easiest way to run the application is to use the provided run script:

```bash
# Run both backend and frontend
./run.sh

# Run only the backend
./run.sh backend

# Run only the frontend
./run.sh frontend
```

### Manual Setup

#### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python3 -m venv venv
   ```

3. Activate the virtual environment:
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```
   - On Windows:
     ```
     venv\Scripts\activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Initialize the database:
   ```
   python init_data.py
   ```

6. Run the application:
   ```
   python run.py
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Default Credentials

The application is initialized with the following default credentials:

- **Username**: admin
- **Password**: admin123

## License

This project is licensed under the MIT License - see the LICENSE file for details.
