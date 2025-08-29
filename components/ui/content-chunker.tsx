"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'

interface ContentChunk {
  id: string
  content: string
  type: 'text' | 'code' | 'list' | 'table'
  priority: 'high' | 'medium' | 'low'
}

interface ContentChunkerProps {
  content: string
  maxChunkSize?: number
  renderChunk?: (chunk: ContentChunk, index: number) => React.ReactNode
  className?: string
  showProgress?: boolean
  autoExpand?: boolean
}

export function ContentChunker({
  content,
  maxChunkSize = 500,
  renderChunk,
  className = "",
  showProgress = true,
  autoExpand = false
}: ContentChunkerProps) {
  const [visibleChunks, setVisibleChunks] = useState<ContentChunk[]>([])
  const [allChunks, setAllChunks] = useState<ContentChunk[]>([])
  const [isExpanded, setIsExpanded] = useState(autoExpand)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Parse content into chunks
  const parseContent = useCallback((text: string): ContentChunk[] => {
    const chunks: ContentChunk[] = []
    const lines = text.split('\n')
    let currentChunk = ''
    let chunkId = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineLength = line.length

      // Determine content type and priority
      let type: ContentChunk['type'] = 'text'
      let priority: ContentChunk['priority'] = 'medium'

      if (line.startsWith('```') || line.startsWith('`')) {
        type = 'code'
        priority = 'high'
      } else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('1. ')) {
        type = 'list'
        priority = 'medium'
      } else if (line.includes('|') && line.includes('---')) {
        type = 'table'
        priority = 'low'
      } else if (line.startsWith('#')) {
        priority = 'high'
      }

      // Check if adding this line would exceed chunk size
      if (currentChunk.length + lineLength > maxChunkSize && currentChunk.length > 0) {
        chunks.push({
          id: `chunk-${chunkId++}`,
          content: currentChunk.trim(),
          type: chunks.length === 0 ? 'text' : chunks[chunks.length - 1].type,
          priority: chunks.length === 0 ? 'high' : chunks[chunks.length - 1].priority
        })
        currentChunk = line + '\n'
      } else {
        currentChunk += line + '\n'
      }
    }

    // Add remaining content as final chunk
    if (currentChunk.trim()) {
      chunks.push({
        id: `chunk-${chunkId++}`,
        content: currentChunk.trim(),
        type: 'text',
        priority: 'medium'
      })
    }

    return chunks
  }, [maxChunkSize])

  // Initialize chunks
  useEffect(() => {
    const chunks = parseContent(content)
    setAllChunks(chunks)
    
    // Show high priority chunks immediately
    const highPriorityChunks = chunks.filter(chunk => chunk.priority === 'high')
    setVisibleChunks(highPriorityChunks)
  }, [content, parseContent])

  // Progressive loading effect
  useEffect(() => {
    if (!isExpanded || visibleChunks.length >= allChunks.length) return

    const loadNextChunk = () => {
      setVisibleChunks(prev => {
        const nextIndex = prev.length
        if (nextIndex < allChunks.length) {
          const newChunks = [...prev, allChunks[nextIndex]]
          setLoadingProgress((newChunks.length / allChunks.length) * 100)
          return newChunks
        }
        return prev
      })
    }

    // Load chunks progressively with small delays
    const interval = setInterval(() => {
      if (visibleChunks.length < allChunks.length) {
        loadNextChunk()
      } else {
        clearInterval(interval)
      }
    }, 100) // 100ms delay between chunks

    return () => clearInterval(interval)
  }, [isExpanded, visibleChunks.length, allChunks.length])

  // Toggle expansion
  const toggleExpansion = useCallback(() => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      // Start progressive loading
      setLoadingProgress((visibleChunks.length / allChunks.length) * 100)
    }
  }, [isExpanded, visibleChunks.length, allChunks.length])

  // Default chunk renderer
  const defaultRenderChunk = useCallback((chunk: ContentChunk, index: number) => {
    const chunkClasses = `content-chunk content-chunk-${chunk.type} content-chunk-${chunk.priority}`
    
    return (
      <div key={chunk.id} className={chunkClasses}>
        {chunk.type === 'code' ? (
          <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto">
            <code>{chunk.content}</code>
          </pre>
        ) : chunk.type === 'list' ? (
          <div className="space-y-1">
            {chunk.content.split('\n').map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>{line.replace(/^[-*]\s*/, '')}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{chunk.content}</div>
        )}
      </div>
    )
  }, [])

  const renderer = renderChunk || defaultRenderChunk

  return (
    <div className={`content-chunker ${className}`}>
      {/* Content chunks */}
      <div className="content-chunks space-y-4">
        {visibleChunks.map((chunk, index) => renderer(chunk, index))}
      </div>

      {/* Progress indicator */}
      {showProgress && isExpanded && visibleChunks.length < allChunks.length && (
        <div className="content-loading-progress mt-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-sm text-gray-400">
              {visibleChunks.length} / {allChunks.length} chunks
            </span>
          </div>
        </div>
      )}

      {/* Expand/Collapse button */}
      {allChunks.length > visibleChunks.length && (
        <div className="content-expand-controls mt-4">
          <button
            onClick={toggleExpansion}
            className="text-yellow-400 hover:text-yellow-300 text-sm underline"
          >
            {isExpanded ? 'Collapse' : `Show all ${allChunks.length} content chunks`}
          </button>
        </div>
      )}

      {/* Content summary */}
      <div className="content-summary mt-4 text-xs text-gray-500">
        <div>Content length: {content.length} characters</div>
        <div>Chunks: {visibleChunks.length} of {allChunks.length} visible</div>
        <div>Chunk size: ~{maxChunkSize} characters</div>
      </div>
    </div>
  )
}

// Hook for content chunking logic
export function useContentChunking(
  content: string,
  maxChunkSize: number = 500
) {
  const [chunks, setChunks] = useState<ContentChunk[]>([])
  const [visibleChunks, setVisibleChunks] = useState<ContentChunk[]>([])

  const parseContent = useCallback((text: string): ContentChunk[] => {
    // Same parsing logic as above
    const chunks: ContentChunk[] = []
    const lines = text.split('\n')
    let currentChunk = ''
    let chunkId = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineLength = line.length

      let type: ContentChunk['type'] = 'text'
      let priority: ContentChunk['priority'] = 'medium'

      if (line.startsWith('```') || line.startsWith('`')) {
        type = 'code'
        priority = 'high'
      } else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('1. ')) {
        type = 'list'
        priority = 'medium'
      } else if (line.includes('|') && line.includes('---')) {
        type = 'table'
        priority = 'low'
      } else if (line.startsWith('#')) {
        priority = 'high'
      }

      if (currentChunk.length + lineLength > maxChunkSize && currentChunk.length > 0) {
        chunks.push({
          id: `chunk-${chunkId++}`,
          content: currentChunk.trim(),
          type: chunks.length === 0 ? 'text' : chunks[chunks.length - 1].type,
          priority: chunks.length === 0 ? 'high' : chunks[chunks.length - 1].priority
        })
        currentChunk = line + '\n'
      } else {
        currentChunk += line + '\n'
      }
    }

    if (currentChunk.trim()) {
      chunks.push({
        id: `chunk-${chunkId++}`,
        content: currentChunk.trim(),
        type: 'text',
        priority: 'medium'
      })
    }

    return chunks
  }, [maxChunkSize])

  useEffect(() => {
    const parsedChunks = parseContent(content)
    setChunks(parsedChunks)
    
    // Show high priority chunks immediately
    const highPriorityChunks = parsedChunks.filter(chunk => chunk.priority === 'high')
    setVisibleChunks(highPriorityChunks)
  }, [content, parseContent])

  const loadMoreChunks = useCallback((count: number = 1) => {
    setVisibleChunks(prev => {
      const nextIndex = prev.length
      const newChunks = [...prev]
      
      for (let i = 0; i < count && nextIndex + i < chunks.length; i++) {
        newChunks.push(chunks[nextIndex + i])
      }
      
      return newChunks
    })
  }, [chunks])

  const loadAllChunks = useCallback(() => {
    setVisibleChunks(chunks)
  }, [chunks])

  return {
    chunks,
    visibleChunks,
    loadMoreChunks,
    loadAllChunks,
    hasMore: visibleChunks.length < chunks.length,
    progress: (visibleChunks.length / chunks.length) * 100
  }
}
