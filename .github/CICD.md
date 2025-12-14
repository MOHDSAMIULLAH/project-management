# CI/CD Documentation

## Overview

This project uses GitHub Actions for Continuous Integration (CI) and Continuous Deployment (CD) to ensure code quality and automate deployments.

## Workflows

### 1. Continuous Integration (CI)
**File:** `.github/workflows/ci.yml`

**Triggers:**
- Pull requests to `main` or `develop` branches
- Pushes to `main` or `develop` branches

**Jobs:**
- **Lint and Type Check**: Runs Biome, ESLint, and TypeScript type checking
- **Build**: Compiles the Next.js application to verify build success
- **Security Scan**: Performs npm audit and checks for outdated dependencies

### 2. Continuous Deployment - Production (CD)
**File:** `.github/workflows/cd.yml`

**Triggers:**
- Pushes to `main` branch
- Manual workflow dispatch

**Jobs:**
- **Deploy**: Builds and deploys application to Vercel production
- **Notify**: Sends deployment status notifications

### 3. Staging Deployment
**File:** `.github/workflows/staging.yml`

**Triggers:**
- Pushes to `develop` branch
- Manual workflow dispatch

**Jobs:**
- **Deploy Staging**: Builds and deploys application to Vercel preview environment

## Branch Strategy

```
main (production)
  ↑
develop (staging)
  ↑
feature/feature-name
```

- **main**: Production-ready code, deploys to production
- **develop**: Integration branch, deploys to staging
- **feature/***: Feature branches, tested via CI on PRs

## Deployment Flow

### For Feature Development:
1. Create feature branch from `develop`
2. Make changes and commit
3. Open PR to `develop`
4. CI runs automatically (lint, type-check, build, security scan)
5. After approval and merge, staging deployment triggers
6. Test on staging environment

### For Production Release:
1. Create PR from `develop` to `main`
2. CI runs automatically
3. After approval and merge, production deployment triggers
4. Application deployed to production

## Manual Deployments

You can trigger deployments manually:

1. Go to Actions tab in GitHub
2. Select the workflow (CD or Staging)
3. Click "Run workflow"
4. Select the branch
5. Click "Run workflow"

## Environment Configuration

See [ENV_SETUP.md](.github/ENV_SETUP.md) for detailed environment variable configuration.

## Monitoring

### Build Status
- Check the Actions tab in GitHub for workflow runs
- Failed builds will show red ❌
- Successful builds will show green ✅

### Deployment Verification
- Production: Check the deployment URL in the workflow output
- Staging: Check the preview URL in the workflow output

## Rollback Strategy

If a deployment fails or causes issues:

1. **Quick Fix**: 
   - Create hotfix branch from `main`
   - Make fix and merge back to `main`
   - New deployment will trigger automatically

2. **Revert**: 
   - Revert the problematic commit on `main`
   - Push to trigger new deployment
   - Fix issue properly in `develop`

3. **Vercel Dashboard**:
   - Log into Vercel dashboard
   - Select previous working deployment
   - Click "Promote to Production"

## Troubleshooting

### Build Failures
- Check the GitHub Actions logs
- Common issues:
  - TypeScript errors
  - Missing environment variables
  - Dependency conflicts

### Deployment Failures
- Verify all GitHub secrets are set correctly
- Check Vercel project configuration
- Ensure database is accessible

### Environment Variables Missing
- Verify secrets in GitHub Settings > Secrets and variables > Actions
- Check `.env.local` creation step in workflow

## Best Practices

1. **Always** create PRs for code review
2. **Never** push directly to `main`
3. **Test** on staging before merging to main
4. **Monitor** deployments after merge
5. **Keep** dependencies updated regularly
6. **Review** security audit results

## Adding New Workflows

To add a new workflow:

1. Create a new `.yml` file in `.github/workflows/`
2. Define triggers, jobs, and steps
3. Add required secrets to GitHub
4. Test with a dummy commit
5. Document the workflow in this file

## Performance Optimization

- Workflows use npm cache to speed up dependency installation
- Build artifacts are saved for 7 days
- Parallel jobs where possible (lint, type-check, security scan)

## Security

- All sensitive data stored as GitHub Secrets
- Secrets are encrypted at rest
- Never log secrets in workflow outputs
- Regular security audits via npm audit
- Dependency updates monitored
