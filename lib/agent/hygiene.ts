export function stripSecrets(s: string) {
    return s.replace(/sk-[A-Za-z0-9]{20,}/g, "sk-***").replace(/[0-9]{16}/g, "####-MASKED");
  }
  
  export function clampInput(user: string, max=4000) {
    return user.slice(0, max);
  }
  