'use client'

import { RealtimeChat } from '@/components/realtime-chat'
import { createClient } from '@/lib/client'
import { useEffect, useState, useRef } from 'react'
import { LogOut, Clock, Users } from 'lucide-react'

export default function ChatPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [userRole, setUserRole] = useState<string>('') 
  const [isApproved, setIsApproved] = useState<boolean | null>(null) // NEW: Track approval status
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [showUsersModal, setShowUsersModal] = useState(false) // NEW: State for Users List modal
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const isInitialized = useRef(false); 
  const lastProcessedMessage = useRef<string>(""); 
  const lastProcessTime = useRef<number>(0);

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  const handleBulkApprove = async () => {
    if (selectedUsers.length === 0) return;
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: true })
      .in('id', selectedUsers)

    if (!error) {
      setAllUsers(allUsers.map(u => 
        selectedUsers.includes(u.id) ? { ...u, is_approved: true } : u
      ))
      setSelectedUsers([])
      setShowAdminModal(false)
    }
  }

  useEffect(() => {
    if (isInitialized.current) return;
    let channel: any;

    const initChat = async () => {
      try {
        isInitialized.current = true; 
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          window.location.href = '/auth/login'
          return
        }
        setUserId(user.id)
        
        const { data: profile } = await supabase
            .from('profiles')
            .select('username, role, is_approved')
            .eq('id', user.id)
            .single()
        
        setUserName(profile?.username || user.email || 'User')
        setUserRole(profile?.role || 'employee')
        setIsApproved(profile?.is_approved ?? false) 

        if (profile?.is_approved) {
            const { data: profiles } = await supabase.from('profiles').select('id, username, is_approved, role')
            if (profiles) setAllUsers(profiles)

            const { data: oldMessages } = await supabase
              .from('messages')
              .select('*, profiles(username)')
              .eq('room_id', 'general')
              .order('inserted_at', { ascending: true })

            if (oldMessages) {
              setHistory(oldMessages.map((m: any) => ({
                id: m.id.toString(),
                content: m.content,
                user: { name: m.profiles?.username || "User" },
                createdAt: m.inserted_at 
              })))
            }

            channel = supabase.channel('general_room')
              .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.general` }, async (payload) => {
                const newMessage = payload.new;
                const { data: sender } = await supabase.from('profiles').select('username').eq('id', newMessage.sender_id).single();
                setHistory((prev) => {
                  if (prev.some(m => m.id === newMessage.id.toString())) return prev;
                  return [...prev, {
                    id: newMessage.id.toString(),
                    content: newMessage.content,
                    user: { name: sender?.username || "New User" },
                    createdAt: newMessage.inserted_at || new Date().toISOString()
                  }];
                });
              }).subscribe()
        }
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    initChat()
    return () => { if (channel) supabase.removeChannel(channel); isInitialized.current = false; }
  }, [])

  const handleSaveMessage = async (newMsg: any) => {
    if (!userId || !newMsg?.content) return;
    const now = Date.now();
    if (newMsg.content === lastProcessedMessage.current && (now - lastProcessTime.current) < 2000) return;
    lastProcessedMessage.current = newMsg.content;
    lastProcessTime.current = now;
    const { error } = await supabase.from('messages').insert({ 
        content: newMsg.content, 
        sender_id: userId, 
        room_id: 'general' 
    });
    if (error) lastProcessedMessage.current = ""; 
  }

  if (loading) return <div className="h-screen bg-[#1a1a1a] flex items-center justify-center text-[#24b47e] font-bold">MARKTIST...</div>

  if (isApproved === false) {
    return (
      <div className="h-screen w-full flex items-center justify-center p-6" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-md w-full p-8 rounded-2xl border border-[#2d2d2d] bg-[#242424] text-center shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#24b47e]/10 rounded-full">
              <Clock className="size-12 text-[#24b47e]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Pending</h2>
          <p className="text-zinc-400 mb-8">
            Welcome to MARKTIST, <span className="text-white font-medium">{userName}</span>. Your account is waiting for admin approval before you can join the chat.
          </p>
          <button 
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all font-bold"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="flex flex-col h-screen max-w-5xl mx-auto relative" 
      style={{ backgroundColor: '#1a1a1a', borderLeft: '1px solid #2d2d2d', borderRight: '1px solid #2d2d2d' }}
    >
      <header 
        className="p-4 flex justify-between items-center relative z-50" 
        style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #2d2d2d' }}
      >
        <div className="flex flex-col">
           <h1 className="font-bold text-xl text-[#24b47e] leading-none">MARKTIST</h1>
           <span className="text-[10px] uppercase tracking-wider mt-1 font-bold" style={{ color: '#ffffff' }}>
             Logged in as: {userName}
           </span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg active:scale-95">
          <LogOut className="size-4" />
          Logout
        </button>
      </header>

      <div className="flex-1 overflow-hidden relative z-10" style={{ backgroundColor: '#1a1a1a' }}>
        <RealtimeChat 
          roomName="general" 
          username={userName} 
          onMessage={handleSaveMessage}
          messages={history} 
        />
      </div>

      {userRole === 'admin' && (
        <>
          {/* USERS LIST BUTTON (Positioned Above Admin Button) */}
          <button 
            onClick={() => setShowUsersModal(true)} 
            className="fixed bottom-24 left-6 z-[999] p-4 rounded-full shadow-lg hover:bg-zinc-900 transition-all active:scale-95"
            style={{ backgroundColor: '#242424', color: '#24b47e', border: '1px solid #2d2d2d' }}
          >
            <Users className="size-5" />
          </button>

          {/* ADMIN APPROVE BUTTON */}
          <button 
            onClick={() => setShowAdminModal(true)} 
            className="fixed bottom-6 left-6 z-[999] p-4 rounded-full shadow-lg hover:bg-zinc-900 transition-all active:scale-95 text-xs font-bold uppercase tracking-tight"
            style={{ backgroundColor: '#242424', color: '#00b4d8', border: '1px solid #2d2d2d' }}
          >
            Admin
          </button>
        </>
      )}

      {/* MODAL 1: USERS LIST */}
      {showUsersModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="p-6 rounded-xl w-80 shadow-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2d2d2d' }}>
            <div className="flex justify-between mb-4">
              <h2 className="font-bold" style={{ color: '#ffffff' }}>All Users</h2>
              <button onClick={() => setShowUsersModal(false)} style={{ color: '#ffffff' }}>✕</button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto mb-2 scrollbar-hide">
              {allUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="flex flex-col p-3 rounded-lg"
                  style={{ border: '1px solid #2d2d2d', backgroundColor: '#242424' }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">{user.username || 'User'}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${user.role === 'admin' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-zinc-500/10 text-zinc-400'}`}>
                      {user.role}
                    </span>
                  </div>
                  <span className={`text-[10px] mt-1 font-bold uppercase ${user.is_approved ? 'text-[#24b47e]' : 'text-red-500'}`}>
                    {user.is_approved ? '● Approved' : '○ Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GRANT ACCESS */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="p-6 rounded-xl w-80 shadow-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2d2d2d' }}>
            <div className="flex justify-between mb-4">
              <h2 className="font-bold" style={{ color: '#ffffff' }}>Grant Access</h2>
              <button onClick={() => setShowAdminModal(false)} style={{ color: '#ffffff' }}>✕</button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4 scrollbar-hide">
              {allUsers.filter(u => !u.is_approved).map((user) => (
                <div 
                  key={user.id} 
                  onClick={() => setSelectedUsers(prev => prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id])}
                  className="flex items-center gap-3 p-2 cursor-pointer rounded-lg transition-all"
                  style={{ 
                    border: selectedUsers.includes(user.id) ? '1px solid #22d3ee' : '1px solid #2d2d2d',
                    backgroundColor: selectedUsers.includes(user.id) ? 'rgba(34, 211, 238, 0.1)' : 'transparent'
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full border transition-all" 
                    style={{ 
                      backgroundColor: selectedUsers.includes(user.id) ? '#22d3ee' : 'transparent',
                      borderColor: selectedUsers.includes(user.id) ? '#22d3ee' : '#2d2d2d'
                    }} 
                  />
                  <span className="text-sm" style={{ color: '#ffffff' }}>{user.username || 'New User'}</span>
                </div>
              ))}
            </div>
            <button onClick={handleBulkApprove} disabled={selectedUsers.length === 0} className="w-full bg-cyan-500 py-2 rounded-full font-bold text-black hover:bg-cyan-400 transition-colors">
              Approve selected ({selectedUsers.length})
            </button>
          </div>
        </div>
      )}
    </div>
  )
}