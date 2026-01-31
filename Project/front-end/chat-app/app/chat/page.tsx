import { createClient as createServerClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import ChatClient from '@/components/chat-page-client'

export default async function ChatPage() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      redirect('/auth/login')
    }
    
    return <ChatClient />
  } catch (err) {
    
    redirect('/auth/login')
  }
}