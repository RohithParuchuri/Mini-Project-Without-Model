#!/bin/bash

echo "🚀 CYBERGUARD AUTHENTICATION SYSTEM - STARTUP TEST"
echo "=================================================="
echo ""

# Test 1: Check MongoDB URI
echo "✓ Checking MongoDB URI..."
if grep -q "cyberguard?retryWrites=true&w=majority" backend/.env; then
    echo "  ✅ MongoDB URI is complete"
else
    echo "  ❌ MongoDB URI is incomplete"
    exit 1
fi

# Test 2: Check JWT Secrets
echo ""
echo "✓ Checking JWT Secrets..."
JWT_SECRET=$(grep "JWT_SECRET=" backend/.env | cut -d'=' -f2)
if [ ${#JWT_SECRET} -gt 30 ]; then
    echo "  ✅ JWT_SECRET is set (${#JWT_SECRET} chars)"
else
    echo "  ❌ JWT_SECRET is too short"
fi

# Test 3: Check CORS
echo ""
echo "✓ Checking CORS Configuration..."
if grep -q "http://localhost:5173" backend/.env; then
    echo "  ✅ CORS includes frontend URL (http://localhost:5173)"
else
    echo "  ❌ CORS doesn't include frontend URL"
fi

# Test 4: Check npm dependencies
echo ""
echo "✓ Checking npm dependencies..."
if [ -d "backend/node_modules" ]; then
    npm_count=$(ls backend/node_modules | wc -l)
    echo "  ✅ node_modules exists (${npm_count} packages installed)"
else
    echo "  ⚠️  node_modules not found, run: cd backend && npm install"
fi

echo ""
echo "=================================================="
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1️⃣  START BACKEND (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "   ⏳ Wait for: ✓ MongoDB connected successfully"
echo ""
echo "2️⃣  START FRONTEND (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "   ⏳ Wait for: ✓ Local: http://localhost:5173/"
echo ""
echo "3️⃣  OPEN IN BROWSER:"
echo "   http://localhost:5173/login"
echo "   http://localhost:5173/register"
echo ""
echo "4️⃣  TEST API:"
echo "   curl http://localhost:5000/api/health"
echo ""
echo "=================================================="
