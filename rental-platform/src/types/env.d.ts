declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ANTHROPIC_API_KEY?: string
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
      SUPABASE_SERVICE_ROLE_KEY?: string
      NEXT_PUBLIC_APP_URL?: string
      STRIPE_SECRET_KEY?: string
      STRIPE_WEBHOOK_SECRET?: string
      TWILIO_ACCOUNT_SID?: string
      TWILIO_AUTH_TOKEN?: string
      TWILIO_PHONE_NUMBER?: string
      FACEBOOK_APP_ID?: string
      FACEBOOK_APP_SECRET?: string
      GOOGLE_PLACES_API_KEY?: string
    }
  }
}

export {}