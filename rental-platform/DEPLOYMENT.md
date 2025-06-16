# AI-Powered Rental Platform Deployment Guide

This guide covers deploying your AI-powered rental management system to production using Supabase and GitHub Pages.

## Prerequisites

- Node.js 18+ installed
- Git repository on GitHub
- Supabase account
- (Optional) Anthropic API key for enhanced website analysis

## 1. Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to your users
3. Wait for the project to be fully provisioned

### Run Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get project ID from Supabase dashboard)
supabase link --project-ref YOUR_PROJECT_ID

# Run the database migration
supabase db push

# Generate TypeScript types
npm run db:generate-types
```

### Get Your Supabase Credentials

From your Supabase dashboard → Settings → API:
- **Project URL**: `https://YOUR_PROJECT_ID.supabase.co`
- **Anon/Public Key**: `eyJ...` (starts with eyJ)
- **Service Role Key**: `eyJ...` (keep this secret)

## 2. Environment Variables

### Local Development (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# AI Enhancement (Optional)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

### GitHub Repository Secrets

For GitHub Pages deployment, add these secrets in your repository:
`Settings → Secrets and variables → Actions → Repository secrets`

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. GitHub Pages Deployment

### Enable GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" in the sidebar
3. Under "Source", select "GitHub Actions"

### Configure GitHub Actions

The included `.github/workflows/deploy.yml` will automatically:
- Build your application with static export
- Deploy to GitHub Pages on every push to main

### Custom Domain (Optional)

1. Add a `CNAME` file to your repository root with your domain
2. In GitHub Pages settings, add your custom domain
3. Enable "Enforce HTTPS"

## 4. Database Configuration

### Row Level Security (RLS)

The database schema includes basic RLS policies. For production, you may want to:

1. Implement proper authentication
2. Refine RLS policies based on your security requirements
3. Set up proper user roles and permissions

### Sample Data

The system automatically creates sample data for new businesses. To customize:

1. Edit the sample data functions in `src/lib/database.ts`
2. Modify the business types and equipment categories
3. Adjust pricing and availability rules

## 5. AI Features Configuration

### Anthropic API (Optional)

For enhanced website analysis:

1. Get an API key from [Anthropic](https://console.anthropic.com/)
2. Add it to your environment variables
3. The system will automatically use AI analysis when available

### Web Intelligence

The platform includes web intelligence features:
- Business reputation scoring
- Social media analysis
- Competitor research

Configure additional APIs for enhanced functionality:
- Google Places API for location data
- Yelp API for review analysis

## 6. Production Optimization

### Performance

- Enable Supabase connection pooling
- Configure CDN for static assets
- Optimize images and reduce bundle size

### Monitoring

- Set up Supabase monitoring and alerts
- Configure error tracking (Sentry, LogRocket)
- Monitor API rate limits and usage

### Security

- Review and tighten RLS policies
- Set up proper CORS configuration
- Enable rate limiting on API endpoints

## 7. Custom Branding

### Business Types

Add new business types in:
```typescript
// src/lib/database.ts
function getColorForType(type: string) {
  const colors = {
    your_new_type: { primary: '#YOUR_COLOR', secondary: '#YOUR_COLOR' }
  }
}
```

### UI Customization

- Modify color schemes in `tailwind.config.js`
- Update logos and assets in `public/`
- Customize email templates for notifications

## 8. Multi-Tenant Features

### Business Isolation

The platform supports multiple businesses with:
- Separate data isolation by `business_id`
- Custom branding per business
- Independent configuration and settings

### Subscription Management

Implement subscription features:
- Plan-based feature access
- Usage tracking and billing
- Trial management

## 9. Testing Deployment

### Local Testing

```bash
# Test static export locally
npm run build:github-pages
npx serve out

# Test Supabase connection
npm run supabase:start
npm run test
```

### Production Validation

After deployment:

1. Test the onboarding flow with a real website
2. Verify AI analysis is working
3. Create sample equipment and rentals
4. Test all CRUD operations
5. Verify responsive design on mobile

## 10. Troubleshooting

### Common Issues

**Build fails on GitHub Actions:**
- Check all environment variables are set
- Verify Supabase credentials are correct
- Ensure Node.js version compatibility

**Database connection errors:**
- Verify Supabase project is active
- Check RLS policies allow public access for onboarding
- Confirm environment variables are properly set

**AI analysis not working:**
- Anthropic API key is optional
- System falls back to content-based analysis
- Check API key format and permissions

### Support

For deployment issues:
1. Check the GitHub Actions logs
2. Review Supabase dashboard for errors
3. Test locally with production environment variables
4. Verify all secrets are properly configured

## Next Steps

Once deployed:
- Customize business types and equipment categories
- Set up custom domain and SSL
- Implement payment processing integration
- Add email notifications and alerts
- Set up analytics and monitoring

Your AI-powered rental platform is now ready for production use!