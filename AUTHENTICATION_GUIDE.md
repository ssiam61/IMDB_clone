# Authentication Implementation Guide

## Summary of Changes

This document outlines the authentication system implemented for the IMDB Clone project.

### 1. Server-Side Authentication

#### Files Created/Modified:
- **`server/middleware/auth.js`** - JWT Authentication Middleware
  - Verifies JWT tokens from Authorization headers
  - Protects authenticated routes
  - Handles token expiration and validation errors

- **`server/routes/auth.js`** - Authentication Routes
  - `/api/auth/signup` - User registration
  - `/api/auth/login` - User login with JWT token generation
  - `/api/auth/logout` - User logout (optional)
  - Generates 7-day expiring JWT tokens

- **`server/index.js`** - Updated Main Server File
  - Imported authentication middleware
  - `/api/auth` routes are PUBLIC (no authentication required)
  - All other API routes are PROTECTED with authentication middleware
  - Users must include JWT token in Authorization header for API requests

#### Key Features:
✅ JWT-based authentication (no third-party service)
✅ Token expiration after 7 days
✅ Input validation on signup and login
✅ Duplicate username/email detection
✅ Admin role detection
✅ Protected API routes with middleware

### 2. Client-Side Authentication

#### Files Created/Modified:
- **`client/src/utils/auth.js`** - Authentication Utility Functions
  - `getToken()` - Retrieve JWT token from localStorage
  - `getUser()` - Retrieve user data from localStorage
  - `isAuthenticated()` - Check if user is logged in
  - `authenticatedFetch()` - Make authenticated API requests with JWT token
  - `login()` - Handle user login
  - `signup()` - Handle user registration
  - `logout()` - Clear authentication data

- **`client/src/components/ProtectedRoute.js`** - Protected Route Component
  - Wraps protected pages
  - Redirects to login if user not authenticated
  - Used in App.js for all protected routes

- **`client/src/App.js`** - Updated Routes
  - Public routes: `/` (Auth page)
  - Protected routes: All other routes wrapped with `<ProtectedRoute>`
  - Automatic redirect to login if accessing protected routes without authentication

- **`client/src/pages/auth.jsx`** - Updated Authentication Page
  - Uses new `login()` and `signup()` functions
  - Stores JWT token and user data
  - Input validation for all fields
  - Password confirmation on signup
  - Loading state during authentication
  - Redirects already authenticated users to dashboard

- **`client/src/pages/userDashboard.jsx`** - Updated API Calls
  - Uses `authenticatedFetch()` instead of regular fetch
  - Automatically includes JWT token in requests
  - Gets user data from `getUser()` function

#### Key Features:
✅ JWT token stored in localStorage
✅ Automatic token inclusion in all API requests
✅ Protected routes with authentication checks
✅ Automatic logout on token expiration (401 response)
✅ User-friendly authentication flow

---

## How to Use

### For Users:
1. Visit the application - redirected to login/signup page
2. Create account or login with credentials
3. JWT token is automatically stored and included in all requests
4. Token persists across browser sessions (7-day expiration)
5. Logout by clicking logout button (removes token from localStorage)

### For Developers:

#### Making Authenticated API Calls:
```javascript
import { authenticatedFetch, getUser } from "../utils/auth";

// Get current user
const user = getUser();

// Make authenticated API call
const response = await authenticatedFetch("http://localhost:5000/api/endpoint", {
  method: "POST",
  body: JSON.stringify(data),
});

const data = await response.json();
```

#### Protecting Routes:
```javascript
import ProtectedRoute from "./components/ProtectedRoute";

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

#### Checking Authentication:
```javascript
import { isAuthenticated, logout } from "../utils/auth";

if (!isAuthenticated()) {
  logout(); // Redirects to login
}
```

---

## Installation & Requirements

### Server Dependencies:
Ensure your `server/package.json` has:
```json
{
  "dependencies": {
    "express": "^4.x.x",
    "cors": "^2.x.x",
    "jsonwebtoken": "^9.x.x",
    "pg": "^8.x.x"
  }
}
```

Install JWT package if not already installed:
```bash
npm install jsonwebtoken
```

### Client Dependencies:
No additional dependencies needed - uses built-in fetch and localStorage APIs.

---

## Security Notes

⚠️ **Important for Production:**

1. **Password Hashing**: Currently passwords are stored in plain text. For production:
   ```bash
   npm install bcrypt
   ```
   Update `server/routes/auth.js` to use bcrypt:
   ```javascript
   const bcrypt = require("bcrypt");
   const hashedPassword = await bcrypt.hash(password, 10);
   // And for login: await bcrypt.compare(password, user.password)
   ```

2. **JWT Secret**: 
   - Currently uses default secret: `"your_jwt_secret_key_change_this_in_production"`
   - Set environment variable in production:
   ```bash
   JWT_SECRET=your_very_long_random_secret_key
   ```

3. **HTTPS**: Use HTTPS in production to protect tokens in transit

4. **Token Refresh**: Consider implementing refresh tokens for better security

5. **CORS**: Review CORS configuration in production

---

## API Endpoint Changes

All existing API endpoints now require JWT authentication in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

Example request:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:5000/api/media/1
```

---

## Testing Authentication

### Create Account:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

Response includes JWT token - use it in subsequent requests.

### Authenticated Request:
```bash
curl -X GET http://localhost:5000/api/home/1 \
  -H "Authorization: Bearer <TOKEN_FROM_LOGIN>"
```

---

## Implementation Complete ✅

Both requirements have been successfully implemented:

1. ✅ **User Authentication**: Handled by custom JWT implementation (no third-party service)
2. ✅ **Authentication Validation on Every Page**: Protected routes component + authenticated fetch for all API calls

The system ensures that:
- Users must authenticate before accessing protected routes
- Every HTTP request to protected endpoints includes JWT authentication
- Unauthenticated requests are rejected with 401 status
- Token expiration is handled gracefully
- User sessions persist across page navigation
