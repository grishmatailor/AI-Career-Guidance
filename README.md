# AI Career Guidance Portal

A production-ready platform that helps students discover their perfect career path using OpenAI.

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, ShadCN UI, Apollo Client.
- **Backend**: Node.js, Apollo Server (GraphQL), TypeORM, PostgreSQL.
- **AI**: OpenAI API (GPT-3.5/4).
- **Auth**: JWT with Role-Based Access Control.

## Project Structure

```
ai-career-guidance-portal
├── client          # Next.js frontend
├── server          # Node.js backend
├── database        # DB scripts and migrations
└── shared          # Shared types/configs
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- OpenAI API Key

### Backend Setup

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your PostgreSQL credentials and OpenAI API Key.
4. Install dependencies:
   ```bash
   npm install
   ```
5. The database schema will be automatically created on the first run thanks to TypeORM's `synchronize: true`.

### Frontend Setup

1. Navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Running the Whole Project

From the root directory:
```bash
npm run dev
```

## Features

- **AI Career Assessment**: Interactive questionnaire analyzed by OpenAI.
- **Smart Recommendations**: Structured career paths with salaries, skills, and roadmaps.
- **Admin Dashboard**: Manage careers, questions, and view user analytics.
- **Modern UI**: Dark mode, responsive design, and smooth animations using Framer Motion.
- **Secure Auth**: JWT-based login with Admin/User roles.

## User Roles

- **Admin**: `admin@example.com` / `admin123`
- **User**: Register as a new user or use `user@example.com` / `user123`

---
Generated with ❤️ by Antigravity
