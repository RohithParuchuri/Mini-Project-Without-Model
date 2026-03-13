# CyberGuard Backend API

A secure, production-ready Node.js/Express backend with MongoDB integration, JWT authentication, and comprehensive security features.

## 🔐 Security Features

- ✅ **Password Hashing:** bcryptjs with 10 salt rounds
- ✅ **JWT Authentication:** Secure token-based auth
- ✅ **Rate Limiting:** Prevention of brute force and DoS attacks
- ✅ **Account Lockout:** Automatic lockout after 5 failed attempts
- ✅ **Security Headers:** Helmet.js for HTTP security
- ✅ **CORS Protection:** Whitelist-based origin validation
- ✅ **Input Validation:** Email and password complexity checks
- ✅ **Error Handling:** Sanitized error messages in production
- ✅ **Database Security:** NoSQL injection prevention via Mongoose

See [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) for comprehensive security documentation.

## 📋 Prerequisites

- **Node.js:** >= 18.0.0
- **npm:** >= 9.0.0
- **MongoDB:** Local or MongoDB Atlas account

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cyberguard
JWT_SECRET=your_random_32_char_secret_here
JWT_REFRESH_SECRET=your_random_32_char_refresh_secret
ALLOWED_ORIGINS=http://localhost:3000
```

**Generate secure secrets:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start MongoDB

**Local MongoDB:**

```bash
mongod
```

**MongoDB Atlas (Cloud):**

Use connection string in MONGODB_URI:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cyberguard
```

### 4. Run the Server

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

Server runs on `http://localhost:5000`

## 📚 API Endpoints

### Health Check

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "confirmPassword": "SecurePass@123"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "bio": "",
      "profileImage": null,
      "isVerified": false,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "lastLogin": "2024-01-01T12:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Password Requirements:**

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Rate Limit:** 5 attempts per 15 minutes

#### Get Profile

```http
GET /api/auth/profile
Authorization: Bearer <accessToken>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "bio": "Web developer",
      "profileImage": "https://...",
      "isVerified": false,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "lastLogin": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

#### Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "profileImage": "https://..."
}
```

#### Change Password

```http
POST /api/auth/change-password
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "currentPassword": "SecurePass@123",
  "newPassword": "NewSecure@456",
  "confirmPassword": "NewSecure@456"
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

## 🔑 Authentication

### Using JWT Tokens

Include the access token in the `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

- **Access Token:** 7 days
- **Refresh Token:** 30 days

When access token expires, use refresh token to get a new one (implement refresh endpoint as needed).

## 🛡️ Security Best Practices

### Password Security

- Passwords are hashed using bcryptjs with 10 salt rounds
- Never stored in plain text
- Compared securely using bcryptjs.compare()

### JWT Security

- Signed with strong secret keys (32+ characters)
- Tokens include expiration time
- Signature verified on every protected route

### Rate Limiting

- **Login/Register:** 5 attempts per 15 minutes per IP
- **General API:** 100 requests per 15 minutes per IP
- **Body Size:** Maximum 10KB

### Account Lockout

- Account locked after 5 failed login attempts
- Lockout duration: 30 minutes (configurable)
- Automatically unlocked after timeout

### External Protection

- Helmet.js for HTTP security headers
- CORS whitelisting by origin
- Body size limits to prevent large payload attacks
- Content-Type validation

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── authController.js    # Auth handlers
├── middleware/
│   └── auth.js              # JWT verification
├── models/
│   └── User.js              # User schema
├── routes/
│   └── auth.js              # Auth routes
├── utils/
│   └── jwt.js               # JWT utilities
├── server.js                # Main server file
├── package.json
├── .env                     # Environment variables
├── .env.example             # Example env vars
├── .gitignore
├── SECURITY_AUDIT.md        # Security documentation
└── README.md                # This file
```

## 🧪 Testing API

### Using cURL

**Register:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass@123",
    "confirmPassword": "SecurePass@123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

**Get Profile:**

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman

1. Import the API collection (create in Postman)
2. Set `{{baseUrl}}` to `http://localhost:5000`
3. Store `accessToken` in environment variable
4. Use `{{accessToken}}` in Authorization header

## 📝 Error Handling

### Common Status Codes

| Code | Error | Meaning |
|------|-------|---------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Auth failed or missing |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate (e.g., email) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description here"
}
```

## 🔧 Configuration

### Database Configuration

Edit in `config/database.js`:

```javascript
const mongoURI = process.env.MONGODB_URI;
```

### JWT Configuration

Edit in `utils/jwt.js`:

```javascript
const SALT_ROUNDS = 10; // Bcrypt salt rounds
expiresIn: '7d' // Token expiration
```

### Rate Limiting

Edit in `routes/auth.js`:

```javascript
max: 5 // 5 requests
windowMs: 15 * 60 * 1000 // 15 minutes
```

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| mongoose | ^7.5.0 | MongoDB ODM |
| bcryptjs | ^2.4.3 | Password hashing |
| jsonwebtoken | ^9.1.0 | JWT tokens |
| helmet | ^7.0.0 | Security headers |
| cors | ^2.8.5 | CORS handling |
| dotenv | ^16.3.1 | Environment vars |
| validator | ^13.11.0 | Input validation |
| express-rate-limit | ^7.0.0 | Rate limiting |
| nodemailer | ^6.9.6 | Email sending |

## 🚨 Environment Variables Reference

```env
# Application
NODE_ENV=development|production
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/cyberguard

# JWT
JWT_SECRET=<32+ character random string>
JWT_REFRESH_SECRET=<32+ character random string>

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Email (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Other
LOG_LEVEL=debug|info|warn|error
BCRYPT_ROUNDS=10
```

## 🐛 Troubleshooting

### MongoDB Connection Failed

```
Error: ECONNREFUSED
```

**Solution:** Make sure MongoDB is running:

```bash
mongod
```

Or use MongoDB Atlas with correct connection string.

### Token Validation Failed

```
Error: Invalid token
```

**Solution:** Make sure token is correctly formatted in header:

```
Authorization: Bearer <token>
```

### Port Already in Use

```
Error: listen EADDRINUSE :::5000
```

**Solution:** Change PORT in `.env` or kill process using port:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Duplicate Key Error

```
Error: E11000 duplicate key error
```

**Solution:** Email already registered. Use different email or reset database:

```bash
# In MongoDB
db.users.deleteMany({})
```

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Docs](https://helmetjs.github.io/)

## 📄 License

ISC

## 👨‍💻 Author

CyberGuard Team

---

**Last Updated:** 2024
**Version:** 1.0.0
**Status:** Production Ready
