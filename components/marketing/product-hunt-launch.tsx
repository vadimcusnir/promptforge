"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, TrendingUp, Target, Star, ArrowRight } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"

interface ProductHuntLaunchProps {
  launchDate: string
  targetUpvotes: number
  currentUpvotes: number
  isLive: boolean
}

export default function ProductHuntLaunch({
  launchDate,
  targetUpvotes,
  currentUpvotes,
  isLive
}: ProductHuntLaunchProps) {
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [progress, setProgress] = useState(0)
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const launch = new Date(launchDate).getTime()
      const difference = launch - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else {
        setTimeLeft("LIVE NOW!")
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [launchDate])

  useEffect(() => {
    setProgress(Math.min((currentUpvotes / targetUpvotes) * 100, 100))
  }, [currentUpvotes, targetUpvotes])

  const handleProductHuntClick = () => {
    trackEvent('product_hunt_click', {
      current_upvotes: currentUpvotes,
      target_upvotes: targetUpvotes,
      progress: progress
    })
    
    // Open Product Hunt in new tab
    window.open('https://www.producthunt.com/posts/promptforge-v3', '_blank')
  }

  const handleShareClick = () => {
    trackEvent('product_hunt_share', {
      platform: 'social',
      current_upvotes: currentUpvotes
    })
    
    // Share to social media
    const text = `🚀 PromptForge v3 just launched on Product Hunt! Industrial-grade prompt engineering with 50 modules and 7D parameters. Check it out!`
    const url = 'https://www.producthunt.com/posts/promptforge-v3'
    
    if (navigator.share) {
      navigator.share({
        title: 'PromptForge v3 on Product Hunt',
        text: text,
        url: url
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${text} ${url}`)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="glass-card border-yellow-600/30 bg-gradient-to-br from-yellow-600/10 to-transparent">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 text-yellow-500" />
            <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
              Product Hunt Launch
            </Badge>
          </div>
          <CardTitle className="text-3xl font-serif text-white">
            {isLive ? "We're Live on Product Hunt!" : "Launching on Product Hunt"}
          </CardTitle>
          <p className="text-zinc-400 mt-2">
            {isLive 
              ? "Help us reach the top by upvoting and sharing!" 
              : "Join us for the biggest prompt engineering launch of 2024"
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Launch Countdown */}
          {!isLive && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-yellow-500" />
                <span className="text-zinc-400">Launch Date:</span>
                <span className="text-white font-semibold">{new Date(launchDate).toLocaleDateString()}</span>
              </div>
              <div className="text-2xl font-bold text-yellow-500">{timeLeft}</div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Progress to Top 5</span>
              <span className="text-white font-semibold">{currentUpvotes} / {targetUpvotes}</span>
            </div>
            <Progress value={progress} className="h-3 bg-zinc-800">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </Progress>
            <div className="text-center text-sm text-zinc-500">
              {progress >= 100 ? "🎉 Target reached!" : `${Math.round(progress)}% complete`}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-yellow-600 hover:bg-yellow-700 text-lg px-8 py-6"
              onClick={handleProductHuntClick}
            >
              {isLive ? "Upvote on Product Hunt" : "Set Reminder"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            {isLive && (
              <Button 
                size="lg" 
                variant="outline" 
                className="border-zinc-700 text-lg px-8 py-6 bg-transparent"
                onClick={handleShareClick}
              >
                Share & Support
              </Button>
            )}
          </div>

          {/* Launch Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-zinc-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{currentUpvotes}</div>
              <div className="text-sm text-zinc-500">Upvotes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">50</div>
              <div className="text-sm text-zinc-500">Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">7D</div>
              <div className="text-sm text-zinc-500">Parameters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{"<"}60s</div>
              <div className="text-sm text-zinc-500">Export Time</div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center pt-4">
            <p className="text-zinc-500 text-sm mb-2">Join our launch community</p>
            <div className="flex justify-center gap-4">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Discord
              </Button>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                <Users className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                <Target className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
