# Quick Start: CI/CD Setup

## ✅ What's Been Configured

Your project now has a complete CI/CD pipeline with:
- ✅ Automated testing and linting on PRs
- ✅ Automatic deployment to Vercel
- ✅ Separate staging and production environments
- ✅ Security scanning
- ✅ Database migration workflows

## 🚀 Quick Setup (5 minutes)

### Step 1: Set Up GitHub Repository
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Add CI/CD configuration"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main

# Create develop branch
git checkout -b develop
git push -u origin develop
```

### Step 2: Add GitHub Secrets

Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

Click "New repository secret" and add these:

#### Required Secrets:
```
DATABASE_URL=postgresql://username:password@host/database
STAGING_DATABASE_URL=postgresql://username:password@host/staging_db
JWT_SECRET=your-random-secret-at-least-32-chars
STAGING_JWT_SECRET=your-staging-secret-at-least-32-chars
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
STAGING_APP_URL=https://staging-your-domain.com
```

#### Vercel Secrets (after Step 3):
```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

### Step 3: Set Up Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Get your credentials
cat .vercel/project.json
```

Copy the `orgId` and `projectId` to GitHub Secrets.

### Step 4: Create Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Copy the token
5. Add it to GitHub Secrets as `VERCEL_TOKEN`

### Step 5: Configure GitHub Environments

1. Go to **Settings → Environments**
2. Create two environments:
   - `production`
   - `staging`
3. (Optional) Add protection rules for production

## 🎯 How to Use

### For New Features:
```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push and create PR to develop
git push origin feature/your-feature
```

Then open a PR on GitHub from `feature/your-feature` → `develop`

### For Production Release:
```bash
# Create PR from develop to main on GitHub
# After approval and merge, production deployment happens automatically
```

## 📊 Workflow Overview

```
Feature Branch → PR → develop (CI runs) → Merge → Staging Deployment
                                                         ↓
                                              Test on staging
                                                         ↓
                           develop → PR → main (CI runs) → Merge → Production Deployment
```

## 🔍 Check Pipeline Status

1. Go to **Actions** tab in GitHub
2. See all workflow runs
3. Click on any run to see details

## 📖 Full Documentation

- [CI/CD Documentation](.github/CICD.md)
- [Environment Setup](.github/ENV_SETUP.md)

## 🛠️ Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run db:push      # Push database schema changes
npm run db:studio    # Open Drizzle Studio
npm run db:generate  # Generate migration files
```

## 🔐 Security Notes

- Never commit `.env.local` file
- All secrets are encrypted in GitHub
- Use different secrets for staging and production
- Rotate secrets regularly

## ❓ Troubleshooting

### Build fails in CI
- Check TypeScript errors: `npm run type-check`
- Check lint errors: `npm run lint`
- Ensure all dependencies are in package.json

### Deployment fails
- Verify all GitHub secrets are set
- Check Vercel token is valid
- Ensure DATABASE_URL is accessible from Vercel

### Need Help?
- Check workflow logs in Actions tab
- Review [CICD.md](.github/CICD.md) for detailed docs
- Check [ENV_SETUP.md](.github/ENV_SETUP.md) for environment variables

## 🎉 You're All Set!

Your CI/CD pipeline is ready. Just add the GitHub secrets and push your code!
