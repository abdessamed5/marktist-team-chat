# MARKTIST - Frontend

A high-performance, real-time chat interface built with **Next.js 15**. This repository contains the frontend implementation, featuring a custom administrative gatekeeping UI and optimized message virtualization.

## 🚀 Frontend Features

- **Smart UI State Management**: Handles "Access Pending" and "Approved" views dynamically based on user profile status.
- **Optimized Chat Pagination**: Implements a custom scroll-anchoring system that loads 50 initial messages and fetches 20 older messages seamlessly when the user reaches the top.
- **Admin Dashboard**: A protected interface for administrators to manage user approvals and view the global directory.
- **Real-time Integration**: Subscribes to database changes to update the UI instantly without page refreshes.
- **Responsive Dark Mode**: A sleek, high-contrast dark theme optimized for both mobile and desktop.
- **Full Type Safety**: Built with TypeScript for reliable prop handling and API integration.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Type System**: TypeScript
- **Client-side Auth**: Supabase Auth Helpers

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## ⚙️ Local Development

1. **Clone the repository:**
   ```bash
   git clone <https://github.com/abdessamed5/marktist-team-chat/tree/main/Project/front-end/chat-app>
   cd marktist-frontend
## Install dependencies:<br />

npm install<br />
Environment Configuration: Create a .env.local file to connect to your API/Backend:<br />

Extrait de code

NEXT_PUBLIC_SUPABASE_URL=your-project-url<br />
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key<br /><br />
Run the app:<br />

npm run dev

## 📂 Frontend Architecture
Plaintext

├── app/                # Next.js App Router & Layouts<br />
│   ├── auth/           # Login/Signup UI<br />
│   └── chat/           # Chat Logic & Scroll Handling<br />
├── components/         # UI Library<br />
│   ├── ui/             # Core UI primitives<br />
│   ├── realtime-chat   # Message feed container<br />
│   └── chat-message    # Message presentation<br />
├── hooks/              # Custom UI hooks (Scroll & Auth)<br />
├── lib/                # API client & Utility helpers<br />
└── public/             # Assets & Logos<br />
