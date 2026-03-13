# ✅ COMPLETE STARTUP GUIDE - Make Pages Visible

## 🎯 3 Things That MUST Be Done (IN ORDER)

### 1️⃣ MongoDB Atlas Connection String in .env

You have MongoDB Atlas credentials, update your `backend/.env`:

```env
MONGODB_URI=mongodb+srv://newworld1357911_db_user:kTHdckiVsj0Z34Kj@cluster0.kjmfaf1.mongodb.net/cyberguard?retryWrites=true&w=majority
```

**⚠️ IMPORTANT:** Add `/cyberguard` database name at the end with `?retryWrites=true&w=majority`

Your current .env should look like:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb+srv://newworld1357911_db_user:kTHdckiVsj0Z34Kj@cluster0.kjmfaf1.mongodb.net/cyberguard?retryWrites=true&w=majority

JWT_SECRET=89feb06c35e5f4365c9dba0afee2d2cfc73d89e7ccf1c0e78b4c4f9168153adc
JWT_REFRESH_SECRET=27f78171ef70f45f6f78c917cdb1e39fa1b570bca383baa20f6ad3c81c750edb

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173

LOG_LEVEL=debug

BCRYPT_ROUNDS=10
TOKEN_EXPIRY_DAYS=7
REFRESH_TOKEN_EXPIRY_DAYS=30

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

API_VERSION=1.0.0
API_BASE_URL=http://localhost:5000/api
```

### 2️⃣ Start Backend Server (FIRST - MOST IMPORTANT!)

```bash
cd backend
npm run dev
```

**Wait for this message:**
```
✓ MongoDB connected successfully
✓ Mongoose connected to MongoDB
✓ Server: http://localhost:5000
```

**⚠️ IF YOU DON'T SEE THIS MESSAGE:**
- Current error will show in terminal
- Common errors:
  - Authentication failed → Check username/password in MONGODB_URI
  - Connection timed out → Check network access IP whitelist in MongoDB Atlas
  - Invalid connection string → Copy exact string from MongoDB Atlas

### 3️⃣ Start Frontend Server (SECOND - In New Terminal)

```bash
cd frontend
npm run dev
```

**Wait for this message:**
```
✓ Local: http://localhost:5173/
```

---

## ✅ Verify Everything Works

### Test 1: Backend is Running
```bash
curl http://localhost:5000/api/health

# You should see:
{
  "success": true,
  "message": "Server is running"
}
```

### Test 2: Frontend Loads
- Open browser: http://localhost:5173
- You should see the landing page with hero, stats, features

### Test 3: Pages Visible
- Go to http://localhost:5173/login → Should see **Login form**
- Go to http://localhost:5173/register → Should see **Register form**

---

## 🐛 If Pages Are Still Not Visible

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for red errors
4. Screenshot and share the error

### Common Console Errors

**"Cannot fetch from http://localhost:5000"**
→ Backend is not running, start it first!

**"useAuth must be used within AuthProvider"**
→ AuthProvider not wrapping app correctly (should be fixed already)

**"CORS error"**
→ Backend not allowing requests, check ALLOWED_ORIGINS in .env

**"Network request failed"**
→ Backend is down or wrong URL

---

## 📋 Complete Startup Checklist

### Backend Setup
- [ ] MONGODB_URI updated in `backend/.env` with `?retryWrites=true&w=majority`
- [ ] Database name is `cyberguard` (in connection string)
- [ ] Run `cd backend && npm run dev`
- [ ] See "✓ MongoDB connected successfully"
- [ ] See "✓ Server: http://localhost:5000"

### Frontend Setup
- [ ] Run `cd frontend && npm run dev` (in new terminal)
- [ ] See "✓ Local: http://localhost:5173"
- [ ] Browser opens to http://localhost:5173

### Testing
- [ ] http://localhost:5173 shows landing page
- [ ] http://localhost:5173/login shows login form
- [ ] http://localhost:5173/register shows register form
- [ ] Browser console shows no red errors
- [ ] Network tab shows API calls going to http://localhost:5000

---

## 🚀 Quick Commands Reference

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend (NEW TERMINAL!)
cd frontend
npm run dev

# Test Backend
curl http://localhost:5000/api/health

# Test Frontend
# Open: http://localhost:5173 in browser
```

---

## 📊 What Happens When You Register

```
User fills form + clicks Register
  ↓
Frontend sends to: http://localhost:5000/api/auth/register
  ↓
Backend receives credentials
  ↓
Backend validates + hashes password
  ↓
Backend stores in MongoDB Atlas
  ↓
Backend returns JWT tokens
  ↓
Frontend stores tokens in localStorage
  ↓
Frontend redirects to /dashboard ✅
```

**If any step fails:**
- Check MongoDB connection
- Check backend console for errors
- Check browser console for errors
- Check Network tab to see API responses

---

## ✨ Expected Results

### Register Page Should Show
- First Name input field
- Last Name input field
- Email input field
- Password input field with strength meter
- Confirm Password input field
- "I agree to terms" checkbox
- "Create Account" button
- Success/error messages at top
- Beautiful dark orange UI ✨

### Login Page Should Show
- Email input field
- Password input field with show/hide toggle
- "Remember me" checkbox
- "Sign In" button
- "Forgot Password" link
- Loading spinner while signing in
- Success/error messages at top
- Beautiful dark orange UI ✨

---

## 🔧 IMPORTANT: MONGODB_URI Format

Your connection string needs to be EXACTLY like this:

```
mongodb+srv://newworld1357911_db_user:kTHdckiVsj0Z34Kj@cluster0.kjmfaf1.mongodb.net/cyberguard?retryWrites=true&w=majority
                                        ↑
                                    password (no special chars to encode)
                                                                    ↑
                                                            database name MUST be cyberguard
                                                                                    ↑
                                                                    MUST have ?retryWrites=true&w=majority
```

Copy and paste this into your backend/.env:

```env
MONGODB_URI=mongodb+srv://newworld1357911_db_user:kTHdckiVsj0Z34Kj@cluster0.kjmfaf1.mongodb.net/cyberguard?retryWrites=true&w=majority
```

---

## Final Check

Run these commands and verify outputs:

```bash
# Check backend .env has MongoDB URI
grep "MONGODB_URI" backend/.env

# Start backend
cd backend && npm run dev
# Should see: ✓ MongoDB connected successfully

# In new terminal, check frontend
cd frontend && npm run dev
# Should see: ✓ Local: http://localhost:5173

# Test backend health
curl http://localhost:5000/api/health
# Should return JSON with success: true
```

---

**If you're still having issues after this:**

1. Share the error message from browser console
2. Share the error message from backend terminal
3. Share output of: `curl http://localhost:5000/api/health`

Then I can fix it!

