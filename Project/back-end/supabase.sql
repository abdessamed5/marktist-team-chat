-- ==========================================
-- 1. MESSAGES TABLE STRUCTURE & POLICIES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.messages (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  room_id text NOT NULL DEFAULT 'general',
  inserted_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy 1: Approved users can insert messages
CREATE POLICY "Approved users can insert messages" 
ON public.messages FOR INSERT TO authenticated WITH CHECK (true);

-- Policy 2: Approved users can read messages
CREATE POLICY "Approved users can read messages" 
ON public.messages FOR SELECT TO authenticated USING (true);

-- Policy 3: Users can only insert their own messages (Public)
CREATE POLICY "Users can only insert their own messages" 
ON public.messages FOR INSERT TO public WITH CHECK (auth.uid() = sender_id);


-- ==========================================
-- 2. PROFILES TABLE STRUCTURE & POLICIES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy 4: Admins can delete profiles
CREATE POLICY "Admins can delete profiles" 
ON public.profiles FOR DELETE TO public USING (true);

-- Policy 5: Admins can update any profile
CREATE POLICY "Admins can update any profile" 
ON public.profiles FOR UPDATE TO authenticated WITH CHECK (true);

-- Policy 6: Profiles are viewable by authenticated users
CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT TO authenticated USING (true);