const fs = require('fs');
const path = require('path');

// Read the current catalog
const catalogPath = path.join(__dirname, '../lib/modules.catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Define the final modules (M31-M50)
const finalModules = {
  "M31": {
    "id": "M31",
    "title": "SALES FLOW ARCHITECT™",
    "slug": "sales-flow-architect",
    "summary": "Design optimized sales processes and conversion funnels",
    "vectors": ["strategic", "rhetoric", "analytics"],
    "difficulty": 3,
    "minPlan": "pro",
    "tags": ["sales", "flow", "conversion"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "sales_goals": {"type": "array", "required": true, "description": "Sales objectives"},
        "customer_journey": {"type": "string", "required": true, "description": "Customer journey map"}
      },
      "kpis": {
        "clarity_min": 80,
        "execution_min": 75,
        "business_fit_min": 85
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M32": {
    "id": "M32",
    "title": "CUSTOMER JOURNEY MAPPER™",
    "slug": "customer-journey-mapper",
    "summary": "Map complete customer journeys with touchpoint optimization",
    "vectors": ["analytics", "cognitive", "strategic"],
    "difficulty": 3,
    "minPlan": "pro",
    "tags": ["customer", "journey", "mapping"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "customer_personas": {"type": "array", "required": true, "description": "Customer personas"},
        "touchpoints": {"type": "array", "required": true, "description": "Customer touchpoints"}
      },
      "kpis": {
        "clarity_min": 80,
        "execution_min": 75,
        "business_fit_min": 85
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M33": {
    "id": "M33",
    "title": "ENABLEMENT FRAME™",
    "slug": "enablement-frame",
    "summary": "Create customer success and enablement frameworks",
    "vectors": ["strategic", "cognitive", "analytics"],
    "difficulty": 3,
    "minPlan": "pro",
    "tags": ["enablement", "success", "framework"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "success_metrics": {"type": "array", "required": true, "description": "Success criteria"},
        "enablement_tools": {"type": "array", "required": true, "description": "Enablement resources"}
      },
      "kpis": {
        "clarity_min": 80,
        "execution_min": 75,
        "business_fit_min": 85
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M34": {
    "id": "M34",
    "title": "ACCOUNT-BASED STRATEGY™",
    "slug": "account-based-strategy",
    "summary": "Design account-based marketing and sales strategies",
    "vectors": ["strategic", "rhetoric", "analytics"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["account", "strategy", "marketing"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "target_accounts": {"type": "array", "required": true, "description": "Target account list"},
        "engagement_strategy": {"type": "string", "required": true, "description": "Engagement approach"}
      },
      "kpis": {
        "clarity_min": 85,
        "execution_min": 80,
        "business_fit_min": 88
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M35": {
    "id": "M35",
    "title": "FORECAST ENGINE™",
    "slug": "forecast-engine",
    "summary": "Build predictive forecasting models for business metrics",
    "vectors": ["analytics", "strategic", "cognitive"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["forecast", "prediction", "analytics"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "historical_data": {"type": "array", "required": true, "description": "Historical metrics"},
        "forecast_horizon": {"type": "string", "required": true, "description": "Forecast timeframe"}
      },
      "kpis": {
        "clarity_min": 85,
        "execution_min": 80,
        "business_fit_min": 88
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M36": {
    "id": "M36",
    "title": "COMPENSATION DESIGNER™",
    "slug": "compensation-designer",
    "summary": "Design fair and motivating compensation structures",
    "vectors": ["strategic", "cognitive", "analytics"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["compensation", "design", "motivation"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "role_requirements": {"type": "array", "required": true, "description": "Role specifications"},
        "market_data": {"type": "array", "required": true, "description": "Market compensation data"}
      },
      "kpis": {
        "clarity_min": 85,
        "execution_min": 80,
        "business_fit_min": 88
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M37": {
    "id": "M37",
    "title": "CUSTOMER SUCCESS PLAYBOOK™",
    "slug": "customer-success-playbook",
    "summary": "Create comprehensive customer success strategies and playbooks",
    "vectors": ["strategic", "cognitive", "analytics"],
    "difficulty": 3,
    "minPlan": "pro",
    "tags": ["success", "playbook", "strategy"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "success_metrics": {"type": "array", "required": true, "description": "Success KPIs"},
        "intervention_points": {"type": "array", "required": true, "description": "Intervention triggers"}
      },
      "kpis": {
        "clarity_min": 80,
        "execution_min": 75,
        "business_fit_min": 85
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M38": {
    "id": "M38",
    "title": "PARTNER ECOSYSTEM GRID™",
    "slug": "partner-ecosystem-grid",
    "summary": "Design and manage partner ecosystem strategies",
    "vectors": ["strategic", "branding", "analytics"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["partners", "ecosystem", "strategy"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "partner_types": {"type": "array", "required": true, "description": "Partner categories"},
        "ecosystem_goals": {"type": "array", "required": true, "description": "Ecosystem objectives"}
      },
      "kpis": {
        "clarity_min": 85,
        "execution_min": 80,
        "business_fit_min": 88
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M39": {
    "id": "M39",
    "title": "INTELLIGENCE ENGINE™",
    "slug": "intelligence-engine",
    "summary": "Build competitive intelligence and market analysis systems",
    "vectors": ["analytics", "strategic", "cognitive"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["intelligence", "competitive", "analysis"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "competitors": {"type": "array", "required": true, "description": "Competitor list"},
        "intelligence_sources": {"type": "array", "required": true, "description": "Data sources"}
      },
      "kpis": {
        "clarity_min": 85,
        "execution_min": 80,
        "business_fit_min": 88
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M40": {
    "id": "M40",
    "title": "NEGOTIATION DYNAMICS™",
    "slug": "negotiation-dynamics",
    "summary": "Master negotiation strategies and psychological dynamics",
    "vectors": ["rhetoric", "cognitive", "strategic"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["negotiation", "psychology", "strategy"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "negotiation_context": {"type": "string", "required": true, "description": "Negotiation scenario"},
        "stakeholders": {"type": "array", "required": true, "description": "Negotiation parties"}
      },
      "kpis": {
        "clarity_min": 85,
        "execution_min": 80,
        "business_fit_min": 88
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M41": {
    "id": "M41",
    "title": "PROCESS AUTOMATION BLUEPRINT™",
    "slug": "process-automation-blueprint",
    "summary": "Design automated business processes for efficiency",
    "vectors": ["strategic", "analytics", "cognitive"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["automation", "process", "blueprint"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "current_processes": {"type": "array", "required": true, "description": "Existing processes"},
        "automation_goals": {"type": "array", "required": true, "description": "Automation objectives"}
      },
      "kpis": {
        "clarity_min": 85,
        "execution_min": 80,
        "business_fit_min": 88
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M42": {
    "id": "M42",
    "title": "QUALITY SYSTEM MAP™",
    "slug": "quality-system-map",
    "summary": "Map quality assurance systems and improvement processes",
    "vectors": ["strategic", "analytics", "cognitive"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["quality", "system", "improvement"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "quality_standards": {"type": "array", "required": true, "description": "Quality requirements"},
        "improvement_areas": {"type": "array", "required": true, "description": "Areas for improvement"}
      },
      "kpis": {
        "clarity_min": 85,
        "execution_min": 80,
        "business_fit_min": 88
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M43": {
    "id": "M43",
    "title": "SUPPLY FLOW OPTIMIZER™",
    "slug": "supply-flow-optimizer",
    "summary": "Optimize supply chain and logistics operations",
    "vectors": ["strategic", "analytics", "cognitive"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["supply", "logistics", "optimization"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "supply_chain": {"type": "array", "required": true, "description": "Supply chain components"},
        "optimization_goals": {"type": "array", "required": true, "description": "Optimization targets"}
      },
      "kpis": {
        "clarity_min": 85,
        "execution_min": 80,
        "business_fit_min": 88
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M44": {
    "id": "M44",
    "title": "PORTFOLIO MANAGER™",
    "slug": "portfolio-manager",
    "summary": "Manage product and project portfolios strategically",
    "vectors": ["strategic", "analytics", "cognitive"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["portfolio", "management", "strategy"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "portfolio_items": {"type": "array", "required": true, "description": "Portfolio components"},
        "strategic_goals": {"type": "array", "required": true, "description": "Strategic objectives"}
      },
      "kpis": {
        "clarity_min": 85,
        "execution_min": 80,
        "business_fit_min": 88
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M45": {
    "id": "M45",
    "title": "CHANGE FORCE FIELD™",
    "slug": "change-force-field",
    "summary": "Manage organizational change with force field analysis",
    "vectors": ["strategic", "cognitive", "rhetoric"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["change", "management", "analysis"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "change_initiative": {"type": "string", "required": true, "description": "Change project"},
        "stakeholders": {"type": "array", "required": true, "description": "Affected stakeholders"}
      },
      "kpis": {
        "clarity_min": 85,
        "execution_min": 80,
        "business_fit_min": 88
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M46": {
    "id": "M46",
    "title": "CREATIVE STRATEGY ENGINE™",
    "slug": "creative-strategy-engine",
    "summary": "Generate creative strategies and innovative solutions",
    "vectors": ["branding", "cognitive", "content"],
    "difficulty": 3,
    "minPlan": "pro",
    "tags": ["creative", "strategy", "innovation"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "creative_challenge": {"type": "string", "required": true, "description": "Creative problem"},
        "constraints": {"type": "array", "required": true, "description": "Creative constraints"}
      },
      "kpis": {
        "clarity_min": 80,
        "execution_min": 75,
        "business_fit_min": 85
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M47": {
    "id": "M47",
    "title": "PROMPT SYSTEM ARCHITECT™",
    "slug": "prompt-system-architect",
    "summary": "Design comprehensive prompt engineering systems",
    "vectors": ["strategic", "cognitive", "analytics"],
    "difficulty": 5,
    "minPlan": "enterprise",
    "tags": ["prompt", "system", "architecture"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "system_requirements": {"type": "array", "required": true, "description": "System specifications"},
        "prompt_patterns": {"type": "array", "required": true, "description": "Prompt patterns"}
      },
      "kpis": {
        "clarity_min": 90,
        "execution_min": 85,
        "business_fit_min": 92
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M48": {
    "id": "M48",
    "title": "FRACTAL IDENTITY MAP™",
    "slug": "fractal-identity-map",
    "summary": "Map organizational identity across all levels and touchpoints",
    "vectors": ["branding", "strategic", "cognitive"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["identity", "fractal", "mapping"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "identity_elements": {"type": "array", "required": true, "description": "Identity components"},
        "touchpoints": {"type": "array", "required": true, "description": "Brand touchpoints"}
      },
      "kpis": {
        "clarity_min": 85,
        "execution_min": 80,
        "business_fit_min": 88
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M49": {
    "id": "M49",
    "title": "EXECUTIVE PROMPT DOSSIER™",
    "slug": "executive-prompt-dossier",
    "summary": "Create executive-level prompt strategies and frameworks",
    "vectors": ["strategic", "rhetoric", "cognitive"],
    "difficulty": 5,
    "minPlan": "enterprise",
    "tags": ["executive", "prompt", "strategy"],
    "outputs": ["txt", "md", "pdf"],
    "spec": {
      "inputs": {
        "executive_context": {"type": "string", "required": true, "description": "Executive situation"},
        "strategic_goals": {"type": "array", "required": true, "description": "Strategic objectives"}
      },
      "kpis": {
        "clarity_min": 90,
        "execution_min": 85,
        "business_fit_min": 92
      }
    },
    "version": "3.1.0",
    "deprecated": false
  },
  "M50": {
    "id": "M50",
    "title": "PROMPT LICENSING MANAGER™",
    "slug": "prompt-licensing-manager",
    "summary": "Manage prompt licensing, IP protection, and commercialization",
    "vectors": ["strategic", "analytics", "cognitive"],
    "difficulty": 5,
    "minPlan": "enterprise",
    "tags": ["licensing", "IP", "commercialization"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "prompt_portfolio": {"type": "array", "required": true, "description": "Prompt assets"},
        "licensing_strategy": {"type": "string", "required": true, "description": "Licensing approach"}
      },
      "kpis": {
        "clarity_min": 90,
        "execution_min": 85,
        "business_fit_min": 92
      }
    },
    "version": "3.1.0",
    "deprecated": false
  }
};

// Add final modules to catalog
Object.assign(catalog.modules, finalModules);

// Write updated catalog back to file
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));

console.log('Successfully added modules M31-M50 to catalog');
console.log(`Total modules in catalog: ${Object.keys(catalog.modules).length}`);
