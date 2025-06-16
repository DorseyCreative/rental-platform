import Anthropic from '@anthropic-ai/sdk'

let anthropicClient: Anthropic | null = null

export function getAnthropicClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('ANTHROPIC_API_KEY not configured - AI features will be disabled')
    return null
  }

  if (!anthropicClient) {
    try {
      anthropicClient = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      })
    } catch (error) {
      console.error('Failed to initialize Anthropic client:', error)
      return null
    }
  }

  return anthropicClient
}

// For backwards compatibility
export function createAnthropicClient(): Anthropic | null {
  return getAnthropicClient()
}

export const anthropic = getAnthropicClient()