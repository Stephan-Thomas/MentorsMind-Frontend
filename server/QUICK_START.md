# Quick Start Guide

Get the MentorMinds API up and running in minutes.

## Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. (Optional) Update `.env` with your settings:
```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

## Running the Server

### Development Mode (with hot reload)
```bash
npm run dev
```

The server will start at `http://localhost:5000`

### Production Mode
```bash
npm run build
npm start
```

## Verify Installation

Open your browser or use curl to test the health endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 1.234,
    "version": "v1",
    "environment": "development"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "v1"
  }
}
```

## Available Endpoints

- `GET /api/health` - Health check
- `GET /api/health/readiness` - Readiness probe
- `GET /api/health/liveness` - Liveness probe
- `GET /api` - API information

## Running Tests

```bash
npm test
```

With coverage:
```bash
npm run test:coverage
```

## Common Issues

### Port Already in Use
Change the `PORT` in `.env` file:
```env
PORT=5001
```

### CORS Errors
Add your frontend URL to `CORS_ORIGIN` in `.env`:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Module Not Found
Make sure you've installed dependencies:
```bash
npm install
```

## Next Steps

1. Read the [README.md](./README.md) for detailed documentation
2. Check [API_STRUCTURE.md](./docs/API_STRUCTURE.md) for API conventions
3. Review [MIDDLEWARE_GUIDE.md](./docs/MIDDLEWARE_GUIDE.md) for middleware configuration
4. Follow [SECURITY_BEST_PRACTICES.md](./docs/SECURITY_BEST_PRACTICES.md) for security guidelines

## Need Help?

- Check the documentation in the `docs/` folder
- Review the test files in `tests/` for examples
- Check the implementation summary in `IMPLEMENTATION_SUMMARY.md`
