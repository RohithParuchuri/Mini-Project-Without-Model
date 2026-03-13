# Frontend Integration Guide - CyberGuard AI

## 🔗 Overview

This guide explains how the frontend is integrated with the secure backend API for user authentication and profile management.

---

## 📁 New Files Created

### 1. Frontend Environment Configuration

**File:** `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CyberGuard
VITE_APP_VERSION=1.0.0
```

**Usage:** Environment variables are accessed via `import.meta.env.VITE_*`

---

### 2. Authentication Service

**File:** `frontend/src/services/AuthService.js`

Core service for all API communication. Handles:
- User registration
- User login
- Profile retrieval and updates
- Password changes
- Token management
- Logout

**Usage in Components:**

```javascript
import AuthService from '@/services/AuthService';

// Register
const data = await AuthService.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass@123',
  confirmPassword: 'SecurePass@123'
});

// Login
const userData = await AuthService.login({
  email: 'john@example.com',
  password: 'SecurePass@123'
});

// Get Profile
const profile = await AuthService.getProfile();

// Check Authentication
if (AuthService.isAuthenticated()) {
  // User is logged in
}

// Get Token
const token = AuthService.getToken();
```

---

### 3. Authentication Context

**File:** `frontend/src/context/AuthContext.jsx`

Global state management for authentication using React Context API.

**Provides:**
- `user` - Current user object
- `loading` - Loading state
- `error` - Error message
- `isAuthenticated` - Boolean auth status
- `register()` - Register function
- `login()` - Login function
- `logout()` - Logout function
- `updateProfile()` - Update user profile
- `changePassword()` - Change password
- `clearError()` - Clear error message

**Usage in Components:**

```javascript
import { useAuth } from '@/context/AuthContext';

export function MyComponent() {
  const { user, loading, error, isAuthenticated, login } = useAuth();

  const handleLogin = async () => {
    try {
      await login('john@example.com', 'SecurePass@123');
      // User is now logged in
    } catch (err) {
      // Handle error
    }
  };
}
```

---

## 🚀 Updated Components

### Login Page

**File:** `frontend/src/pages/Login.jsx`

**Changes:**
✅ Now uses `useAuth()` hook
✅ Calls `login()` function with email and password
✅ Displays error messages from API
✅ Shows success message on login
✅ Handles loading state with spinner
✅ Redirects to `/dashboard` on success

**How It Works:**

```javascript
const { login, loading, error } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await login(email, password);
    // Navigate to dashboard
  } catch (err) {
    // Error is shown in error message
  }
};
```

---

### Register Page

**File:** `frontend/src/pages/Register.jsx`

**Changes:**
✅ Now uses `useAuth()` hook
✅ Calls `register()` function with user data
✅ Validates passwords match
✅ Displays error messages from API
✅ Shows success message on registration
✅ Handles password strength calculation
✅ Redirects to `/dashboard` on success

**How It Works:**

```javascript
const { register, loading, error } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await register(firstName, lastName, email, password, confirmPassword);
    // Navigate to dashboard
  } catch (err) {
    // Error is shown in error message
  }
};
```

---

### App Component

**File:** `frontend/src/App.jsx`

**Changes:**
✅ Wrapped with `<AuthProvider>`
✅ AuthProvider wraps entire Router
✅ Makes auth context available to all routes

**Structure:**

```javascript
<AuthProvider>
  <Router>
    {/* All routes have access to useAuth hook */}
  </Router>
</AuthProvider>
```

---

## 🔐 Token Management

### How Tokens Are Stored

Tokens are stored in browser localStorage:

```javascript
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', token);
```

### How Tokens Are Used

All API requests include token in Authorization header:

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Token Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔄 Authentication Flow

### User Registration Flow

```
1. User fills registration form
   ↓
2. Submit form (handleSubmit)
   ↓
3. Call register() from useAuth hook
   ↓
4. AuthService.register() sends POST to /api/auth/register
   ↓
5. Backend validates and returns tokens
   ↓
6. Tokens stored in localStorage
   ↓
7. User state updated in context
   ↓
8. Redirect to /dashboard
```

### User Login Flow

```
1. User fills login form
   ↓
2. Submit form (handleSubmit)
   ↓
3. Call login() from useAuth hook
   ↓
4. AuthService.login() sends POST to /api/auth/login
   ↓
5. Backend validates credentials
   ↓
6. Returns user data and tokens
   ↓
7. Tokens stored in localStorage
   ↓
8. User state updated in context
   ↓
9. Redirect to /dashboard
```

### Protected Route Flow

```
1. Component mounts
   ↓
2. Check useAuth() for isAuthenticated
   ↓
3. If false, redirect to /login
   ↓
4. If true, render component
   ↓
5. Component can call API with token
   ↓
6. If 401 (unauthorized), token expired
   ↓
7. Clear localStorage and redirect to /login
```

---

## 🛡️ Error Handling

### API Error Response Format

```json
{
  "success": false,
  "message": "Invalid email or password",
  "attemptsRemaining": 4
}
```

### How Errors Are Displayed

1. **In Context:** Error stored in `error` state
2. **In Components:** Error displayed via conditional render
3. **Error Message:** Shows user-friendly message from backend

### Error Examples

**Login Failures:**
```
"Invalid email or password"
"Account is locked. Try again in X minutes"
"Too many failed login attempts. Account locked"
```

**Registration Failures:**
```
"User with this email already exists"
"Password must be at least 8 characters long"
"Passwords do not match"
```

---

## 📱 Using Authentication in Components

### Check if User is Logged In

```javascript
import { useAuth } from '@/context/AuthContext';

export function Dashboard() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Welcome, {user.firstName}!</div>;
}
```

### Display User Profile

```javascript
import { useAuth } from '@/context/AuthContext';

export function ProfileCard() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.email}</p>
      <p>{user.bio}</p>
    </div>
  );
}
```

### Logout User

```javascript
import { useAuth } from '@/context/AuthContext';

export function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // User will be logged out and can redirect if needed
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Update User Profile

```javascript
import { useAuth } from '@/context/AuthContext';

export function ProfileSettings() {
  const { updateProfile, error } = useAuth();

  const handleUpdate = async () => {
    try {
      await updateProfile({
        firstName: 'Jane',
        lastName: 'Doe',
        bio: 'Updated bio',
        profileImage: 'https://...'
      });
      // Profile updated successfully
    } catch (err) {
      // Error is in error state
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
```

---

## 🧪 Testing Authentication

### Test Registration

```javascript
// In browser console or test:
await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'SecurePass@123',
    confirmPassword: 'SecurePass@123'
  })
});
```

### Test Login

```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass@123'
  })
});

const data = await response.json();
console.log(data); // Check accessToken in response
```

---

## 🔌 CORS Configuration

### Backend CORS Setup

**File:** `backend/server.js`

```javascript
const allowedOrigins = [
  'http://localhost:3000',  // Frontend
  'http://localhost:3001',  // Alternative port
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Environment Variable

**File:** `backend/.env`

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## 🚀 Running Frontend & Backend Together

### Terminal 1: Start MongoDB

```bash
mongod
```

### Terminal 2: Start Backend

```bash
cd backend
npm install
npm run dev

# Output:
# ✓ MongoDB connected
# ✓ Server: http://localhost:5000
```

### Terminal 3: Start Frontend

```bash
cd frontend
npm install
npm run dev

# Output:
# ✓ Run:   npm run dev
# ✓ Local: http://localhost:5173/
```

### Test the Integration

1. Open http://localhost:5173/register
2. Fill registration form with:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: SecurePass@123
   - Confirm Password: SecurePass@123
3. Click "Sign Up"
4. Should redirect to /dashboard
5. Login page should show user is authenticated

---

## 📊 State Management Flow

```
AuthProvider (context)
  ├── user (current user or null)
  ├── loading (boolean)
  ├── error (string or null)
  ├── isAuthenticated (boolean)
  │
  └── Methods:
      ├── register(fn, ln, email, pwd, cfmpwd)
      ├── login(email, password)
      ├── logout()
      ├── updateProfile(data)
      ├── changePassword(current, new, confirm)
      └── clearError()

Any Component with useAuth()
  └── Can access/call all above
```

---

## 🔒 Security Best Practices

### Token Security

✅ Tokens stored in localStorage
✅ Tokens sent in Authorization header
✅ API validates token on every request
⚠️ Consider using httpOnly cookies for production

### Password Security

✅ Passwords never logged in frontend
✅ Passwords never sent in clear over HTTP
✅ Passwords hashed on backend (bcryptjs)
✅ Password validation on frontend and backend

### CORS Protection

✅ Whitelist-based origin validation
✅ Credentials allowed only for known origins
✅ Content-Type validation

---

## 📋 File Structure

```
frontend/
├── .env                              # Frontend config
├── src/
│   ├── App.jsx                       # App with AuthProvider
│   ├── pages/
│   │   ├── Login.jsx                 # Updated with auth
│   │   └── Register.jsx              # Updated with auth
│   ├── services/
│   │   └── AuthService.js            # NEW: API calls
│   ├── context/
│   │   └── AuthContext.jsx           # NEW: Auth state
│   └── ...other files...
```

---

## ✅ Checklist

- [x] Created `.env` with API URL
- [x] Created AuthService for API calls
- [x] Created AuthContext for state management
- [x] Updated Login page to use auth
- [x] Updated Register page to use auth
- [x] Wrapped App with AuthProvider
- [x] CORS configured on backend
- [x] Token management implemented
- [x] Error handling added
- [x] Documentation complete

---

## 🐛 Troubleshooting

### CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Make sure backend is running on http://localhost:5000
2. Check ALLOWED_ORIGINS in backend/.env
3. Verify frontend URL matches ALLOWED_ORIGINS

### Token Not Persisting

**Error:** User logs in but token not saved

**Solution:**
1. Check browser localStorage
2. Verify token is called `accessToken`
3. Check browser console for errors

### API Returns 401

**Error:** `Unauthorized` response from API

**Solution:**
1. Token may be expired (7 days)
2. Token may be invalid
3. Delete localStorage and log in again
4. Check Authorization header format: `Bearer <token>`

### Can't send Authorization Header

**Error:** Header not being sent to API

**Solution:**
```javascript
// Make sure fetch includes credentials:
fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 📚 Additional Resources

- React Documentation: https://react.dev
- React Context: https://react.dev/reference/react/useContext
- React Router: https://reactrouter.com
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

**Setup Complete!** ✅

Your frontend is now fully integrated with the secure backend API.

Start both servers and test the registration/login flow.

