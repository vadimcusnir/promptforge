export const modules = [];
export const MODULES = [];
export const COMPLETE_MODULES_CATALOG = [];
export const searchModules = () => [];

export interface ModuleDefinition {
  id: number;
  name: string;
  description: string;
  domain: string;
  vectors: string[];
  difficulty: string;
  plan: string;
  kpi: string;
  spec: string;
  output_template: string;
  estimated_tokens: number;
}
