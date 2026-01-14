// =======================
// PRISMA SETUP
// =======================
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// =======================
// ENUMS
// =======================
enum Role {
  ADMIN
  USER
}

enum ResourceStatus {
  AVAILABLE
  BOOKED
  MAINTENANCE
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
}

enum MessageType {
  EMAIL
  SMS
}

enum MessageStatus {
  QUEUED
  SENT
  FAILED
}

// =======================
// USER & AUTH
// =======================
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  firstName String?
  lastName  String?
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  avatarUrl String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  bookings      Booking[]
  notifications Notification[]
  auditLogs     AuditLog[]
  apiKeys       ApiKey[]
  messageLogs   MessageLog[]
}

// =======================
// RESOURCE MANAGEMENT
// =======================
model Resource {
  id           String         @id @default(uuid())
  name         String
  description  String?        @db.Text
  type         String
  capacity     Int
  pricePerHour Decimal        @db.Decimal(10, 2)
  status       ResourceStatus @default(AVAILABLE)
  imageUrl     String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  bookings Booking[]
  blocks   ResourceBlock[]
}

// =======================
// CALENDAR & BOOKINGS
// =======================
model Booking {
  id         String        @id @default(uuid())
  startTime  DateTime
  endTime    DateTime
  totalPrice Decimal       @db.Decimal(10, 2)
  status     BookingStatus @default(CONFIRMED)

  userId     String
  resourceId String

  user     User     @relation(fields: [userId], references: [id])
  resource Resource @relation(fields: [resourceId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([resourceId])
  @@index([startTime, endTime])
}

// Explicit blocking for drag/drop & maintenance
model ResourceBlock {
  id         String   @id @default(uuid())
  resourceId String
  startTime  DateTime
  endTime    DateTime
  reason     String?  // Maintenance / Admin block

  resource Resource @relation(fields: [resourceId], references: [id])

  createdAt DateTime @default(now())

  @@index([resourceId])
  @@index([startTime, endTime])
}

// =======================
// NOTIFICATIONS
// =======================
model Notification {
  id      String  @id @default(uuid())
  title   String
  message String  @db.Text
  isRead  Boolean @default(false)

  userId String
  user   User @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())

  @@index([userId])
}

// =======================
// EMAIL & SMS LOGGING
// =======================
model MessageLog {
  id       String        @id @default(uuid())
  type     MessageType
  to       String
  content  String        @db.Text
  status   MessageStatus
  provider String?

  userId String?
  user   User? @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())

  @@index([type])
  @@index([status])
}

// =======================
// AUDIT & ANALYTICS
// =======================
model AuditLog {
  id        String   @id @default(uuid())
  action    String
  entity    String
  entityId  String
  ipAddress String?
  details   Json?

  userId String
  user   User @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())

  @@index([entity])
  @@index([createdAt])
}

// =======================
// API & INTEGRATIONS
// =======================
model ApiKey {
  id        String   @id @default(uuid())
  key       String   @unique
  name      String
  expiresAt DateTime?
  isActive  Boolean  @default(true)

  userId String
  user   User @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())
}

model Webhook {
  id        String   @id @default(uuid())
  url       String
  events    String
  secret    String
  isActive  Boolean  @default(true)

  createdAt DateTime @default(now())
}