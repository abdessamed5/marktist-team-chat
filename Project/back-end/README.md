# MARKTIST - Backend (Supabase)

This folder contains the database schema, RLS policies, and triggers required for the MARKTIST Chat application.

## 🗄️ Database Schema
- **profiles**: Handles user roles (`admin`, `employee`) and approval status.
- **messages**: Stores chat history with sender references.

## 🚀 Setup Instructions
1. Create a new project in [Supabase](https://supabase.com).
2. Open the **SQL Editor**.
3. Copy the contents of `supabase.sql` from this folder and run it.
4. Ensure **Realtime** is enabled for the `messages` table in the Supabase dashboard.

## 🔐 Security (RLS)
- Users can only read messages if `is_approved` is set to `true`.
- Only `admin` roles can update the `is_approved` status of other users.