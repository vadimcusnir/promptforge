"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SevenDConfig } from "@/types/promptforge";

interface SevenDOption {
  value: string;
  label: string;
  description: string;
}

interface SevenDOptionsMap {
  domain: SevenDOption[];
  scale: SevenDOption[];
  urgency: SevenDOption[];
  complexity: SevenDOption[];
  resources: SevenDOption[];
  application: SevenDOption[];
  output_format: SevenDOption[];
}

const SEVEN_D_OPTIONS: SevenDOptionsMap = {
  domain: [
    { value: "saas", label: "SaaS", description: "Software-as-a-Service applications and platforms" },
    { value: "ecommerce", label: "E-commerce", description: "Online retail and marketplace solutions" },
    { value: "fintech", label: "FinTech", description: "Financial technology and digital banking" },
    { value: "healthtech", label: "HealthTech", description: "Healthcare technology and digital health" },
    { value: "edtech", label: "EdTech", description: "Educational technology and learning platforms" },
    { value: "ai", label: "AI/ML", description: "Artificial intelligence and machine learning" },
    { value: "enterprise", label: "Enterprise", description: "Large-scale business solutions" },
    { value: "startup", label: "Startup", description: "Early-stage company solutions" },
    { value: "nonprofit", label: "Non-profit", description: "Social impact and charitable organizations" },
    { value: "government", label: "Government", description: "Public sector and civic technology" },
  ],
  scale: [
    { value: "startup", label: "Startup", description: "Small team, limited resources, rapid iteration" },
    { value: "scaleup", label: "Scale-up", description: "Growing team, increasing resources, market expansion" },
    { value: "midsize", label: "Mid-size", description: "Established team, stable resources, market presence" },
    { value: "enterprise", label: "Enterprise", description: "Large team, abundant resources, market leadership" },
    { value: "global", label: "Global", description: "Multi-national team, distributed resources, worldwide reach" },
  ],
  urgency: [
    { value: "planned", label: "Planned", description: "Strategic initiative with flexible timeline" },
    { value: "normal", label: "Normal", description: "Standard project with moderate timeline" },
    { value: "high", label: "High", description: "Priority project with tight timeline" },
    { value: "critical", label: "Critical", description: "Emergency project with immediate timeline" },
    { value: "opportunity", label: "Opportunity", description: "Time-sensitive market opportunity" },
  ],
  complexity: [
    { value: "simple", label: "Simple", description: "Straightforward implementation with minimal dependencies" },
    { value: "standard", label: "Standard", description: "Typical complexity with moderate dependencies" },
    { value: "advanced", label: "Advanced", description: "Complex implementation with multiple dependencies" },
    { value: "expert", label: "Expert", description: "Highly complex with extensive dependencies" },
    { value: "research", label: "Research", description: "Experimental or research-oriented complexity" },
  ],
  resources: [
    { value: "lean_team", label: "Lean Team", description: "Small team with limited specialized skills" },
    { value: "specialized_team", label: "Specialized Team", description: "Team with relevant domain expertise" },
    { value: "cross_functional", label: "Cross-functional", description: "Diverse team with multiple skill sets" },
    { value: "external_partners", label: "External Partners", description: "Team augmented with external expertise" },
    { value: "unlimited", label: "Unlimited", description: "Access to extensive resources and expertise" },
  ],
  application: [
    { value: "concept", label: "Concept", description: "Initial idea exploration and validation" },
    { value: "prototype", label: "Prototype", description: "Basic working model for testing" },
    { value: "mvp", label: "MVP", description: "Minimum viable product for market validation" },
    { value: "production", label: "Production", description: "Full-scale deployment and operation" },
    { value: "optimization", label: "Optimization", description: "Performance improvement and scaling" },
    { value: "maintenance", label: "Maintenance", description: "Ongoing support and updates" },
  ],
  output_format: [
    { value: "spec", label: "Specification", description: "Detailed technical specification document" },
    { value: "brief", label: "Brief", description: "Concise project overview and requirements" },
    { value: "proposal", label: "Proposal", description: "Formal project proposal and scope" },
    { value: "roadmap", label: "Roadmap", description: "Strategic implementation timeline and milestones" },
    { value: "template", label: "Template", description: "Reusable framework and structure" },
  ],
};

const DOMAIN_DEFAULTS: Partial<Record<string, Partial<SevenDConfig>>> = {
  saas: {
    scale: "startup",
    urgency: "planned",
    complexity: "standard",
    resources: "lean_team",
    application: "mvp",
  },
  ecommerce: {
    scale: "midsize",
    urgency: "normal",
    complexity: "standard",
    resources: "specialized_team",
    application: "production",
  },
  fintech: {
    scale: "enterprise",
    urgency: "high",
    complexity: "advanced",
    resources: "cross_functional",
    application: "production",
  },
  healthtech: {
    scale: "enterprise",
    urgency: "critical",
    complexity: "expert",
    resources: "external_partners",
    application: "production",
  },
  ai: {
    scale: "startup",
    urgency: "opportunity",
    complexity: "research",
    resources: "specialized_team",
    application: "prototype",
  },
};

interface SevenDConfiguratorProps {
  config: SevenDConfig;
  onConfigChange: (config: SevenDConfig) => void;
}

export function SevenDConfigurator({ config, onConfigChange }: SevenDConfiguratorProps) {
  const handleParameterChange = (parameter: keyof SevenDConfig, value: string) => {
    const newConfig = { ...config, [parameter]: value };
    
    // Apply domain-specific defaults if domain changed
    if (parameter === "domain" && DOMAIN_DEFAULTS[value]) {
      Object.assign(newConfig, DOMAIN_DEFAULTS[value]);
    }
    
    onConfigChange(newConfig);
  };

  const getParameterOptions = (parameter: keyof SevenDConfig): SevenDOption[] => {
    if (parameter === "outputFormat") {
      return SEVEN_D_OPTIONS.output_format;
    }
    return SEVEN_D_OPTIONS[parameter as keyof SevenDOptionsMap] || [];
  };

  const getParameterDescription = (parameter: keyof SevenDConfig, value: string): string => {
    const options = getParameterOptions(parameter);
    const option = options.find((opt: SevenDOption) => opt.value === value);
    return option?.description || "";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>7-Dimensional Configuration</span>
          <Badge variant="secondary">Framework</Badge>
        </CardTitle>
        <CardDescription>
          Configure your prompt generation parameters using our comprehensive 7-D framework.
          Each dimension affects how your prompt is structured and optimized.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Domain Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Domain</label>
            <Select value={config.domain} onValueChange={(value) => handleParameterChange("domain", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {getParameterOptions("domain").map((option: SevenDOption) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getParameterDescription("domain", config.domain)}
            </p>
          </div>

          {/* Scale Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Scale</label>
            <Select value={config.scale} onValueChange={(value) => handleParameterChange("scale", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select scale" />
              </SelectTrigger>
              <SelectContent>
                {getParameterOptions("scale").map((option: SevenDOption) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getParameterDescription("scale", config.scale)}
            </p>
          </div>

          {/* Urgency Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Urgency</label>
            <Select value={config.urgency} onValueChange={(value) => handleParameterChange("urgency", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                {getParameterOptions("urgency").map((option: SevenDOption) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getParameterDescription("urgency", config.urgency)}
            </p>
          </div>

          {/* Complexity Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Complexity</label>
            <Select value={config.complexity} onValueChange={(value) => handleParameterChange("complexity", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent>
                {getParameterOptions("complexity").map((option: SevenDOption) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getParameterDescription("complexity", config.complexity)}
            </p>
          </div>

          {/* Resources Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Resources</label>
            <Select value={config.resources} onValueChange={(value) => handleParameterChange("resources", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select resources" />
              </SelectTrigger>
              <SelectContent>
                {getParameterOptions("resources").map((option: SevenDOption) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getParameterDescription("resources", config.resources)}
            </p>
          </div>

          {/* Application Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Application</label>
            <Select value={config.application} onValueChange={(value) => handleParameterChange("application", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select application" />
              </SelectTrigger>
              <SelectContent>
                {getParameterOptions("application").map((option: SevenDOption) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getParameterDescription("application", config.application)}
            </p>
          </div>

          {/* Output Format Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Output Format</label>
            <Select value={config.outputFormat} onValueChange={(value) => handleParameterChange("outputFormat", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select output format" />
              </SelectTrigger>
              <SelectContent>
                {getParameterOptions("outputFormat").map((option: SevenDOption) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getParameterDescription("outputFormat", config.outputFormat)}
            </p>
          </div>

          {/* Vector Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Vector</label>
            <Select value={config.vector} onValueChange={(value) => handleParameterChange("vector", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select vector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="V1">V1: Systems & Agents</SelectItem>
                <SelectItem value="V2">V2: Marketing & Sales</SelectItem>
                <SelectItem value="V3">V3: Content & Creative</SelectItem>
                <SelectItem value="V4">V4: Operations & Process</SelectItem>
                <SelectItem value="V5">V5: Research & Analysis</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose the vector that best aligns with your use case and industry focus.
            </p>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Configuration Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div><span className="font-medium">Domain:</span> {config.domain}</div>
            <div><span className="font-medium">Scale:</span> {config.scale}</div>
            <div><span className="font-medium">Urgency:</span> {config.urgency}</div>
            <div><span className="font-medium">Complexity:</span> {config.complexity}</div>
            <div><span className="font-medium">Resources:</span> {config.resources}</div>
            <div><span className="font-medium">Application:</span> {config.application}</div>
            <div><span className="font-medium">Output:</span> {config.outputFormat}</div>
            <div><span className="font-medium">Vector:</span> {config.vector}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
