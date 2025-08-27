"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageCircle, 
  Twitter, 
  Users, 
  TrendingUp, 
  Star,
  Heart,
  Share2,
  ExternalLink,
  Calendar,
  MapPin,
  Clock
} from "lucide-react"

interface CommunityEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: 'webinar' | 'workshop' | 'ama' | 'networking'
  attendees: number
  maxAttendees: number
  isFeatured: boolean
}

interface CommunityPost {
  id: string
  author: string
  authorAvatar: string
  content: string
  platform: 'discord' | 'twitter' | 'linkedin'
  likes: number
  shares: number
  comments: number
  timestamp: string
  isHighlighted: boolean
}

export default function CommunityHub() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [email, setEmail] = useState('')

  const upcomingEvents: CommunityEvent[] = [
    {
      id: '1',
      title: '7D Parameter Engine Deep Dive',
      description: 'Join Sarah Chen for an advanced workshop on mastering all seven dimensions of our parameter engine.',
      date: '2024-01-25',
      time: '14:00 UTC',
      type: 'workshop',
      attendees: 45,
      maxAttendees: 100,
      isFeatured: true
    },
    {
      id: '2',
      title: 'Enterprise AI Compliance Q&A',
      description: 'Dr. Elena Vasquez answers your questions about AI compliance, audit trails, and regulatory requirements.',
      date: '2024-01-28',
      time: '16:00 UTC',
      type: 'ama',
      attendees: 23,
      maxAttendees: 50,
      isFeatured: false
    },
    {
      id: '3',
      title: 'Prompt Engineering ROI Workshop',
      description: 'Learn how to measure and maximize the business impact of your prompt engineering investments.',
      date: '2024-02-01',
      time: '15:00 UTC',
      type: 'webinar',
      attendees: 67,
      maxAttendees: 200,
      isFeatured: false
    }
  ]

  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      author: 'Sarah Chen',
      authorAvatar: '/professional-woman-portrait.png',
      content: 'Just deployed our 7D Parameter Engine in production! The precision and consistency improvements are incredible. Teams are seeing 40% better results with 60% less iteration. 🚀 #PromptEngineering #AI',
      platform: 'twitter',
      likes: 89,
      shares: 23,
      comments: 12,
      timestamp: '2h ago',
      isHighlighted: true
    },
    {
      id: '2',
      author: 'Marcus Rodriguez',
      authorAvatar: '/professional-man-portrait.png',
      content: 'The module library organization patterns we implemented are game-changing for team collaboration. No more duplicate work or version conflicts! 📚 #TeamWork #AIInfrastructure',
      platform: 'discord',
      likes: 45,
      shares: 8,
      comments: 15,
      timestamp: '4h ago',
      isHighlighted: false
    },
    {
      id: '3',
      author: 'Dr. Elena Vasquez',
      authorAvatar: '/professional-woman-scientist.png',
      content: 'Compliance isn\'t just about checking boxes. It\'s about building trust and ensuring your AI systems are accountable. Our audit trail system makes this effortless. 🔒 #AIEthics #Compliance',
      platform: 'linkedin',
      likes: 156,
      shares: 34,
      comments: 28,
      timestamp: '6h ago',
      isHighlighted: true
    }
  ]

  const handleJoinCommunity = async () => {
    if (!email) return

    try {
      // Add to community mailing list
      const response = await fetch('/api/community/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        // Open Discord invite
        window.open('https://discord.gg/promptforge', '_blank')
      }
    } catch (error) {
      console.error('Error joining community:', error)
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'webinar': return '📺'
      case 'workshop': return '🔧'
      case 'ama': return '❓'
      case 'networking': return '🤝'
      default: return '📅'
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'webinar': return 'bg-blue-600/20 text-blue-400 border-blue-600/30'
      case 'workshop': return 'bg-green-600/20 text-green-400 border-green-600/30'
      case 'ama': return 'bg-purple-600/20 text-purple-400 border-purple-600/30'
      case 'networking': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
      default: return 'bg-zinc-600/20 text-zinc-400 border-zinc-600/30'
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Join the PromptForge Community</h1>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          Connect with fellow prompt engineers, share insights, and stay updated on the latest developments in industrial AI.
        </p>
        
        {/* Community Stats */}
        <div className="flex justify-center gap-8 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">2,847</div>
            <div className="text-zinc-400">Community Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">156</div>
            <div className="text-zinc-400">Active Discussions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">89</div>
            <div className="text-zinc-400">Expert Contributors</div>
          </div>
        </div>
      </div>

      {/* Join Community */}
      <Card className="glass-card border-yellow-600/30 mb-12">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Join?</h2>
          <p className="text-zinc-400 mb-6">
            Get instant access to our Discord server, exclusive events, and early access to new features.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Button 
              onClick={handleJoinCommunity}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Join Community
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-zinc-500 mt-4">
            By joining, you agree to our community guidelines and privacy policy.
          </p>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-zinc-900 border-zinc-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-600">Overview</TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-green-600">Events</TabsTrigger>
          <TabsTrigger value="discussions" className="data-[state=active]:bg-blue-600">Discussions</TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-purple-600">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Discord Community */}
            <Card className="glass-card border-blue-600/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                  Discord Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-400">
                  Join our vibrant Discord server with dedicated channels for every aspect of prompt engineering.
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Active Members</span>
                    <span className="text-white font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Online Now</span>
                    <span className="text-green-500 font-semibold">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Channels</span>
                    <span className="text-white font-semibold">24</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Join Discord Server
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Twitter Community */}
            <Card className="glass-card border-sky-600/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Twitter className="w-6 h-6 text-sky-500" />
                  Twitter Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-400">
                  Follow us for daily insights, tips, and updates on prompt engineering and AI development.
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Followers</span>
                    <span className="text-white font-semibold">12.4K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Engagement Rate</span>
                    <span className="text-green-500 font-semibold">4.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Monthly Reach</span>
                    <span className="text-white font-semibold">89.2K</span>
                  </div>
                </div>

                <Button className="w-full bg-sky-600 hover:bg-sky-700">
                  Follow @PromptForge
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2 border-zinc-700">
                    <Calendar className="w-6 h-6 text-yellow-500" />
                    <span>View Events</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 border-zinc-700">
                    <Users className="w-6 h-6 text-blue-500" />
                    <span>Find Mentors</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 border-zinc-700">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    <span>Career Opportunities</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-8">
          <div className="space-y-6">
            {/* Featured Event */}
            {upcomingEvents.filter(e => e.isFeatured).map(event => (
              <Card key={event.id} className="glass-card border-yellow-600/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className={getEventTypeColor(event.type)}>
                        {getEventTypeIcon(event.type)} {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                      <CardTitle className="text-xl text-white mt-2">{event.title}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">{event.date}</div>
                      <div className="text-sm text-zinc-400">{event.time}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400 mb-4">{event.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.attendees}/{event.maxAttendees}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                    </div>
                    
                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                      Register Now
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Other Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.filter(e => !e.isFeatured).map(event => (
                <Card key={event.id} className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getEventTypeColor(event.type)}>
                        {getEventTypeIcon(event.type)} {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                      <div className="text-sm text-zinc-400">{event.date}</div>
                    </div>
                    <CardTitle className="text-lg text-white">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400 text-sm mb-4">{event.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-zinc-400">
                        <Users className="w-4 h-4 inline mr-1" />
                        {event.attendees}/{event.maxAttendees}
                      </div>
                      
                      <Button variant="outline" size="sm" className="border-zinc-700">
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="discussions" className="mt-8">
          <div className="space-y-6">
            {communityPosts.map(post => (
              <Card key={post.id} className={`glass-card ${post.isHighlighted ? 'border-yellow-600/30' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.author}
                      className="w-12 h-12 rounded-full"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">{post.author}</span>
                        <Badge variant="outline" className="border-zinc-600">
                          {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                        </Badge>
                        <span className="text-sm text-zinc-400">{post.timestamp}</span>
                      </div>
                      
                      <p className="text-zinc-300 mb-4">{post.content}</p>
                      
                      <div className="flex items-center gap-6">
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                          <Heart className="w-4 h-4 mr-2" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                          <Share2 className="w-4 h-4 mr-2" />
                          {post.shares}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Community Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-zinc-700">
                    📚 Prompt Engineering Handbook
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-zinc-700">
                    🎥 Video Tutorials Library
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-zinc-700">
                    📊 Case Studies & Examples
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-zinc-700">
                    🔧 Tools & Templates
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Get Involved
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-zinc-700">
                    ✍️ Write Guest Posts
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-zinc-700">
                    🎤 Host Events
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-zinc-700">
                    🤝 Mentor Others
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-zinc-700">
                    💡 Suggest Features
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
