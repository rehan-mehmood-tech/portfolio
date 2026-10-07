# Rehan Mehmood — Portfolio

A production-oriented personal portfolio and lead-generation platform for Rehan Mehmood, focused on AI agents, backend systems, workflow automation, projects, credentials, and professional experience.

The site uses a dynamic Firestore-backed content model and includes a protected admin panel so portfolio content can be updated without changing source code. The frontend is designed for Vercel, while the optional AI portfolio assistant is a separate FastAPI service designed for Render.

## Features

- Premium responsive portfolio UI based on the original Figma Make direction
- Dynamic projects, services, experience, certifications, recommendations, and profile content
- Firestore-backed content with checked-in fallback content for resilient public rendering
- Protected Firebase Authentication admin panel
- Contact lead capture API
- AI portfolio assistant with FastAPI, LangGraph, Groq, and server-sent events
- SEO metadata, sitemap, robots configuration, and structured data
- Security headers and typed form validation
- Vercel-ready frontend and Render-ready backend

## Architecture

```text
portfolio/
├── apps/web/                  # Next.js App Router frontend and admin CMS
│   ├── app/                   # Routes, API handlers, admin, and page layouts
│   ├── components/            # Shared interface components
│   ├── lib/                   # Firebase, authentication, data, schemas, and types
│   ├── scripts/               # Firestore seeding and admin-role utilities
│   ├── firestore.rules        # Firestore security rules
│   └── firestore.indexes.json # Firestore indexes
├── services/agent-api/        # FastAPI/LangGraph assistant for Render
├── src/                       # Original React/Vite Figma Make prototype
├── public/                    # Shared visual assets
└── PRD.md                     # Product requirements and content direction
```

## Technology

### Web application

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4 and custom editorial CSS
- Firebase Authentication
- Cloud Firestore
- Firebase Admin SDK
- React Hook Form and Zod
- Vercel Analytics

### Agent service

- FastAPI
- LangGraph and LangChain
- Groq
- Firebase Admin SDK
- Server-sent events

## Local development

### Prerequisites

- Node.js 20 or newer
- npm
- Python 3.12 or newer for the agent service
- A Firebase project with Authentication and Firestore enabled

### 1. Configure and run the web application

```bash
cd apps/web
npm install
```

Copy `apps/web/.env.example` to `apps/web/.env.local`, then provide the required Firebase values.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
npm run lint       # TypeScript validation
npm run build      # Production build
npm run seed       # Seed Firestore with the initial portfolio content
npm run set-admin -- owner@example.com
```

Firebase Email/Password authentication must be enabled before using the admin panel. Create the owner account in Firebase Authentication, then run `set-admin` to assign its custom admin claim.

If server-side Firebase credentials are not configured, public pages use checked-in fallback content. Authentication, CMS writes, and lead persistence remain disabled until their required credentials are available.

### 2. Configure and run the agent API

```bash
cd services/agent-api
python -m venv .venv
```

Activate the environment, install dependencies, and create a local `.env` file using the variables documented below.

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The health endpoint is available at `http://localhost:8000/health`.

## Environment variables

### Next.js frontend

Use `apps/web/.env.example` as the template. Important variables include:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical web URL |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase browser SDK configuration |
| `FIREBASE_PROJECT_ID` | Firebase Admin project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase service-account client email |
| `FIREBASE_PRIVATE_KEY` | Firebase service-account private key |
| `SESSION_COOKIE_NAME` | Secure admin session cookie name |
| `INTERNAL_API_KEY` | Shared secret used by trusted backend calls |
| `NEXT_PUBLIC_AGENT_API_URL` | Public Render agent API URL |
| `RESEND_API_KEY` | Optional email notification provider key |
| `TELEGRAM_BOT_TOKEN` | Optional Telegram notification token |
| `TELEGRAM_CHAT_ID` | Optional Telegram notification destination |

### FastAPI service

| Variable | Purpose |
| --- | --- |
| `ALLOWED_ORIGINS` | Comma-separated permitted frontend origins |
| `GROQ_API_KEY` | Groq API credential |
| `GROQ_MODEL` | Optional Groq model override |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firebase service-account JSON string |
| `WEB_LEADS_URL` | Frontend lead-ingestion endpoint |
| `WEB_INTERNAL_API_KEY` | Shared secret matching `INTERNAL_API_KEY` |

Never commit `.env` files, private keys, or Firebase service-account JSON.

## Firebase deployment

From a Firebase CLI environment configured for the project, deploy the checked-in rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

The public site reads published portfolio records. Administrative writes are restricted to authenticated users with the expected admin claim.

## Vercel deployment

1. Import this GitHub repository into Vercel.
2. Set the Root Directory to `apps/web`.
3. Add the frontend environment variables.
4. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
5. Set `NEXT_PUBLIC_AGENT_API_URL` after deploying the agent service.
6. Deploy.

Vercel detects the Next.js build and runs it from the selected root directory.

## Render deployment

The repository includes `services/agent-api/render.yaml`.

1. Create a new Render Blueprint from this repository.
2. Confirm the service root is `services/agent-api`.
3. Add the secret environment variables in Render.
4. Set `ALLOWED_ORIGINS` to the Vercel production URL.
5. Set `WEB_LEADS_URL` to `https://your-domain.example/api/leads`.
6. Deploy and copy the Render service URL into Vercel as `NEXT_PUBLIC_AGENT_API_URL`.

## Admin workflow

After signing in at `/login`, the protected `/admin` area can manage:

- Profile information
- Projects and case-study data
- Services
- Experience
- Certifications
- Recommendations
- Portfolio visibility and ordering

Published records are read dynamically from Firestore, allowing ongoing updates without redeploying the frontend.

## Design direction

The interface follows a dark technical/editorial system:

- Black and graphite surfaces
- White high-contrast typography
- Red interaction and status accents
- Inter for readable interface copy
- Silkscreen for technical display moments
- Structured grids, restrained motion, and terminal-inspired details

## License

This repository contains a personal portfolio and its associated content. Reuse of personal information, photographs, branding, and portfolio copy requires permission from the owner.
