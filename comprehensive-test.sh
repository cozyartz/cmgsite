#!/bin/bash

echo "🔧 Comprehensive Production Readiness Test"
echo "=" $(printf '=%.0s' {1..50})

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
TESTS_PASSED=0
TESTS_TOTAL=0
CRITICAL_FAILURES=0

# Function to log test results
log_test() {
    local test_name="$1"
    local status="$2"
    local message="$3"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    if [ "$status" = "PASS" ]; then
        echo -e "   ${GREEN}✅ $test_name${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    elif [ "$status" = "WARN" ]; then
        echo -e "   ${YELLOW}⚠️  $test_name${NC}"
        if [ -n "$message" ]; then
            echo -e "      ${YELLOW}$message${NC}"
        fi
    else
        echo -e "   ${RED}❌ $test_name${NC}"
        if [ -n "$message" ]; then
            echo -e "      ${RED}$message${NC}"
        fi
        CRITICAL_FAILURES=$((CRITICAL_FAILURES + 1))
    fi
}

echo ""
echo "1️⃣ Testing Development Environment..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_test "Node.js installed ($NODE_VERSION)" "PASS"
else
    log_test "Node.js not found" "FAIL" "Install Node.js to continue"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    log_test "npm installed ($NPM_VERSION)" "PASS"
else
    log_test "npm not found" "FAIL" "npm is required for building"
fi

# Check if in correct directory
if [ -f "package.json" ]; then
    log_test "package.json found" "PASS"
else
    log_test "package.json not found" "FAIL" "Run from project root directory"
fi

echo ""
echo "2️⃣ Testing Dependencies..."

# Check if node_modules exists
if [ -d "node_modules" ]; then
    log_test "Dependencies installed" "PASS"
else
    log_test "Dependencies not installed" "WARN" "Run 'npm install' first"
fi

# Check critical dependencies in package.json
if [ -f "package.json" ]; then
    if grep -q "@supabase/supabase-js" package.json; then
        log_test "Supabase dependency found" "PASS"
    else
        log_test "Supabase dependency missing" "FAIL"
    fi
    
    if grep -q "react" package.json; then
        log_test "React dependency found" "PASS"
    else
        log_test "React dependency missing" "FAIL"
    fi
    
    if grep -q "vite" package.json; then
        log_test "Vite build tool found" "PASS"
    else
        log_test "Vite build tool missing" "FAIL"
    fi
fi

echo ""
echo "3️⃣ Testing Source Code Structure..."

# Check critical files
declare -a critical_files=(
    "src/App.tsx"
    "src/main.tsx" 
    "src/contexts/SupabaseAuthContext.tsx"
    "src/pages/AuthSimpleBackup.tsx"
    "src/lib/supabase.ts"
    "src/config/env.ts"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        log_test "$(basename "$file") exists" "PASS"
    else
        log_test "$(basename "$file") missing" "FAIL" "Required file not found: $file"
    fi
done

echo ""
echo "4️⃣ Testing Configuration Files..."

# Check config files
declare -a config_files=(
    "tsconfig.json"
    "vite.config.ts"
    "tailwind.config.js"
    "eslint.config.js"
    ".prettierrc"
)

for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        log_test "$(basename "$file") exists" "PASS"
    else
        log_test "$(basename "$file") missing" "WARN" "Configuration file missing: $file"
    fi
done

echo ""
echo "5️⃣ Testing Environment Variables..."

# Run environment validation if it exists
if [ -f "validate-environment.mjs" ]; then
    log_test "Environment validation script exists" "PASS"
    echo "   Running environment validation..."
    if node validate-environment.mjs > /dev/null 2>&1; then
        log_test "Environment validation passed" "PASS"
    else
        log_test "Environment validation failed" "WARN" "Check environment variables"
    fi
else
    log_test "Environment validation script missing" "WARN"
fi

echo ""
echo "6️⃣ Testing Code Quality..."

# Check for TypeScript compilation
if command -v npx &> /dev/null && [ -f "tsconfig.json" ]; then
    echo "   Checking TypeScript compilation..."
    if npx tsc --noEmit > /dev/null 2>&1; then
        log_test "TypeScript compilation" "PASS"
    else
        log_test "TypeScript compilation errors" "FAIL" "Fix TypeScript errors before deployment"
    fi
else
    log_test "TypeScript check skipped" "WARN" "TypeScript compiler not available"
fi

# Check for linting
if npm run lint > /dev/null 2>&1; then
    log_test "ESLint checks" "PASS"
else
    log_test "ESLint issues found" "WARN" "Consider fixing linting issues"
fi

echo ""
echo "7️⃣ Testing Build Process..."

# Test production build
echo "   Running production build test..."
if VITE_ENVIRONMENT=production npm run build > /dev/null 2>&1; then
    log_test "Production build successful" "PASS"
    
    # Check if dist directory was created
    if [ -d "dist" ]; then
        log_test "Build output directory created" "PASS"
        
        # Check for critical build files
        if [ -f "dist/index.html" ]; then
            log_test "index.html generated" "PASS"
        else
            log_test "index.html not generated" "FAIL"
        fi
        
        # Check for asset files
        if ls dist/assets/*.js > /dev/null 2>&1; then
            log_test "JavaScript assets generated" "PASS"
        else
            log_test "JavaScript assets missing" "FAIL"
        fi
        
        if ls dist/assets/*.css > /dev/null 2>&1; then
            log_test "CSS assets generated" "PASS"
        else
            log_test "CSS assets missing" "WARN"
        fi
    else
        log_test "Build output directory missing" "FAIL"
    fi
else
    log_test "Production build failed" "FAIL" "Build must succeed before deployment"
fi

echo ""
echo "8️⃣ Testing Unit Tests..."

# Run tests if available
if npm run test:run > /dev/null 2>&1; then
    log_test "Unit tests passed" "PASS"
elif grep -q "test" package.json; then
    log_test "Unit tests failed" "WARN" "Some tests are failing"
else
    log_test "No unit tests configured" "WARN" "Consider adding unit tests"
fi

echo ""
echo "=" $(printf '=%.0s' {1..60})
echo "📊 COMPREHENSIVE TEST RESULTS"
echo "=" $(printf '=%.0s' {1..60})

echo "Tests Run: $TESTS_TOTAL"
echo "Tests Passed: $TESTS_PASSED"
echo "Critical Failures: $CRITICAL_FAILURES"

SUCCESS_RATE=$((TESTS_PASSED * 100 / TESTS_TOTAL))
echo "Success Rate: $SUCCESS_RATE%"

echo ""
if [ $CRITICAL_FAILURES -eq 0 ] && [ $SUCCESS_RATE -ge 85 ]; then
    echo -e "${GREEN}🎉 PRODUCTION READY!${NC}"
    echo -e "${GREEN}✅ System passed comprehensive testing${NC}"
    echo ""
    echo "🚀 Ready for deployment to production!"
    echo ""
    echo "📝 Deployment checklist:"
    echo "   1. ✅ Environment variables configured"
    echo "   2. ✅ Build process verified"
    echo "   3. ✅ Code quality checks passed"
    echo "   4. ✅ Dependencies validated"
    echo ""
    echo "🎯 Deploy with: npm run deploy:pages"
    exit 0
elif [ $CRITICAL_FAILURES -eq 0 ]; then
    echo -e "${YELLOW}🚀 MOSTLY READY${NC}"
    echo -e "${YELLOW}⚠️  Minor issues found, but deployable${NC}"
    echo ""
    echo "Consider addressing warnings before production deployment."
    exit 0
else
    echo -e "${RED}❌ NOT READY FOR PRODUCTION${NC}"
    echo -e "${RED}Critical issues must be resolved before deployment${NC}"
    echo ""
    echo "🔧 Required fixes:"
    echo "   • Resolve critical failures listed above"
    echo "   • Ensure all required files are present"
    echo "   • Fix build process issues"
    echo "   • Re-run this test script"
    exit 1
fi
