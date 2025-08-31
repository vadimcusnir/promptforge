"use client";

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Plus, 
  Share2, 
  MessageSquare, 
  Edit3, 
  Eye,
  Loader2,
  CheckCircle,
  Clock
} from 'lucide-react'

interface CollaborationSession {
  id: string
  name: string
  ownerId: string
  participants: string[]
  moduleId: string
  content: string
  lastModified: Date
  isActive: boolean
}

interface CollaborationEvent {
  type: 'join' | 'leave' | 'edit' | 'cursor' | 'selection' | 'comment'
  userId: string
  userName: string
  sessionId: string
  data: any
  timestamp: Date
}

export function CollaborationWorkspace() {
  const [sessions, setSessions] = useState<CollaborationSession[]>([])
  const [activeSession, setActiveSession] = useState<CollaborationSession | null>(null)
  const [sessionContent, setSessionContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [newSessionName, setNewSessionName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [comments, setComments] = useState<Array<{id: string, user: string, text: string, timestamp: Date}>>([])
  const [newComment, setNewComment] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<Array<{id: string, name: string, cursor?: any}>>([])

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/collaboration/sessions')
      const data = await response.json()
      
      if (data.success) {
        setSessions(data.sessions)
        if (data.sessions.length > 0 && !activeSession) {
          setActiveSession(data.sessions[0])
          setSessionContent(data.sessions[0].content)
        }
      }
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createSession = async () => {
    if (!newSessionName.trim()) return
    
    setIsCreating(true)
    try {
      const response = await fetch('/api/collaboration/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: 'demo-user-1',
          moduleId: 'M01',
          name: newSessionName,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setSessions(prev => [...prev, data.session])
        setActiveSession(data.session)
        setSessionContent('')
        setNewSessionName('')
      }
    } catch (error) {
      console.error('Failed to create session:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const joinSession = (session: CollaborationSession) => {
    setActiveSession(session)
    setSessionContent(session.content)
    
    // Simulate joining users
    setOnlineUsers([
      { id: 'user-1', name: 'Alice Johnson' },
      { id: 'user-2', name: 'Bob Smith' },
      { id: 'user-3', name: 'Carol Davis' },
    ])
  }

  const handleContentChange = (content: string) => {
    setSessionContent(content)
    
    // In a real implementation, this would broadcast to other users
    // via WebSocket connection
  }

  const addComment = () => {
    if (!newComment.trim()) return
    
    const comment = {
      id: `comment-${Date.now()}`,
      user: 'You',
      text: newComment,
      timestamp: new Date(),
    }
    
    setComments(prev => [...prev, comment])
    setNewComment('')
  }

  const shareSession = () => {
    if (activeSession) {
      const shareUrl = `${window.location.origin}/collaborate/${activeSession.id}`
      navigator.clipboard.writeText(shareUrl)
      // Show toast notification
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gold-industrial" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-pf-text mb-4">
          Real-time Collaboration
        </h1>
        <p className="text-pf-text-muted text-lg">
          Work together on prompts with live editing and comments
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sessions Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-pf-surface border-pf-text-muted/30">
            <CardHeader>
              <CardTitle className="text-pf-text flex items-center gap-2">
                <Users className="w-5 h-5 text-gold-industrial" />
                Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Create New Session */}
              <div className="space-y-2">
                <Input
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="Session name..."
                  className="bg-pf-black border-pf-text-muted/30 text-pf-text"
                />
                <Button
                  onClick={createSession}
                  disabled={isCreating || !newSessionName.trim()}
                  className="w-full bg-gold-industrial text-pf-black hover:bg-gold-industrial-dark"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Session
                    </>
                  )}
                </Button>
              </div>

              {/* Sessions List */}
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      activeSession?.id === session.id
                        ? 'border-gold-industrial bg-gold-industrial/10'
                        : 'border-pf-text-muted/30 bg-pf-black hover:bg-pf-text-muted/10'
                    }`}
                    onClick={() => joinSession(session)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-pf-text font-medium text-sm">
                        {session.name}
                      </h4>
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        {session.participants.length} users
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-pf-text-muted">
                      <Clock className="w-3 h-3" />
                      {new Date(session.lastModified).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Online Users */}
          {activeSession && (
            <Card className="bg-pf-surface border-pf-text-muted/30">
              <CardHeader>
                <CardTitle className="text-pf-text flex items-center gap-2">
                  <Eye className="w-5 h-5 text-green-400" />
                  Online Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {onlineUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-pf-text text-sm">{user.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Workspace */}
        <div className="lg:col-span-3 space-y-6">
          {activeSession ? (
            <>
              {/* Session Header */}
              <Card className="bg-pf-surface border-pf-text-muted/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-pf-text">{activeSession.name}</CardTitle>
                      <CardDescription className="text-pf-text-muted">
                        Module: {activeSession.moduleId} • {activeSession.participants.length} participants
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={shareSession}
                        className="bg-pf-text-muted/20 text-pf-text-muted hover:bg-pf-text-muted/30"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Content Editor */}
              <Card className="bg-pf-surface border-pf-text-muted/30">
                <CardHeader>
                  <CardTitle className="text-pf-text flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-gold-industrial" />
                    Content Editor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={sessionContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Start writing your prompt here... Everyone can see changes in real-time!"
                    className="w-full h-64 p-4 bg-pf-black border border-pf-text-muted/30 text-pf-text rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gold-industrial/50"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-pf-text-muted">
                      {sessionContent.length} characters
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigator.clipboard.writeText(sessionContent)}
                        className="bg-pf-text-muted/20 text-pf-text-muted hover:bg-pf-text-muted/30"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card className="bg-pf-surface border-pf-text-muted/30">
                <CardHeader>
                  <CardTitle className="text-pf-text flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-gold-industrial" />
                    Comments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="bg-pf-black border-pf-text-muted/30 text-pf-text"
                      onKeyPress={(e) => e.key === 'Enter' && addComment()}
                    />
                    <Button
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      className="bg-gold-industrial text-pf-black hover:bg-gold-industrial-dark"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-pf-black p-3 rounded-lg border border-pf-text-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-pf-text font-medium text-sm">{comment.user}</span>
                          <span className="text-pf-text-muted text-xs">
                            {comment.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-pf-text text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-pf-surface border-pf-text-muted/30">
              <CardContent className="pt-12 pb-12 text-center">
                <Users className="w-16 h-16 text-pf-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-pf-text mb-2">
                  No Active Session
                </h3>
                <p className="text-pf-text-muted">
                  Create a new session or join an existing one to start collaborating
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
