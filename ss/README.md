# SkillSphere — Intelligent Hyperlocal Freelance Ecosystem

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in .env values
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Backend runs on: http://localhost:5000
Frontend runs on: http://localhost:5173

## ⚙️ Required .env Values

### backend/.env
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skillsphere
JWT_ACCESS_SECRET=your_32_char_min_secret_here
JWT_REFRESH_SECRET=your_32_char_min_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@skillsphere.com
FROM_NAME=SkillSphere
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
COOKIE_SECRET=your_32_char_cookie_secret
```

## 🏗️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Zustand, React Router v6 |
| Backend | Node.js, Express.js, Socket.IO |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT, Google OAuth, bcrypt |
| Payments | Razorpay |
| Storage | Cloudinary |
| Real-time | Socket.IO |

## 📡 API Endpoints

- Auth: `/api/auth/*`
- Users: `/api/users/*`
- Freelancers: `/api/freelancers/*`
- Gigs: `/api/gigs/*`
- Jobs: `/api/jobs/*`
- Proposals: `/api/proposals/*`
- Projects: `/api/projects/*`
- Chat: `/api/chat/*`
- Payments: `/api/payments/*`
- Reviews: `/api/reviews/*`
- Notifications: `/api/notifications/*`
- AI: `/api/ai/*`
- Admin: `/api/admin/*`
- Health: `GET /health`

## 🚀 Deployment

- Backend → Render.com
- Frontend → Vercel
- Database → MongoDB Atlas

See .env.example for all required environment variables.
