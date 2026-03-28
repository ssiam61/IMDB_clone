# IMDb Clone Frontend - Setup Guide

## Overview
Modern React Vite frontend with React Router, Axios, and Tailwind CSS. Dark theme inspired by IMDb's design.

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install react-router-dom axios tailwindcss postcss autoprefixer
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or as shown in your terminal).

## Project Structure

```
src/
├── components/
│   └── Navbar.jsx              # Navigation bar with auth-aware menu
├── pages/
│   ├── LoginPage.jsx           # Login form page
│   ├── SignupPage.jsx          # Registration form page
│   ├── HomePage.jsx            # Movie listing & discovery
│   └── ProfilePage.jsx         # User profile with watchlist & reviews
├── services/
│   └── api.js                  # Axios instance with interceptors
├── context/                    # Global state management (ready for use)
├── routes/                     # Custom routing utilities (ready for use)
├── App.jsx                     # Main app with routing setup
├── App.css                     # Dark theme styles & utilities
├── index.css                   # Tailwind CSS import
└── main.jsx                    # React entry point
```

## Features

### Dark Theme
- Color scheme: Gray-900 (backgrounds) with Yellow-400 accents
- CSS variables for consistent theming
- Responsive utilities for mobile-first design

### Authentication Flow
- Token stored in `localStorage`
- Axios interceptor automatically adds `Authorization: Bearer <token>` header
- Login/Signup pages with error handling
- Profile page protected (redirects to login if not authenticated)

### Components

#### Navbar
- Sticky positioning
- Responsive hamburger menu
- Conditional display based on auth state
- Dark theme with hover effects

#### Pages
- **LoginPage**: Email/password authentication
- **SignupPage**: User registration with validation
- **HomePage**: Movie grid with featured section and search
- **ProfilePage**: User info, watchlist, and reviews (tabbed interface)

### API Configuration
- Base URL: `http://localhost:5000/api`
- All requests automatically include auth token if available
- Error handling integrated in components

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomePage | Main movie discovery |
| `/login` | LoginPage | User authentication |
| `/signup` | SignupPage | New user registration |
| `/profile` | ProfilePage | User profile & content |

## Styling Systems

### Tailwind CSS
- Used for layout and responsive design
- Common utilities: `bg-gray-900`, `text-yellow-400`, `hover:bg-yellow-500`, etc.

### App.css
Custom CSS for:
- Dark theme variables
- Animations (fadeIn, slideIn, spin)
- Utility classes (.card, .badge, .spinner, etc.)
- Form styling
- Typography styles

## Development Tips

### Adding a New Page
1. Create component in `src/pages/PageName.jsx`
2. Import in `App.jsx`
3. Add route: `<Route path="/page-path" element={<PageName />} />`

### Adding a New Component
1. Create component in `src/components/ComponentName.jsx`
2. Import where needed: `import ComponentName from '../components/ComponentName'`

### API Calls
```javascript
import api from '../services/api';

// GET request
const response = await api.get('/endpoint');

// POST request
const response = await api.post('/endpoint', data);

// The token is automatically included!
```

### Authentication
```javascript
// Save token after login
localStorage.setItem('authToken', response.data.token);
localStorage.setItem('userId', response.data.userId);

// Check if logged in
const token = localStorage.getItem('authToken');

// Clear on logout
localStorage.removeItem('authToken');
localStorage.removeItem('userId');
```

## Backend Connection
Ensure the backend API is running on `http://localhost:5000/api` with these endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Media
- `GET /api/media` - Get all movies
- `GET /api/user/:userId` - Get user info
- `GET /api/watchlist/:userId` - Get user's watchlist
- `GET /api/review/user/:userId` - Get user's reviews

## Color Palette
- Primary BG: `#111111` (gray-900)
- Secondary BG: `#1c1c1c` (gray-800)
- Accent: `#ffd700` (yellow-400)
- Text: `#ffffff` (white)
- Secondary Text: `#b0b0b0` (gray-400)
- Border: `#404040` (gray-700)

## Customization

### Dark Mode Toggle
To add dark/light mode toggle, modify the CSS variables in `:root` dynamically and apply to document.

### Font Changes
Update the `font-family` in `App.css` under `html, body` selector.

### Color Changes
Modify the CSS variables in `:root` to change the entire theme.

## Troubleshooting

### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

### CORS Errors
Ensure your backend has CORS enabled for `http://localhost:5173`

### Token Not Persisting
Check browser DevTools Console → Application → Local Storage to verify token is saved.

## Next Steps

1. **Connect to Backend**: Update `baseURL` in `services/api.js` if backend runs on different port
2. **Add More Pages**: Create detail pages for movies, watchlist management, etc.
3. **State Management**: Use Context API files or Redux for complex state
4. **Error Boundaries**: Add error handling for better UX
5. **Loading States**: Enhance loading indicators throughout the app

---

Built with ❤️ for IMDb Clone
