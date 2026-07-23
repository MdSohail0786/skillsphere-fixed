# Fix Plan - SkillSphere Backend ✅

## ✅ Step 1: Fix duplicate index in `User.js`

- Removed `userSchema.index({ email: 1 })` — duplicates `unique: true` on email field

## ✅ Step 2: Fix duplicate index in `FreelancerProfile.js`

- Removed `freelancerProfileSchema.index({ user: 1 })` — duplicates `unique: true` on user field

## ✅ Step 3: Fix duplicate route definitions in `auth.js`

- Removed the unconditional `/google` and `/google/callback` routes, kept only the guarded ones

## ❌ Step 4: MongoDB Connection (User Action Required)

- User needs to fix their MONGODB_URI in `.env` or whitelist IP in MongoDB Atlas
