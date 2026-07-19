# API Reference

Base URL: `http://localhost:3005/api` (development)

All routes below are relative to this base. Example: `POST /auth/login` → `http://localhost:3005/api/auth/login`.

## Authentication

Most protected endpoints require:

```
Authorization: Bearer <jwt_token>
```

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Register a new user |
| POST | `/auth/login` | — | Login, returns JWT |
| POST | `/auth/forgot-password` | — | Send password reset email |
| POST | `/auth/reset-password` | — | Reset password with token |
| GET | `/auth/reset-password/validate/:token` | — | Validate reset token |

### Login Request

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

---

## Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Hello message |
| GET | `/health` | `{ status: "OK", timestamp }` |
| GET | `/test` | Backend connectivity check |

---

## Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users` | — | Create user |
| GET | `/users` | — | List users (paginated: `?page=1&limit=10`) |
| GET | `/users/me` | JWT | Current user profile |
| GET | `/users/:id` | — | User by ID |
| PUT | `/users/:id` | — | Update user |
| DELETE | `/users/:id` | — | Delete user |
| POST | `/users/:id/interactions` | — | Record product interaction |
| PATCH | `/users/me/wishlist/add` | JWT | Add product to wishlist |
| PATCH | `/users/me/wishlist/remove` | JWT | Remove from wishlist |
| GET | `/users/me/wishlist` | JWT | Get wishlist |
| PATCH | `/users/user/:id/ratings` | — | Rate a product |
| GET | `/users/:id/recommendations` | — | Get recommendations (`?limit=5`) |
| PATCH | `/users/:id/preferences/add` | — | Add preferred category |
| PATCH | `/users/:id/preferences/remove` | — | Remove preferred category |
| GET | `/users/:id/product/:productId` | — | Get user's rating for a product |

---

## Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create product |
| GET | `/products` | List all products |
| GET | `/products/top-rated` | Top rated (`?limit=6`) |
| GET | `/products/highest-discount` | Highest discount (`?limit=6`) |
| GET | `/products/featured` | Featured products |
| GET | `/products/popular` | Popular products (`?limit=10`) |
| GET | `/products/search` | Search & filter (see below) |
| GET | `/products/:id` | Product by ID |
| PATCH | `/products/:id` | Update product |
| PUT | `/products/:id` | Update product (legacy) |
| DELETE | `/products/:id` | Delete product |
| PATCH | `/products/:id/increment/:field` | Increment `views`, `purchases`, or `wishlistAdds` |
| GET | `/products/:id/related` | Related products (`?limit=10`) |
| POST | `/products/:id/similar-products` | Set similar product IDs |
| POST | `/products/:id/feedback-keywords` | Add feedback keywords |

### Search Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `query` | string | Text search |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `minRating` | number | Minimum rating |
| `categories` | string | Comma-separated category IDs |
| `sortBy` | enum | `price-asc`, `price-desc`, `rating`, `newest`, `popularity` |
| `limit` | number | Results per page |

Example:

```
GET /products/search?query=phone&minPrice=100&maxPrice=500&sortBy=rating&limit=20
```

---

## Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/categories` | Create category |
| GET | `/categories` | List all categories |
| GET | `/categories/:id` | Category by ID |
| DELETE | `/categories/:id` | Delete category |

---

## Cart

All cart routes require JWT.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get current user's cart |
| POST | `/cart` | Add item `{ "productId": "..." }` |
| PATCH | `/cart` | Update quantity `{ "productId": "...", "quantity": 2 }` |
| DELETE | `/cart?productId=...` | Remove item |

---

## Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create order |
| GET | `/orders` | List all orders |
| GET | `/orders/user/:userId` | Orders for a user |
| GET | `/orders/:id` | Order by ID |
| PUT | `/orders/:id` | Update order |
| PUT | `/orders/:id/status` | Update status `{ "status": "..." }` |
| PUT | `/orders/:id/payment-status` | Update payment status |
| DELETE | `/orders/:id` | Delete order |

### Create Order Body (example)

```json
{
  "userId": "64abc...",
  "products": [{ "productId": "64def...", "quantity": 1, "price": 99.99 }],
  "totalPrice": 99.99,
  "shippingAddress": { "street": "...", "city": "...", "zip": "..." },
  "contactInfo": { "phone": "...", "email": "..." },
  "paymentMethod": "zarinpal"
}
```

---

## Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/:orderId/start` | Start payment for an order |
| GET | `/payments/verify?Authority=...&Status=...` | Verify payment callback |
| POST | `/payments/webhook/zarinpal` | Zarinpal webhook |
| GET | `/mock-gateway/pay` | Mock payment gateway (dev) |

---

## Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions/payment/:paymentId` | Transactions for a payment |

---

## Comments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/comments` | JWT | Create comment |
| GET | `/comments/product/:productId` | — | List comments (`?page=1&limit=10`) |
| GET | `/comments/replies/:commentId` | — | List replies |
| GET | `/comments/:id` | — | Comment by ID |
| PUT | `/comments/:id` | JWT | Update comment |
| DELETE | `/comments/:id` | JWT | Delete comment |
| POST | `/comments/:id/like` | JWT | Like comment |
| POST | `/comments/:id/dislike` | JWT | Dislike comment |

---

## Contact

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/contact` | Submit contact form |
| GET | `/contact` | List all submissions (admin) |
| GET | `/contact/:id` | Get submission by ID |
| PATCH | `/contact/:id/status` | Update status |
| DELETE | `/contact/:id` | Delete submission |

---

## Recommendations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recommendations/:userId` | Product IDs recommended for user |

---

## Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload/images` | Upload up to 3 images (multipart `images` field, max 2 MB each) |

Allowed types: `jpg`, `jpeg`, `png`, `webp`

---

## Error Responses

NestJS returns standard HTTP status codes:

| Code | Meaning |
|------|---------|
| 400 | Validation error / bad request |
| 401 | Unauthorized (missing or invalid JWT) |
| 404 | Resource not found |
| 500 | Internal server error |

Validation errors include a message array from `class-validator`.

---

## Related Docs

- [Project Overview](PROJECT.md)
- [Architecture](ARCHITECTURE.md)
- [Setup Guide](SETUP.md)
