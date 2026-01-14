# BookingPMS - Resource & Booking Management System

A production-ready, full-stack web application for managing resource bookings with complete admin controls, analytics, and user management.

## Tech Stack

### Backend
- Node.js + Express.js
- Prisma ORM
- MySQL Database
- JWT Authentication
- RBAC (Role-Based Access Control)

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- FullCalendar
- Chart.js
- Axios

## Features

### Guest (No Login)
- View resources
- View availability calendar
- Browse resource catalog

### User (Logged In)
- Create bookings
- View and cancel own bookings
- View notifications
- Manage profile

### Admin
- Complete user management
- Resource management (CRUD)
- Calendar blocking for maintenance
- Analytics dashboard with charts
- Audit logs for all activities
- System settings

## Project Structure

```
bookingpms/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Configuration
│   │   └── app.js           # Express app entry
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context (auth)
│   │   ├── services/        # API service modules
│   │   └── App.jsx          # Main app with routing
│   └── package.json
│
└── docs/                    # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### 1. Database Setup

Create a MySQL database:
```sql
CREATE DATABASE bookingpms;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="mysql://user:password@localhost:3306/bookingpms"
# JWT_SECRET="your-secret-key"

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:push

# Seed the database with sample data
npm run seed

# Start the server
npm run dev
```

The backend will run on http://localhost:5000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on http://localhost:5173

## Default Credentials

After running the seed command:

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@bookingpms.com   | Admin@123 |
| User  | user@bookingpms.com    | User@123  |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user
- `POST /api/auth/logout` - Logout

### Resources
- `GET /api/resources` - List all resources
- `GET /api/resources/:id` - Get resource details
- `POST /api/resources` - Create resource (admin)
- `PUT /api/resources/:id` - Update resource (admin)
- `DELETE /api/resources/:id` - Delete resource (admin)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/calendar` - Get calendar events

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id` - Update user
- `GET /api/admin/bookings` - All bookings
- `POST /api/admin/blocks` - Create calendar block
- `GET /api/admin/audit-logs` - Audit logs
- `GET /api/admin/analytics/*` - Analytics endpoints

## Key Features Implementation

### Double Booking Prevention
The booking service uses database transactions and overlap checks to prevent double bookings:
1. Check for block overlaps
2. Check for booking overlaps
3. Transaction-level locking for race conditions

### Audit Logging
All critical actions are logged with:
- User information
- IP address
- Action type
- Entity details
- Timestamp

### RBAC Implementation
- JWT tokens contain role information
- Middleware validates role on protected routes
- Frontend routes protected by role guards

## Environment Variables

### Backend (.env)
```
DATABASE_URL=mysql://user:password@localhost:3306/bookingpms
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Set up SSL/TLS
5. Use connection pooling for database

### Frontend
```bash
npm run build
```
Deploy the `dist` folder to your static hosting.

## License

MIT License
