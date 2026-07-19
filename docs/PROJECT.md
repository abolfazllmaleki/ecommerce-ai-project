# Project Overview

## What Is This?

An e-commerce platform built as a monorepo with a customer-facing storefront and a REST API. The backend follows **Clean Architecture** (domain → application → infrastructure → interface), and the frontend is a Next.js App Router application with client-side state for auth and cart.

The "AI" aspect is **behavior-driven personalization**: recommendations are generated from user interaction history, product similarity links, and feedback keywords — not from an external LLM.

## Repository Layout

```
ecommerce-ai-project/
├── frontend/                 # Next.js 14 storefront
│   └── src/
│       ├── app/              # Pages, components, API routes (BFF)
│       ├── services/         # API client helpers
│       └── ...
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/             # Register, login, password reset
│   │   ├── users/            # Profiles, wishlist, ratings, recommendations
│   │   ├── products/         # Catalog, search, related products
│   │   ├── categories/       # Category CRUD
│   │   ├── cart/             # Authenticated shopping cart
│   │   ├── orders/           # Order lifecycle
│   │   ├── payment/          # Zarinpal + mock gateway
│   │   ├── transaction/      # Payment transaction records
│   │   ├── comments/         # Product reviews & replies
│   │   ├── contact/          # Contact form submissions
│   │   ├── recommendations/  # Recommendation endpoint
│   │   ├── email/            # Password reset emails
│   │   ├── recaptcha/        # Google reCAPTCHA verification
│   │   └── shared/
│   │       ├── caching/      # Redis adapter & cache versioning
│   │       ├── messaging/    # RabbitMQ publisher/consumer
│   │       └── cloudinary/   # Image uploads
│   └── docker-compose.yml    # Redis + RabbitMQ for local dev
└── docs/                     # Documentation
```

## Backend Modules

| Module | Responsibility |
|--------|----------------|
| **Auth** | Registration, login, JWT, forgot/reset password |
| **Users** | CRUD, wishlist, ratings, interactions, preferences, recommendations |
| **Products** | CRUD, search, featured/popular/top-rated, related products, metrics |
| **Categories** | Product category management |
| **Cart** | JWT-protected cart (add, update, remove, get) |
| **Orders** | Create and manage orders; publishes `order.created` events |
| **Payment** | Start/verify payments via Zarinpal or mock gateway |
| **Transaction** | Query transactions by payment ID |
| **Comments** | Product comments, replies, like/dislike |
| **Contact** | Contact form with admin status management |
| **Recommendations** | Exposes user-specific product recommendations |
| **Email** | SMTP emails for password reset |
| **Recaptcha** | Server-side reCAPTCHA validation |
| **Shared/Caching** | Redis cache with versioned keys |
| **Shared/Messaging** | RabbitMQ event bus |
| **Shared/Cloudinary** | Multi-image upload (max 3, 2 MB each) |

## Frontend Pages

| Route | Purpose |
|-------|---------|
| `/` | Home — featured, top-rated, discounted products |
| `/search` | Product search with filters |
| `/ProductDetail/[id]` | Product detail, comments, related items |
| `/cart` | Shopping cart |
| `/checkout` | Order creation & payment start |
| `/login`, `/register` | Authentication |
| `/forgot-password`, `/reset-password` | Password recovery |
| `/contact` | Contact form |
| `/about` | About page |
| `/manager` | Admin dashboard (products, users, orders) |
| `/useraccount/*` | Profile, orders, wishlist, address, recommendations |

## Key User Flows

### Browse & Purchase

1. User browses products on the home page or search.
2. Product views are tracked via increment endpoints.
3. User adds items to cart (JWT required).
4. Checkout creates an order via `POST /api/orders`.
5. Backend publishes `order.created` to RabbitMQ.
6. Payment is started (Zarinpal redirect or mock gateway).
7. Payment verification updates order status via events.

### Personalization

1. User interactions (views, purchases, etc.) are stored in `interactionHistory`.
2. `GET /api/users/:id/recommendations` returns the most interacted products.
3. Related products are resolved by category and cached in Redis.
4. Products can have manually curated `similarProducts` and `userFeedbackKeywords`.

### Admin

The `/manager` dashboard provides tabs for orders, products, users, analytics, and settings. Admin operations call the same REST API used by the storefront.

## User Roles

Defined in the backend domain:

- `USER` — default role
- `ADMIN` — full management access
- `MODERATOR` — moderation capabilities

## API Base URL

All backend routes are prefixed with `/api` (configured in `backend/src/main.ts`).

The frontend reads `NEXT_PUBLIC_BACKEND_URL`, which should include the prefix:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3005/api
```

## Related Docs

- [Architecture](ARCHITECTURE.md)
- [Tech Stack](TECH-STACK.md)
- [API Reference](API.md)
- [Setup Guide](SETUP.md)
