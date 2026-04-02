# Quick Setup Guide - Authentication Implementation

## ⚡ Quick Start

### Step 1: Install Dependencies

On the server, install the JWT package:

```bash
cd server
npm install jsonwebtoken
```

or if using yarn:
```bash
yarn add jsonwebtoken
```

### Step 2: Server Setup

The server is already configured with the authentication system:
- ✅ Middleware created at `server/middleware/auth.js`
- ✅ Auth routes created at `server/routes/auth.js`
- ✅ Main server file updated at `server/index.js`

**No additional server setup needed!**

### Step 3: Client Setup

The client is already configured with authentication:
- ✅ Auth utilities created at `client/src/utils/auth.js`
- ✅ Protected route component created at `client/src/components/ProtectedRoute.js`
- ✅ Auth page updated at `client/src/pages/auth.jsx`
- ✅ App routes updated at `client/src/App.js`
- ✅ UserNavbar updated with logout button

**No additional client setup needed!**

### Step 4: Restart and Test

```bash
# Terminal 1: Start server
cd server
npm start

# Terminal 2: Start client
cd client
npm start
```

Visit http://localhost:3000 and test:
1. Create a new account (signup)
2. Login with credentials
3. Navigate through protected pages
4. Click logout button to logout

---

## 📋 What Was Implemented

### Requirement 1: User Authentication ✅
- Custom JWT-based authentication (no third-party service)
- Token generated on successful login/signup
- Token stored securely in localStorage
- 7-day token expiration

### Requirement 2: Authentication Validation on Every Page ✅
- ProtectedRoute component wraps all protected pages
- Every HTTP request includes JWT token automatically
- Server validates token before processing requests
- Unauthenticated users redirected to login
- Token expiration handled gracefully

---

## 🔐 Security Considerations

### Current State (Development):
- ✅ JWT authentication working
- ⚠️ Passwords stored in plain text (needs bcrypt for production)
- ⚠️ JWT secret is hardcoded (should use environment variables)

### For Production:
1. Install bcrypt for password hashing:
   ```bash
   npm install bcrypt
   ```

2. Update `server/routes/auth.js` to hash passwords:
   ```javascript
   const bcrypt = require("bcrypt");
   // For signup:
   const hashedPassword = await bcrypt.hash(password, 10);
   // For login:
   const passwordMatch = await bcrypt.compare(password, user.password);
   ```

3. Use environment variables:
   Create `.env` file in server root:
   ```
   JWT_SECRET=your_very_long_secure_random_secret_key_here
   DATABASE_URL=postgresql://...
   PORT=5000
   ```

4. Update `server/middleware/auth.js`:
   ```javascript
   const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
   ```

---

## 📁 Files Modified/Created

### Server Files:
- ✨ `server/middleware/auth.js` (NEW)
- ✨ `server/routes/auth.js` (NEW)
- 📝 `server/index.js` (MODIFIED)
- 📝 `server/package.json` (MODIFIED - added jsonwebtoken)

### Client Files:
- ✨ `client/src/utils/auth.js` (NEW)
- ✨ `client/src/components/ProtectedRoute.js` (NEW)
- 📝 `client/src/App.js` (MODIFIED)
- 📝 `client/src/pages/auth.jsx` (MODIFIED)
- 📝 `client/src/pages/userDashboard.jsx` (MODIFIED)
- 📝 `client/src/components/UserNavbar.js` (MODIFIED)

---

## 🧪 Testing the Authentication

### Endpoint: Create Account
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isAdmin": false
}
```

### Endpoint: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

### Endpoint: Access Protected Route
```bash
curl -X GET http://localhost:5000/api/home/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🚀 Usage in Components

### Example: Making Authenticated API Calls
```javascript
import { authenticatedFetch, getUser } from "../utils/auth";

export const MyComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenticatedFetch(
          "http://localhost:5000/api/data",
          { method: "GET" }
        );
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
    
    fetchData();
  }, []);
};
```

### Example: Check if User is Authenticated
```javascript
import { isAuthenticated, logout, getUser } from "../utils/auth";

export const MyComponent = () => {
  if (!isAuthenticated()) {
    return <div>Not logged in</div>;
  }
  
  const user = getUser();
  return <div>Welcome, {user.name}!</div>;
};
```

---

## 📞 Troubleshooting

### "Token not provided" Error
- Ensure you've logged in successfully
- Check that localStorage has "authToken" key
- Verify Authorization header format: `Bearer <token>`

### "Token expired" Error
- User needs to login again
- Client automatically redirects to login page
- Implement token refresh for better UX (future enhancement)

### "Invalid token" Error
- JWT secret mismatch between server and client
- Token tampered or corrupted
- Try logging in again

### 401 Unauthorized on Protected Routes
- User not authenticated
- ProtectedRoute will redirect to login
- Check browser console for specific error message

---

## ✅ Implementation Completed

Both requirements are now fully implemented:
1. ✅ User authentication handled by custom JWT implementation
2. ✅ Authentication validation on every page with ProtectedRoute and authenticated fetch

The system is ready for production use with the security enhancements mentioned above.
