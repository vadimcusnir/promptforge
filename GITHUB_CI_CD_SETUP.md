# GitHub CI/CD Setup Guide

**Project**: PromptForge v3  
**Status**: Implementation Complete ✅  
**Next Step**: Repository Configuration

## 🎯 **Setup Overview**

The CI/CD system is fully implemented with all workflows. Now we need to configure GitHub repository settings to enable the pipeline.

## 🔧 **Step 1: Branch Protection Rules**

### **Enable Branch Protection for `main` branch**

1. Go to your GitHub repository
2. Navigate to **Settings** → **Branches**
3. Click **Add rule** for the `main` branch
4. Configure the following settings:

```yaml
Branch name pattern: main
✅ Require a pull request before merging
✅ Require status checks to pass before merging
✅ Require branches to be up to date before merging
✅ Require conversation resolution before merging

Status checks that are required:
- lint-typecheck
- unit-tests  
- build
- security-scan

✅ Require signed commits
✅ Require linear history
✅ Include administrators
✅ Restrict pushes that create files
✅ Restrict deletions
```

### **Enable Branch Protection for `develop` branch**

1. Add another rule for the `develop` branch
2. Use the same settings as `main` but with:
   - **Status checks**: Same required checks
   - **Allow force pushes**: ✅ (for development workflow)

## 🔐 **Step 2: Environment Configuration**

### **Create Preview Environment**

1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name: `preview`
4. **Protection rules**: None (automatic deployment)
5. **Deployment branches**: `feature/*`, `bugfix/*`, `hotfix/*`

### **Create Production Environment**

1. Click **New environment** again
2. Name: `production`
3. **Protection rules**: 
   - ✅ **Required reviewers**: Add your username
   - ✅ **Wait timer**: 0 minutes
   - ✅ **Deployment branches**: `main` only

## 🔑 **Step 3: Repository Secrets**

### **Required Secrets**

Go to **Settings** → **Secrets and variables** → **Actions**

```bash
# Vercel Integration
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id_here  
VERCEL_PROJECT_ID=your_vercel_project_id_here

# Optional: Additional Security
GITHUB_TOKEN=auto_generated
```

### **How to Get Vercel Credentials**

1. **VERCEL_TOKEN**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to **Settings** → **Tokens**
   - Click **Create** → **New Token**
   - Name: `PromptForge-CI-CD`
   - Scope: `Full Account`
   - Copy the generated token

2. **VERCEL_ORG_ID**:
   - Go to **Settings** → **General**
   - Copy **Team ID** (if team) or **User ID** (if personal)

3. **VERCEL_PROJECT_ID**:
   - Go to your project in Vercel
   - Navigate to **Settings** → **General**
   - Copy **Project ID**

## 🚀 **Step 4: Test the Pipeline**

### **Create Test Pull Request**

1. Create a new branch: `test-ci-cd`
2. Make a small change (e.g., add a comment)
3. Push and create PR
4. Watch the GitHub Actions tab

### **Expected Workflow Execution**

```yaml
Jobs that should run:
1. lint-typecheck ✅ (runs first)
2. unit-tests ✅ (waits for lint-typecheck)
3. build ✅ (waits for unit-tests)
4. security-scan ✅ (runs in parallel)
5. deploy-preview ✅ (waits for build)
```

### **Verify Status Checks**

All status checks should show as ✅ green:
- `lint-typecheck`
- `unit-tests`
- `build`
- `security-scan`

## 🔍 **Step 5: Monitor and Optimize**

### **Check Workflow Performance**

1. Go to **Actions** tab
2. Click on any workflow run
3. Review execution times
4. Look for optimization opportunities

### **Security Scanning Results**

1. **CodeQL**: Check **Security** tab for results
2. **Semgrep**: Review workflow logs for findings
3. **npm audit**: Check for vulnerability alerts

### **Cache Performance**

Monitor cache hit rates:
- pnpm store cache
- Next.js build cache
- TypeScript build info

## 🚨 **Troubleshooting Common Issues**

### **Workflow Not Triggering**

- ✅ Check branch protection rules
- ✅ Verify workflow file exists in `.github/workflows/`
- ✅ Check for syntax errors in YAML

### **Status Checks Failing**

- **lint-typecheck**: Run `pnpm lint` locally
- **unit-tests**: Run `pnpm test` locally
- **build**: Run `pnpm build` locally
- **security-scan**: Check security script outputs

### **Deployment Issues**

- ✅ Verify Vercel secrets are correct
- ✅ Check Vercel project permissions
- ✅ Review environment protection rules

### **Cache Issues**

- Clear GitHub Actions cache
- Check cache key patterns
- Verify cache paths exist

## 📊 **Expected Results**

### **Successful PR Preview**

```markdown
🚀 **Preview Deployment Ready!**

Your changes have been deployed to: https://promptforge-v3-git-test-ci-cd-username.vercel.app

This preview will be available until the PR is closed or merged.
```

### **Production Deployment**

```bash
🚀 Production deployment successful!
Deployed commit: abc123...
Deployed by: username
```

## 🎉 **Success Criteria**

- ✅ **All status checks pass** on every PR
- ✅ **Preview deployments** work automatically
- ✅ **Production deployments** require approval
- ✅ **Security scanning** runs on every commit
- ✅ **Cache optimization** reduces build times
- ✅ **Quality gates** prevent bad code from merging

## 🔮 **Next Steps After Setup**

1. **Monitor Performance**: Track workflow execution times
2. **Security Reviews**: Regular review of CodeQL and Semgrep results
3. **Cache Optimization**: Monitor cache hit rates
4. **Team Training**: Educate team on CI/CD workflow
5. **Documentation**: Update team documentation with new process

---

**Status**: Ready for Configuration ⚙️  
**Implementation**: Complete ✅  
**Next Action**: Configure GitHub Repository Settings
