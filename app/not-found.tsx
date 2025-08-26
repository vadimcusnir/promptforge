"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Home, Layers } from "lucide-react"

export default function NotFound() {
  const [showRedirect, setShowRedirect] = useState(false)
  const [countdown, setCountdown] = useState(15)

  useEffect(() => {
    // Auto redirect after 15 seconds
    const redirectTimer = setTimeout(() => {
      setShowRedirect(true)
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            window.location.href = "/"
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 15000)

    return () => {
      clearTimeout(redirectTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Glitch Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="animate-pulse">
          <defs>
            <pattern id="glitch" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="2" height="100" fill="#FFD700" opacity="0.1" />
              <rect x="20" width="1" height="100" fill="#FFD700" opacity="0.2" />
              <rect x="50" width="3" height="100" fill="#FFD700" opacity="0.05" />
              <rect x="80" width="1" height="100" fill="#FFD700" opacity="0.15" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#glitch)" />
        </svg>
      </div>

      {/* Pulsar in corner */}
      <div className="absolute top-8 right-8">
        <div className="w-4 h-4 bg-gold-400 rounded-full animate-pulse">
          <div className="absolute inset-0 bg-gold-400 rounded-full animate-ping opacity-75" />
        </div>
      </div>

      {/* Disintegrating Mask */}
      <div className="absolute top-1/4 left-1/4 opacity-20">
        <svg width="200" height="200" className="animate-spin-slow">
          <defs>
            <mask id="disintegrate">
              <rect width="200" height="200" fill="white" />
              <circle cx="50" cy="50" r="5" fill="black" className="animate-pulse" />
              <circle
                cx="150"
                cy="80"
                r="3"
                fill="black"
                className="animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <circle cx="100" cy="150" r="4" fill="black" className="animate-pulse" style={{ animationDelay: "1s" }} />
            </mask>
          </defs>
          <rect width="200" height="200" fill="#FFD700" mask="url(#disintegrate)" opacity="0.3" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-2xl">
          {/* Glitch Title */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold font-montserrat text-white mb-4 relative">
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 text-red-500 animate-pulse"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
                    transform: "translateX(-2px)",
                  }}
                >
                  RITUAL FAILED
                </span>
                <span
                  className="absolute inset-0 text-blue-500 animate-pulse"
                  style={{
                    clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
                    transform: "translateX(2px)",
                    animationDelay: "0.1s",
                  }}
                >
                  RITUAL FAILED
                </span>
                <span className="relative z-10">RITUAL FAILED</span>
              </span>
            </h1>
            <div className="text-2xl md:text-3xl font-bold text-gold-400 mb-2">Page Not Found</div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            The prompt you seek does not exist.
            <br />
            <span className="text-gold-400">But the Forge remains.</span>
          </p>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <Link
              href="/generator"
              className="inline-flex items-center px-8 py-4 bg-gold-400 text-black font-bold text-lg rounded-lg hover:bg-gold-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-gold-400/25"
            >
              <Home className="w-6 h-6 mr-3" />
              Return to Generator
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>

            <div className="block">
              <Link
                href="/modules"
                className="inline-flex items-center px-6 py-3 border-2 border-gold-400 text-gold-400 font-semibold rounded-lg hover:bg-gold-400 hover:text-black transition-all duration-300"
              >
                <Layers className="w-5 h-5 mr-2" />
                Browse Modules
              </Link>
            </div>
          </div>

          {/* Microcopy */}
          <p className="text-gray-500 text-sm italic mb-8">Don't let a broken link halt your evolution.</p>

          {/* Auto Redirect Message */}
          {showRedirect && (
            <div className="bg-gray-900/80 border border-gold-400/30 rounded-lg p-4 animate-fade-in">
              <p className="text-gold-400 text-sm">Redirecting to homepage in {countdown} seconds...</p>
            </div>
          )}
        </div>
      </div>

      {/* Fractured Code Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-gradient-to-t from-gold-400/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-400 animate-pulse" />
        <div className="absolute bottom-2 left-0 right-0 text-xs font-mono text-gold-400/50 text-center animate-pulse">
          {"> SYSTEM.FORGE.REBUILD() // INITIALIZING..."}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
