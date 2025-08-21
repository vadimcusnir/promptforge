# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

Please report (suspected) security vulnerabilities to **[security@promptforge.ai]**. You will receive a response from us within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity but historically within a few days.

## Security Measures

### Dependency Management
- All dependencies are pinned to exact versions
- Regular security audits using `npm audit`
- Automated dependency updates via Dependabot
- SBOM generation for dependency transparency

### Code Security
- ESLint security plugin for static analysis
- CodeQL analysis for vulnerability detection
- Pre-commit hooks for secret detection
- Conventional commits with GPG signing

### Infrastructure Security
- Security headers configured in Vercel
- Node.js version pinned for reproducible builds
- Frozen lockfile for consistent dependencies
- Secret scanning in CI/CD pipeline

### Development Security
- Pre-commit hooks prevent secret commits
- Lint-staged runs security checks
- Automated security scanning on PRs
- Weekly security scans scheduled

## Security Best Practices

### For Developers
1. Never commit secrets, API keys, or sensitive data
2. Use environment variables for configuration
3. Keep dependencies up to date
4. Follow conventional commit messages
5. Sign commits with GPG
6. Run security lints before committing

### For Deployments
1. Use pinned Node.js versions
2. Enable security headers
3. Monitor for vulnerabilities
4. Regular security audits
5. Implement proper access controls

## Security Tools Used

- **ESLint Security Plugin**: Static code analysis
- **CodeQL**: Advanced semantic code analysis
- **TruffleHog**: Secret detection
- **npm audit**: Dependency vulnerability scanning
- **Dependabot**: Automated dependency updates
- **CycloneDX**: SBOM generation
- **Husky**: Git hooks for security checks

## Vulnerability Response

1. **Assessment**: Evaluate the severity and impact
2. **Containment**: Implement immediate mitigations
3. **Fix**: Develop and test the security patch
4. **Release**: Deploy the fix with security advisory
5. **Communication**: Notify users and stakeholders

## Security Contacts

- **Security Team**: security@promptforge.ai
- **Maintainer**: vadimcusnir@promptforge.ai

## Acknowledgments

We appreciate the security community's efforts in responsibly disclosing vulnerabilities to us.
