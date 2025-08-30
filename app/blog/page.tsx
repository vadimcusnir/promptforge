"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, User, ArrowRight, BookOpen } from "lucide-react";

// Mock data for demonstration
const mockArticles = [
  {
    id: 1,
    title: "How the 7D Engine Revolutionizes Prompt Engineering",
    excerpt: "Discover how our proprietary 7D methodology transforms complex prompt creation into a systematic, repeatable process that guarantees quality and consistency.",
    coverImage: "/blog/7d-engine-cover.jpg",
    domain: "AI Engineering",
    vectors: ["Clarity", "Execution", "Business Fit"],
    author: "Alex Chen",
    readTime: "8 min",
    publishDate: "2024-08-25",
    slug: "7d-engine-revolutionizes-prompt-engineering"
  },
  {
    id: 2,
    title: "The SKRE Design System: Dark Industrial Aesthetics in Web Design",
    excerpt: "Explore how our 70/20/10 color palette creates a premium, industrial feel that enhances user experience while maintaining perfect readability.",
    coverImage: "/blog/skre-design-system.jpg",
    domain: "Design",
    vectors: ["Visual", "User Experience", "Branding"],
    author: "Maria Rodriguez",
    readTime: "6 min",
    publishDate: "2024-08-24",
    slug: "skre-design-system-dark-industrial-aesthetics"
  },
  {
    id: 3,
    title: "Module M25: Advanced Content Strategy for Enterprise",
    excerpt: "Deep dive into our most sophisticated content strategy module, designed for enterprise teams requiring scalable, measurable content operations.",
    coverImage: "/blog/module-m25-content-strategy.jpg",
    domain: "Content Strategy",
    vectors: ["Strategy", "Execution", "Measurement"],
    author: "David Kim",
    readTime: "12 min",
    publishDate: "2024-08-23",
    slug: "module-m25-advanced-content-strategy"
  },
  {
    id: 4,
    title: "Entitlement Gating: Building Premium User Experiences",
    excerpt: "Learn how we implement sophisticated gating mechanisms that provide value at every tier while encouraging upgrades through strategic feature reveals.",
    coverImage: "/blog/entitlement-gating.jpg",
    domain: "Product Design",
    vectors: ["User Experience", "Business Model", "Conversion"],
    author: "Sarah Johnson",
    readTime: "7 min",
    publishDate: "2024-08-22",
    slug: "entitlement-gating-premium-user-experiences"
  },
  {
    id: 5,
    title: "Test Engine Deep Dive: From Simulation to Live GPT Testing",
    excerpt: "Understanding the four quantifiable rubrics that ensure every prompt meets our ≥80 quality threshold before reaching production.",
    coverImage: "/blog/test-engine-deep-dive.jpg",
    domain: "Quality Assurance",
    vectors: ["Testing", "Quality", "Validation"],
    author: "Michael Chen",
    readTime: "10 min",
    publishDate: "2024-08-21",
    slug: "test-engine-deep-dive-simulation-live-gpt"
  },
  {
    id: 6,
    title: "Export Pipeline: From txt to Enterprise Bundle",
    excerpt: "Comprehensive guide to our multi-format export system, including manifest generation, checksum validation, and enterprise bundle creation.",
    coverImage: "/blog/export-pipeline-guide.jpg",
    domain: "Technical",
    vectors: ["Export", "Integration", "Enterprise"],
    author: "Lisa Wang",
    readTime: "9 min",
    publishDate: "2024-08-20",
    slug: "export-pipeline-txt-enterprise-bundle"
  }
];

const recommendedArticles = [
  mockArticles[0],
  mockArticles[2],
  mockArticles[4]
];

const domains = ["All", "AI Engineering", "Design", "Content Strategy", "Product Design", "Quality Assurance", "Technical"];
const vectors = ["All", "Clarity", "Execution", "Business Fit", "Visual", "User Experience", "Strategy", "Measurement", "Testing", "Quality", "Export", "Integration"];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedVector, setSelectedVector] = useState("All");

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === "All" || article.domain === selectedDomain;
    const matchesVector = selectedVector === "All" || article.vectors.includes(selectedVector);
    
    return matchesSearch && matchesDomain && matchesVector;
  });

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-sans">
              Blog <span className="text-[hsl(var(--accent))]">PromptForge™</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Insights, strategies, and deep dives into AI prompt engineering, 
              design systems, and enterprise-grade workflows
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <BookOpen className="w-4 h-4" />
              <span>50+ Articles</span>
              <span>•</span>
              <span>Expert Contributors</span>
              <span>•</span>
              <span>Weekly Updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filtering and Search */}
      <section className="py-8 bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md text-sm"
              >
                {domains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
              <select
                value={selectedVector}
                onChange={(e) => setSelectedVector(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md text-sm"
              >
                {vectors.map(vector => (
                  <option key={vector} value={vector}>{vector}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Articles Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="bg-gray-900 border-gray-800 hover:border-[hsl(var(--accent))] transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(var(--accent))]/10">
                    <div className="aspect-video bg-gray-800 rounded-t-lg mb-4 flex items-center justify-center">
                      <div className="text-gray-400 text-sm">Cover Image</div>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-gray-800 text-[hsl(var(--accent))] border-gray-700">
                          {article.domain}
                        </Badge>
                        {article.vectors.slice(0, 2).map((vector, index) => (
                          <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                            {vector}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-xl text-white hover:text-[hsl(var(--accent))] transition-colors cursor-pointer">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-gray-300 mb-4 line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {article.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[hsl(var(--accent))] hover:text-foreground hover:bg-[hsl(var(--accent))]/10"
                        >
                          Read More <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">No articles found</div>
                  <div className="text-gray-500">Try adjusting your search or filters</div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Recommended Articles */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Recommended</h3>
                <div className="space-y-4">
                  {recommendedArticles.map((article) => (
                    <div key={article.id} className="group cursor-pointer">
                      <div className="text-sm text-gray-400 mb-1">{article.domain}</div>
                      <div className="text-white group-hover:text-[hsl(var(--accent))] transition-colors font-medium">
                        {article.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{article.readTime}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="bg-gradient-to-r from-[hsl(var(--accent))] to-[#e6c200] rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-black mb-2">Stay Updated</h3>
                <p className="text-black/80 text-sm mb-4">
                  Get the latest insights on AI prompt engineering
                </p>
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Subscribe to Newsletter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your AI Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the power of 50+ operational modules and the 7D engine
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[hsl(var(--accent))] text-black hover:bg-primary">
              Try Generator Free
            </Button>
            <Button size="lg" variant="outline" className="border-[hsl(var(--accent))] text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] hover:text-black">
              View Modules
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
