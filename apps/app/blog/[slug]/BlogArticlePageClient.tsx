"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Clock,
  User,
  Share2,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Download,
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { articleData } from "./articleData"

function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(scrollPercent)
    }

    window.addEventListener("scroll", updateProgress)
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
      <div className="h-full bg-[#CDA434] transition-all duration-150 ease-out" style={{ width: `${progress}%` }} />
    </div>
  )
}

function InlineLeadMagnet() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Inline lead magnet subscribe:", {
      email: email.substring(0, 3) + "***",
      location: "blog-article",
    })
    setIsSubmitted(true)
    // TODO: Add to Supabase subscribers table
  }

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-r from-[#CDA434] to-[#B8954A] rounded-lg p-8 text-center my-12">
        <div className="max-w-md mx-auto">
          <Check className="w-12 h-12 text-black mx-auto mb-4" />
          <h3 className="font-cinzel text-xl font-bold text-black mb-2">Check Your Email!</h3>
          <p className="text-black/80">Your free ebook "ChatGPT Knows Your Future" is on its way.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-[#CDA434] to-[#B8954A] rounded-lg p-8 text-center my-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <Download className="w-8 h-8 text-black mr-3" />
          <h3 className="font-cinzel text-2xl font-bold text-black">Get the Complete Playbook</h3>
        </div>
        <p className="text-black/80 text-lg mb-6">
          Download "ChatGPT Knows Your Future" - Free ebook with advanced meta-prompts and automation strategies.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white border-0 text-black placeholder-gray-600 flex-1 focus:ring-2 focus:ring-black"
          />
          <Button type="submit" className="bg-black text-white hover:bg-gray-800 whitespace-nowrap px-6">
            Download Free Ebook
          </Button>
        </form>
        <p className="text-black/60 text-sm mt-3">Join 10,000+ AI practitioners. Unsubscribe anytime.</p>
      </div>
    </div>
  )
}

function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = (platform: string) => {
    console.log("[v0] Article shared:", { platform, title, url })
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    handleShare("clipboard")
  }

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          window.open(shareUrls.twitter, "_blank")
          handleShare("twitter")
        }}
        className="border-gray-600 text-gray-300 hover:border-[#CDA434] hover:text-[#CDA434] bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
      >
        <Twitter className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          window.open(shareUrls.facebook, "_blank")
          handleShare("facebook")
        }}
        className="border-gray-600 text-gray-300 hover:border-[#CDA434] hover:text-[#CDA434] bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
      >
        <Facebook className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          window.open(shareUrls.linkedin, "_blank")
          handleShare("linkedin")
        }}
        className="border-gray-600 text-gray-300 hover:border-[#CDA434] hover:text-[#CDA434] bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
      >
        <Linkedin className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="border-gray-600 text-gray-300 hover:border-[#CDA434] hover:text-[#CDA434] bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  )
}

function ArticleStructuredData({ article, slug }: { article: any; slug: string }) {
  const baseUrl = "https://promptforge.com"
  const articleUrl = `${baseUrl}/blog/${slug}`

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: `${baseUrl}${article.coverImage}`,
    author: {
      "@type": "Person",
      name: article.author,
      image: `${baseUrl}${article.authorImage}`,
    },
    publisher: {
      "@type": "Organization",
      name: "PromptForge",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: article.publishDate,
    dateModified: article.publishDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    url: articleUrl,
    wordCount: article.content.replace(/<[^>]*>/g, "").split(" ").length,
    timeRequired: `PT${article.readTime.replace(" min", "M")}`,
    articleSection: article.domain,
    keywords: article.vectors.join(", "),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}

function BreadcrumbStructuredData({ article }: { article: any }) {
  const baseUrl = "https://promptforge.com"

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Forge Chronicles",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${baseUrl}/blog/${article.slug}`,
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
}

export function BlogArticlePageClient({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [activeSection, setActiveSection] = useState("")
  const [showLeadMagnet, setShowLeadMagnet] = useState(false)

  const article = articleData[slug as keyof typeof articleData]
  const currentUrl = typeof window !== "undefined" ? window.location.href : ""

  useEffect(() => {
    const handleScroll = () => {
      const sections = article?.tableOfContents || []
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) {
        setActiveSection(currentSection.id)
      }

      const firstH2 = document.querySelector("#domain-dimension")
      if (firstH2) {
        const rect = firstH2.getBoundingClientRect()
        if (rect.top < window.innerHeight && !showLeadMagnet) {
          setShowLeadMagnet(true)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [article, showLeadMagnet])

  useEffect(() => {
    if (article) {
      console.log("[v0] Article viewed:", {
        slug: params.slug,
        title: article.title,
        author: article.author,
        readTime: article.readTime,
        category: article.domain,
        vectors: article.vectors,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      })

      // Track reading progress milestones
      const trackReadingProgress = () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

        if (scrollPercent > 25 && !sessionStorage.getItem(`read-25-${params.slug}`)) {
          console.log("[v0] Reading progress:", { slug: params.slug, progress: "25%" })
          sessionStorage.setItem(`read-25-${params.slug}`, "true")
        }
        if (scrollPercent > 50 && !sessionStorage.getItem(`read-50-${params.slug}`)) {
          console.log("[v0] Reading progress:", { slug: params.slug, progress: "50%" })
          sessionStorage.setItem(`read-50-${params.slug}`, "true")
        }
        if (scrollPercent > 75 && !sessionStorage.getItem(`read-75-${params.slug}`)) {
          console.log("[v0] Reading progress:", { slug: params.slug, progress: "75%" })
          sessionStorage.setItem(`read-75-${params.slug}`, "true")
        }
        if (scrollPercent > 90 && !sessionStorage.getItem(`read-complete-${params.slug}`)) {
          console.log("[v0] Reading progress:", { slug: params.slug, progress: "complete" })
          sessionStorage.setItem(`read-complete-${params.slug}`, "true")
        }
      }

      window.addEventListener("scroll", trackReadingProgress)
      return () => window.removeEventListener("scroll", trackReadingProgress)
    }
  }, [article, params.slug])

  if (!article) {
    notFound()
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <>
      <ArticleStructuredData article={article} slug={slug} />
      <BreadcrumbStructuredData article={article} />

      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <ReadingProgress />

        {/* Breadcrumb */}
        <div className="border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-gray-400">
              <Link
                href="/"
                className="hover:text-[#CDA434] transition-colors focus:ring-2 focus:ring-[#00FF7F] rounded"
              >
                Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <Link
                href="/blog"
                className="hover:text-[#CDA434] transition-colors focus:ring-2 focus:ring-[#00FF7F] rounded"
              >
                Forge Chronicles
              </Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-300">Article</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-400 hover:text-[#CDA434] transition-colors mb-8 focus:ring-2 focus:ring-[#00FF7F] rounded"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chronicles
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-6">
              <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {article.title}
              </h1>
              <p className="font-space-grotesk text-xl text-gray-300 mb-6">{article.subtitle}</p>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Image
                  src={article.authorImage || "/placeholder.svg"}
                  alt={`${article.author} profile picture`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-white font-medium">{article.author}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Badge variant="outline" className="border-[#CDA434] text-[#CDA434]">
                  {article.domain}
                </Badge>
                {article.vectors.map((vector) => (
                  <Badge key={vector} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                    {vector}
                  </Badge>
                ))}
                <ShareButtons title={article.title} url={currentUrl} />
              </div>
            </div>

            {/* Cover Image */}
            <div className="aspect-video relative overflow-hidden rounded-lg mb-8">
              <Image
                src={article.coverImage || "/placeholder.svg"}
                alt={`Cover image for ${article.title}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>

            {/* TL;DR */}
            <Card className="bg-[#1a1a1a] border-l-4 border-l-[#CDA434] border-gray-700 mb-8">
              <CardContent className="p-6">
                <h3 className="font-cinzel font-bold text-[#CDA434] mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  TL;DR
                </h3>
                <p className="font-space-grotesk text-gray-300 leading-relaxed">{article.tldr}</p>
              </CardContent>
            </Card>

            {/* Table of Contents - Sticky on Desktop */}
            <div className="lg:hidden mb-8">
              <Card className="bg-[#1a1a1a] border-gray-700">
                <CardContent className="p-6">
                  <h3 className="font-cinzel font-bold text-white mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {article.tableOfContents.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`block w-full text-left px-3 py-2 rounded transition-colors focus:ring-2 focus:ring-[#00FF7F] ${
                          activeSection === item.id
                            ? "bg-[#CDA434] text-black font-medium"
                            : "text-gray-300 hover:text-[#CDA434] hover:bg-gray-800"
                        }`}
                      >
                        {index + 1}. {item.title}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </header>

          {/* Main Content Layout */}
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Article Content */}
            <article className="lg:col-span-3">
              <div className="prose prose-invert prose-lg max-w-none font-space-grotesk">
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                  style={{
                    lineHeight: "1.6",
                  }}
                />

                {showLeadMagnet && <InlineLeadMagnet />}
              </div>
            </article>

            {/* Sticky TOC - Desktop Only */}
            <aside className="hidden lg:block">
              <div className="sticky top-8">
                <Card className="bg-[#1a1a1a] border-gray-700">
                  <CardContent className="p-6">
                    <h3 className="font-cinzel font-bold text-white mb-4">Table of Contents</h3>
                    <nav className="space-y-2">
                      {article.tableOfContents.map((item, index) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`block w-full text-left px-3 py-2 rounded transition-colors text-sm focus:ring-2 focus:ring-[#00FF7F] ${
                            activeSection === item.id
                              ? "bg-[#CDA434] text-black font-medium"
                              : "text-gray-300 hover:text-[#CDA434] hover:bg-gray-800"
                          }`}
                        >
                          {index + 1}. {item.title}
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>

          {/* Author Box */}
          <Card className="bg-[#1a1a1a] border-gray-700 mt-16 mb-12">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <Image
                  src={article.authorImage || "/placeholder.svg"}
                  alt={article.author}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-cinzel text-xl font-bold text-white mb-2">About {article.author}</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">{article.authorBio}</p>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:border-[#CDA434] hover:text-[#CDA434] bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:border-[#CDA434] hover:text-[#CDA434] bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Follow
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card className="bg-[#1a1a1a] border-gray-700 mb-12">
            <CardContent className="p-8">
              <h3 className="font-cinzel text-xl font-bold text-white mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "From Prototype to Production: Scaling Your Prompt Systems",
                    image: "/industrial-factory-automation.png",
                    domain: "Operations",
                    readTime: "12 min",
                  },
                  {
                    title: "Building Audit Trails for AI Compliance",
                    image: "/digital-audit-compliance.png",
                    domain: "Compliance",
                    readTime: "15 min",
                  },
                  {
                    title: "Module Library Best Practices",
                    image: "/organized-tool-library.png",
                    domain: "Architecture",
                    readTime: "6 min",
                  },
                ].map((relatedArticle, index) => (
                  <Link key={index} href="#" className="group">
                    <div className="aspect-video relative overflow-hidden rounded-lg mb-3">
                      <Image
                        src={relatedArticle.image || "/placeholder.svg"}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs mb-2">
                      {relatedArticle.domain}
                    </Badge>
                    <h4 className="font-medium text-white group-hover:text-[#CDA434] transition-colors line-clamp-2 mb-1">
                      {relatedArticle.title}
                    </h4>
                    <p className="text-gray-400 text-sm">{relatedArticle.readTime}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Newsletter CTA */}
          <Card className="bg-gradient-to-r from-[#CDA434] to-[#B8954A] border-0">
            <CardContent className="p-8 text-center">
              <h3 className="font-cinzel text-2xl font-bold text-black mb-2">Get More Industrial AI Insights</h3>
              <p className="text-black/80 mb-6">Join 10,000+ engineers building the future of prompt systems</p>
              <Button className="bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-[#00FF7F]">
                Subscribe to Newsletter <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
