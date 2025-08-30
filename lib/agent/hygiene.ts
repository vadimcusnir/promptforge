export const hygiene = {};
export const stripSecrets = (input: any) => input;
export const detectInjection = (input: any) => ({ detected: false });
export const normalizeInput = (input: any) => input;
