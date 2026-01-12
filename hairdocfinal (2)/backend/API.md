# Hair Doc API Documentation

## Base URL
- Production: `https://hairdoc.co.za/api`
- Development: `http://localhost:3002/api`

## Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Health Check

### GET /api/health

Check the health status of the API and database connection.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```

## Authentication Endpoints

### POST /api/auth/login

Login with username/email and password.

**Request Body:**
```json
{
  "identifier": "username or email",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "role": "Client",
    "avatar_url": "https://..."
  }
}
```

### POST /api/auth/register

Register a new client account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

### POST /api/auth/forgot-password

Request a password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset email sent"
}
```

### PUT /api/auth/reset-password/:token

Reset password using token from email.

**Request Body:**
```json
{
  "password": "newpassword"
}
```

**Response:**
```json
{
  "message": "Password has been reset"
}
```

## Services Endpoints

### GET /api/services

Get all services (public).

**Response:**
```json
[
  {
    "id": 1,
    "category": "Haircut",
    "name": "Men's Haircut",
    "description": "...",
    "duration": 30,
    "price": 50.00,
    "imageUrl": "https://...",
    "alt": "Men's haircut"
  }
]
```

### POST /api/services

Create a new service (Admin only).

**Request Body:**
```json
{
  "category": "Haircut",
  "name": "Men's Haircut",
  "description": "...",
  "duration": 30,
  "price": 50.00,
  "imageUrl": "https://...",
  "alt": "Men's haircut"
}
```

### PUT /api/services/:id

Update a service (Admin only).

### DELETE /api/services/:id

Delete a service (Admin only).

## Products Endpoints

### GET /api/products

Get all products (public).

### POST /api/products

Create a new product (Admin only).

### PUT /api/products/:id

Update a product (Admin only).

### DELETE /api/products/:id

Delete a product (Admin only).

## Courses Endpoints

### GET /api/courses

Get all courses (public).

### POST /api/courses

Create a new course (Admin only).

### PUT /api/courses/:id

Update a course (Admin only).

### DELETE /api/courses/:id

Delete a course (Admin only).

## Bookings Endpoints

### GET /api/bookings

Get all bookings (public).

### POST /api/bookings

Create a new booking (public).

**Request Body:**
```json
{
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "clientPhone": "1234567890",
  "service": "Men's Haircut",
  "staff": "Jane Smith",
  "date": "2024-01-15",
  "time": "10:00",
  "price": 50.00,
  "duration": 30
}
```

### PUT /api/bookings/:id

Update a booking (Admin only).

### DELETE /api/bookings/:id

Delete a booking (Admin only).

## Enrollments Endpoints

### GET /api/enrollments

Get all enrollments (public).

### POST /api/enrollments

Create a new enrollment (public).

### PUT /api/enrollments/:id

Update an enrollment (Admin only).

### DELETE /api/enrollments/:id

Delete an enrollment (Admin only).

## Gallery Endpoints

### GET /api/gallery

Get all gallery items (public).

### POST /api/gallery

Create a new gallery item (Admin only).

### PUT /api/gallery/:id

Update a gallery item (Admin only).

### DELETE /api/gallery/:id

Delete a gallery item (Admin only).

## Orders Endpoints

### GET /api/orders

Get all orders (Auth required).

### POST /api/orders

Create a new order (public).

### PUT /api/orders/:id

Update an order (Admin only).

## Settings Endpoints

### GET /api/settings

Get application settings (public).

**Response:**
```json
{
  "salonName": "Hair Doc",
  "logoUrl": "https://...",
  "faviconUrl": "https://...",
  "maintenanceMode": false,
  "primaryPhone": "1234567890",
  "bookingEmail": "bookings@hairdoc.co.za",
  "address": "123 Main St",
  "socials": {
    "instagram": "@hairdoc",
    "twitter": "@hairdoc",
    "facebook": "hairdoc"
  }
}
```

### PUT /api/settings

Update settings (Admin only).

## Upload Endpoints

### POST /api/upload

Upload an image file.

**Request:** Multipart form data with `image` field.

**Response:**
```json
{
  "imageUrl": "/uploads/image-1234567890.jpg"
}
```

## Sync Endpoints

### POST /api/sync/push

Sync local data to database (Admin only).

### GET /api/sync/pull

Pull data from database (Admin only).

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable

## Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes per IP

## Security

- All sensitive endpoints require JWT authentication
- Passwords are hashed using bcrypt
- Rate limiting is enabled
- Security headers are set via Helmet.js
- CORS is configured for specific origins
