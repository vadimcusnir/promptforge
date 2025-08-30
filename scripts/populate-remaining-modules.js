const fs = require('fs');
const path = require('path');

// Read the current catalog
const catalogPath = path.join(__dirname, '../lib/modules.catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Define the remaining modules (M21-M50)
const remainingModules = {
  "M21": {
    "id": "M21",
    "title": "API DOCS GENERATOR™",
    "slug": "api-docs-generator",
    "summary": "Generate comprehensive API documentation with examples",
    "vectors": ["analytics", "strategic", "content"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["api", "documentation", "technical"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "api_spec": {"type": "string", "required": true, "description": "API specification"},
        "examples": {"type": "array", "required": true, "description": "Usage examples"}
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
  "M22": {
    "id": "M22",
    "title": "SYSTEM BLUEPRINT™",
    "slug": "system-blueprint",
    "summary": "Create comprehensive system architecture blueprints",
    "vectors": ["strategic", "analytics", "cognitive"],
    "difficulty": 5,
    "minPlan": "enterprise",
    "tags": ["architecture", "system", "blueprint"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "system_requirements": {"type": "array", "required": true, "description": "System requirements"},
        "constraints": {"type": "array", "required": true, "description": "Technical constraints"}
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
  "M23": {
    "id": "M23",
    "title": "DEVOPS PIPELINE ARCHITECT™",
    "slug": "devops-pipeline-architect",
    "summary": "Design automated DevOps pipelines for continuous delivery",
    "vectors": ["analytics", "strategic", "cognitive"],
    "difficulty": 5,
    "minPlan": "enterprise",
    "tags": ["devops", "pipeline", "automation"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "deployment_targets": {"type": "array", "required": true, "description": "Deployment environments"},
        "quality_gates": {"type": "array", "required": true, "description": "Quality checkpoints"}
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
  "M24": {
    "id": "M24",
    "title": "DATA SCHEMA OPTIMIZER™",
    "slug": "data-schema-optimizer",
    "summary": "Optimize database schemas for performance and scalability",
    "vectors": ["analytics", "strategic", "cognitive"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["database", "schema", "optimization"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "current_schema": {"type": "string", "required": true, "description": "Current database schema"},
        "performance_requirements": {"type": "array", "required": true, "description": "Performance targets"}
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
  "M25": {
    "id": "M25",
    "title": "MICROSERVICES GRID™",
    "slug": "microservices-grid",
    "summary": "Design microservices architecture with service mesh",
    "vectors": ["strategic", "analytics", "cognitive"],
    "difficulty": 5,
    "minPlan": "enterprise",
    "tags": ["microservices", "architecture", "grid"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "business_domains": {"type": "array", "required": true, "description": "Business domain boundaries"},
        "service_requirements": {"type": "array", "required": true, "description": "Service specifications"}
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
  "M26": {
    "id": "M26",
    "title": "SECURITY FORTRESS FRAME™",
    "slug": "security-fortress-frame",
    "summary": "Comprehensive security framework for applications and infrastructure",
    "vectors": ["strategic", "crisis", "analytics"],
    "difficulty": 5,
    "minPlan": "enterprise",
    "tags": ["security", "framework", "fortress"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "threat_model": {"type": "string", "required": true, "description": "Threat model analysis"},
        "compliance_requirements": {"type": "array", "required": true, "description": "Compliance standards"}
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
  "M27": {
    "id": "M27",
    "title": "PERFORMANCE ENGINE™",
    "slug": "performance-engine",
    "summary": "Optimize application performance across all layers",
    "vectors": ["analytics", "strategic", "cognitive"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["performance", "optimization", "engine"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "performance_metrics": {"type": "array", "required": true, "description": "Current performance metrics"},
        "optimization_goals": {"type": "array", "required": true, "description": "Performance targets"}
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
  "M28": {
    "id": "M28",
    "title": "API GATEWAY DESIGNER™",
    "slug": "api-gateway-designer",
    "summary": "Design API gateways with routing, security, and monitoring",
    "vectors": ["strategic", "analytics", "cognitive"],
    "difficulty": 4,
    "minPlan": "pro",
    "tags": ["api", "gateway", "design"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "api_services": {"type": "array", "required": true, "description": "Backend API services"},
        "routing_rules": {"type": "array", "required": true, "description": "Routing requirements"}
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
  "M29": {
    "id": "M29",
    "title": "ORCHESTRATION MATRIX™",
    "slug": "orchestration-matrix",
    "summary": "Design service orchestration and workflow management",
    "vectors": ["strategic", "analytics", "cognitive"],
    "difficulty": 5,
    "minPlan": "enterprise",
    "tags": ["orchestration", "workflow", "matrix"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "workflow_requirements": {"type": "array", "required": true, "description": "Workflow specifications"},
        "service_dependencies": {"type": "array", "required": true, "description": "Service dependency map"}
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
  "M30": {
    "id": "M30",
    "title": "CLOUD INFRA MAP™",
    "slug": "cloud-infra-map",
    "summary": "Map cloud infrastructure with cost optimization and scaling",
    "vectors": ["strategic", "analytics", "cognitive"],
    "difficulty": 5,
    "minPlan": "enterprise",
    "tags": ["cloud", "infrastructure", "mapping"],
    "outputs": ["txt", "md", "pdf", "json"],
    "spec": {
      "inputs": {
        "infrastructure_requirements": {"type": "array", "required": true, "description": "Infrastructure needs"},
        "cost_constraints": {"type": "array", "required": true, "description": "Budget limitations"}
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

// Add remaining modules to catalog
Object.assign(catalog.modules, remainingModules);

// Write updated catalog back to file
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));

console.log('Successfully added modules M21-M30 to catalog');
console.log(`Total modules in catalog: ${Object.keys(catalog.modules).length}`);
