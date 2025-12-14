# Environment Variables Configuration

This document lists all required environment variables for the project.

## Required Secrets for GitHub Actions

### General Secrets
- `DATABASE_URL`: PostgreSQL database connection string (production)
- `STAGING_DATABASE_URL`: PostgreSQL database connection string (staging)
- `JWT_SECRET`: Secret key for JWT token signing (production)
- `STAGING_JWT_SECRET`: Secret key for JWT token signing (staging)
- `GEMINI_API_KEY`: Google Gemini API key for AI features
- `NEXT_PUBLIC_APP_URL`: Public URL of your application (production)
- `STAGING_APP_URL`: Public URL of your staging application

### Vercel Deployment Secrets
- `VERCEL_TOKEN`: Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each secret listed above

## Local Development

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Obtaining Vercel Credentials

### Get Vercel Token
```bash
npm i -g vercel
vercel login
vercel token create
```

### Get Vercel Org ID and Project ID
```bash
# Link your project to Vercel
vercel link

# Check .vercel/project.json for:
# - orgId (VERCEL_ORG_ID)
# - projectId (VERCEL_PROJECT_ID)
```

## Database Setup

This project uses Neon PostgreSQL. To set up:

1. Create a Neon account at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Add it to your GitHub secrets as `DATABASE_URL`
5. For staging, create a separate database and add as `STAGING_DATABASE_URL`

## Security Notes

- Never commit `.env.local` or `.env` files to version control
- Rotate secrets regularly
- Use different secrets for production and staging environments
- Ensure JWT_SECRET is at least 32 characters long
