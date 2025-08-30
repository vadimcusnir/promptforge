export const gptLive = {};

// Mock GPTLiveOptions interface
export interface GPTLiveOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}
