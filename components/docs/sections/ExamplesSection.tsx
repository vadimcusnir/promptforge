"use client";

import { ArrowUp, Code, Zap, FileText, Download } from "lucide-react";

export function ExamplesSection() {
  const examples = [
    {
      title: "Creative Writing - Blog Post",
      description: "Generate a compelling blog post introduction",
      params7D: {
        domain: "Creative",
        scale: "Medium",
        urgency: "Normal",
        complexity: "Moderate",
        resources: "Standard",
        application: "Public",
        output: "Text"
      },
      prompt: `You are a skilled content writer specializing in engaging blog introductions. Create a compelling opening paragraph for a blog post about [TOPIC] that:

1. Hooks the reader within the first sentence
2. Establishes the problem or question being addressed
3. Promises value and insight to the reader
4. Uses vivid, descriptive language
5. Maintains a conversational yet professional tone

The introduction should be 2-3 sentences long and set up the reader for the valuable content that follows.`,
      testScore: 87,
      exportFormats: [".txt", ".md", ".json", ".pdf"]
    },
    {
      title: "Technical Documentation - API Guide",
      description: "Create comprehensive API documentation",
      params7D: {
        domain: "Technical",
        scale: "Large",
        urgency: "High",
        complexity: "Advanced",
        resources: "Enhanced",
        application: "Client",
        output: "Structured"
      },
      prompt: `You are a senior technical writer with expertise in API documentation. Create comprehensive documentation for the [API_NAME] API that includes:

1. **Overview**: Clear description of the API's purpose and capabilities
2. **Authentication**: Step-by-step authentication setup with code examples
3. **Endpoints**: Detailed documentation for each endpoint including:
   - HTTP method and URL
   - Request parameters and body schema
   - Response format and status codes
   - Example requests and responses
4. **Error Handling**: Common error codes and troubleshooting
5. **Rate Limits**: Usage limits and best practices
6. **Code Examples**: Working examples in Python, JavaScript, and cURL

Format the documentation in clear, scannable sections with proper markdown formatting.`,
      testScore: 92,
      exportFormats: [".txt", ".md", ".json", ".pdf", ".zip"]
    },
    {
      title: "Business Strategy - Market Analysis",
      description: "Develop a strategic market analysis framework",
      params7D: {
        domain: "Business",
        scale: "Enterprise",
        urgency: "Critical",
        complexity: "Expert",
        resources: "Premium",
        application: "Internal",
        output: "Structured"
      },
      prompt: `You are a senior business strategist with 15+ years of experience in market analysis and competitive intelligence. Develop a comprehensive market analysis framework for [INDUSTRY/MARKET] that includes:

1. **Market Overview**: Size, growth trends, and key drivers
2. **Competitive Landscape**: Major players, market share, and positioning
3. **Customer Segmentation**: Detailed buyer personas and needs analysis
4. **SWOT Analysis**: Strengths, weaknesses, opportunities, and threats
5. **Market Entry Strategy**: Recommendations for new entrants
6. **Risk Assessment**: Key risks and mitigation strategies
7. **Action Plan**: Specific, actionable next steps with timelines

Provide executive-level insights with supporting data points and strategic recommendations.`,
      testScore: 89,
      exportFormats: [".txt", ".md", ".json", ".pdf", ".zip"]
    }
  ];

  return (
    <section id="examples" className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          <span className="text-[hsl(var(--accent))]">Examples</span> & Use Cases
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          See PromptForge™ v3 in action with real-world examples of 7D configurations, 
          generated prompts, test results, and export bundles
        </p>
      </div>

      {/* Examples Overview */}
      <div className="bg-primary border border-border/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[hsl(var(--accent))] rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-black" />
          </div>
          Learning Through Examples
        </h2>
        
        <div className="space-y-4 text-white/90 leading-relaxed">
          <p>
            The best way to understand PromptForge™ v3 is to see it in action. Below are 
            real examples of how different 7D parameter combinations produce different types 
            of prompts, each optimized for specific use cases and requirements.
          </p>
          
          <p>
            Each example includes the complete 7D configuration, the generated prompt, 
            test results, and available export formats. Study these patterns to master 
            the art of prompt engineering with our system.
          </p>
        </div>
      </div>

      {/* Example Cards */}
      <div className="space-y-8">
        {examples.map((example, index) => (
          <div key={example.title} className="bg-primary border border-border/30 rounded-xl p-8">
            {/* Example Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-[hsl(var(--accent))] rounded-lg flex items-center justify-center text-black font-bold text-lg">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[hsl(var(--accent))] mb-2">{example.title}</h3>
                <p className="text-white/80 text-lg">{example.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[hsl(var(--accent))]">{example.testScore}</div>
                <div className="text-white/60 text-sm">Test Score</div>
              </div>
            </div>

            {/* 7D Parameters */}
            <div className="mb-6">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[hsl(var(--accent))]" />
                7D Parameter Configuration
              </h4>
              <div className="bg-primary border border-border/30 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm font-mono">
                  {Object.entries(example.params7D).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-white/60">{key}:</span>
                      <span className="text-[hsl(var(--accent))] font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Prompt */}
            <div className="mb-6">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[hsl(var(--accent))]" />
                Generated Prompt
              </h4>
              <div className="bg-primary border border-border/30 rounded-lg p-4">
                <pre className="text-white/90 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                  {example.prompt}
                </pre>
              </div>
            </div>

            {/* Export Formats */}
            <div className="mb-6">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Download className="w-4 h-4 text-[hsl(var(--accent))]" />
                Available Export Formats
              </h4>
              <div className="flex flex-wrap gap-2">
                {example.exportFormats.map((format) => (
                  <span key={format} className="px-3 py-1 bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs rounded-full border border-[hsl(var(--accent))]/30 font-medium">
                    {format}
                  </span>
                ))}
              </div>
            </div>

            {/* Analysis */}
            <div className="bg-primary border border-border/30 rounded-lg p-4">
              <h5 className="font-semibold text-white mb-3">Why This Configuration Works</h5>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-white/80">
                <div>
                  <h6 className="font-medium text-[hsl(var(--accent))] mb-2">Parameter Synergy</h6>
                  <p>
                    The combination of {example.params7D.domain} domain with {example.params7D.complexity} complexity 
                    and {example.params7D.resources} resources creates a balanced approach that matches the task requirements.
                  </p>
                </div>
                <div>
                  <h6 className="font-medium text-[hsl(var(--accent))] mb-2">Quality Assurance</h6>
                  <p>
                    With a test score of {example.testScore}, this prompt exceeds the minimum threshold of 80, 
                    ensuring professional-grade quality and effectiveness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Best Practices */}
      <div className="bg-primary border border-border/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Best Practices from Examples</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Parameter Optimization</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                <div>
                  <p className="text-white/90 text-sm font-medium">Start with Domain and Scale</p>
                  <p className="text-white/60 text-xs">These provide the foundation for other parameters</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                <div>
                  <p className="text-white/90 text-sm font-medium">Match Complexity to Resources</p>
                  <p className="text-white/60 text-xs">Ensure your capabilities align with your ambitions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                <div>
                  <p className="text-white/90 text-sm font-medium">Consider Application Context</p>
                  <p className="text-white/60 text-xs">Internal vs. client-facing prompts have different needs</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Prompt Engineering Tips</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                <div>
                  <p className="text-white/90 text-sm font-medium">Be Specific and Clear</p>
                  <p className="text-white/60 text-xs">Vague prompts produce vague results</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                <div>
                  <p className="text-white/90 text-sm font-medium">Include Examples</p>
                  <p className="text-white/60 text-xs">Show the AI what you want, don't just tell it</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                <div>
                  <p className="text-white/90 text-sm font-medium">Test and Iterate</p>
                  <p className="text-white/60 text-xs">Use the test engine to refine your prompts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Example Builder */}
      <div className="bg-primary border border-border/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Try It Yourself</h2>
        
        <div className="text-center space-y-4">
          <p className="text-white/80">
            Ready to create your own prompts? Use the examples above as templates and 
            experiment with different 7D parameter combinations to see how they affect 
            the generated output.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-[hsl(var(--accent))] text-black font-semibold rounded-lg hover:bg-[hsl(var(--accent))]/90 transition-colors duration-200">
              Go to Generator
            </button>
            <button className="px-6 py-3 bg-primary text-white border border-border/30 rounded-lg hover:bg-primary/50 transition-colors duration-200">
              View All Modules
            </button>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <div className="text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--accent))]/20 border border-[hsl(var(--accent))]/40 text-[hsl(var(--accent))] rounded-lg hover:bg-[hsl(var(--accent))]/30 transition-colors duration-200"
        >
          <ArrowUp className="w-4 h-4" />
          Back to Top
        </button>
      </div>
    </section>
  );
}
