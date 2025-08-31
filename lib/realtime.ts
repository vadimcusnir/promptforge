import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'

export interface CollaborationSession {
  id: string
  name: string
  ownerId: string
  participants: string[]
  moduleId: string
  content: string
  lastModified: Date
  isActive: boolean
}

export interface CollaborationEvent {
  type: 'join' | 'leave' | 'edit' | 'cursor' | 'selection' | 'comment'
  userId: string
  userName: string
  sessionId: string
  data: any
  timestamp: Date
}

export class RealtimeService {
  private static instance: RealtimeService
  private io: SocketIOServer | null = null
  private sessions: Map<string, CollaborationSession> = new Map()
  private userSessions: Map<string, string[]> = new Map() // userId -> sessionIds

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService()
    }
    return RealtimeService.instance
  }

  initialize(server: HTTPServer) {
    if (this.io) return this.io

    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    })

    this.setupEventHandlers()
    return this.io
  }

  private setupEventHandlers() {
    if (!this.io) return

    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      // Join collaboration session
      socket.on('join-session', (data: { sessionId: string, userId: string, userName: string }) => {
        this.joinSession(socket, data)
      })

      // Leave collaboration session
      socket.on('leave-session', (data: { sessionId: string, userId: string }) => {
        this.leaveSession(socket, data)
      })

      // Handle content changes
      socket.on('content-change', (data: { sessionId: string, userId: string, content: string, change: any }) => {
        this.handleContentChange(socket, data)
      })

      // Handle cursor position
      socket.on('cursor-move', (data: { sessionId: string, userId: string, position: any }) => {
        this.handleCursorMove(socket, data)
      })

      // Handle text selection
      socket.on('text-selection', (data: { sessionId: string, userId: string, selection: any }) => {
        this.handleTextSelection(socket, data)
      })

      // Handle comments
      socket.on('add-comment', (data: { sessionId: string, userId: string, comment: any }) => {
        this.handleAddComment(socket, data)
      })

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket)
      })
    })
  }

  private joinSession(socket: any, data: { sessionId: string, userId: string, userName: string }) {
    const { sessionId, userId, userName } = data
    
    // Join the socket room
    socket.join(sessionId)
    
    // Get or create session
    let session = this.sessions.get(sessionId)
    if (!session) {
      session = {
        id: sessionId,
        name: `Session ${sessionId}`,
        ownerId: userId,
        participants: [userId],
        moduleId: '',
        content: '',
        lastModified: new Date(),
        isActive: true
      }
      this.sessions.set(sessionId, session)
    } else {
      // Add user to participants if not already there
      if (!session.participants.includes(userId)) {
        session.participants.push(userId)
      }
    }

    // Track user sessions
    const userSessions = this.userSessions.get(userId) || []
    if (!userSessions.includes(sessionId)) {
      userSessions.push(sessionId)
      this.userSessions.set(userId, userSessions)
    }

    // Notify others in the session
    socket.to(sessionId).emit('user-joined', {
      userId,
      userName,
      sessionId,
      participants: session.participants
    })

    // Send current session state to the new user
    socket.emit('session-state', {
      session,
      participants: session.participants
    })

    console.log(`User ${userId} joined session ${sessionId}`)
  }

  private leaveSession(socket: any, data: { sessionId: string, userId: string }) {
    const { sessionId, userId } = data
    
    socket.leave(sessionId)
    
    const session = this.sessions.get(sessionId)
    if (session) {
      session.participants = session.participants.filter(id => id !== userId)
      
      // Remove session if no participants left
      if (session.participants.length === 0) {
        this.sessions.delete(sessionId)
      }
    }

    // Update user sessions
    const userSessions = this.userSessions.get(userId) || []
    const updatedSessions = userSessions.filter(id => id !== sessionId)
    if (updatedSessions.length === 0) {
      this.userSessions.delete(userId)
    } else {
      this.userSessions.set(userId, updatedSessions)
    }

    // Notify others in the session
    socket.to(sessionId).emit('user-left', {
      userId,
      sessionId,
      participants: session?.participants || []
    })

    console.log(`User ${userId} left session ${sessionId}`)
  }

  private handleContentChange(socket: any, data: { sessionId: string, userId: string, content: string, change: any }) {
    const { sessionId, userId, content, change } = data
    
    const session = this.sessions.get(sessionId)
    if (session) {
      session.content = content
      session.lastModified = new Date()
      
      // Broadcast change to other participants
      socket.to(sessionId).emit('content-updated', {
        userId,
        content,
        change,
        timestamp: new Date()
      })
    }
  }

  private handleCursorMove(socket: any, data: { sessionId: string, userId: string, position: any }) {
    const { sessionId, userId, position } = data
    
    // Broadcast cursor position to other participants
    socket.to(sessionId).emit('cursor-moved', {
      userId,
      position,
      timestamp: new Date()
    })
  }

  private handleTextSelection(socket: any, data: { sessionId: string, userId: string, selection: any }) {
    const { sessionId, userId, selection } = data
    
    // Broadcast text selection to other participants
    socket.to(sessionId).emit('text-selected', {
      userId,
      selection,
      timestamp: new Date()
    })
  }

  private handleAddComment(socket: any, data: { sessionId: string, userId: string, comment: any }) {
    const { sessionId, userId, comment } = data
    
    // Broadcast comment to all participants in the session
    this.io?.to(sessionId).emit('comment-added', {
      userId,
      comment,
      timestamp: new Date()
    })
  }

  private handleDisconnect(socket: any) {
    console.log('User disconnected:', socket.id)
    
    // Remove user from all sessions
    for (const [userId, sessionIds] of this.userSessions.entries()) {
      for (const sessionId of sessionIds) {
        socket.to(sessionId).emit('user-disconnected', {
          userId,
          sessionId
        })
      }
    }
  }

  // Public methods for creating and managing sessions
  createSession(ownerId: string, moduleId: string, name?: string): CollaborationSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const session: CollaborationSession = {
      id: sessionId,
      name: name || `Collaboration Session`,
      ownerId,
      participants: [ownerId],
      moduleId,
      content: '',
      lastModified: new Date(),
      isActive: true
    }
    
    this.sessions.set(sessionId, session)
    
    // Track user sessions
    const userSessions = this.userSessions.get(ownerId) || []
    userSessions.push(sessionId)
    this.userSessions.set(ownerId, userSessions)
    
    return session
  }

  getSession(sessionId: string): CollaborationSession | undefined {
    return this.sessions.get(sessionId)
  }

  getUserSessions(userId: string): string[] {
    return this.userSessions.get(userId) || []
  }

  getAllSessions(): CollaborationSession[] {
    return Array.from(this.sessions.values())
  }

  // Demo mode methods
  getDemoSessions(): CollaborationSession[] {
    return [
      {
        id: 'demo-session-1',
        name: 'Content Strategy Workshop',
        ownerId: 'demo-user-1',
        participants: ['demo-user-1', 'demo-user-2'],
        moduleId: 'M01',
        content: 'This is a demo collaboration session for content strategy...',
        lastModified: new Date(),
        isActive: true
      },
      {
        id: 'demo-session-2',
        name: 'Prompt Optimization Session',
        ownerId: 'demo-user-2',
        participants: ['demo-user-2', 'demo-user-3'],
        moduleId: 'M03',
        content: 'Working on optimizing prompts for better AI responses...',
        lastModified: new Date(Date.now() - 3600000), // 1 hour ago
        isActive: true
      }
    ]
  }
}

export const realtimeService = RealtimeService.getInstance()
