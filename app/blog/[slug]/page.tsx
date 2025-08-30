"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Clock, 
  User, 
  Calendar, 
  ArrowLeft, 
  Share2, 
  ExternalLink,
  ChevronRight,
  Check
} from "lucide-react";
import Link from "next/link";

// Mock article data - in real app this would come from CMS/API
const mockArticle = {
  slug: "7d-engine-revolutionizes-prompt-engineering",
  title: "How the 7D Engine Revolutionizes Prompt Engineering",
  subtitle: "Discover how our proprietary 7D methodology transforms complex prompt creation into a systematic, repeatable process that guarantees quality and consistency.",
  excerpt: "The 7D Engine represents a paradigm shift in prompt engineering, moving from ad-hoc creation to systematic, measurable generation. This article explores how each dimension contributes to prompt quality and how the system ensures consistency across all outputs.",
  coverImage: "/blog/7d-engine-cover.jpg",
  domain: "AI Engineering",
  vectors: ["Clarity", "Execution", "Business Fit", "Measurement"],
  author: {
    name: "Alex Chen",
    avatar: "/authors/alex-chen.jpg",
    bio: "Lead AI Engineer at PromptForge with 8+ years in machine learning and prompt optimization. Specializes in enterprise-scale AI workflows and quality assurance systems.",
    social: {
      twitter: "https://twitter.com/alexchen_ai",
      linkedin: "https://linkedin.com/in/alexchen-ai",
      github: "https://github.com/alexchen-ai"
    }
  },
  publishDate: "2024-08-25",
  readTime: "8 min",
  content: `
## TL;DR

The 7D Engine transforms prompt engineering from an art to a science by implementing seven quantifiable dimensions: Clarity, Context, Constraints, Creativity, Consistency, Completeness, and Compliance. This systematic approach reduces prompt creation time from 4 hours to 30 minutes while ensuring quality scores ≥80 and export-ready outputs.

## Table of Contents

- [The Problem with Traditional Prompt Engineering](#the-problem)
- [Introducing the 7D Framework](#7d-framework)
- [Dimension 1: Clarity](#clarity)
- [Dimension 2: Context](#context)
- [Dimension 3: Constraints](#constraints)
- [Dimension 4: Creativity](#creativity)
- [Dimension 5: Consistency](#consistency)
- [Dimension 6: Completeness](#completeness)
- [Dimension 7: Compliance](#compliance)
- [Implementation in PromptForge](#implementation)
- [Results and Metrics](#results)
- [Conclusion](#conclusion)

## The Problem with Traditional Prompt Engineering

Traditional prompt engineering relies heavily on intuition and trial-and-error. Engineers spend hours crafting prompts, testing them manually, and iterating based on subjective feedback. This approach has several critical flaws:

- **Inconsistent Quality**: Without standardized criteria, prompt quality varies dramatically
- **Time Inefficiency**: 4+ hours per prompt is unsustainable for enterprise teams
- **Lack of Measurability**: No objective way to assess prompt effectiveness
- **Scalability Issues**: Manual processes don't scale with team growth

## Introducing the 7D Framework

The 7D Engine addresses these challenges through a systematic, quantifiable approach. Each dimension represents a measurable aspect of prompt quality, allowing engineers to optimize systematically rather than intuitively.

### How It Works

1. **Input Analysis**: The system analyzes the initial prompt against all 7 dimensions
2. **Gap Identification**: Identifies which dimensions need improvement
3. **Automated Enhancement**: Applies optimization algorithms to strengthen weak areas
4. **Quality Validation**: Ensures the final prompt meets all quality thresholds
5. **Export Preparation**: Formats the prompt for immediate use

## Dimension 1: Clarity

Clarity measures how easily the AI understands the intended output. High clarity prompts produce consistent, accurate results.

**Key Metrics:**
- Ambiguity score (target: <10%)
- Instruction specificity (target: >90%)
- Output format clarity (target: 100%)

**Example Improvement:**

\`\`\`
Before: "Write a marketing email"
After: "Write a marketing email for a SaaS product launch, targeting CTOs, with a professional tone, 150-200 words, including a clear CTA button"
\`\`\`

## Dimension 2: Context

Context ensures the AI has sufficient background information to generate relevant outputs.

**Key Metrics:**
- Context completeness (target: >85%)
- Relevance score (target: >90%)
- Background depth (target: appropriate to task)

**Implementation:**
The system automatically analyzes the prompt and suggests additional context elements:
- Industry-specific terminology
- Target audience details
- Historical performance data
- Competitive landscape

## Dimension 3: Constraints

Constraints define the boundaries and limitations of the AI's output.

**Key Metrics:**
- Constraint specificity (target: >95%)
- Boundary clarity (target: 100%)
- Compliance verification (target: 100%)

**Types of Constraints:**
- **Length**: Word count, character limits
- **Style**: Tone, voice, formatting
- **Content**: Topics to avoid, required elements
- **Technical**: API limitations, output formats

## Dimension 4: Creativity

Creativity balances innovation with consistency, ensuring outputs are both original and aligned with brand guidelines.

**Key Metrics:**
- Innovation score (target: 70-85%)
- Brand alignment (target: >95%)
- Uniqueness factor (target: >60%)

**Creativity Enhancement:**
The system suggests creative elements while maintaining brand consistency:
- Alternative phrasing approaches
- Metaphor and analogy suggestions
- Storytelling frameworks
- Visual language integration

## Dimension 5: Consistency

Consistency ensures that similar prompts produce similar quality outputs across different contexts.

**Key Metrics:**
- Output variance (target: <15%)
- Quality stability (target: >90%)
- Brand voice consistency (target: >95%)

**Consistency Mechanisms:**
- Template standardization
- Quality checkpoints
- Automated validation
- Performance tracking

## Dimension 6: Completeness

Completeness ensures that all necessary elements are included for successful execution.

**Key Metrics:**
- Requirement coverage (target: 100%)
- Dependency identification (target: 100%)
- Success criteria clarity (target: 100%)

**Completeness Checklist:**
- [ ] Clear objective statement
- [ ] Required inputs specified
- [ ] Output format defined
- [ ] Success metrics included
- [ ] Error handling specified
- [ ] Fallback options provided

## Dimension 7: Compliance

Compliance ensures that prompts adhere to legal, ethical, and organizational standards.

**Key Metrics:**
- Legal compliance (target: 100%)
- Ethical alignment (target: 100%)
- Policy adherence (target: 100%)

**Compliance Areas:**
- Data privacy regulations
- Industry standards
- Company policies
- Ethical AI guidelines

## Implementation in PromptForge

The 7D Engine is fully integrated into PromptForge's workflow:

### 1. **Module Integration**
Each of the 50 operational modules automatically applies the 7D framework:
- M01-M10: Basic 7D implementation
- M11-M25: Advanced 7D with industry-specific optimizations
- M26-M40: Enterprise 7D with compliance automation
- M41-M50: Custom 7D configurations

### 2. **Real-time Optimization**
The system continuously optimizes prompts as you type:
- Live quality scoring
- Instant improvement suggestions
- Automated enhancement options
- Performance predictions

### 3. **Quality Gates**
Every prompt must pass quality thresholds before export:
- Minimum score: 80/100
- All 7 dimensions must meet minimum standards
- Automated quality validation
- Manual override options for edge cases

## Results and Metrics

Since implementing the 7D Engine, PromptForge has achieved remarkable results:

### **Efficiency Improvements**
- **Time Reduction**: 85% faster prompt creation (4h → 30m)
- **Quality Increase**: 40% improvement in output consistency
- **Error Reduction**: 75% fewer prompt failures
- **Scalability**: 10x increase in team productivity

### **Quality Metrics**
- **Average Score**: 87/100 (vs. industry average of 62)
- **Consistency**: 94% output stability
- **Compliance**: 100% regulatory adherence
- **User Satisfaction**: 96% positive feedback

### **Enterprise Impact**
- **Cost Savings**: $50K+ annually per team
- **Time to Market**: 60% faster deployment
- **Risk Reduction**: 80% fewer compliance issues
- **Team Growth**: 3x faster onboarding

## Conclusion

The 7D Engine represents the future of prompt engineering—a systematic, measurable, and scalable approach that transforms intuition into science. By implementing this framework, organizations can achieve:

- **Predictable Quality**: Every prompt meets established standards
- **Operational Efficiency**: Dramatic time and cost savings
- **Scalable Growth**: Consistent results across teams and projects
- **Competitive Advantage**: Superior AI outputs that drive business value

The transition from traditional prompt engineering to the 7D methodology isn't just an improvement—it's a fundamental shift that positions organizations for success in the AI-first economy.

Ready to experience the 7D Engine? [Start your free trial](/generator) and see the transformation in action.
  `,
  relatedPosts: [
    {
      title: "Module M25: Advanced Content Strategy for Enterprise",
      excerpt: "Deep dive into our most sophisticated content strategy module...",
      slug: "module-m25-advanced-content-strategy",
      domain: "Content Strategy",
      readTime: "12 min"
    },
    {
      title: "Test Engine Deep Dive: From Simulation to Live GPT Testing",
      excerpt: "Understanding the four quantifiable rubrics...",
      slug: "test-engine-deep-dive-simulation-live-gpt",
      domain: "Quality Assurance",
      readTime: "10 min"
    },
    {
      title: "Export Pipeline: From txt to Enterprise Bundle",
      excerpt: "Comprehensive guide to our multi-format export system...",
      slug: "export-pipeline-txt-enterprise-bundle",
      domain: "Technical",
      readTime: "9 min"
    }
  ]
};

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // In Next.js 15, params is a Promise
  const { slug } = await params;

  // In real app, fetch article data based on slug
  // For now, we'll use mock data, but in production this would be:
  // const article = await fetchArticleBySlug(slug);
  const article = mockArticle;
  
  // Log the slug for debugging (will be used in production)
  console.log('Blog article requested for slug:', slug);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Extract headings for Table of Contents
  const headings = article.content
    .split('\n')
    .filter(line => line.startsWith('## '))
    .map(line => {
      const text = line.replace('## ', '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { text, id };
    });

  return (
    <main className="min-h-screen bg-black">
      {/* Breadcrumb Navigation */}
      <section className="py-6 bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{article.title}</span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back to Blog Button */}
            <Link href="/blog">
              <Button variant="ghost" className="text-[hsl(var(--accent))] hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            {/* Article Meta */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-gray-800 text-[hsl(var(--accent))] border-gray-700">
                  {article.domain}
                </Badge>
                {article.vectors.map((vector, index) => (
                  <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                    {vector}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Title and Subtitle */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-sans leading-tight">
              {article.title}
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {article.subtitle}
            </p>

            {/* Author and Meta Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="text-white font-medium">{article.author.name}</div>
                  <div className="text-gray-400 text-sm">Lead AI Engineer</div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {article.readTime}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyLink}
                  className="text-gray-400 hover:text-[hsl(var(--accent))]"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Cover Image Placeholder */}
            <div className="aspect-video bg-gray-800 rounded-lg mb-8 flex items-center justify-center">
              <div className="text-gray-400 text-lg">Article Cover Image</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-3">
              <article className="prose prose-invert prose-lg max-w-none">
                {/* TL;DR Section */}
                <div className="bg-gray-900 border-l-4 border-[hsl(var(--accent))] p-6 mb-8 rounded-r-lg">
                  <h3 className="text-[hsl(var(--accent))] font-semibold mb-2">TL;DR</h3>
                  <p className="text-gray-300 leading-relaxed">{article.excerpt}</p>
                </div>

                {/* Table of Contents */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
                  <h3 className="text-white font-semibold mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {headings.map((heading, index) => (
                      <button
                        key={index}
                        onClick={() => handleSectionClick(heading.id)}
                        className={`block text-left w-full p-2 rounded transition-colors ${
                          activeSection === heading.id
                            ? 'bg-[hsl(var(--accent))] text-black'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        {heading.text}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Article Body */}
                <div className="text-gray-300 leading-relaxed space-y-6">
                  {article.content.split('\n').map((line, index) => {
                    if (line.startsWith('## ')) {
                      const text = line.replace('## ', '');
                      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      return (
                        <h2 key={index} id={id} className="text-2xl font-bold text-white mt-12 mb-6 pt-8 border-t border-gray-800">
                          {text}
                        </h2>
                      );
                    } else if (line.startsWith('### ')) {
                      const text = line.replace('### ', '');
                      return (
                        <h3 key={index} className="text-xl font-semibold text-white mt-8 mb-4">
                          {text}
                        </h3>
                      );
                    } else if (line.startsWith('- ')) {
                      const text = line.replace('- ', '');
                      return (
                        <li key={index} className="text-gray-300 ml-6">
                          {text}
                        </li>
                      );
                    } else if (line.startsWith('**')) {
                      const text = line.replace(/\*\*/g, '');
                      return (
                        <p key={index} className="font-semibold text-white">
                          {text}
                        </p>
                      );
                    } else if (line.trim() === '') {
                      return <div key={index} className="h-4"></div>;
                    } else if (line.trim()) {
                      return (
                        <p key={index} className="text-gray-300 leading-relaxed">
                          {line}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-[hsl(var(--accent))] to-[#e6c200] rounded-lg p-8 mt-12 text-center">
                  <h3 className="text-2xl font-bold text-black mb-4">
                    Ready to Experience the 7D Engine?
                  </h3>
                  <p className="text-black/80 mb-6">
                    Start creating enterprise-grade prompts in minutes, not hours
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                      Try Generator Free
                    </Button>
                    <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                      View All Modules
                    </Button>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Author Box */}
              <Card className="bg-gray-900 border-gray-800 mb-8">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-white">About the Author</h3>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="text-white font-medium">{article.author.name}</div>
                    <div className="text-gray-400 text-sm">{article.author.bio}</div>
                  </div>
                  <div className="flex justify-center space-x-3">
                    <a href={article.author.social.twitter} className="text-gray-400 hover:text-[hsl(var(--accent))] transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a href={article.author.social.linkedin} className="text-gray-400 hover:text-[hsl(var(--accent))] transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a href={article.author.social.github} className="text-gray-400 hover:text-[hsl(var(--accent))] transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Related Posts */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-white">Related Posts</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {article.relatedPosts.map((post, index) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="text-sm text-gray-400 mb-1">{post.domain}</div>
                        <div className="text-white group-hover:text-[hsl(var(--accent))] transition-colors font-medium text-sm">
                          {post.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{post.readTime}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
