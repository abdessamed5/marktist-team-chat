'use client'

import { cn } from '@/lib/utils'
import { ChatMessageItem } from '@/components/chat-message'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import {
  type ChatMessage,
  useRealtimeChat,
} from '@/hooks/use-realtime-chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface RealtimeChatProps {
  roomName: string
  username: string
  onMessage?: (message: ChatMessage) => void 
  messages?: ChatMessage[]
}

export const RealtimeChat = ({
  roomName,
  username,
  onMessage,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  })
  const [newMessage, setNewMessage] = useState('')

  const allMessages = useMemo(() => {
    const mergedMessages = [...initialMessages, ...realtimeMessages]
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) => index === self.findIndex((m) => m.id === message.id)
    )
    return uniqueMessages.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }, [initialMessages, realtimeMessages])

  useEffect(() => {
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() || !isConnected) return

      const messageContent = newMessage.trim()
      
      sendMessage(messageContent)
      
      if (onMessage) {
        onMessage({
          id: Math.random().toString(),
          content: messageContent,
          user: { name: username },
          createdAt: new Date().toISOString()
        })
      }
      
      setNewMessage('')
    },
    [newMessage, isConnected, sendMessage, onMessage, username]
  )

  return (
    <div 
      className="flex flex-col h-full w-full antialiased"
      style={{ backgroundColor: '#1a1a1a', color: '#ededed' }}
    >
      
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {allMessages.length === 0 ? (
          <div className="text-center text-xs text-zinc-600 uppercase tracking-widest mt-10">
            Start the conversation
          </div>
        ) : null}
        
        <div className="space-y-1">
          {allMessages.map((message, index) => {
            const prevMessage = index > 0 ? allMessages[index - 1] : null
            const showHeader = true; // This forces the name and time to appear on every message

            return (
              <div key={message.id} className="animate-in fade-in duration-300">
                <ChatMessageItem
                  message={message}
                  isOwnMessage={message.user.name === username}
                  showHeader={showHeader}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* FIXED INPUT AREA: Removed max-w-4xl and used inline styles to kill white borders */}
      <form 
        onSubmit={handleSendMessage} 
        className="p-4" 
        style={{ 
          backgroundColor: '#1a1a1a', 
          borderTop: '1px solid #2d2d2d' 
        }}
      >
        <div className="relative flex items-center w-full">
          <Input
            className="w-full rounded-2xl h-12 px-5 focus-visible:ring-[#24b47e]/50"
            style={{ 
              backgroundColor: '#242424', 
              border: '1px solid #2d2d2d', 
              color: '#ffffff' 
            }}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected}
          />
          
          {isConnected && newMessage.trim() && (
            <Button
              className="absolute right-2 bg-[#24b47e] hover:bg-[#1e9668] text-black rounded-lg size-8 p-0"
              type="submit"
            >
              <Send className="size-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}