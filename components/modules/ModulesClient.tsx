'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Lock, ArrowRight, Info, Clock, Tag, Building, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ModulesClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVector, setSelectedVector] = useState<string | null>(null)

  const vectors = [
    { id: "strategic", name: "Strategic", color: "text-blue-400" },
    { id: "rhetoric", name: "Rhetoric", color: "text-purple-400" },
    { id: "content", name: "Content", color: "text-green-400" },
    { id: "analytics", name: "Analytics", color: "text-orange-400" },
    { id: "branding", name: "Branding", color: "text-pink-400" },
    { id: "crisis", name: "Crisis", color: "text-red-400" },
    { id: "cognitive", name: "Cognitive", color: "text-indigo-400" },
  ]

  return (
    <div className="space-y-8">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900/80 border border-zinc-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Vector Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedVector === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedVector(null)}
          className={selectedVector === null ? "bg-yellow-600 text-black" : "border-zinc-700 text-white hover:bg-zinc-800"}
        >
          All Vectors
        </Button>
        {vectors.map((vector) => (
          <Button
            key={vector.id}
            variant={selectedVector === vector.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedVector(vector.id)}
            className={selectedVector === vector.id ? "bg-yellow-600 text-black" : "border-zinc-700 text-white hover:bg-zinc-800"}
          >
            {vector.name}
          </Button>
        ))}
      </div>

      {/* Interactive Module Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-zinc-900/80 border border-zinc-700 hover:border-yellow-400/50 transition-all group">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-yellow-400">M{(i + 1).toString().padStart(2, '0')}</span>
                <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-500">
                  {vectors[i % vectors.length].name}
                </Badge>
              </div>
              <CardTitle className="font-serif text-lg group-hover:text-yellow-400 transition-colors">
                Sample Module {i + 1}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500 text-white text-xs">
                  beginner
                </Badge>
                <Badge className="bg-gray-600 text-white text-xs">
                  business
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 mb-3">
                Interactive module description with advanced prompt engineering capabilities.
              </CardDescription>
              
              <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  15 min
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  module
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                  prompt
                </Badge>
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                  engineering
                </Badge>
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                  ai
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                  asChild
                >
                  <Link href={`/generator?module=M${(i + 1).toString().padStart(2, '0')}`}>
                    Use Module
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-white hover:bg-zinc-800"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Features Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 font-serif">Advanced Module Features</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-zinc-900/80 border border-zinc-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-yellow-400" />
                Enterprise Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Seamlessly integrate modules into your existing enterprise workflows with our API.
              </p>
              <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                View API Docs
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/80 border border-zinc-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                Quality Assurance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Built-in quality scoring and validation ensures consistent, high-quality outputs.
              </p>
              <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}