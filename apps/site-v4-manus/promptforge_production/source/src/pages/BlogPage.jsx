import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight,
  Filter,
  TrendingUp,
  BookOpen,
  Star,
  Eye,
  Share2,
  Bookmark,
  ChevronRight,
  Tag,
  Rss,
  Mail
} from 'lucide-react'
import { blogArticles, getFeaturedArticles, getAllCategories, getAllTags } from '../data/blog/articles'

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTag, setSelectedTag] = useState('')

  const categories = ['All', ...getAllCategories()]
  const tags = getAllTags()
  const featuredArticles = getFeaturedArticles()

  // Filter articles based on search and filters
  const filteredArticles = blogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
    const matchesTag = !selectedTag || article.tags.includes(selectedTag)
    
    return matchesSearch && matchesCategory && matchesTag
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-primary">PromptForge Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Insights, strategies, and best practices for industrial-grade prompt engineering and enterprise AI implementation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-outline" size="lg">
                <Rss className="w-4 h-4 mr-2" />
                RSS Feed
              </Button>
              <Button className="btn-outline" size="lg">
                <BookOpen className="w-4 h-4 mr-2" />
                All Articles
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-4">Featured Articles</h2>
                <p className="text-xl text-muted-foreground">
                  Our most popular and impactful content
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <Card key={article.id} className={`card-industrial overflow-hidden ${index === 0 ? 'lg:col-span-2' : ''}`}>
                  <div className={`${index === 0 ? 'lg:flex' : ''}`}>
                    <div className={`${index === 0 ? 'lg:w-1/2' : ''}`}>
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-48 lg:h-64 object-cover"
                      />
                    </div>
                    
                    <div className={`p-6 ${index === 0 ? 'lg:w-1/2 lg:flex lg:flex-col lg:justify-center' : ''}`}>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className="badge-primary">{article.category}</Badge>
                        <Badge variant="outline">Featured</Badge>
                      </div>
                      
                      <h3 className={`font-bold mb-3 ${index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'}`}>
                        <Link 
                          to={`/blog/${article.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {article.title}
                        </Link>
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {article.author.name}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(article.publishedAt)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {article.readTime}
                          </div>
                        </div>
                        
                        <Link to={`/blog/${article.slug}`}>
                          <Button variant="ghost" size="sm" className="text-primary">
                            Read More
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">All Articles</h2>
            <p className="text-xl text-muted-foreground">
              Explore our complete library of prompt engineering insights
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles, topics, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 input-industrial"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Categories:</span>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "btn-primary" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                  setSelectedTag('')
                }}
                className="btn-outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="card-industrial overflow-hidden group hover:scale-105 transition-transform duration-200">
                  <div className="relative">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="badge-primary">{article.category}</Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">
                      <Link 
                        to={`/blog/${article.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {article.author.name}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime}
                        </div>
                      </div>
                      
                      <Link to={`/blog/${article.slug}`}>
                        <Button variant="ghost" size="sm" className="text-primary group-hover:translate-x-1 transition-transform">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        Published {formatDate(article.publishedAt)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get the latest insights on prompt engineering and enterprise AI delivered to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="input-industrial"
            />
            <Button className="btn-primary">
              <Mail className="w-4 h-4 mr-2" />
              Subscribe
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            Join 10,000+ professionals. No spam, unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  )
}

export default BlogPage

