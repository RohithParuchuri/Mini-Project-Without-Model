# Backend Configuration Explained

## 📋 What Each Environment Variable Does

### Application Settings

```env
NODE_ENV=development
```
- **development:** Shows detailed error messages, useful for debugging
- **production:** Hides error details for security, optimizes performance

```env
PORT=5000
```
- The port your backend server runs on
- Frontend will connect to http://localhost:5000

---

### Database Configuration

```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/cyberguard
```
- **Connection string to MongoDB**
- Used to: Store user accounts, profile data, authentication records
- Options:
  - **Local MongoDB:** `mongodb://localhost:27017/cyberguard`
  - **MongoDB Atlas (Cloud):** `mongodb+srv://...` (recommended for production)
- See `MONGODB_ATLAS_SETUP.md` for detailed MongoDB Atlas setup

---

### JWT (JSON Web Tokens) Configuration

```env
JWT_SECRET=your_super_secret_jwt_secret_key_here_min_32_chars_generated_securely
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key_here_min_32_chars_generated_securely
```

**What they do:**
- `JWT_SECRET` - Signs access tokens (valid for 7 days)
- `JWT_REFRESH_SECRET` - Signs refresh tokens (valid for 30 days)

**Why two secrets?**
- Separation of concerns (security best practice)
- If one is compromised, the other remains secure
- Different token lifespans

**How to generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this twice, copy outputs to .env

---

### CORS Configuration

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173
```

**What it does:**
- Controls which websites can access your API
- Prevents unauthorized cross-origin requests

**Origins:**
- `http://localhost:3000` - Standard React dev port
- `http://localhost:3001` - Alternative React dev port
- `http://localhost:5173` - Vite dev server port (your frontend)

**For production:**
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

---

### Security Settings

```env
BCRYPT_ROUNDS=10
```
- How many times to hash passwords
- Higher = more secure but slower
- 10 rounds = ~100ms hashing (good balance)

```env
TOKEN_EXPIRY_DAYS=7
TOKEN_EXPIRY_DAYS=30
```
- Access token expires after 7 days
- Refresh token expires after 30 days
- Users must login again after 7 days

---

### Rate Limiting

```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**What it prevents:**
- Brute force attacks (trying many passwords)
- Denial of Service (DoS) attacks
- API abuse

**Current settings:**
- `900000` ms = 15 minutes
- Max 100 requests per 15 minutes per IP
- Login endpoint: 5 attempts per 15 minutes (more restrictive)

---

### Logging

```env
LOG_LEVEL=debug
```
- **debug:** Show all information (development)
- **info:** Show important events only
- **warn:** Show warnings and errors only
- **error:** Show errors only (production)

---

### API Information

```env
API_VERSION=1.0.0
API_BASE_URL=http://localhost:5000/api
```

- `API_VERSION` - Your API version
- `API_BASE_URL` - Full path to API (used for documentation/clients)

---

## ❌ What Was Removed & Why

### Email Configuration (REMOVED)

**Old variables:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

**Why removed:**
- Not needed for basic authentication
- Would require email verification feature (added complexity)
- You only want login/register without email verification
- Nodemailer package also removed (cleaner dependencies)

**If you add email verification later:**
- Uncomment these variables
- Run `npm install nodemailer@8.0.1`
- Implement email sending in registration flow

---

## 🔄 Complete Configuration Example

### Development Setup

```env
# Application
NODE_ENV=development
PORT=5000

# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://cyberguard_user:YourPassword@cluster0.xyz.mongodb.net/cyberguard?retryWrites=true&w=majority

# JWT Tokens
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6s7t8u9v0w1x2y3z4a5b6c7d8e9f0
JWT_REFRESH_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173

# Security
BCRYPT_ROUNDS=10
TOKEN_EXPIRY_DAYS=7
REFRESH_TOKEN_EXPIRY_DAYS=30

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug

# API
API_VERSION=1.0.0
API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Production Configuration Example

```env
# Application
NODE_ENV=production
PORT=5000

# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://cyberguard_user:YourPassword@cluster0.xyz.mongodb.net/cyberguard?retryWrites=true&w=majority

# JWT Tokens (NEW SECRETS!)
JWT_SECRET=<generate new secure secret>
JWT_REFRESH_SECRET=<generate new secure secret>

# CORS (Your domain)
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Security
BCRYPT_ROUNDS=10
TOKEN_EXPIRY_DAYS=7
REFRESH_TOKEN_EXPIRY_DAYS=30

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=warn

# API
API_VERSION=1.0.0
API_BASE_URL=https://yourdomain.com/api
```

---

## 📊 Configuration Summary

| Variable | What It Does | Development | Production |
|----------|-------------|-------------|------------|
| NODE_ENV | Environment | development | production |
| PORT | Server port | 5000 | 5000 |
| MONGODB_URI | Database | Atlas or local | Atlas (recommended) |
| JWT_SECRET | Access token | Generate new | Generate new |
| JWT_REFRESH_SECRET | Refresh token | Generate new | Generate new |
| ALLOWED_ORIGINS | CORS whitelist | localhost:* | yourdomain.com |
| BCRYPT_ROUNDS | Hash strength | 10 | 10+ |
| TOKEN_EXPIRY_DAYS | Token lifetime | 7 | 7 |
| RATE_LIMIT_WINDOW_MS | Rate limit period | 900000 (15min) | 900000 (15min) |
| RATE_LIMIT_MAX_REQUESTS | Max requests | 100/period | 100/period |
| LOG_LEVEL | Logging detail | debug | warn |
| API_VERSION | Version | 1.0.0 | 1.0.0 |

---

## ✅ Before Running Server

1. ✅ MONGODB_URI set correctly
2. ✅ JWT_SECRET (32+ random characters)
3. ✅ JWT_REFRESH_SECRET (32+ random characters)
4. ✅ ALLOWED_ORIGINS includes frontend URL
5. ✅ MongoDB database exists and is accessible
6. ✅ Firewall allows port 5000

---

## 🎯 Next Steps

1. Read `MONGODB_ATLAS_SETUP.md` for database setup
2. Generate new JWT secrets and add to .env
3. Start MongoDB (local or verify Atlas connection)
4. Run `npm run dev`
5. Test with frontend at http://localhost:5173

---

## 📞 Quick Help

**Password connection errors?**
→ Check MongoDB Atlas database user password is correct

**CORS errors?**
→ Add your frontend URL to ALLOWED_ORIGINS

**Port already in use?**
→ Change PORT to different number (8000, 8001, etc.)

**Token issues?**
→ Regenerate JWT_SECRET and JWT_REFRESH_SECRET

---

**All configuration options explained!** ✅

