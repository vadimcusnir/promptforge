"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Play, Pause, Volume2, VolumeX, Maximize, X } from "lucide-react"

interface RitualVideoProps {
  type: 'inversul-luminii' | 'lumina-din-tacere' | 'aparatul-de-vizualizare' | 'fara-glyph' | 'contaminare'
  className?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  showControls?: boolean
}

export function RitualVideo({ 
  type, 
  className, 
  autoplay = false, 
  loop = true, 
  muted = true,
  showControls = true 
}: RitualVideoProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isMuted, setIsMuted] = useState(muted)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const videoConfigs = {
    'inversul-luminii': {
      title: 'Inversul Luminii',
      description: 'Ce-ar fi dacă logo-ul nu s-ar lumina, ci ar absorbi toată lumina din jur?',
      duration: '~7s',
      concept: 'Absorpția luminii spre centru. Revelarea prin absența luminii.'
    },
    'lumina-din-tacere': {
      title: 'Lumina din Tăcere',
      description: 'În loc să apară cu zgomot, glyphul apare când TOTUL se oprește.',
      duration: '~6.5s',
      concept: 'Revelarea prin tăcere absolută. Descoperirea în vid.'
    },
    'aparatul-de-vizualizare': {
      title: 'Aparatul de Vizualizare',
      description: 'Nu glyphul e vizibil, ci retina ta e calibrată să-l vadă.',
      duration: '~6.5s',
      concept: 'Lentila AI care scanează și detectează simbolul.'
    },
    'fara-glyph': {
      title: 'Fără Glyph',
      description: 'Ce-ar fi dacă logo-ul ar fi absent în toată animația?',
      duration: '~7s',
      concept: 'Sculptarea prin absența aurului. Prezența prin absență.'
    },
    'contaminare': {
      title: 'Contaminare',
      description: 'Glyphul nu apare. Se răspândește ca un virus în imagine.',
      duration: '~6.8s',
      concept: 'Răspândirea virală și inteligentă a simbolului.'
    }
  }

  const config = videoConfigs[type]

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const openModal = () => {
    setShowModal(true)
    setIsPlaying(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setIsPlaying(false)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <>
      {/* Video Thumbnail */}
      <div 
        className={cn(
          "relative w-full h-48 bg-black rounded-lg overflow-hidden cursor-pointer group",
          "border border-gray-800 hover:border-yellow-400/50 transition-all duration-300",
          className
        )}
        onClick={openModal}
      >
        {/* Placeholder for video - in real implementation, this would be a video element */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
              <Play className="w-8 h-8 text-black ml-1" />
            </div>
            <h3 className="text-white font-mono font-bold text-lg mb-2">{config.title}</h3>
            <p className="text-gray-400 text-sm mb-1">{config.duration}</p>
            <p className="text-gray-500 text-xs">{config.concept}</p>
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center">
            <Play className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
            <p className="text-white font-mono text-sm">Play Ritual</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-yellow-400 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Video container */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              {/* Video placeholder - in real implementation, this would be the actual video */}
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                    <Play className="w-12 h-12 text-black ml-1" />
                  </div>
                  <h2 className="text-white font-mono font-bold text-2xl mb-4">{config.title}</h2>
                  <p className="text-gray-300 text-lg mb-2">{config.description}</p>
                  <p className="text-gray-400 text-sm">{config.concept}</p>
                </div>
              </div>

              {/* Controls */}
              {showControls && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={togglePlay}
                        className="text-white hover:text-yellow-400 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-yellow-400 transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                    </div>
                    <button
                      onClick={toggleFullscreen}
                      className="text-white hover:text-yellow-400 transition-colors"
                    >
                      <Maximize className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Video info */}
            <div className="mt-4 text-center">
              <h3 className="text-white font-mono font-bold text-xl mb-2">{config.title}</h3>
              <p className="text-gray-300 text-sm">{config.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Collection component for all ritual videos
export function RitualVideoCollection({ className }: { className?: string }) {
  const videos = [
    'inversul_luminii',
    'lumina_din_tacere', 
    'aparatul_de_vizualizare',
    'fara_glyph',
    'contaminare'
  ] as const

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {videos.map((videoType) => (
        <RitualVideo key={videoType} type={videoType} />
      ))}
    </div>
  )
}
