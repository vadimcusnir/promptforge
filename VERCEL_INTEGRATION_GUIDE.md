# Vercel Integration Guide

**Project**: PromptForge v3  
**Purpose**: CI/CD Preview & Production Deployments  
**Status**: Ready for Configuration ⚙️

## 🎯 **Integration Overview**

Vercel integration enables automatic preview deployments for PRs and production deployments for the main branch.

## 🚀 **Step 1: Vercel Project Setup**

### **Create New Vercel Project**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **New Project**
3. Import your GitHub repository: `promptforge`
4. Configure project settings:

```yaml
Framework Preset: Next.js
Root Directory: ./
Build Command: pnpm build
Output Directory: .next
Install Command: pnpm install
```

### **Environment Variables**

Add these environment variables in Vercel:

```bash
# Database
DATABASE_URL=your_supabase_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Analytics & Monitoring
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Feature Flags
NEXT_PUBLIC_COMING_SOON=false
```

## 🔑 **Step 2: Generate Vercel Credentials**

### **VERCEL_TOKEN**

1. Go to **Settings** → **Tokens**
2. Click **Create** → **New Token**
3. Configure:
   - **Name**: `PromptForge-CI-CD`
   - **Scope**: `Full Account`
   - **Expiration**: `No expiration` (or set custom)
4. Copy the generated token

### **VERCEL_ORG_ID**

1. Go to **Settings** → **General**
2. Copy the **Team ID** (if team account) or **User ID** (if personal)

### **VERCEL_PROJECT_ID**

1. Go to your project dashboard
2. Navigate to **Settings** → **General**
3. Copy the **Project ID**

## ⚙️ **Step 3: GitHub Secrets Configuration**

### **Add Repository Secrets**

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:

```bash
VERCEL_TOKEN=your_generated_token
VERCEL_ORG_ID=your_org_or_user_id
VERCEL_PROJECT_ID=your_project_id
```

### **Verify Secret Names**

Ensure exact naming (case-sensitive):
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 🔄 **Step 4: Test Integration**

### **Create Test Branch**

```bash
git checkout -b test-vercel-integration
git add .
git commit -m "test: vercel integration"
git push origin test-vercel-integration
```

### **Create Pull Request**

1. Go to GitHub repository
2. Click **Compare & pull request**
3. Create PR from `test-vercel-integration` to `main`
4. Watch the **Actions** tab

### **Expected Workflow**

```yaml
Jobs:
1. lint-typecheck ✅
2. unit-tests ✅  
3. build ✅
4. security-scan ✅
5. deploy-preview ✅ (Vercel integration)
```

## 📊 **Step 5: Verify Deployment**

### **Check Vercel Dashboard**

1. Go to Vercel project dashboard
2. Check **Deployments** tab
3. Look for preview deployment
4. Verify URL format: `https://promptforge-v3-git-test-vercel-integration-username.vercel.app`

### **Check GitHub PR**

1. Go back to GitHub PR
2. Look for comment:
```markdown
🚀 **Preview Deployment Ready!**

Your changes have been deployed to: [Vercel URL]

This preview will be available until the PR is closed or merged.
```

## 🚨 **Troubleshooting**

### **Deployment Fails**

**Common Issues:**
- ❌ Invalid Vercel token
- ❌ Incorrect org/project ID
- ❌ Missing environment variables
- ❌ Build failures

**Solutions:**
1. Verify all secrets are correct
2. Check Vercel project permissions
3. Review build logs for errors
4. Ensure environment variables are set

### **Preview Not Working**

**Check:**
1. GitHub Actions workflow status
2. Vercel deployment logs
3. Environment variable configuration
4. Project settings in Vercel

### **Build Failures**

**Common Causes:**
- Missing dependencies
- Environment variable issues
- Build command errors
- TypeScript compilation errors

**Debug:**
1. Run `pnpm build` locally
2. Check Vercel build logs
3. Verify package.json scripts
4. Review TypeScript configuration

## ⚡ **Performance Optimization**

### **Build Caching**

Vercel automatically caches:
- Dependencies (`node_modules`)
- Build outputs (`.next`)
- TypeScript compilation

### **Deployment Speed**

**Optimizations:**
- Use pnpm for faster installs
- Optimize build commands
- Minimize bundle size
- Leverage Vercel's edge network

## 🔐 **Security Considerations**

### **Token Security**

- ✅ Use dedicated CI/CD token
- ✅ Set appropriate scope
- ✅ Regular token rotation
- ✅ Monitor token usage

### **Environment Variables**

- ✅ Never commit secrets
- ✅ Use Vercel's encrypted variables
- ✅ Limit access to production values
- ✅ Regular security audits

## 📈 **Monitoring & Analytics**

### **Vercel Analytics**

1. **Performance**: Core Web Vitals
2. **Deployments**: Success/failure rates
3. **Build Times**: Optimization opportunities
4. **Error Tracking**: Runtime issues

### **GitHub Actions**

1. **Workflow Status**: Success/failure rates
2. **Execution Times**: Performance metrics
3. **Cache Hit Rates**: Optimization data
4. **Security Results**: Vulnerability reports

## 🎉 **Success Criteria**

- ✅ **Preview Deployments**: Work for all PRs
- ✅ **Production Deployments**: Trigger on main branch
- ✅ **Automatic Comments**: PR preview URLs
- ✅ **Build Success**: All deployments complete
- ✅ **Performance**: Fast build and deploy times

## 🔮 **Next Steps**

1. **Test Integration**: Create test PR and verify deployment
2. **Monitor Performance**: Track build and deploy times
3. **Optimize Builds**: Reduce build times and bundle sizes
4. **Security Review**: Regular vulnerability scanning
5. **Team Training**: Educate on new deployment process

---

**Status**: Ready for Vercel Setup ⚙️  
**Integration**: GitHub Actions + Vercel  
**Next Action**: Configure Vercel Project & Add Secrets
