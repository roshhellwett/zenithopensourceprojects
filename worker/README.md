# ⛦ Zenith AI Worker

Backend AI service for Zenith Open Source Projects — handles all Groq/Llama 3.3 chat requests.

## Setup

```bash
cd worker
npm install
cp .env.example .env
# Edit .env and set your GROQ_API_KEY
npm run dev
```

## Deploy to Railway

1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repo
3. Set the **Root Directory** to `worker`
4. Add environment variables:
   - `GROQ_API_KEY` = your Groq API key
   - `ALLOWED_ORIGINS` = your frontend URLs (comma-separated)
5. Deploy!

Railway will auto-detect the `railway.json` config and use the correct build/start commands.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ | Your Groq API key from [console.groq.com/keys](https://console.groq.com/keys) |
| `PORT` | ❌ | Server port (Railway auto-assigns via `$PORT`) |
| `ALLOWED_ORIGINS` | ❌ | Comma-separated frontend URLs for CORS |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Service info & status |
| `GET` | `/health` | Health check |
| `POST` | `/api/ai/chat` | AI chat (accepts `{ messages: [...] }`) |

## Connecting the Frontend

In your frontend's `.env.local`, set:

```env
NEXT_PUBLIC_API_URL=https://your-railway-worker.up.railway.app
```

This tells the frontend to forward all AI requests to the Railway worker instead of using Vercel's built-in API routes.
