# 🚀Full-stack Email Job Scheduler

## Overview

This project is a production-style **email scheduling system**

The system supports:
- Scheduling emails to be sent at a future time
- Enforcing delays and hourly rate limits
- Persisting jobs so server restarts do not cause data loss or duplicate sends
- A frontend dashboard to manage scheduled and sent emails

---

## 🧱 Tech Stack

### Backend
- TypeScript
- Express.js
- BullMQ (Redis-backed job queue)
- PostgreSQL (via Prisma ORM)
- Redis (queues + rate limiting)
- Nodemailer with Ethereal Email (fake SMTP)

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- NextAuth (Google OAuth)

### Infra
- Redis and PostgreSQL can be run locally or via Docker

---

## 📁 Repository Structure

```bash
├── server/ # Express backend + BullMQ worker
├── client/ # Next.js frontend
├── README.md
```


---

## 🖥 Backend Architecture

### High-level flow

1. Client sends an email scheduling request
2. Email metadata is stored in PostgreSQL
3. Each email is scheduled as a BullMQ delayed job
4. Worker processes jobs when their delay expires
5. Rate limits and delays are enforced at send time
6. Email is sent using Ethereal SMTP
7. Email status is updated in the database

---

## 📌 Scheduling (No Cron)

Cron jobs are intentionally not used.

Scheduling is handled using **BullMQ delayed jobs**, which are persisted in Redis.  
This ensures that:
- Jobs survive server restarts
- Emails are sent at the correct time
- Emails are not duplicated

---

## 🔁 Persistence & Idempotency

- All emails are stored in PostgreSQL before being queued
- BullMQ persists delayed jobs in Redis
- Email records track status (`scheduled`, `sent`, `failed`)
- Before sending, the worker checks the current status
- Emails marked as `sent` are never sent again

This guarantees idempotent behavior even after restarts.

---

## ⚙️ Concurrency, Delay & Rate Limiting

### Worker Concurrency

Worker concurrency is configurable via environment variables and allows multiple emails to be processed in parallel safely.

WORKER_CONCURRENCY=5


---

### Delay Between Emails

A minimum delay between individual email sends is enforced to mimic provider throttling.

- Implemented using BullMQ limiter and worker logic
- Configurable via environment variables or user input

Example:

MIN_DELAY_SECONDS=2


---

### Hourly Rate Limiting (Per Sender)

- Emails are rate-limited per sender per hour
- Limits are configurable via environment variables or request payload
- Redis-backed counters are used for `(sender + hour window)`
- Safe across multiple workers and instances

Example:

MAX_EMAILS_PER_HOUR=100


---

### When Limits Are Exceeded

- Emails are not dropped
- Jobs are delayed into the next available hour window
- Order is preserved as much as reasonably possible

---

### Behavior Under Load

If 1000+ emails are scheduled at roughly the same time:
- All jobs are queued immediately
- Workers process jobs respecting:
  - concurrency limits
  - per-email delay
  - hourly rate limits
- Excess jobs are automatically rescheduled

---

## 🔐 Authentication

- Google OAuth is implemented using NextAuth
- Only authenticated users can access the dashboard
- User name, email, and avatar are shown in the header
- Logout functionality is provided

---

## 🎨 Frontend Features

The frontend closely follows the provided Figma design.

### Dashboard
- Protected routes
- Header with user info and logout
- Sections for:
  - Scheduled Emails
  - Sent Emails
- Compose New Email action

---

### Compose New Email

Users can:
- Enter subject and body
- Upload a CSV/text file of email addresses
- See the number of parsed email addresses
- Select start time
- Configure:
  - Delay between emails
  - Hourly sending limit
- Schedule emails via backend API

---

### Scheduled Emails

Displays:
- Email
- Subject
- Scheduled time
- Status

Includes loading and empty states.

---

### Sent Emails

Displays:
- Email
- Subject
- Sent time
- Status (`sent` / `failed`)

Includes loading and empty states.

---

## ▶️ Running the Project Locally

### Backend

```bash
cd server
npm install
npm run dev
```
Ensure Redis and PostgreSQL are running.

Frontend
```bash
cd client
npm install
npm run dev
```

🔑 Environment Variables

##Backend (.env)
```bash
DATABASE_URL=postgresql://...
REDIS_HOST=localhost
REDIS_PORT=6379

WORKER_CONCURRENCY=5
MIN_DELAY_SECONDS=2
MAX_EMAILS_PER_HOUR=100

ETHEREAL_EMAIL=your_ethereal_email
ETHEREAL_PASSWORD=your_ethereal_password

Frontend (.env.local)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

```

✅ Features Checklist
##Backend

###Email scheduling API
###Persistent delayed jobs using BullMQ
###Restart-safe execution
###Idempotent email sending
###Per-sender rate limiting
###Configurable concurrency and delay

##Frontend

###Google OAuth authentication
###Protected dashboard
###Compose email flow
###Scheduled and sent email views
###Loading and empty states

