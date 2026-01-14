ROLE

You are a Senior Full-Stack Architect (10+ years experience).
Design and build a production-ready Resource & Booking Management System with complete frontend and backend flow.

This is NOT a demo.
This is real business software.

🧱 TECH STACK (FIXED – DO NOT CHANGE)
Frontend

React (Vite or CRA)

Axios for API calls

React Router

Calendar UI (FullCalendar or similar)

Tailwind CSS or Material UI

JWT stored securely (HTTP-only or memory-based)

Backend

Node.js

Express.js

Prisma ORM

MySQL

JWT Authentication

RBAC (ADMIN / USER)

👥 USER ROLES & ACCESS
1️⃣ Guest (No Login)

View resources

View availability calendar

No booking actions

2️⃣ User (Logged In)

Login

View & create bookings

Cancel own bookings

View notifications

View calendar availability

3️⃣ Admin

All user permissions

User management

Resource management

Calendar blocking

Analytics dashboard

Audit logs

📂 FRONTEND MENU STRUCTURE
Guest

Home

Resources

Availability Calendar

Login

User Dashboard

Dashboard

My Bookings

Calendar

Notifications

Profile

Logout

Admin Dashboard

Dashboard (KPIs + Charts)

Resources

Calendar (Block Slots)

Users

Analytics

Audit Logs

Notifications

Settings

Logout

🔐 AUTHENTICATION FLOW

User submits email + password

Backend validates credentials (bcrypt)

JWT issued { sub: userId, role }

Frontend stores token securely

Axios attaches token to every request

RBAC middleware protects routes

🔄 FRONTEND → BACKEND FLOW
Axios Setup

Base URL /api

Interceptors add JWT

Handle 401/403 globally

🧾 DATABASE MODELS (HIGH LEVEL)

User (role, isActive)

Resource (status, price)

Booking (time-based, no overlap)

ResourceBlock (admin/maintenance blocks)

Notification (in-app)

MessageLog (email/SMS)

AuditLog (security & analytics)

ApiKey / Webhook (external)

🗓️ BOOKING FLOW (CRITICAL)
Frontend

User selects resource

User selects time via calendar

UI disables blocked/booked slots

User confirms booking

Backend

Validate time range

Check resource status

Check ResourceBlock overlaps

Check Booking overlaps

Calculate price

Save booking (transaction)

Create notification

Create audit log

❌ No double booking allowed

🧱 RESOURCE MANAGEMENT FLOW
Admin

Create / edit / delete resources

Set price, capacity, status

All actions audited

Guest/User

Read-only access

🚫 CALENDAR BLOCKING FLOW (ADMIN)

Admin selects date/time

Creates ResourceBlock

Blocked slots appear disabled in UI

Booking prevented server-side

🔔 NOTIFICATION FLOW

Triggered on booking create/cancel

Stored in Notification table

Visible in dashboard

Optional email/SMS logged

📊 ADMIN ANALYTICS FLOW

Dashboard shows:

Total users

Active bookings

Total revenue

Growth %

Monthly booking chart

Revenue chart

Recent audit logs

Backend uses Prisma count, sum, aggregate

🛡️ SECURITY RULES

JWT required for protected routes

Admin-only routes strictly enforced

All critical actions logged

No direct DB exposure

Enum-safe queries only

🧩 BACKEND ROUTE STRUCTURE

/api/auth

/api/resources

/api/bookings

/api/notifications

/api/admin

/api/admin/users

/api/health

📁 BACKEND FOLDER STRUCTURE
src/
 ├─ controllers/
 ├─ services/
 ├─ routes/
 ├─ middleware/
 ├─ prisma/
 ├─ utils/
 └─ app.js

🧠 ARCHITECTURE PRINCIPLES

Modular design

No duplicated logic

Scalable

Production-ready

Clean separation of concerns

🛑 FINAL RULES

Do NOT simplify by removing features

Do NOT allow double booking

Do NOT mix roles

Do NOT skip audit logs

Build like real SaaS software

✅ EXPECTED RESULT

A fully functional, secure, scalable web application with:

React frontend

Node + Express backend

Prisma + MySQL database

Clean UI flow

Complete business logic

END OF PROMPT

If you want, I can also:

Convert this into Claude-optimized format

Create flow diagrams

Generate React component map

Generate API contract docs

