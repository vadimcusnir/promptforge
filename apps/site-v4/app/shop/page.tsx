"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Star, Users, TrendingUp, Package, ShoppingCart } from "lucide-react"
import { marketplacePacks } from "@/lib/marketplace-data"

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  const filteredPacks = marketplacePacks.filter((pack) => {
    const matchesSearch =
      pack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || pack.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedPacks = [...filteredPacks].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "newest":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case "popular":
      default:
        return b.sales - a.sales
    }
  })

  const categories = ["all", "sales", "marketing", "education", "commerce", "operations"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Package className="w-8 h-8 text-emerald-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-white font-mono">Module Shop</h1>
          </div>
          <p className="text-xl text-slate-300 font-mono max-w-3xl mx-auto">
            Industrial-grade prompt packs. Certified KPI. Ready-to-deploy. Transform your operations with proven
            modules.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-3xl font-bold text-emerald-400 font-mono mb-2">50+</div>
            <div className="text-slate-400 font-mono text-sm">Industrial Modules</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-3xl font-bold text-emerald-400 font-mono mb-2">1.2K+</div>
            <div className="text-slate-400 font-mono text-sm">Happy Customers</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-3xl font-bold text-emerald-400 font-mono mb-2">94%</div>
            <div className="text-slate-400 font-mono text-sm">Success Rate</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-3xl font-bold text-emerald-400 font-mono mb-2">&lt;60s</div>
            <div className="text-slate-400 font-mono text-sm">Time to Artifact</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 mb-12 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search module packs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white font-mono"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-600 text-white font-mono">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="font-mono">
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-600 text-white font-mono">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular" className="font-mono">
                  Most Popular
                </SelectItem>
                <SelectItem value="newest" className="font-mono">
                  Newest
                </SelectItem>
                <SelectItem value="price-low" className="font-mono">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high" className="font-mono">
                  Price: High to Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Module Packs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPacks.map((pack) => (
            <Card
              key={pack.id}
              className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300 group"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-3">
                  <Badge
                    variant="outline"
                    className="border-emerald-400/30 text-emerald-400 bg-emerald-400/10 font-mono text-xs"
                  >
                    {pack.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-mono text-slate-300">{pack.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-white font-mono group-hover:text-emerald-400 transition-colors">
                  {pack.name}
                </CardTitle>
                <CardDescription className="text-slate-400 font-mono">{pack.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {pack.modules.slice(0, 4).map((module, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-slate-600 text-slate-300 font-mono text-xs"
                      >
                        {module}
                      </Badge>
                    ))}
                    {pack.modules.length > 4 && (
                      <Badge variant="outline" className="border-slate-600 text-slate-300 font-mono text-xs">
                        +{pack.modules.length - 4} more
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{pack.sales} sales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{pack.successRate}% success</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                    <div className="text-xs text-slate-400 font-mono mb-1">Expected Results:</div>
                    <div className="text-sm text-white font-mono">{pack.expectedResults}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="text-left">
                  <div className="text-2xl font-bold text-white font-mono">${pack.price}</div>
                  <div className="text-xs text-slate-400 font-mono">One-time purchase</div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/shop/${pack.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                    >
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/shop/${pack.id}`}>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedPacks.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white font-mono mb-2">No packs found</h3>
            <p className="text-slate-400 font-mono">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
