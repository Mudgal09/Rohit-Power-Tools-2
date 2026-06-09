# ⚡ Rohit Power Tools — Full Stack E-Commerce

> India's #1 Power Tool Store — Built with React, Node.js, MongoDB, Razorpay, Cloudinary & Gemini AI

---

## 🗂️ Project Structure

```
rohit-power-tools/
├── backend/                    # Node.js + Express API
│   ├── models/                 # MongoDB schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── payment.js          # Razorpay
│   │   ├── chatbot.js          # Gemini AI
│   │   ├── admin.js
│   │   └── upload.js           # Cloudinary
│   ├── middleware/
│   │   ├── auth.js             # JWT protect + adminOnly
│   │   └── cloudinary.js       # Multer + Cloudinary
│   ├── server.js
│   ├── seed.js                 # Sample data seeder
│   └── .env.example
│
└── frontend/                   # React + Vite + Bootstrap
    └── src/
        ├── pages/
        │   ├── HomePage.jsx          # Halo shader bg
        │   ├── ProductsPage.jsx      # Pensive shader bg
        │   ├── LoginPage.jsx         # Nighty Night shader bg
        │   ├── RegisterPage.jsx      # Mint shader bg
        │   ├── ProfilePage.jsx       # Orders + settings
        │   ├── ChatbotPage.jsx       # Interstella shader + speech-to-text
        │   ├── PaymentPage.jsx       # Universe shader + Razorpay
        │   └── AdminPage.jsx         # Viola shader + full CRUD
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   └── ProductCard.jsx
        ├── context/
        │   ├── AuthContext.jsx       # JWT auth state
        │   └── CartContext.jsx       # Cart state
        └── index.css                 # Design tokens
```

---

## 🚀 Setup Guide

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier)
- Razorpay test account
- Google AI Studio account (Gemini API)

---

### 1. Clone & Install

```bash
# Install root dev tools
npm install

# Install all dependencies
npm run install-all
```

---

### 2. Backend Environment

```bash
cd backend
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rohit-power-tools
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret

GEMINI_API_KEY=AIzaSy...your_key

FRONTEND_URL=http://localhost:5173
```

---

### 3. Frontend Environment

```bash
cd frontend
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

### 4. Seed the Database

```bash
npm run seed
```

This creates:
- **12 sample products** across all categories
- **Admin account**: `admin@rohitpowertools.in` / `admin123`

---

### 5. Run Development Servers

```bash
# From root — runs both backend (5000) and frontend (5173) simultaneously
npm run dev
```

Open: **http://localhost:5173**

---

## 🌐 8 Pages

| Page | Route | Auth |
|------|-------|------|
| Home | `/` | Public |
| Products | `/products` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Profile | `/profile` | 🔒 User |
| AI Chatbot | `/chatbot` | 🔒 User |
| Payment / Cart | `/payment` | 🔒 User |
| Admin Panel | `/admin` | 🔒 Admin only |

---

## 🎨 Shader Gradient Backgrounds

Each page uses a different ShaderGradient from the `@shadergradient/react` package:

| Page | Shader |
|------|--------|
| Home | **Halo** (orange-purple plane) |
| Products | **Pensive** (blue-violet sphere) |
| Login | **Nighty Night** (dark purple waterPlane) |
| Register | **Mint** (teal-white waterPlane) |
| Chatbot | **Interstella** (teal-orange sphere) |
| Payment | **Universe** (purple-red waterPlane) |
| Admin | **Viola** (white-yellow-blue sphere) |

---

## 💳 Razorpay Integration

Uses **test mode**. Test credentials:
- Card: `4111 1111 1111 1111`, CVV: any, Expiry: any future date
- UPI: `success@razorpay`

---

## 🤖 AI Chatbot (Bolt AI)

- Powered by **Google Gemini 1.5 Flash**
- **Speech-to-text** via Web Speech API (Chrome/Edge)
- Trained on store context: products, brands, policies, shipping
- Quick suggestion chips on first load
- Full conversation history sent per request

---

## ☁️ Cloudinary Image Upload

- Admin can paste Cloudinary URLs into product form
- For direct upload: use the `/api/upload/image` endpoint (multipart/form-data)
- Images auto-resized to 800×800, quality optimized

---

## 🔑 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/me
PUT    /api/auth/change-password

GET    /api/products              (filter: category, brand, search, sort, minPrice, maxPrice, page)
GET    /api/products/featured
GET    /api/products/:id
POST   /api/products              (admin)
PUT    /api/products/:id          (admin)
DELETE /api/products/:id          (admin)
POST   /api/products/:id/reviews  (auth)

POST   /api/payment/create-order  (auth)
POST   /api/payment/verify        (auth)

GET    /api/orders/my-orders      (auth)
GET    /api/orders/:id            (auth)
GET    /api/orders                (admin)
PUT    /api/orders/:id/status     (admin)

POST   /api/chatbot/message       (auth)
POST   /api/chatbot/public

GET    /api/admin/stats           (admin)
GET    /api/admin/users           (admin)
DELETE /api/admin/users/:id       (admin)

POST   /api/upload/image          (admin)
POST   /api/upload/images         (admin)
```

---

## 🎨 Design System

- **Colors**: Orange `#ff5500`, Gold `#ffa500`, Dark `#0a0a0a`
- **Fonts**: Bebas Neue (display), Rajdhani (headings), Inter (body)
- **Framework**: Bootstrap 5 + custom CSS variables

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Bootstrap 5 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Payment | Razorpay |
| Images | Cloudinary + Multer |
| AI | Google Gemini 1.5 Flash |
| Animations | ShaderGradient, Framer Motion |
| Icons | React Icons (Feather) |

---

## 👨‍💻 Developer

**Rohit Mudgal** — [GitHub: Mudgal09](https://github.com/Mudgal09)

---

*Built with ❤️ in Haryana, India 🇮🇳*
