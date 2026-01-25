# MARKTIST: Enterprise-Grade Real-Time Chat Engine

MARKTIST is a sophisticated, full-stack communication platform built with **Next.js 15** and **Supabase**. It features a robust **Administrative Gatekeeping** system, role-based access control (RBAC), and an optimized **infinite-scroll history engine** designed for high-performance message retrieval.<br />



---

## 🏗️ System Architecture

The project is split into two specialized layers to ensure scalability and clean separation of concerns:<br />

### 1. Frontend (Next.js 15 & React 19)
* **Virtual History Loading**: Implements a "Smart Fetch" algorithm. On mount, the UI pulls 50 messages. As the user scrolls up, the engine prepends 20 messages at a time using **Scroll Anchoring** to prevent layout shifts.<br />
* **Real-time Synchronization**: Leverages Supabase Postgres Changes to update the UI instantly when new messages arrive or user permissions change.<br />
* **Access Control UI**: Dedicated "Pending Approval" state that blocks the chat engine until an Admin updates the user's status in the database.<br />

### 2. Backend (Supabase & PostgreSQL)
* **Relational Database**: Optimized schema for Profiles and Messages with Foreign Key constraints.<br />
* **Row Level Security (RLS)**: Strict security policies ensuring users can only read messages if their `is_approved` status is `true`.<br />
* **Automated Workflows**: SQL Triggers and Functions that automatically create a user profile in the `public` schema immediately upon Auth signup.<br />

---

## 🚀 Key Technical Features

* **Admin Control Panel**: An integrated dashboard for users with the `admin` role to bulk-approve new employees and manage the user directory.<br />
* **Performance Optimization**: Message history is reverse-buffered to ensure the most recent messages load first while maintaining chronological order.<br />
* **Type Safety**: End-to-end TypeScript implementation for predictable state management and error handling.<br />
* **Dark-Theme UI**: A high-contrast, professional dark mode built with Tailwind CSS for reduced eye strain during long-form communication.<br />

---

## 🛠️ Tech Stack

| Layer      | Technology |<br />
| :--------- | :--------- |<br />
| **Framework** | Next.js 15 (App Router) |<br />
| **Language** | TypeScript |<br />
| **Database** | PostgreSQL (via Supabase) |<br />
| **Auth** | Supabase Auth (JWT) |<br />
| **Real-time** | Supabase Realtime (WebSockets) |<br />
| **Styling** | Tailwind CSS |<br />
| **Icons** | Lucide React |<br />

---

## 📂 Project Structure

```text
├── Project/<br />
│   ├── front-end/<br />
│   │   └── chat-app/          # Next.js Application<br />
│   │       ├── app/           # App Router & Server Components<br />
│   │       ├── components/    # Chat Feed & Admin Modals<br />
│   │       └── hooks/         # Scroll & Real-time logic<br />
│   └── back-end/<br />
│       └── supabase.sql       # Database Schema & RLS Policies<br />
⚙️ Setup & Installation
Database Setup
Execute the Project/back-end/supabase.sql script in your Supabase SQL Editor.<br />

Enable Realtime on the messages table in your Supabase Dashboard.<br />

Frontend Setup<br />
Navigate to the chat-app directory.<br />

Install dependencies: npm install.<br />

Configure .env.local with your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.<br />

Launch the environment: npm run dev.<br />