<p align="center">
  <img src="docs/assets/tech-stack-banner.png" alt="E-Commerce AI Platform — Tech Stack" width="100%" />
</p>

<h1 align="center">E-Commerce AI Project</h1>

<p align="center">
  A production-style full-stack e-commerce platform — modern storefront, scalable API, real payments, and smart personalization.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white" alt="RabbitMQ" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

---

## Why This Project?

It is a **real-world e-commerce system** built with patterns you would see on a growing product team: Clean Architecture on the backend, event-driven payment flows, Redis caching, and a polished customer-facing UI with admin and user dashboard.

Built to showcase **full-stack ownership** — from product pages and checkout to async messaging and payment verification.

## Highlights

| | |
|---|---|
| **Smart storefront** | Search, filters, categories, ratings, comments, wishlist, and personalized recommendations |
| **Enterprise-style backend** | NestJS modules with domain / application / infrastructure layers |
| **Event-driven checkout** | Orders publish to RabbitMQ → payment starts asynchronously |
| **Performance** | Redis cache with versioned keys for hot product queries |
| **Real payments** | Zarinpal integration + mock gateway for local dev |
| **Admin dashboard** | Manage products, users, and orders from `/manager` |
| **User dashboard** | Manage profile, orders, wishlist, and recommended products |
| **Production-ready extras** | JWT auth, Cloudinary uploads, email reset, reCAPTCHA, i18n support |

## Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,nestjs,mongodb,redis,docker,tailwind" alt="Stack icons" />
</p>

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | NestJS 11, Clean Architecture, JWT + Passport, Swagger |
| **Data** | MongoDB (Mongoose), Redis (ioredis) |
| **Messaging** | RabbitMQ — order & payment events |
| **Integrations** | Cloudinary, Nodemailer, Zarinpal, Google reCAPTCHA |
| **Testing** | Jest — unit tests & E2E tests for critical services |
| **Deploy** | Vercel (frontend + serverless API) |

## Features

### Customer Experience
- Home page with featured, top-rated, and highest-discount products
- Advanced product search (price, rating, category, sort)
- Product detail pages with image gallery, related items, and star ratings
- Shopping cart synced with the backend (JWT-protected)
- Full checkout flow with shipping address and payment redirect
- User account: profile, orders, wishlist, address book, recommendations
- Contact form with reCAPTCHA protection

### Smart Personalization
- Tracks user interactions (views, purchases, wishlist activity)
- Generates recommendations from behavior history
- Related products by category + curated similar-product links
- Feedback keywords on products for richer discovery

### Admin & Operations
- Manager dashboard for products, users, and orders
- Order status and payment status management
- Cloudinary multi-image upload for product media
- Contact submission management

### Backend Engineering
- 15+ REST modules with use-case-driven design
- Async payment pipeline via RabbitMQ consumers
- Redis caching with namespace versioning
- Password reset flow over SMTP
- Health check and test endpoints for monitoring
- E2E testing infrastructure and unit tests for critical services

## Project Structure

```
ecommerce-ai-project/
├── frontend/          # Next.js storefront & admin UI
├── backend/           # NestJS REST API (Clean Architecture)
├── docs/              # Architecture, API, setup guides
└── docs/assets/       # README images & diagrams
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Docker (for Redis & RabbitMQ)

### 1. Start infrastructure

```bash
cd backend
docker compose up -d
```

### 2. Configure environment

Create `backend/.env` and `frontend/.env.local` — see [Setup Guide](docs/SETUP.md) for all variables.

```env
# backend/.env (minimum)
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your-secret
PORT=3005
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
RABBITMQ_URL=amqp://app_user:app_password@127.0.0.1:5672
```

```env
# frontend/.env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:3005/api
```

### 3. Run the apps

```bash
# Terminal 1 — API
cd backend && npm install && npm run start:dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

| Service | URL |
|---------|-----|
| Storefront | http://localhost:3000 |
| API | http://localhost:3005/api |
| Health check | http://localhost:3005/api/health |
| RabbitMQ UI | http://localhost:15672 |

## Documentation

Want the full picture? Dive deeper:

| Document | Description |
|----------|-------------|
| [Project Overview](docs/PROJECT.md) | Modules, pages, and user flows |
| [Architecture](docs/ARCHITECTURE.md) | System design, caching, event flow |
| [Tech Stack](docs/TECH-STACK.md) | Libraries, tools, and integrations |
| [API Reference](docs/API.md) | REST endpoints and auth |
| [Setup Guide](docs/SETUP.md) | Environment variables and deployment |

## License

Private — UNLICENSED
