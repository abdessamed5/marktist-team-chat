# MARKTIST: Enterprise-Grade Real-Time Chat Engine

MARKTIST is a sophisticated, full-stack communication platform built with **Next.js 15** and **Supabase**. It features a robust **Administrative Gatekeeping** system, role-based access control (RBAC), and an optimized **infinite-scroll history engine** designed for high-performance message retrieval.<br />



---
##  Development Philosophy: Why this Stack?

### The Shift to Supabase + Next.js
While I am proficient in the traditional **Node.js/Django** ecosystem, I chose to integrate **Supabase** for this project. This was a deliberate learning challenge for me. Despite it being new to my workflow, I recognized its potential for:
* **Rapid Deployment**: It allowed me to move from schema design to a live real-time app in record time.
* **Reliability**: Using a managed Postgres instance ensures data integrity and high availability.
* **Security-First Architecture**: Learning Supabase's Row Level Security (RLS) pushed me to think about security at the database level, rather than just the application level.

I felt the need to master this modern stack because staying at the forefront of technology is what drives me as a developer. Adapting to new, powerful tools is core to my growth mindset.

---

## 🛡️ Security & Anti-Exploit Measures

Security was not an afterthought in this project. I implemented several layers of protection to ensure the integrity of the application:

### 1. SQL Injection Prevention
Instead of manually concatenating strings in queries, I leveraged the **Supabase JavaScript Client**, which utilizes **parameterized queries** under the hood. This ensures that user input is never executed as code, effectively neutralizing SQL Injection (SQLi) attacks.

### 2. Environment Variable Protection (Anti-Reverse Engineering)
To prevent the leaking of sensitive API keys and database credentials:
* **Server-Side Protection**: All sensitive operations are handled via Next.js Server Actions or API routes where variables are stored in `.env.local`.
* **Prefix Logic**: Only variables prefixed with `NEXT_PUBLIC_` are accessible to the browser, while the "Service Role" keys remain strictly on the server, hidden from the client-side bundle and reverse-engineering attempts.

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
├── Project/
│   ├── front-end/
│   │   └── chat-app/          # Next.js Application
│   │       ├── app/           # App Router & Server Components
│   │       ├── components/    # Chat Feed & Admin Modals
│   │       └── hooks/         # Scroll & Real-time logic
│   └── back-end/<br />
│       └── supabase.sql       # Database Schema & RLS Policies
⚙️ Setup & Installation
Database Setup
Execute the Project/back-end/supabase.sql script in your Supabase SQL Editor.

Enable Realtime on the messages table in your Supabase Dashboard.

Frontend Setup
Navigate to the chat-app directory.

Install dependencies: npm install.

Configure .env.local with your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
Launch the environment: npm run dev.

