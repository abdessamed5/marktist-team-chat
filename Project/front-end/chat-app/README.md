# MARKTIST Chat App

A modern, real-time chat application built with Next.js 15, featuring a robust administrative approval system, secure messaging, and an optimized scrollable history.

## 🚀 Key Features

- **Admin Gatekeeping**: New users are placed in a "Pending" state until an admin grants access via the built-in Admin Panel.
- **Smart History Pagination**: Loads an initial **50 messages** and fetches **20 more** on-demand as you scroll up, using scroll-anchoring to prevent UI jumps.
- **Real-time Chat**: Instant messaging with live updates powered by Supabase Postgres Changes.
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS and a high-contrast dark theme.
- **Modern UI Components**: Clean, accessible components using Radix UI and shadcn/ui.
- **TypeScript Support**: Full type safety throughout the application.
- **Server-Side Rendering**: Optimized performance with Next.js App Router.

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React icons
- **Backend**: Supabase (Authentication, Database, Real-time subscriptions)
- **Development**: ESLint, PostCSS

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account and project

## ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd marktist-chat
Install dependencies:

## 

npm install
Set up environment variables: Create a .env.local file in the root directory:

Extrait de code

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
Run the development server:

##

npm run dev
Open http://localhost:3000 in your browser.

🕹 Usage
Sign Up: Create a new account.

Access Pending: Wait for an administrator to approve your account.

Chat: Once approved, join the general room for real-time conversations.

Admin Panel: Users with the admin role can approve pending users and view the full user list.

📂 Project Structure
Plaintext

├── app/                # Next.js app directory
│   ├── auth/           # Authentication pages
│   ├── chat/           # Chat interface logic (page.tsx)
│   └── globals.css     # Global styles
├── components/         # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── realtime-chat   # Message feed and input area
│   └── chat-message    # Individual message items
├── hooks/              # Custom React hooks (real-time & scroll)
├── lib/                # Utility functions and Supabase client
└── public/             # Static assets
