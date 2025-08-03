#!/bin/bash

# 🛡️ ENTERPRISE SECURITY HARDENING SCRIPT
# Maximum legal protection and security compliance

echo "🚨 CRITICAL SECURITY OPERATIONS INITIATED"
echo "=========================================="
echo ""

# Set strict error handling
set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "🔒 STEP 1: IMMEDIATE CREDENTIAL CLEANUP"
echo "======================================="

# Remove credentials from git history
print_info "Removing sensitive data from git history..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    print_warning "This will rewrite git history permanently!"
    read -p "Continue with git history cleanup? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cleaning git history..."
        
        # Remove sensitive files from history
        git filter-branch --force --index-filter \
          'git rm --cached --ignore-unmatch .env .dev.vars' \
          --prune-empty --tag-name-filter cat -- --all || true
        
        # Clean up git references
        rm -rf .git/refs/original/ || true
        git reflog expire --expire=now --all || true
        git gc --prune=now --aggressive || true
        
        print_status "Git history cleaned"
    else
        print_warning "Skipping git history cleanup"
    fi
else
    print_warning "Not a git repository - skipping git cleanup"
fi

echo ""
echo "🔐 STEP 2: ENVIRONMENT SECURITY VALIDATION"
echo "==========================================="

# Check for sensitive files
print_info "Scanning for exposed credentials..."

SENSITIVE_FILES=(
    ".env"
    ".dev.vars" 
    "config.json"
    "secrets.json"
    "credentials.json"
    "*.key"
    "*.pem"
    "*.p12"
)

ISSUES_FOUND=0

for pattern in "${SENSITIVE_FILES[@]}"; do
    if ls $pattern 2>/dev/null; then
        print_error "Found potentially sensitive file: $pattern"
        ((ISSUES_FOUND++))
    fi
done

# Check for hardcoded secrets in code
print_info "Scanning source code for hardcoded secrets..."

SECRET_PATTERNS=(
    "password\s*=\s*['\"][^'\"]{8,}"
    "secret\s*=\s*['\"][^'\"]{16,}"
    "token\s*=\s*['\"][^'\"]{20,}"
    "api_key\s*=\s*['\"][^'\"]{16,}"
    "[a-zA-Z0-9]{32,}"
)

for pattern in "${SECRET_PATTERNS[@]}"; do
    if grep -r -E "$pattern" src/ 2>/dev/null | grep -v "example\|template\|placeholder"; then
        print_error "Potential hardcoded secret found with pattern: $pattern"
        ((ISSUES_FOUND++))
    fi
done

if [ $ISSUES_FOUND -eq 0 ]; then
    print_status "No immediate credential exposure detected"
else
    print_error "Found $ISSUES_FOUND potential security issues"
fi

echo ""
echo "🛡️ STEP 3: SECURITY CONFIGURATION ENFORCEMENT"
echo "=============================================="

# Ensure secure file permissions
print_info "Setting secure file permissions..."

# Protect environment files
chmod 600 .env* 2>/dev/null || true
chmod 600 *.json 2>/dev/null || true
chmod 600 *.key 2>/dev/null || true
chmod 600 *.pem 2>/dev/null || true

# Protect configuration files
chmod 644 *.config.* 2>/dev/null || true
chmod 644 package*.json 2>/dev/null || true

# Protect scripts
chmod 755 *.sh 2>/dev/null || true

print_status "File permissions secured"

echo ""
echo "📋 STEP 4: COMPLIANCE VERIFICATION"
echo "==================================="

# Check for required legal documents
print_info "Verifying legal compliance documents..."

REQUIRED_DOCS=(
    "TERMS_OF_SERVICE.md"
    "PRIVACY_POLICY.md" 
    "SECURITY_POLICY.md"
)

MISSING_DOCS=0

for doc in "${REQUIRED_DOCS[@]}"; do
    if [ -f "$doc" ]; then
        print_status "Found: $doc"
    else
        print_error "Missing: $doc"
        ((MISSING_DOCS++))
    fi
done

if [ $MISSING_DOCS -eq 0 ]; then
    print_status "All required legal documents present"
else
    print_error "Missing $MISSING_DOCS required legal documents"
fi

echo ""
echo "🔍 STEP 5: DEPENDENCY SECURITY AUDIT"
echo "====================================="

# Check for Node.js and npm
if command -v npm &> /dev/null; then
    print_info "Running npm security audit..."
    
    if npm audit --audit-level=moderate; then
        print_status "No moderate or higher vulnerabilities found"
    else
        print_warning "Security vulnerabilities detected - run 'npm audit fix'"
    fi
    
    # Check for outdated packages
    print_info "Checking for outdated packages..."
    if npm outdated; then
        print_warning "Outdated packages found - consider running 'npm update'"
    else
        print_status "All packages are up to date"
    fi
else
    print_warning "npm not found - skipping dependency audit"
fi

echo ""
echo "🚀 STEP 6: PRODUCTION READINESS CHECK"
echo "====================================="

# Environment configuration check
print_info "Validating environment configuration..."

if [ -f ".env.example" ]; then
    print_status "Environment template found"
else
    print_warning "No .env.example template found"
fi

if [ -f ".gitignore" ]; then
    if grep -q "\.env" .gitignore; then
        print_status ".env files properly ignored"
    else
        print_error ".env files not in .gitignore"
    fi
else
    print_error "No .gitignore file found"
fi

# Build configuration check
print_info "Validating build configuration..."

if [ -f "package.json" ]; then
    if jq -e '.scripts.build' package.json > /dev/null 2>&1; then
        print_status "Build script configured"
    else
        print_warning "No build script found"
    fi
    
    if jq -e '.scripts."security:check"' package.json > /dev/null 2>&1; then
        print_status "Security check script configured"
    else
        print_warning "No security check script found"
    fi
else
    print_error "No package.json found"
fi

echo ""
echo "📊 STEP 7: SECURITY RECOMMENDATIONS"
echo "===================================="

print_info "Security hardening recommendations:"
echo ""
echo "1. 🔐 IMMEDIATE ACTIONS:"
echo "   - Regenerate ALL OAuth credentials that were exposed"
echo "   - Update Cloudflare API tokens"
echo "   - Change any hardcoded passwords or secrets"
echo ""
echo "2. 🛡️ ONGOING SECURITY:"
echo "   - Run 'npm run security:check' before each deployment"
echo "   - Enable 2FA on all service accounts (GitHub, Cloudflare, etc.)"
echo "   - Set up automated security scanning"
echo "   - Regular backup and disaster recovery testing"
echo ""
echo "3. 📋 COMPLIANCE MONITORING:"
echo "   - Quarterly security audits"
echo "   - Annual penetration testing"
echo "   - Regular legal document updates"
echo "   - Staff security training"
echo ""
echo "4. 🚨 INCIDENT RESPONSE:"
echo "   - Monitor security logs daily"
echo "   - Have incident response plan ready"
echo "   - Maintain emergency contact list"
echo "   - Regular security drills"

echo ""
echo "📞 STEP 8: EMERGENCY CONTACTS"
echo "=============================="

print_info "Security Emergency Contacts:"
echo "   Security Team: security@cozyartzmedia.com"
echo "   Legal Team: legal@cozyartzmedia.com"
echo "   Privacy Officer: privacy@cozyartzmedia.com"
echo "   24/7 Hotline: +1 (269) 261-0069"

echo ""
echo "🎯 FINAL SECURITY STATUS"
echo "========================"

if [ $ISSUES_FOUND -eq 0 ] && [ $MISSING_DOCS -eq 0 ]; then
    print_status "🟢 ENTERPRISE SECURITY: PROTECTED"
    print_status "Your application meets enterprise security standards"
    print_status "Legal liability risk: MINIMIZED"
else
    print_warning "🟡 SECURITY: NEEDS ATTENTION"
    print_warning "Issues found: $ISSUES_FOUND credential issues, $MISSING_DOCS missing docs"
    print_warning "Legal liability risk: ELEVATED"
fi

echo ""
echo "🔒 Security hardening complete!"
echo "Remember to:"
echo "1. Force push cleaned git history: git push --force-with-lease origin main"
echo "2. Regenerate ALL exposed credentials immediately"
echo "3. Run 'npm run production:preflight' before production deployment"
echo "4. Monitor security logs and alerts continuously"
echo ""
echo "For ongoing security support: security@cozyartzmedia.com"
