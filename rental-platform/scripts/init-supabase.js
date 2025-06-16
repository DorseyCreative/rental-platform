#!/usr/bin/env node

/**
 * Supabase Initialization Script
 * Helps set up the database and environment for the rental platform
 */

const fs = require('fs')
const path = require('path')

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`)
}

function checkEnvironment() {
  log('\n🔍 Checking environment...', 'blue')
  
  const envFile = path.join(process.cwd(), '.env.local')
  const envExampleFile = path.join(process.cwd(), '.env.example')
  
  if (!fs.existsSync(envFile)) {
    if (fs.existsSync(envExampleFile)) {
      log('📋 Copying .env.example to .env.local...', 'yellow')
      fs.copyFileSync(envExampleFile, envFile)
    } else {
      log('❌ No .env.example file found', 'red')
      return false
    }
  }
  
  const envContent = fs.readFileSync(envFile, 'utf8')
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=') && !envContent.includes('your_supabase_url_here')
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') && !envContent.includes('your_supabase_anon_key_here')
  
  if (!hasSupabaseUrl || !hasSupabaseKey) {
    log('⚠️  Supabase credentials not configured in .env.local', 'yellow')
    log('Please update your Supabase URL and anon key in .env.local', 'yellow')
    return false
  }
  
  log('✅ Environment variables configured', 'green')
  return true
}

function checkSupabaseCLI() {
  log('\n🔧 Checking Supabase CLI...', 'blue')
  
  try {
    const { execSync } = require('child_process')
    execSync('supabase --version', { stdio: 'pipe' })
    log('✅ Supabase CLI is installed', 'green')
    return true
  } catch (error) {
    log('❌ Supabase CLI not found', 'red')
    log('Install with: npm install -g supabase', 'yellow')
    return false
  }
}

function displayInstructions() {
  log('\n📚 Setup Instructions:', 'cyan')
  log('1. Create a Supabase project at https://supabase.com', 'bright')
  log('2. Get your project URL and anon key from Settings > API', 'bright')
  log('3. Update .env.local with your credentials', 'bright')
  log('4. Run: supabase link --project-ref YOUR_PROJECT_ID', 'bright')
  log('5. Run: supabase db push', 'bright')
  log('6. Run: npm run db:generate-types', 'bright')
  log('7. Run: npm run dev', 'bright')
}

function main() {
  log('🚀 AI-Powered Rental Platform Setup', 'bright')
  log('======================================', 'bright')
  
  const envOk = checkEnvironment()
  const cliOk = checkSupabaseCLI()
  
  if (envOk && cliOk) {
    log('\n🎉 Environment is ready!', 'green')
    log('You can now run: npm run dev', 'green')
  } else {
    displayInstructions()
  }
  
  log('\n📖 For detailed setup instructions, see DEPLOYMENT.md', 'cyan')
}

if (require.main === module) {
  main()
}