# ContentCraft AI

<div align="center">
  <img src="/public/logo.png" alt="ContentCraft AI Logo" width="200"/>
  <h3>AI-Powered Content Generation Platform</h3>
  <p>Generate professional content instantly with Google's Gemini 2.5 Pro AI</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14"/>
    <img src="https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS"/>
    <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google" alt="Google Gemini"/>
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql" alt="PostgreSQL"/>
  </div>
</div>

## ✨ Features

- **🤖 Advanced AI Generation**: Harnesses Google's Gemini 2.5 Pro for high-quality content creation
- **📝 Multiple Content Templates**: Blog posts, article outlines, SEO content, social media posts, and more
- **� Rich Text Editor**: Professional editor for viewing and refining AI-generated content
- **�💰 Razorpay Integration**: Seamless subscription payments with India's leading payment gateway
- **💳 Subscription Tiers**: Free tier and Pro tier with flexible payment options
- **📊 Usage Tracking**: Word count tracking and usage limitations based on subscription tier
- **🔐 User Authentication**: Secure authentication with Clerk
- **💾 Content History**: Save and access all previously generated content
- **🎨 Modern & Responsive UI**: Beautiful interface built with TailwindCSS and custom components
- **📱 Mobile-Friendly**: Fully responsive design for all devices
- **🚀 Optimized Performance**: Fast loading times with Next.js optimizations

## 📸 Screenshots

<div align="center">
  <img src="/public/screenshots/page1.png" alt="Home Page" width="45%"/>
  <img src="/public/screenshots/page2.png" alt="Dashboard" width="45%"/>
  <img src="/public/screenshots/page3.PNG" alt="Content Generation" width="45%"/>
  <img src="/public/screenshots/page4.PNG" alt="Rich Text Editor" width="45%"/>
  <img src="/public/screenshots/page5.PNG" alt="Razorpay Checkout" width="45%"/>
</div>

## 🛠️ Tech Stack

- **Frontend**:
  - Next.js 14 - React framework with server and client components
  - TypeScript - Type-safe JavaScript
  - TailwindCSS - Utility-first CSS framework
  - Radix UI - Accessible component primitives
  - Lucide Icons - Beautiful icon set
  - Rich Text Editor - Professional content editing capabilities

- **Backend**:
  - Next.js API Routes - Serverless functions
  - Google Gemini 2.5 Pro - Advanced AI model for content generation
  - Drizzle ORM - Type-safe database toolkit
  - PostgreSQL (Neon) - Serverless Postgres database
  - Clerk - Authentication and user management

- **Payments**:
  - Razorpay - India's leading payment gateway for subscription processing
  - Secure checkout experience
  - Automatic subscription management

- **Deployment**:
  - Vercel - Platform for frontend and serverless functions

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn
- Clerk account for authentication
- Google Gemini API key
- Razorpay account for payments
- Neon PostgreSQL database

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CoderYashVij/ContentCraft-AI.git
   cd ContentCraft-AI
   ```

2. **Install dependencies**
   ```bash
   npm install --force
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with the following variables:
   ```
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Database
   DATABASE_URL=your_neon_postgres_connection_string
   
   # Google Gemini AI
   NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   
   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_SECRET_KEY=your_razorpay_secret_key
   SUBSCRIPTION_PLAN_ID=your_subscription_plan_id
   ```

4. **Initialize database schema**
   ```bash
   npm run db:push
   # or
   yarn db:push
   ```

5. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Management

- **Schema Management**: `src/utils/schema.ts`
- **View Database**: `npm run db:studio` or `yarn db:studio`
- **Update Schema**: Make changes to schema.ts and run `npm run db:push`

## 📜 Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management

## 📱 Features Breakdown

- **Content Generation**:
  - Multiple AI templates for different content types
  - Form-based input for guiding AI generation
  - Real-time content preview and editing

- **Rich Text Editor**:
  - Professional formatting tools for content refinement
  - Export options for generated content
  - Seamless editing experience with Markdown support
  - Clean, distraction-free interface for content focus

- **User Dashboard**:
  - Content history tracking
  - Usage statistics
  - Subscription management
  - Word count visualization

- **Subscription System**:
  - Free tier with limited usage (40,000 words)
  - Pro tier with unlimited content generation
  - Seamless Razorpay payment gateway integration
  - Secure transaction processing
  - Automatic subscription renewal management

## 👨‍💻 Author

- **Yash Vij** - [GitHub](https://github.com/CoderYashVij)

