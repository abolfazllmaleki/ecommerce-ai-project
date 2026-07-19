# Tech Stack

## Overview

| Category | Choice | Version (approx.) |
|----------|--------|-------------------|
| Frontend framework | Next.js | 14.x |
| UI library | React | 18.x |
| Styling | Tailwind CSS | 3.x |
| Backend framework | NestJS | 11.x |
| Language | TypeScript | 5.x |
| Database | MongoDB via Mongoose | 8.x |
| Cache | Redis via ioredis | 5.x |
| Message broker | RabbitMQ via amqplib | 2.x |
| Auth | JWT + Passport | — |
| Payments | Zarinpal (+ mock gateway) | — |
| Media | Cloudinary | 2.x |
| Email | Nodemailer | 7.x |

## Frontend

### Core

| Package | Purpose |
|---------|---------|
| `next` | App Router, SSR/SSG, API routes |
| `react` / `react-dom` | UI rendering |
| `typescript` | Type safety |
| `tailwindcss` | Utility-first CSS |
| `axios` | HTTP client (search service) |

### UI & UX

| Package | Purpose |
|---------|---------|
| `@headlessui/react` | Accessible tabs, modals (manager dashboard) |
| `framer-motion` | Animations |
| `react-icons` | Icon set |
| `react-hook-form` | Form handling |

### Internationalization

| Package | Purpose |
|---------|---------|
| `next-intl` | App localization |
| `i18next` / `react-i18next` / `next-i18next` | Translation infrastructure |

### Security

| Package | Purpose |
|---------|---------|
| `react-google-recaptcha` | Client-side reCAPTCHA widget |
| `jsonwebtoken` | Token handling on frontend |

## Backend

### Core

| Package | Purpose |
|---------|---------|
| `@nestjs/common`, `@nestjs/core` | NestJS framework |
| `@nestjs/config` | Environment configuration |
| `@nestjs/mongoose` | MongoDB integration |
| `@nestjs/swagger` | API documentation (comments module) |
| `mongoose` | ODM for MongoDB |
| `class-validator` / `class-transformer` | DTO validation |

### Auth

| Package | Purpose |
|---------|---------|
| `@nestjs/jwt` | JWT token generation |
| `@nestjs/passport` | Auth strategies |
| `passport-jwt` | JWT strategy |
| `passport-local` | Email/password strategy |
| `bcrypt` | Password hashing |

### Infrastructure

| Package | Purpose |
|---------|---------|
| `ioredis` | Redis client |
| `amqplib` | RabbitMQ client |
| `cloudinary` | Image hosting |
| `multer` | Multipart file uploads |
| `nodemailer` | Transactional email |
| `@nestjs/axios` / `axios` | HTTP calls (Zarinpal API) |

### Dev & Testing

| Package | Purpose |
|---------|---------|
| `@nestjs/cli` | Nest CLI |
| `jest` / `ts-jest` | Unit tests |
| `supertest` | E2E tests |
| `eslint` / `prettier` | Linting & formatting |

## Infrastructure Services

### MongoDB

Primary data store for users, products, orders, comments, contacts, carts, payments, and transactions.

```
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
```

### Redis

Response caching with versioned invalidation. Started locally via Docker:

```bash
cd backend && docker compose up -d redis
```

### RabbitMQ

Async integration between orders and payments. Management plugin enabled on port 15672.

```bash
cd backend && docker compose up -d rabbitmq
```

Default credentials: `app_user` / `app_password`

## External Services

| Service | Env Variables | Used For |
|---------|---------------|----------|
| **Cloudinary** | `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET` | Product image uploads |
| **SMTP** | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Password reset emails |
| **Zarinpal** | `ZARINPAL_MERCHANT_ID` | Iranian payment gateway |
| **Google reCAPTCHA** | `RECAPTCHA_SECRET_KEY` / `RECAPTCHA_SECRET` | Bot protection on forms |
| **Frontend URL** | `FRONTEND_URL` | Password reset link base |
| **Backend URL** | `BACKEND_URL` | Payment callback URLs |

## Deployment Targets

| App | Config | Platform |
|-----|--------|----------|
| Frontend | `frontend/vercel.json`, `output: 'standalone'` | Vercel |
| Backend | `backend/vercel.json` | Vercel (serverless) |
| Root | `vercel.json` | Monorepo routing |

## Related Docs

- [Project Overview](PROJECT.md)
- [Architecture](ARCHITECTURE.md)
- [API Reference](API.md)
- [Setup Guide](SETUP.md)
