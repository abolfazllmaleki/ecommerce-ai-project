# Architecture

## High-Level System Diagram

```mermaid
flowchart TB
    subgraph Client
        FE[Next.js Frontend]
    end

    subgraph API["NestJS API (port 3005)"]
        CTRL[Controllers]
        UC[Use Cases]
        DOM[Domain Entities]
        REPO[Repositories]
    end

    subgraph Data
        MONGO[(MongoDB)]
        REDIS[(Redis)]
    end

    subgraph Messaging
        RMQ[RabbitMQ]
    end

    subgraph External
        CLOUD[Cloudinary]
        SMTP[Nodemailer / SMTP]
        ZP[Zarinpal]
    end

    FE -->|REST /api/*| CTRL
    CTRL --> UC --> DOM
    UC --> REPO --> MONGO
    UC --> REDIS
    UC -->|publish events| RMQ
    RMQ -->|consume| UC
    UC --> CLOUD
    UC --> SMTP
    UC --> ZP
```

## Backend: Clean Architecture

Each feature module is organized into layers:

```
module/
├── domain/           # Entities, repository ports (interfaces)
├── application/      # Use cases, DTOs, domain events
├── infrastructure/   # Mongoose repos, mappers, adapters
└── interface/        # Controllers (HTTP layer)
```

### Design Principles

- **Use cases** contain business logic; controllers stay thin.
- **Repository ports** (`IProductRepository`, `IUserRepository`, etc.) decouple domain from MongoDB.
- **Mappers** translate between Mongoose documents and domain entities.
- **Shared modules** provide cross-cutting concerns (cache, messaging, uploads).

### Example: Product Read Flow

```
GET /api/products/:id/related
  → GetRelatedProductsUseCase
      → Check Redis cache (versioned key)
      → ProductRepository.getRelated()  [same category, sorted by rating]
      → Cache result (TTL 300s)
      → Return Product[]
```

## Caching Strategy

Redis is accessed through a `CachePort` adapter (`RedisCacheAdapter`).

- **Versioned keys** — when products change, a version counter increments so stale cache keys are naturally bypassed.
- **Namespaces** — e.g. `PRODUCT_LIST_RELATED` for related product queries.
- **TTL** — related products cached for 5 minutes.

Configuration via environment:

```
REDIS_URL=redis://127.0.0.1:6379   # or individual vars below
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

## Event-Driven Payment Flow

Orders and payments communicate asynchronously through RabbitMQ.

```mermaid
sequenceDiagram
    participant Client
    participant Orders
    participant RMQ as RabbitMQ
    participant Payment
    participant ZP as Zarinpal

    Client->>Orders: POST /api/orders
    Orders->>Orders: Save order to MongoDB
    Orders->>RMQ: Publish order.created.v1
    RMQ->>Payment: OrderCreatedConsumer
    Payment->>Payment: Start payment
    Payment->>ZP: Create payment session
    ZP-->>Client: Redirect to gateway
    Client->>Payment: GET /api/payments/verify
    Payment->>Payment: Verify & update status
    Payment->>RMQ: Publish payment.succeeded / payment.failed
```

### Event Names

| Event | Routing Key | Trigger |
|-------|-------------|---------|
| `order.created` | `order.created.v1` | Order successfully created |
| `payment.succeeded` | (published on verify) | Payment verified |
| `payment.failed` | (published on verify) | Payment failed or expired |

RabbitMQ defaults (from `docker-compose.yml`):

```
RABBITMQ_URL=amqp://app_user:app_password@127.0.0.1:5672
RABBITMQ_EXCHANGE=app.events
```

Management UI: http://localhost:15672

## Frontend Architecture

### App Router (Next.js 14)

- **Pages** under `src/app/` — file-based routing.
- **Components** — reusable UI in `src/app/components/`.
- **Context** — `AuthContext` (JWT in localStorage) and `CartContext` (syncs with backend cart).
- **API Routes** — thin BFF proxies in `src/app/api/` for wishlist, cart, and view increments.

### Data Fetching Pattern

Most components call the NestJS API directly using `NEXT_PUBLIC_BACKEND_URL`. Some operations go through Next.js API routes to attach auth headers server-side.

```
Browser → Next.js page/component
       → fetch(NEXT_PUBLIC_BACKEND_URL + '/products/...')
       → NestJS API → MongoDB / Redis
```

## Authentication

- **Strategy**: JWT via Passport (`passport-jwt`).
- **Login** returns a token; frontend stores it and sends `Authorization: Bearer <token>`.
- **Protected routes**: cart, wishlist (`/users/me/*`), comment create/edit/delete.
- **Password reset**: token stored on user document; email sent via Nodemailer.

## Recommendation Engine

Not an external ML service. Recommendations are computed in MongoDB:

```javascript
// Aggregation: top N products by interaction count
interactionHistory → group by product → sort by count → limit
```

Additional personalization data on products:

- `similarProducts` — manually linked product IDs
- `userFeedbackKeywords` — keywords from user feedback
- Related products — same category, ranked by rating and purchases

## Deployment Notes

Both apps include `vercel.json` for Vercel deployment:

- **Frontend** — Next.js standalone build
- **Backend** — serverless Node via `@vercel/node`

For production, ensure all environment variables are set in Vercel (or your host) and that MongoDB Atlas, Redis, and RabbitMQ are reachable from the deployment environment.

## Related Docs

- [Project Overview](PROJECT.md)
- [Tech Stack](TECH-STACK.md)
- [API Reference](API.md)
- [Setup Guide](SETUP.md)
