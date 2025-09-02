"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  ImageIcon,
  History,
  Save,
  Eye,
  Send,
  Upload,
  Search,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

// Mock data for content management
const mockPosts = [
  {
    id: 1,
    title: "Advanced Prompt Engineering Techniques",
    status: "published",
    author: "Admin User",
    lastModified: "2024-01-15T10:30:00Z",
    publishedAt: "2024-01-15T09:00:00Z",
    type: "blog",
  },
  {
    id: 2,
    title: "API Authentication Guide",
    status: "draft",
    author: "Admin User",
    lastModified: "2024-01-14T16:45:00Z",
    publishedAt: null,
    type: "docs",
  },
  {
    id: 3,
    title: "7D Parameter System Overview",
    status: "scheduled",
    author: "Admin User",
    lastModified: "2024-01-13T14:20:00Z",
    publishedAt: "2024-01-20T10:00:00Z",
    type: "blog",
  },
]

const mockMedia = [
  {
    id: 1,
    name: "hero-image.jpg",
    type: "image/jpeg",
    size: "2.4 MB",
    uploadedAt: "2024-01-15T10:30:00Z",
    altText: "PromptForge dashboard interface",
  },
  {
    id: 2,
    name: "api-diagram.png",
    type: "image/png",
    size: "1.8 MB",
    uploadedAt: "2024-01-14T16:45:00Z",
    altText: "API flow diagram",
  },
]

const mockRevisions = [
  {
    id: 1,
    postId: 1,
    version: "v1.3",
    author: "Admin User",
    createdAt: "2024-01-15T10:30:00Z",
    changes: "Updated code examples and fixed typos",
  },
  {
    id: 2,
    postId: 1,
    version: "v1.2",
    author: "Admin User",
    createdAt: "2024-01-14T14:20:00Z",
    changes: "Added new section on advanced techniques",
  },
]

export default function AdminEditor() {
  const [activeTab, setActiveTab] = useState("blog")
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusBadge = (status: string) => {
    const variants = {
      published: "bg-green-900 text-green-300",
      draft: "bg-gray-700 text-gray-300",
      scheduled: "bg-blue-900 text-blue-300",
      review: "bg-yellow-900 text-yellow-300",
    }
    return variants[status as keyof typeof variants] || variants.draft
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4" />
      case "scheduled":
        return <Clock className="h-4 w-4" />
      case "review":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Edit className="h-4 w-4" />
    }
  }

  const filteredPosts = mockPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#CDA434] mb-2">Content Management</h1>
          <p className="text-gray-400">Create, edit, and manage your blog posts and documentation</p>
        </div>
        <Button className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90 mt-4 sm:mt-0">
          <FileText className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-900 border-gray-800">
          <TabsTrigger value="blog" className="data-[state=active]:bg-[#CDA434] data-[state=active]:text-black">
            <FileText className="h-4 w-4 mr-2" />
            Blog
          </TabsTrigger>
          <TabsTrigger value="docs" className="data-[state=active]:bg-[#CDA434] data-[state=active]:text-black">
            <FileText className="h-4 w-4 mr-2" />
            Docs
          </TabsTrigger>
          <TabsTrigger value="media" className="data-[state=active]:bg-[#CDA434] data-[state=active]:text-black">
            <ImageIcon className="h-4 w-4 mr-2" />
            Media
          </TabsTrigger>
          <TabsTrigger value="revisions" className="data-[state=active]:bg-[#CDA434] data-[state=active]:text-black">
            <History className="h-4 w-4 mr-2" />
            Revisions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blog" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-[#CDA434]">Blog Posts</CardTitle>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPosts
                  .filter((post) => post.type === "blog")
                  .map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-white">{post.title}</h3>
                          <Badge className={getStatusBadge(post.status)}>
                            {getStatusIcon(post.status)}
                            <span className="ml-1 capitalize">{post.status}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>By {post.author}</span>
                          <span>Modified {new Date(post.lastModified).toLocaleDateString()}</span>
                          {post.publishedAt && <span>Published {new Date(post.publishedAt).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#CDA434]">Documentation</CardTitle>
              <CardDescription className="text-gray-400">Manage API documentation and user guides</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPosts
                  .filter((post) => post.type === "docs")
                  .map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-white">{post.title}</h3>
                          <Badge className={getStatusBadge(post.status)}>
                            {getStatusIcon(post.status)}
                            <span className="ml-1 capitalize">{post.status}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>By {post.author}</span>
                          <span>Modified {new Date(post.lastModified).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-[#CDA434]">Media Library</CardTitle>
                <Button className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90 mt-4 sm:mt-0">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </Button>
              </div>
              <CardDescription className="text-gray-400">
                Manage images, documents, and other media files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockMedia.map((media) => (
                  <div key={media.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                    <div className="aspect-video bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-white text-sm truncate">{media.name}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{media.type}</span>
                        <span>{media.size}</span>
                      </div>
                      <p className="text-xs text-gray-400">{media.altText}</p>
                      <div className="flex items-center space-x-2 pt-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400 text-xs">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revisions" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#CDA434]">Content Revisions</CardTitle>
              <CardDescription className="text-gray-400">Track changes and manage content versions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRevisions.map((revision) => (
                  <div
                    key={revision.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-white">{revision.version}</h3>
                        <Badge className="bg-blue-900 text-blue-300">
                          <History className="h-3 w-3 mr-1" />
                          Revision
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-300">{revision.changes}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>By {revision.author}</span>
                          <span>{new Date(revision.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#CDA434]">
                        Restore
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Editor Modal/Panel would go here when editing a post */}
      {isEditing && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434]">Edit Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">
                    Title
                  </Label>
                  <Input id="title" placeholder="Enter post title..." className="bg-gray-800 border-gray-700 mt-1" />
                </div>
                <div>
                  <Label htmlFor="content" className="text-gray-300">
                    Content (MDX)
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Write your content in MDX format..."
                    className="bg-gray-800 border-gray-700 mt-1 min-h-96"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status" className="text-gray-300">
                    Status
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-gray-800 border-gray-700 mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="publishDate" className="text-gray-300">
                    Publish Date
                  </Label>
                  <Input id="publishDate" type="datetime-local" className="bg-gray-800 border-gray-700 mt-1" />
                </div>
                <div className="flex flex-col space-y-2">
                  <Button className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#CDA434] text-[#CDA434] hover:bg-[#CDA434] hover:text-black bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
