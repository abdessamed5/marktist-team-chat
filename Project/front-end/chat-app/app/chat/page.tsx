'use client'

import { RealtimeChat } from '@/components/realtime-chat'
import { createClient } from '@/lib/client'
import { useEffect, useState } from 'react'

export default function ChatPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initChat = async () => {
      try {
        // 1. Get the current logged-in user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          window.location.href = '/auth/login'
          return
        }

        setUserId(user.id)

        // 2. Fetch the username from your 'profiles' table
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()
        
        const currentUsername = profile?.username || user.email || 'User'
        setUserName(currentUsername)

        // 3. Fetch Message History from your 'messages' table
        // This matches your columns: sender_id, content, inserted_at, room_id
        const { data: oldMessages, error } = await supabase
          .from('messages')
          .select('*')
          .eq('room_id', 'general')
          .order('inserted_at', { ascending: true })

        if (error) throw error

        if (oldMessages) {
          // Transform the database data into the format the UI component expects
          const formattedMessages = oldMessages.map((m) => ({
            id: m.id.toString(),
            content: m.content,
            user: { 
              // We compare sender_id to show your name vs others
              name: m.sender_id === user.id ? currentUsername : "Other User" 
            },
            createdAt: m.inserted_at
          }))
          setHistory(formattedMessages)
        }
      } catch (err) {
        console.error("Chat initialization error:", err)
      } finally {
        setLoading(false)
      }
    }

    initChat()
  }, [])

  // 4. This function runs every time you send a message
  const handleSaveMessage = async (messages: any[]) => {
    const lastMessage = messages[messages.length - 1]
    
    if (userId && lastMessage) {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: lastMessage.content,
          sender_id: userId,
          room_id: 'general' 
        })
      
      if (error) console.error("Error saving message:", error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading MARKTIST Chat...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto border-x bg-background">
      <header className="p-4 border-b flex justify-between items-center bg-card">
        <h1 className="font-bold text-xl text-primary">MARKTIST</h1>
        <div className="text-sm text-muted-foreground">
          Logged in as: <span className="font-medium text-foreground">{userName}</span>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {/* Pass the history into the messages prop so they show on reload */}
        <RealtimeChat 
          roomName="general" 
          username={userName} 
          onMessage={handleSaveMessage}
          messages={history} 
        />
      </div>
    </div>
  )
}