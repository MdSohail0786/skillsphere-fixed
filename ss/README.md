# 🚀 SkillSphere — Intelligent Hyperlocal Freelance Ecosystem

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Stack](https://img.shields.io/badge/stack-MERN-purple)
![Status](https://img.shields.io/badge/status-production--ready-success)

> **AI-Powered Hyperlocal Freelancing Platform** — Connect verified local freelancers with clients using smart matching, real-time chat, secure payments, and AI recommendations.

---

## ✨ Key Features

### 🧠 AI-Powered Matching

- **Smart Scoring**: Freelancers scored 0–100 based on skills, budget, rating, and location proximity
- **AI Recommendations**: Personalized job & gig suggestions using match algorithms
- **Hyperlocal Search**: Find talent by city, state, pincode, or geographical coordinates

### 💼 For Freelancers

- **Portfolio Builder**: Showcase work with images, videos, GitHub links, and live demos
- **Skill Badges**: Display verified skills with proficiency levels (beginner/intermediate/expert)
- **Level Tiers**: Rising Talent → Top Rated → Top Rated Plus → Expert
- **Earnings Analytics**: Track total earnings, completed projects, and average ratings
- **My Gigs**: Create and manage service offerings with multi-tiered pricing packages

### 🏢 For Clients

- **Job Posting**: Create detailed job listings with budgets, timelines, and skill requirements
- **Freelancer Discovery**: Browse/search/filter freelancers by skills, ratings, location, and hourly rates
- **Proposal Management**: Review, accept/reject proposals from freelancers
- **Project Tracking**: Monitor progress with milestone-based workflows

### 🔒 Security & Trust

- **JWT Authentication**: Access + Refresh token rotation with automatic expiry
- **Google OAuth**: One-click sign-in with Google accounts
- **Email Verification**: Secure account activation via email confirmation
- **Password Reset**: Forgot/reset password flow with crypto-secure tokens
- **Role-Based Access**: Freelancer, Client, and Admin roles with strict authorization
- **Account Suspension**: Admin can ban/unban users with reason tracking
- **Rate Limiting**: Auth endpoints limited to 10 req/15min, API to 200 req/15min
- **Helmet + CORS**: Security headers and cross-origin protection

### 💬 Real-Time Features

- **Instant Messaging**: Socket.IO-powered chat with typing indicators
- **Online Presence**: Real-time online/offline status indicators
- **Live Notifications**: Push notifications for proposals, messages, payments, and reviews
- **Toast Notifications**: Non-intrusive in-app notifications

### 💳 Payments & Finance

- **Razorpay Integration**: Secure payment processing with escrow holds
- **Transaction History**: Complete payment audit trail per user
- **Milestone Payments**: Release funds only after milestone approval
- **Platform Revenue**: Admin dashboard tracks total platform and monthly revenue

### 📱 Responsive Design

- **Dark/Light Theme**: Full theme support with localStorage persistence (dark mode toggle)
- **Mobile-First**: Fully responsive Tailwind CSS design across all pages
- **Animated UI**: Smooth transitions, hover effects, skeleton loaders

---

## 🏗️ Tech Stack

| Layer         | Technology                                       | Purpose                                        |
| ------------- | ------------------------------------------------ | ---------------------------------------------- |
| **Frontend**  | React 18 + Vite                                  | SPA with fast HMR & lazy loading               |
| **Styling**   | Tailwind CSS 3.4                                 | Utility-first responsive design                |
| **State**     | Zustand 5                                        | Lightweight global state management            |
| **Routing**   | React Router v6                                  | Client-side routing with lazy routes           |
| **HTTP**      | Axios                                            | API client with JWT interceptor & auto-refresh |
| **Icons**     | Lucide React                                     | Consistent iconography                         |
| **Forms**     | react-hook-form                                  | Form validation                                |
| **Animation** | Framer Motion                                    | Page transitions                               |
| **Backend**   | Node.js + Express                                | RESTful API server                             |
| **Database**  | MongoDB + Mongoose                               | Document database with ODM                     |
| **Real-time** | Socket.IO 4                                      | Bidirectional event-based communication        |
| **Auth**      | JWT + Passport.js                                | Token-based + Google OAuth 2.0                 |
| **Payments**  | Razorpay                                         | Payment gateway integration                    |
| **Media**     | Cloudinary + Multer                              | Image upload and transformation                |
| **Email**     | Nodemailer                                       | Transactional emails (verify, reset)           |
| **Security**  | Helmet, CORS, Rate-Limit, Mongo-Sanitize, bcrypt | OWASP best practices                           |
| **Logging**   | Winston + Morgan                                 | Structured server logging                      |
| **Dev**       | Nodemon, Vite HMR                                | Hot reload development                         |

---

## 📂 Project Structure

```
skillsphere/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Cloudinary, Passport config
│   │   ├── controllers/     # Route handlers (13 modules)
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── models/          # Mongoose schemas (11 models)
│   │   ├── routes/          # Express routers (13 modules)
│   │   ├── socket/          # Socket.IO event handlers
│   │   ├── utils/           # JWT, email, response helpers
│   │   └── server.js        # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client + all API modules
│   │   ├── components/      # Reusable UI components
│   │   │   ├── chat/        # Chat components
│   │   │   ├── common/      # Navbar, Footer, Sidebar, Toast
│   │   │   ├── gigs/        # Gig components
│   │   │   ├── jobs/        # Job components
│   │   │   └── ui/          # Base UI components
│   │   ├── hooks/           # Custom hooks (useSocket, useToast)
│   │   ├── pages/           # Page components (11 pages)
│   │   │   ├── auth/        # Login, Signup, Forgot/Reset, Verify
│   │   │   └── dashboard/   # Freelancer, Client, Admin dashboards
│   │   ├── store/           # Zustand stores (auth, theme, chat, notifications)
│   │   ├── utils/           # Helpers (formatCurrency, timeAgo, etc.)
│   │   ├── App.jsx          # Root component with routes
│   │   ├── index.css        # Global styles + custom components
│   │   └── main.jsx         # Application entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB Atlas account (or use in-memory for development)

### 1️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see config section below)
npm run dev
```

Backend starts on **http://localhost:5000** 🎉

> 💡 **No MongoDB? No problem!** Set `USE_MEMORY_DB=true` in `.env` and the app will use an in-memory MongoDB server automatically.

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on **http://localhost:5173** 🎉

---

## ⚙️ Configuration (.env)

```env
# ---- Server ----
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# ---- Database ----
# Leave empty or set USE_MEMORY_DB=true for in-memory (dev only)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skillsphere
USE_MEMORY_DB=true            # Skips Atlas, uses in-memory DB instantly

# ---- JWT ----
JWT_ACCESS_SECRET=your_32_char_min_secret_here
JWT_REFRESH_SECRET=your_32_char_min_refresh_secret

# ---- Google OAuth ----
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# ---- Email (SMTP) ----
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@skillsphere.com
FROM_NAME=SkillSphere

# ---- Cloudinary ----
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# ---- Razorpay ----
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

# ---- Cookie ----
COOKIE_SECRET=your_32_char_cookie_secret
```

---

## 📡 API Reference

| Prefix                           | Description                   | Auth Required |
| -------------------------------- | ----------------------------- | :-----------: |
| `GET /health`                    | Health check                  |      ❌       |
| `POST /api/auth/signup`          | Register new user             |      ❌       |
| `POST /api/auth/login`           | Login                         |      ❌       |
| `POST /api/auth/forgot-password` | Request password reset        |      ❌       |
| `POST /api/auth/reset-password`  | Reset password with token     |      ❌       |
| `POST /api/auth/verify-email`    | Verify email with token       |      ❌       |
| `GET /api/auth/google`           | Google OAuth login            |      ❌       |
| `POST /api/auth/refresh`         | Refresh JWT token             |      ❌       |
| `POST /api/auth/logout`          | Logout                        |      ✅       |
| `GET /api/auth/me`               | Get current user              |      ✅       |
| `GET/PUT /api/users/*`           | User profile CRUD             |      ✅       |
| `GET /api/freelancers/*`         | Browse/search freelancers     |      ❌       |
| `GET/POST /api/gigs/*`           | Gigs CRUD                     |     Mixed     |
| `GET/POST /api/jobs/*`           | Jobs CRUD                     |     Mixed     |
| `POST /api/proposals/*`          | Proposal submission           |      ✅       |
| `GET /api/projects/*`            | Project management            |      ✅       |
| `GET/POST /api/chat/*`           | Messaging                     |      ✅       |
| `POST /api/payments/*`           | Payment processing            |      ✅       |
| `POST /api/reviews/*`            | Review submission             |      ✅       |
| `GET /api/notifications/*`       | Notification management       |      ✅       |
| `GET /api/ai/*`                  | AI matching & recommendations |      ✅       |
| `GET /api/admin/*`               | Admin operations              |     Admin     |

---

## 📊 Database Models (11 Collections)

| Model                 | Key Fields                                                            | Indexes                    |
| --------------------- | --------------------------------------------------------------------- | -------------------------- |
| **User**              | name, email, password, role, location.coordinates, googleId, isBanned | 2dsphere, role             |
| **FreelancerProfile** | user, title, skills[], hourlyRate, availability, averageRating, level | skills.name, averageRating |
| **Gig**               | freelancer, title, description, category, packages, status, orders    | text, category, status     |
| **Job**               | client, title, description, budget, skills[], status, experienceLevel | text, status, client       |
| **Proposal**          | freelancer, job, bidAmount, timeline, status                          | job+freelancer, status     |
| **Project**           | job, freelancer, client, milestones[], progress, totalAmount          | freelancer, client, status |
| **Message**           | conversation, sender, content, isRead                                 | conversation, createdAt    |
| **Conversation**      | participants[], lastMessage                                           | participants               |
| **Notification**      | user, type, title, body, isRead, link                                 | user, createdAt            |
| **Transaction**       | user, type, amount, status, razorpayOrderId                           | user, createdAt            |
| **Review**            | reviewer, targetUser, rating, review, projectId                       | targetUser, projectId      |

---

## 👥 User Roles & Dashboards

### 🟣 Freelancer Dashboard

- **Stats**: Total Earnings, Active Projects, Pending Proposals, Avg Rating
- **My Gigs**: List gigs with status (active/paused), create new gigs
- **Recent Proposals**: Track proposal statuses (pending/accepted/rejected)
- **AI Recommended Jobs**: Smart job suggestions with match scores

### 🔵 Client Dashboard

- **Stats**: Active Projects, Completed, Total Spend, Jobs Posted
- **My Jobs**: Post new jobs, track proposal counts
- **Active Projects**: Progress bars with milestone tracking

### 🔴 Admin Dashboard

- **Platform Stats**: Total Users, Freelancers, Clients, Revenue (total + monthly)
- **User Management**: View/search users, ban/unban, verify freelancers
- **Reports**: Review and resolve reported content
- **Transactions**: Full payment audit trail

---

## 🎨 Pages Overview (11 Pages)

| Page                | Route              | Features                                                |
| ------------------- | ------------------ | ------------------------------------------------------- |
| **Home**            | `/`                | Hero, stats, categories, top freelancers, CTA           |
| **Gigs**            | `/gigs`            | Search, category filter, sort, grid view                |
| **Jobs**            | `/jobs`            | Search, filters (budget, type, experience), pagination  |
| **Freelancers**     | `/freelancers`     | Search, filters (rate, rating, city), card grid         |
| **Chat**            | `/chat`            | Real-time messaging, typing indicators, online status   |
| **Notifications**   | `/notifications`   | Mark read, mark all read, delete, type icons            |
| **Login**           | `/login`           | Email/password, Google OAuth, forgot password           |
| **Signup**          | `/signup`          | Role selector, form validation, email verification flow |
| **Forgot Password** | `/forgot-password` | Email input, sends reset link                           |
| **Reset Password**  | `/reset-password`  | Token validation, new password                          |
| **Verify Email**    | `/verify-email`    | Token verification confirmation                         |

---

## 🌙 Theme System

- **Dark/Light Toggle** in Navbar + system preference detection
- **Persistent**: Saved to `localStorage` under `ss_theme` key
- **Flash Prevention**: Inline `<script>` in `index.html` applies theme before React loads
- **CSS Variables**: `--bg`, `--bg-card`, `--text`, `--border` etc. for Tailwind `dark:` class
- **Smooth Transitions**: `transition` on background-color and text-color

---

## 🔐 Security Checklist

- [x] JWT access/refresh token rotation
- [x] bcrypt password hashing (12 rounds)
- [x] HTTP-only refresh cookies
- [x] Helmet security headers
- [x] CORS whitelist configuration
- [x] Rate limiting (global + auth)
- [x] MongoDB injection sanitization
- [x] Request body size limits (10MB)
- [x] Input validation (express-validator)
- [x] Token expiry handling with auto-refresh
- [x] Account ban/unban system
- [x] Role-based authorization middleware
- [x] Error handler with stack trace suppression in production

---

## 🚢 Deployment

### Backend → Render.com

```bash
# Build command: npm install
# Start command: npm start
# Environment: Add all .env variables in Render dashboard
```

### Frontend → Vercel

```bash
# Build command: npm run build
# Output directory: dist
# Environment: VITE_API_URL=https://your-backend.onrender.com/api
```

### Database → MongoDB Atlas

1. Create free cluster
2. Whitelist deployment IPs
3. Get connection string
4. Set as `MONGODB_URI` in backend env

---

## 🧪 Testing Locally

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Open browser at http://localhost:5173
# Backend API at http://localhost:5000
# Health check: http://localhost:5000/health
```

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first framework
- **Lucide React** for beautiful, consistent icons
- **Zustand** for minimal state management
- **MongoDB Memory Server** for hassle-free local development
- **Socket.IO** for making real-time easy

---

<div align="center">
  <p>Built with ❤️ for freelancers and clients everywhere</p>
  <p>
    <strong>SkillSphere</strong> — <em>Hire Smarter, Work Better</em>
  </p>
</div>
