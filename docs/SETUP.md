# Setup Guide

Step-by-step instructions to run the project locally and deploy to production.

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 18+ | LTS recommended |
| npm | 9+ | Comes with Node |
| MongoDB | 6+ | Local install or [MongoDB Atlas](https://www.mongodb.com/atlas) |
| Docker | Latest | For Redis & RabbitMQ |

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd ecommerce-ai-project

cd backend && npm install
cd ../frontend && npm install
```

## 2. Start Infrastructure (Docker)

From the `backend` directory:

```bash
docker compose up -d
```

This starts:

| Service | Port | Purpose |
|---------|------|---------|
| Redis | 6379 | Response caching |
| RabbitMQ | 5672 | Event messaging |
| RabbitMQ Management | 15672 | Web UI (`app_user` / `app_password`) |

Verify:

```bash
docker compose ps
```

## 3. Backend Environment

Create `backend/.env`:

```env
# Server
PORT=3005
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce

# Auth
JWT_SECRET=change-this-to-a-long-random-string

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
# REDIS_URL=redis://127.0.0.1:6379

# RabbitMQ
RABBITMQ_URL=amqp://app_user:app_password@127.0.0.1:5672
RABBITMQ_EXCHANGE=app.events

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3005/api

# Email (password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Shop <your-email@gmail.com>"

# Cloudinary (product images)
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_KEY=your-api-key
CLOUDINARY_SECRET=your-api-secret

# reCAPTCHA
RECAPTCHA_SECRET_KEY=your-recaptcha-secret

# Payments (Zarinpal — optional for dev)
ZARINPAL_MERCHANT_ID=your-merchant-id
```

### Start the API

```bash
cd backend
npm run start:dev
```

Verify at http://localhost:3005/api/health

## 4. Frontend Environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3005/api
```

> **Important:** Include the `/api` prefix. The NestJS app sets a global prefix of `api`.

### Start the Storefront

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

## 5. Verify the Full Stack

1. Visit http://localhost:3000 — home page loads products.
2. Register a new account at `/register`.
3. Log in at `/login`.
4. Browse a product, add to cart, proceed to checkout.
5. Check http://localhost:3005/api/health returns `{ "status": "OK" }`.
6. Check RabbitMQ UI at http://localhost:15672 for connected consumers.

## Running Tests

```bash
# Backend unit tests
cd backend
npm test

# Backend e2e tests
npm run test:e2e
```

## Production Deployment

### Vercel (included configs)

Both apps have `vercel.json` files. Set all environment variables in the Vercel dashboard for each project.

**Backend variables** — all vars from `backend/.env` above.

**Frontend variables:**

```
NEXT_PUBLIC_BACKEND_URL=https://your-api.vercel.app/api
```

### MongoDB Atlas

Replace `MONGODB_URI` with your Atlas connection string:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

### Redis & RabbitMQ in Production

Use managed services (e.g. Upstash Redis, CloudAMQP) and set:

```
REDIS_URL=redis://...
RABBITMQ_URL=amqp://...
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| API returns 404 | Ensure `NEXT_PUBLIC_BACKEND_URL` includes `/api` |
| CORS errors | Backend enables `origin: '*'` in dev; tighten for production |
| Redis connection refused | Run `docker compose up -d redis` in `backend/` |
| RabbitMQ connection refused | Run `docker compose up -d rabbitmq` in `backend/` |
| Payment fails locally | Use mock gateway or set valid `ZARINPAL_MERCHANT_ID` |
| Images not loading | Configure Cloudinary env vars; check `next.config.js` domains |
| Port conflict | Change `PORT` in backend `.env` and update frontend URL |

## Scripts Reference

### Backend (`backend/package.json`)

| Script | Command |
|--------|---------|
| `npm run start:dev` | Dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start:prod` | Run compiled app |
| `npm test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |

### Frontend (`frontend/package.json`)

| Script | Command |
|--------|---------|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## Related Docs

- [Project Overview](PROJECT.md)
- [Architecture](ARCHITECTURE.md)
- [Tech Stack](TECH-STACK.md)
- [API Reference](API.md)
