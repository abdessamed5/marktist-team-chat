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
   git clone <repository-url>
   cd marktist-frontend
Install dependencies:

npm install
Environment Configuration: Create a .env.local file to connect to your API/Backend:

Extrait de code

NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
Run the app:

npm run dev

##📂 Frontend Architecture
Plaintext

├── app/                # Next.js App Router & Layouts
│   ├── auth/           # Login/Signup UI
│   └── chat/           # Chat Logic & Scroll Handling
├── components/         # UI Library
│   ├── ui/             # Core UI primitives
│   ├── realtime-chat   # Message feed container
│   └── chat-message    # Message presentation
├── hooks/              # Custom UI hooks (Scroll & Auth)
├── lib/                # API client & Utility helpers
└── public/             # Assets & Logos
