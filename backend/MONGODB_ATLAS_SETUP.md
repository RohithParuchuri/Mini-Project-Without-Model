# MongoDB Atlas Setup Guide

MongoDB Atlas is MongoDB's official cloud database service. It's free for development and scales easily to production.

---

## 🎯 Step-by-Step MongoDB Atlas Setup

### Step 1: Create a MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click **"Try Free"** button
3. Create an account with:
   - Email address
   - Strong password
   - Your name
4. Verify your email address
5. Complete account setup (choose "Build my own" or "Use a template")

---

### Step 2: Create a Project

1. After login, you'll see the Projects page
2. Click **"Create Project"** (or "New Project")
3. Give it a name: `CyberGuard` (or your project name)
4. Click **"Create Project"**

---

### Step 3: Create a Cluster

1. Click **"Create"** button in the Clusters section
2. Select:
   - **Provider:** AWS (or your preferred)
   - **Region:** Choose closest to you (e.g., `us-east-1`)
   - **Tier:** `M0` (Free forever - good for development)
3. Click **"Create Cluster"**
4. Wait 3-5 minutes for cluster to be created (you'll see a loading spinner)

---

### Step 4: Create Database User

1. Click **"Security"** in left sidebar → **"Database Access"**
2. Click **"+ Add New Database User"**
3. Fill in:
   - **Username:** `cyberguard_user` (or any name)
   - **Password:** Generate secure password (or create your own)
     - **Important:** Save this password! You'll need it in .env
   - **Database User Privileges:** Select `"Atlas admin"`
4. Click **"Add User"**

**Save the username and password!**
```
Username: cyberguard_user
Password: YourSecurePassword123!
```

---

### Step 5: Configure Network Access

1. Click **"Security"** → **"Network Access"**
2. Click **"+ Add IP Address"**
3. Choose one option:
   - **Option A (RECOMMENDED):** Click **"Add Current IP Address"**
     - Adds your current IP only
   - **Option B:** Enter `0.0.0.0/0`
     - Allows all IPs (less secure but good for development)
4. Click **"Confirm"**

---

### Step 6: Get Connection String

1. Go back to **"Clusters"** section
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Copy the connection string that looks like:
   ```
   mongodb+srv://cyberguard_user:<password>@cluster.mongodb.net/...
   ```

---

### Step 7: Update Your Backend .env File

Open `backend/.env` and replace the MONGODB_URI:

**Before:**
```env
MONGODB_URI=mongodb://localhost:27017/cyberguard
```

**After:**
```env
MONGODB_URI=mongodb+srv://cyberguard_user:YourSecurePassword123!@cluster0.xxxxx.mongodb.net/cyberguard?retryWrites=true&w=majority
```

**Important Steps:**
1. Replace `YourSecurePassword123!` with your actual password
2. Replace `cluster0.xxxxx` with your actual cluster name
3. Keep `?retryWrites=true&w=majority` at the end

---

### Step 8: Test the Connection

Run your backend server:

```bash
cd backend
npm run dev
```

**Expected Output:**
```
✓ MongoDB connected successfully
✓ Mongoose connected to MongoDB
✓ Server: http://localhost:5000
```

If you get a connection error, check:
- ✅ Database user created with correct username/password
- ✅ IP address whitelisted in Network Access
- ✅ Connection string has correct password (with special characters escaped if needed)
- ✅ Database name matches in .env

---

## 📋 Common Issues & Solutions

### "Authentication failed"
**Problem:** Username or password is wrong

**Solution:**
1. Go to Database Access
2. Click the ellipsis (...) next to your user
3. Click "Edit Password"
4. Update password in .env

### "Connection timed out"
**Problem:** IP address not whitelisted

**Solution:**
1. Go to Network Access
2. Click "Add IP Address"
3. Choose "Add Current IP Address"
4. Wait a minute for it to apply

### "Invalid connection string"
**Problem:** Special characters in password not escaped

**Solution:**
- If your password has special characters like `@`, `#`, `$`, etc.
- URL-encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - etc.
- Example: `password123!@456` → `password123%21%40456`

### "Cannot connect from my production server"
**Problem:** Your production server's IP not whitelisted

**Solution:**
1. Add production server's IP to Network Access
2. Or use `0.0.0.0/0` to allow all IPs (for learning/testing)

---

## 🔐 Security Best Practices

### For Development
- ✅ Use `0.0.0.0/0` or current IP only
- ✅ Use strong password for database user
- ✅ Store .env file in .gitignore

### For Production
- ✅ Whitelist only your production server's IP
- ✅ Use a strong database password
- ✅ Rotate credentials regularly
- ✅ Enable database encryption
- ✅ Enable IP address whitelist enforcement
- ✅ Use Atlas IP Access List only

---

## 🗄️ Managing Your Cluster

### View Your Data
1. Click "Collections" in your cluster
2. See all databases and collections
3. Browse documents

### Backup Your Data
1. Automatic backups are enabled (every 6 hours)
2. Click "Backup" tab to view/restore

### Delete Database User
1. Go to "Database Access"
2. Find user, click ellipsis (...)
3. Click "Delete"

### Delete Cluster
1. Go to "Clusters"
2. Click "..." on cluster
3. Click "Delete Cluster"
4. Confirm deletion

---

## 📊 Environment Variable Explained

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
```

Breaking it down:
- `mongodb+srv://` - Connection protocol (srv = service)
- `username:password` - Your database user credentials
- `@cluster0.xxxxx.mongodb.net` - Your MongoDB Atlas cluster address
- `/dbname` - Database name (created automatically)
- `?retryWrites=true` - Retry writes if they fail
- `&w=majority` - Wait for write to be confirmed

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas account created
- [ ] Project created
- [ ] Cluster created (M0 free tier)
- [ ] Database user created (username + password saved)
- [ ] Network Access IP whitelisted
- [ ] Connection string copied
- [ ] MONGODB_URI updated in .env
- [ ] Special characters in password URL-encoded if needed
- [ ] Backend server started successfully
- [ ] "MongoDB connected" message appears

---

## 🚀 You're Ready!

Once your cluster is connected, your backend will automatically:
- Create the `cyberguard` database
- Create collections as needed
- Store user data securely
- Handle all queries through Mongoose

**No more local MongoDB needed!**

---

## 📞 Need Help?

### Official Resources
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Guide](https://docs.atlas.mongodb.com/connection-string/)
- [Network Access](https://docs.atlas.mongodb.com/security-whitelist/)

### Common Queries
- [What's a cluster?](https://docs.atlas.mongodb.com/getting-started/#create-a-cluster)
- [How to reset password?](https://docs.atlas.mongodb.com/security-database-users/)
- [IP access list?](https://docs.atlas.mongodb.com/security-whitelist/)

---

**Your complete guide to MongoDB Atlas is ready!** 🎉

