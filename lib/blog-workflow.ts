export type BlogPostStatus = 'draft' | 'review' | 'approved' | 'scheduled' | 'published';

export interface BlogWorkflowStep {
  status: BlogPostStatus;
  name: string;
  description: string;
  requiredChecks: string[];
  nextStatus?: BlogPostStatus;
  canRollback: boolean;
}

export interface BlogWorkflowTransition {
  from: BlogPostStatus;
  to: BlogPostStatus;
  allowedRoles: string[];
  requiredChecks: string[];
  autoTransition?: boolean;
}

export interface BlogWorkflowCheck {
  id: string;
  name: string;
  description: string;
  category: 'design' | 'seo' | 'legal' | 'content';
  required: boolean;
  validator: (post: any) => { passed: boolean; message?: string };
}

// Workflow steps definition
export const BLOG_WORKFLOW_STEPS: BlogWorkflowStep[] = [
  {
    status: 'draft',
    name: 'Draft',
    description: 'Initial content creation and editing',
    requiredChecks: ['content_basic'],
    nextStatus: 'review',
    canRollback: false,
  },
  {
    status: 'review',
    name: 'Review',
    description: 'Content review and quality checks',
    requiredChecks: ['design_contrast', 'seo_meta', 'content_links'],
    nextStatus: 'approved',
    canRollback: true,
  },
  {
    status: 'approved',
    name: 'Approved',
    description: 'Content approved and ready for publication',
    requiredChecks: ['legal_pii', 'seo_schema'],
    nextStatus: 'scheduled',
    canRollback: true,
  },
  {
    status: 'scheduled',
    name: 'Scheduled',
    description: 'Content scheduled for publication',
    requiredChecks: [],
    nextStatus: 'published',
    canRollback: true,
  },
  {
    status: 'published',
    name: 'Published',
    description: 'Content is live and accessible',
    requiredChecks: [],
    canRollback: true,
  },
];

// Workflow transitions
export const BLOG_WORKFLOW_TRANSITIONS: BlogWorkflowTransition[] = [
  {
    from: 'draft',
    to: 'review',
    allowedRoles: ['editor', 'admin', 'owner'],
    requiredChecks: ['content_basic'],
  },
  {
    from: 'review',
    to: 'approved',
    allowedRoles: ['admin', 'owner'],
    requiredChecks: ['design_contrast', 'seo_meta', 'content_links'],
  },
  {
    from: 'approved',
    to: 'scheduled',
    allowedRoles: ['editor', 'admin', 'owner'],
    requiredChecks: ['legal_pii', 'seo_schema'],
  },
  {
    from: 'scheduled',
    to: 'published',
    allowedRoles: ['admin', 'owner'],
    requiredChecks: [],
    autoTransition: true,
  },
  {
    from: 'review',
    to: 'draft',
    allowedRoles: ['editor', 'admin', 'owner'],
    requiredChecks: [],
  },
  {
    from: 'approved',
    to: 'review',
    allowedRoles: ['admin', 'owner'],
    requiredChecks: [],
  },
  {
    from: 'scheduled',
    to: 'approved',
    allowedRoles: ['admin', 'owner'],
    requiredChecks: [],
  },
  {
    from: 'published',
    to: 'scheduled',
    allowedRoles: ['admin', 'owner'],
    requiredChecks: [],
  },
];

// Workflow checks
export const BLOG_WORKFLOW_CHECKS: BlogWorkflowCheck[] = [
  {
    id: 'content_basic',
    name: 'Basic Content Check',
    description: 'Ensures content has title, excerpt, and body',
    category: 'content',
    required: true,
    validator: (post) => {
      if (!post.title || !post.excerpt || !post.content) {
        return { passed: false, message: 'Title, excerpt, and content are required' };
      }
      return { passed: true };
    },
  },
  {
    id: 'design_contrast',
    name: 'Design & Contrast Check',
    description: 'Verifies proper contrast ratios and responsive design',
    category: 'design',
    required: true,
    validator: (post) => {
      // Mock validation - in production this would check actual design elements
      return { passed: true };
    },
  },
  {
    id: 'seo_meta',
    name: 'SEO Meta Check',
    description: 'Validates title length, meta description, and H1 structure',
    category: 'seo',
    required: true,
    validator: (post) => {
      const errors = [];
      if (post.title && post.title.length > 60) {
        errors.push('Title should be 60 characters or less');
      }
      if (post.excerpt && (post.excerpt.length < 120 || post.excerpt.length > 160)) {
        errors.push('Excerpt should be 120-160 characters');
      }
      if (errors.length > 0) {
        return { passed: false, message: errors.join(', ') };
      }
      return { passed: true };
    },
  },
  {
    id: 'content_links',
    name: 'Internal Links Check',
    description: 'Ensures minimum 3 internal links for SEO',
    category: 'seo',
    required: true,
    validator: (post) => {
      const internalLinks = (post.content.match(/\[([^\]]+)\]\(\/[^)]+\)/g) || []).length;
      if (internalLinks < 3) {
        return { passed: false, message: 'At least 3 internal links required' };
      }
      return { passed: true };
    },
  },
  {
    id: 'legal_pii',
    name: 'Legal & PII Check',
    description: 'Scans for PII and sensitive claims',
    category: 'legal',
    required: true,
    validator: (post) => {
      // Mock PII detection - in production this would use actual PII detection
      const piiPatterns = [
        /\b\d{3}-\d{2}-\d{4}\b/, // SSN
        /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/, // Credit card
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      ];
      
      const content = `${post.title} ${post.excerpt} ${post.content}`;
      for (const pattern of piiPatterns) {
        if (pattern.test(content)) {
          return { passed: false, message: 'Potential PII detected in content' };
        }
      }
      return { passed: true };
    },
  },
  {
    id: 'seo_schema',
    name: 'SEO Schema Check',
    description: 'Validates structured data and schema markup',
    category: 'seo',
    required: true,
    validator: (post) => {
      // Mock schema validation - in production this would validate actual schema
      return { passed: true };
    },
  },
];

export function canTransition(
  from: BlogPostStatus,
  to: BlogPostStatus,
  userRole: string
): { allowed: boolean; reason?: string } {
  const transition = BLOG_WORKFLOW_TRANSITIONS.find(
    t => t.from === from && t.to === to
  );

  if (!transition) {
    return { allowed: false, reason: 'Invalid transition' };
  }

  if (!transition.allowedRoles.includes(userRole)) {
    return { allowed: false, reason: 'Insufficient permissions' };
  }

  return { allowed: true };
}

export function getRequiredChecks(status: BlogPostStatus): string[] {
  const step = BLOG_WORKFLOW_STEPS.find(s => s.status === status);
  return step?.requiredChecks || [];
}

export function runWorkflowChecks(post: any, checks: string[]): {
  passed: boolean;
  results: Array<{ check: string; passed: boolean; message?: string }>;
} {
  const results = checks.map(checkId => {
    const check = BLOG_WORKFLOW_CHECKS.find(c => c.id === checkId);
    if (!check) {
      return { check: checkId, passed: false, message: 'Check not found' };
    }

    const result = check.validator(post);
    return {
      check: checkId,
      passed: result.passed,
      message: result.message,
    };
  });

  const passed = results.every(r => r.passed);
  return { passed, results };
}

export function getNextStatus(currentStatus: BlogPostStatus): BlogPostStatus | null {
  const step = BLOG_WORKFLOW_STEPS.find(s => s.status === currentStatus);
  return step?.nextStatus || null;
}

export function getWorkflowStep(status: BlogPostStatus): BlogWorkflowStep | null {
  return BLOG_WORKFLOW_STEPS.find(s => s.status === status) || null;
}
