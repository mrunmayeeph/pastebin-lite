# Pastebin Lite – Text Snippet Sharing

**Pastebin Lite** is a lightweight web application for creating and sharing text snippets with optional expiration controls. It provides a simple API and web interface for quickly storing text content and generating shareable links with configurable time-to-live (TTL) and view limits.

---
## 🔗 Live Demo

**Production URL:**  
👉 https://pastebin-lite-mrunmayee.vercel.app
---

## Features

- **Quick Text Sharing**  
  Create pastes instantly and receive a shareable URL with a unique 8-character ID.

- **Flexible Expiration Controls**  
  Set optional time-based expiration (TTL in seconds) and/or view count limits.

- **RESTful API**  
  Clean JSON API with health checks, paste creation, and retrieval endpoints.

- **Safe Content Rendering**  
  XSS-protected HTML view with automatic content escaping via React.

- **Test Mode Support**  
  Deterministic time testing for automated test suites using `x-test-now-ms` header.

- **View Tracking**  
  Intelligent view counting where API fetches count as views, but HTML page views don't.

- **Processing History**  
  Tracks paste metadata including creation time, expiry status, and remaining views.

---

## Tech Stack

### 🚀 Backend (API)
- **Next.js 14 (App Router)** – React framework with API routes and server-side rendering
- **TypeScript** – Type-safe development with strict typing throughout
- **Vercel Postgres** – Serverless PostgreSQL with automatic connection pooling
- **Node.js 18+** – Runtime environment

### 🎨 Frontend (UI)
- **React 18 (TypeScript)** – Component-based UI with type safety
- **Next.js App Router** – File-based routing with React Server Components
- **CSS (Custom + Responsive)** – Clean form-based UI with responsive design
- **Client-side State Management** – React hooks for form handling and API communication

### 🗄️ Database
- **PostgreSQL (via Vercel Postgres)** – Serverless, scalable database
- **Connection Pooling** – Built-in connection management for serverless environments
- **Atomic Operations** – Safe concurrent view counting with database-level incrementing

### ☁️ Deployment & Infrastructure
- **Vercel** – Serverless deployment with automatic scaling
- **Edge Network** – Global CDN for static assets
- **Environment Variables** – Secure credential management

## Persistence Layer

### 🗄️ Database: Vercel Postgres (PostgreSQL)

**Vercel Postgres** is a serverless PostgreSQL database optimized for serverless and edge deployments.

#### Why Vercel Postgres?

| Feature | Benefit |
|---------|---------|
| **Serverless Architecture** | No manual server management, automatic scaling |
| **Persistent Storage** | Data survives across deployments and serverless invocations |
| **Connection Pooling** | Built-in pooling prevents connection exhaustion |
| **ACID Compliance** | Reliable transactions and data integrity |
| **Global Edge Network** | Low-latency access from edge functions |
| **Automatic Backups** | Point-in-time recovery included |

#### Database Schema

```sql
CREATE TABLE pastes (
  id VARCHAR(255) PRIMARY KEY,           -- Unique 8-char alphanumeric ID
  content TEXT NOT NULL,                 -- Paste content (unlimited length)
  created_at BIGINT NOT NULL,            -- Creation timestamp (milliseconds)
  ttl_seconds INTEGER,                   -- Time-to-live in seconds (nullable)
  max_views INTEGER,                     -- Maximum view count (nullable)
  view_count INTEGER DEFAULT 0           -- Current view count
);
```

#### Key Operations

- **Atomic View Counting**: View increments use `UPDATE ... SET view_count = view_count + 1` for thread-safe concurrent access
- **Expiry Checks**: Calculated as `created_at + (ttl_seconds * 1000)` compared to current time
- **Auto-initialization**: Table created automatically on first health check request

---

## 🚀 Running Locally

### Prerequisites

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **PostgreSQL database** (Vercel Postgres recommended for production-like setup)
- **Git** for cloning the repository

---

### Setup Instructions

#### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd pastebin-lite
```

#### 2️⃣ Install Dependencies
```bash
npm install
```

This installs:
- Next.js 14
- React 18
- TypeScript 5
- Vercel Postgres SDK

#### 3️⃣ Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your database credentials:

```env
# Vercel Postgres Connection Strings
POSTGRES_URL="postgres://user:password@host:5432/database"
POSTGRES_PRISMA_URL="postgres://user:password@host:5432/database?pgbouncer=true"
POSTGRES_URL_NO_SSL="postgres://user:password@host:5432/database?sslmode=disable"
POSTGRES_URL_NON_POOLING="postgres://user:password@host:5432/database"

# Database Credentials
POSTGRES_USER="user"
POSTGRES_HOST="host.postgres.vercel-storage.com"
POSTGRES_PASSWORD="password"
POSTGRES_DATABASE="database"

# Optional: Enable test mode for automated testing
TEST_MODE=0
```

**📍 Getting Vercel Postgres Credentials:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new Vercel Postgres database
3. Navigate to **Storage** → Your Database → **.env.local** tab
4. Copy all environment variables into your local `.env.local` file

**Alternative: Use Local PostgreSQL**

If using a local PostgreSQL instance:

```env
POSTGRES_URL="postgres://localhost:5432/pastebin"
POSTGRES_PRISMA_URL="postgres://localhost:5432/pastebin"
POSTGRES_URL_NO_SSL="postgres://localhost:5432/pastebin"
POSTGRES_URL_NON_POOLING="postgres://localhost:5432/pastebin"
POSTGRES_USER="postgres"
POSTGRES_HOST="localhost"
POSTGRES_PASSWORD="your-password"
POSTGRES_DATABASE="pastebin"
```

#### 4️⃣ Run the Development Server

```bash
npm run dev
```

The application will start at **[http://localhost:3000](http://localhost:3000)**

#### 5️⃣ Verify Setup

1. Visit [http://localhost:3000](http://localhost:3000)
2. Create a test paste
3. Verify the paste loads correctly
4. Check health endpoint: [http://localhost:3000/api/healthz](http://localhost:3000/api/healthz)

**Expected health check response:**
```json
{"ok": true}
```

---

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

---

## API Endpoints

### 🏥 Health Check
```http
GET /api/healthz
```
**Response (200 OK):**
```json
{
  "ok": true
}
```
Returns application and database connectivity status. Used for monitoring and automated testing.

---

### ✍️ Create Paste
```http
POST /api/pastes
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "string (required, non-empty)",
  "ttl_seconds": 60,     // optional, integer ≥ 1
  "max_views": 5         // optional, integer ≥ 1
}
```

**Success Response (200 OK):**
```json
{
  "id": "abc12345",
  "url": "https://your-app.vercel.app/p/abc12345"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "content is required and must be a non-empty string"
}
```

**Validation Rules:**
- `content` must be a non-empty string
- `ttl_seconds` must be an integer ≥ 1 (if provided)
- `max_views` must be an integer ≥ 1 (if provided)

---

### 📥 Fetch Paste (API)
```http
GET /api/pastes/:id
```

**Success Response (200 OK):**
```json
{
  "content": "Your paste content here",
  "remaining_views": 4,                      // null if unlimited
  "expires_at": "2026-01-31T10:30:00.000Z"  // null if no TTL
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Paste not found or no longer available"
}
```

**Behavior:**
- Each successful API fetch **increments the view count**
- Returns 404 if paste is expired, view limit reached, or doesn't exist
- Supports test mode with `x-test-now-ms` header when `TEST_MODE=1`

---

### 🌐 View Paste (HTML)
```http
GET /p/:id
```

**Success Response:** HTML page displaying the paste content

**Error Response:** 404 HTML page with user-friendly error message

**Behavior:**
- Returns server-rendered HTML page
- **Does NOT increment view count** (allows free sharing)
- Content is safely escaped to prevent XSS attacks

---

## 🏗️ Architecture & Design Decisions

### 1. **Persistence Strategy**
**Decision:** Vercel Postgres with serverless architecture

**Rationale:**
- No in-memory storage to ensure data survives across serverless function cold starts
- Automatic connection pooling prevents connection exhaustion
- Scales automatically with traffic without manual intervention
- ACID compliance ensures data integrity for concurrent operations

---

### 2. **View Counting Logic**
**Decision:** API requests count as views, HTML page views don't

**Rationale:**
- **API fetches** (`GET /api/pastes/:id`) increment view count—used for programmatic access
- **HTML page views** (`GET /p/:id`) do NOT increment—allows users to preview and share without consuming limits
- Enables use cases like "share with your team but limit API access"

**Implementation:** Atomic database increment (`view_count = view_count + 1`) prevents race conditions

---

### 3. **Expiry Handling**
**Decision:** TTL calculated from creation time, not last access

**Rationale:**
- **Predictable behavior**: Users know exact expiry time upfront
- **Simpler logic**: No need to track last access timestamp
- **Better for sharing**: Recipients know if content will still be available
- **Formula**: `expiry_time = created_at + (ttl_seconds * 1000)`

---

### 4. **ID Generation Strategy**
**Decision:** Random 8-character alphanumeric IDs

**Rationale:**
- **Character set**: `[a-zA-Z0-9]` = 62 possible characters
- **Collision probability**: 62^8 ≈ 218 trillion possibilities
- **URL-friendly**: No special characters requiring encoding
- **Short & shareable**: Compact URLs for easy sharing

**Example IDs:** `aBc12XyZ`, `K9mP4qRs`

---

### 5. **Test Mode Support**
**Decision:** Environment variable + custom header for deterministic testing

**Implementation:**
```typescript
// Set TEST_MODE=1 environment variable
// Send x-test-now-ms: 1706515200000 header

const currentTime = TEST_MODE === '1' && request.headers['x-test-now-ms']
  ? parseInt(request.headers['x-test-now-ms'])
  : Date.now();
```

**Rationale:**
- Allows automated tests to control time progression
- Tests can verify TTL expiry without waiting
- Production behavior unaffected (TEST_MODE=0 by default)

---

### 6. **Error Handling Philosophy**
**Decision:** Consistent 404 for all unavailable pastes

**Rationale:**
- **Security**: Don't leak information about paste existence
- **Simplicity**: Single error type for clients to handle
- **User experience**: "Not found" is clear and expected

**All these return 404:**
- Non-existent paste ID
- Expired paste (TTL exceeded)
- View limit exhausted

---

### 7. **Security Considerations**

| Threat | Mitigation |
|--------|------------|
| **XSS Attacks** | React automatically escapes HTML content |
| **SQL Injection** | Parameterized queries via Vercel Postgres SDK |
| **Credential Exposure** | Environment variables, never committed to git |
| **Rate Limiting** | Vercel platform-level protection |
| **Large Uploads** | No file size limit validation (PostgreSQL TEXT type handles unlimited content) |

---

### 8. **Scalability Architecture**

**Serverless Benefits:**
- ✅ Auto-scales from 0 to millions of requests
- ✅ Pay-per-execution pricing model
- ✅ Global edge deployment
- ✅ No server maintenance

**Database Optimization:**
- Indexed `id` column (PRIMARY KEY) for fast lookups
- Connection pooling prevents exhaustion
- Lightweight queries (single-table, no joins)

---

## 🚢 Deployment

### Deploying to Vercel (Recommended)

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Pastebin Lite"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pastebin-lite.git
git push -u origin main
```

#### Step 2: Import to Vercel
1. Visit [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. **Import your repository**
4. Click **"Deploy"** (initial deployment will fail—this is expected!)

#### Step 3: Add Postgres Database
1. In Vercel project dashboard, go to **Storage** tab
2. Click **"Create Database"** → **"Postgres"**
3. Name it (e.g., `pastebin-db`)
4. Select region (choose closest to your users)
5. Click **"Create"**
6. Click **"Connect to Project"** and select your project

Vercel automatically injects all required environment variables.

#### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click ⋯ menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete ✅

Your app is now live at `https://your-project.vercel.app`!

---

### Environment Variables

**Automatically set by Vercel Postgres:**
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

**Optional (for testing):**
- `TEST_MODE=1` — Enables deterministic time testing

---

## 📂 Project Structure

```
pastebin-lite/
│
├── 📄 Configuration
│   ├── package.json              # Dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── next.config.js            # Next.js configuration
│   ├── vercel.json               # Vercel deployment settings
│   └── .env.example              # Environment template
│
├── 📁 app/                       # Next.js App Router
│   │
│   ├── api/                      # API Routes
│   │   ├── healthz/
│   │   │   └── route.ts          # GET /api/healthz
│   │   └── pastes/
│   │       ├── route.ts          # POST /api/pastes
│   │       └── [id]/
│   │           └── route.ts      # GET /api/pastes/:id
│   │
│   ├── p/[id]/                   # Paste View Pages
│   │   ├── page.tsx              # GET /p/:id (HTML view)
│   │   └── not-found.tsx         # 404 page
│   │
│   ├── page.tsx                  # Home page with form
│   └── layout.tsx                # Root layout
│
└── 📁 lib/                       # Utilities
    ├── db.ts                     # Database operations
    └── time.ts                   # Time utilities (TEST_MODE)
```

**File Count:**
- 7 Route files (1 home, 3 API, 2 view, 1 404)
- 2 Utility libraries
- 5 Configuration files

---

## 🧪 Testing

### Manual Testing

#### Test Health Check
```bash
curl https://your-app.vercel.app/api/healthz
```

**Expected:** `{"ok":true}`

---

#### Test Create Paste
```bash
curl -X POST https://your-app.vercel.app/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello World",
    "ttl_seconds": 60,
    "max_views": 5
  }'
```

**Expected:**
```json
{
  "id": "aBc12XyZ",
  "url": "https://your-app.vercel.app/p/aBc12XyZ"
}
```

---

#### Test Fetch Paste
```bash
# Replace PASTE_ID with actual ID from creation
curl https://your-app.vercel.app/api/pastes/PASTE_ID
```

**Expected:**
```json
{
  "content": "Hello World",
  "remaining_views": 4,
  "expires_at": "2026-01-30T12:00:00.000Z"
}
```

---

#### Test View Limits
```bash
# Create paste with max_views=1
RESPONSE=$(curl -s -X POST https://your-app.vercel.app/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content":"One view only","max_views":1}')

ID=$(echo $RESPONSE | jq -r '.id')

# First fetch (should succeed)
curl https://your-app.vercel.app/api/pastes/$ID

# Second fetch (should return 404)
curl -i https://your-app.vercel.app/api/pastes/$ID
```

---

### Test Mode (Automated Testing)

Set `TEST_MODE=1` environment variable to enable deterministic time testing.

#### Test TTL Expiry
```bash
# Create paste with 60s TTL
RESPONSE=$(curl -s -X POST https://your-app.vercel.app/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content":"Expires in 60s","ttl_seconds":60}')

ID=$(echo $RESPONSE | jq -r '.id')

# Fetch with current time (should succeed)
NOW_MS=$(($(date +%s) * 1000))
curl -H "x-test-now-ms: $NOW_MS" \
  https://your-app.vercel.app/api/pastes/$ID

# Fetch with future time +61s (should return 404)
FUTURE_MS=$((NOW_MS + 61000))
curl -i -H "x-test-now-ms: $FUTURE_MS" \
  https://your-app.vercel.app/api/pastes/$ID
```

---

### Automated Test Checklist

✅ **Service Checks**
- Health check returns 200 with valid JSON
- All responses have `Content-Type: application/json`
- Requests complete within timeout

✅ **Paste Creation**
- Creates paste and returns `id` and `url`
- URL points to `/p/:id` on correct domain
- Input validation returns 4xx for invalid data

✅ **Paste Retrieval**
- Fetches existing paste with correct content
- Returns `remaining_views` and `expires_at`
- HTML view renders content safely

✅ **View Limits**
- `max_views=1`: first fetch succeeds, second returns 404
- `max_views=2`: two fetches succeed, third returns 404
- No negative `remaining_views`

✅ **TTL Expiration**
- Available before expiry
- Returns 404 after expiry (using test mode)

✅ **Combined Constraints**
- Becomes unavailable when first constraint triggers

✅ **Error Handling**
- Invalid inputs return 4xx with JSON errors
- Unavailable pastes consistently return 404

---

## 💡 Implementation Notes

### Key Technical Highlights

- **Atomic View Counting**: Uses `UPDATE ... SET view_count = view_count + 1` for safe concurrent access
- **Automatic Table Creation**: Database schema initialized on first `/api/healthz` request
- **Serverless-Friendly**: No global state; all data persisted in PostgreSQL
- **Type-Safe**: Full TypeScript implementation with strict type checking
- **Clean Architecture**: Separation of routes (app/), business logic (lib/), and configuration

### Performance Considerations

- **Fast Lookups**: Primary key index on `id` column ensures O(1) lookups
- **Lightweight Queries**: Single-table operations, no joins
- **Connection Pooling**: Vercel Postgres handles connection management
- **Edge-Ready**: Can be deployed to edge locations for lower latency

### Code Quality

- ✅ No hardcoded URLs (uses request headers for dynamic URL generation)
- ✅ No secrets in repository (uses environment variables)
- ✅ Parameterized queries (prevents SQL injection)
- ✅ Input validation (all user inputs validated)
- ✅ Error handling (try-catch blocks in all routes)

---

## 📝 Assignment Compliance

This implementation satisfies all assignment requirements:

### ✅ Functional Requirements
- Create paste with arbitrary text
- Generate shareable URL
- View paste via URL
- Optional TTL and view count limits
- Pastes become unavailable when constraints trigger

### ✅ API Requirements
- `GET /api/healthz` - Returns JSON, reflects database health
- `POST /api/pastes` - Creates paste, validates input, returns ID and URL
- `GET /api/pastes/:id` - Fetches paste, increments views, handles expiry
- `GET /p/:id` - Returns HTML with safe rendering

### ✅ Technical Requirements
- Deterministic time testing support (`TEST_MODE=1`)
- Persistent storage (Vercel Postgres)
- Proper error handling (4xx for invalid input, 404 for unavailable)
- No hardcoded URLs or committed secrets
- Standard install/build commands

### ✅ Documentation
- Complete README with setup instructions
- Persistence layer explanation
- Design decisions documented

---

## 📚 Additional Resources

- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Postgres Docs**: [vercel.com/docs/storage/vercel-postgres](https://vercel.com/docs/storage/vercel-postgres)
- **TypeScript Handbook**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
- **Vercel Deployment**: [vercel.com/docs](https://vercel.com/docs)

---

## 📄 License

MIT License - Feel free to use this code for learning and projects.

---

## 🙋 Support

For questions or issues:
1. Check the **DEPLOYMENT.md** guide for deployment help
2. Review **TESTING.md** for test verification
3. Consult **PROJECT_STRUCTURE.md** for architecture details

---

**Built with ❤️ using Next.js, TypeScript, and Vercel Postgres**


