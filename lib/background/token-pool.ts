export interface Token {
  id: number
  text: string
}

export class TokenPool {
  private tokens: Token[]
  private index = 0

  constructor(tokens: Token[]) {
    this.tokens = [...tokens]
  }

  next(): Token {
    const token = this.tokens[this.index]
    this.index = (this.index + 1) % this.tokens.length
    return token
  }

  shuffle(): void {
    for (let i = this.tokens.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.tokens[i], this.tokens[j]] = [this.tokens[j], this.tokens[i]]
    }
  }
}

export function createTokenPool(tokens: Token[], maxTokens: number): TokenPool {
  const pool = new TokenPool(tokens)
  pool.shuffle()
  return pool
}
