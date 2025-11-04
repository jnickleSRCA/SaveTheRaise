# SaveTheRaise - Idea Submission Tracker

A full-stack application for tracking cost-saving ideas with review workflows and scoreboard metrics.

## Features

- **Submission Form**: Public form for submitting Part Change and Process Change proposals
- **Initial Review**: Password-protected review page (password: `initial`)
- **Committee Review**: Password-protected committee review with full edit capabilities (password: `committee`)
- **Public Scoreboard**: Real-time metrics showing total submissions, approved value, and implemented value

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Fastify, Node.js, TypeScript
- **Database**: PostgreSQL with Kysely query builder
- **Monorepo**: Turborepo with workspaces

## Project Structure

```
SaveTheRaise/
├── packages/
│   ├── api/          # Fastify backend API
│   ├── web/          # Next.js frontend
│   ├── shared/       # Shared types and utilities
│   └── api-schema/   # API schemas
├── docker-compose.yml
├── Dockerfile.api
└── Dockerfile.web
```

## Development

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root:

```bash
cp .env.example .env
```

3. Start PostgreSQL (or use Docker):

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_DB=savetheraise \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

4. Run migrations:

```bash
npm run migrate --workspace=@savetheraise/api
```

5. Start development servers:

```bash
npm run dev
```

This will start:

- API on http://localhost:3001
- Web on http://localhost:3000

## Docker Deployment

### Build and run with Docker Compose:

```bash
docker-compose up -d
```

This will start:

- PostgreSQL database
- API server on port 3001
- Web server on port 3000

### Deployment to ubuntu02

1. Copy the project to ubuntu02:

```bash
scp -r SaveTheRaise/ user@ubuntu02:/opt/
```

2. SSH into ubuntu02:

```bash
ssh user@ubuntu02
```

3. Navigate to the project directory:

```bash
cd /opt/SaveTheRaise
```

4. Create production `.env` file:

```bash
cp .env.example .env
# Edit .env with production values
nano .env
```

5. Build and start containers:

```bash
docker-compose up -d
```

6. Check logs:

```bash
docker-compose logs -f
```

## API Endpoints

### Public Endpoints

- `POST /ideas` - Submit a new idea
- `GET /scoreboard` - Get scoreboard metrics
- `POST /auth/login` - Login with password
- `GET /auth/status` - Check authentication status
- `POST /auth/logout` - Logout

### Protected Endpoints (Initial Review)

- `GET /ideas/initial-review` - Get submitted ideas (requires `initial` password)
- `PATCH /ideas/:id/initial-review` - Update idea status (requires `initial` password)

### Protected Endpoints (Committee Review)

- `GET /ideas/committee-review` - Get committee review ideas (requires `committee` password)
- `PATCH /ideas/:id` - Update idea (requires `committee` password)

## Database Schema

### Ideas Table

- `id` (UUID) - Primary key
- `submitter_names` (text) - Submitter name(s)
- `type` (enum) - 'part_change' | 'process_change'
- `status` (enum) - Idea status (submitted, rejected_initial, committee_review, approved, implemented, rejected_committee)
- `dollar_value` (numeric) - Estimated dollar value
- Part Change fields: `old_pn`, `old_cost`, `new_pn`, `new_cost`, `eau`, `calculated_impact`
- Process Change fields: `area_to_improve`, `customers_affected`, `impact_description`
- `notes` (text) - Submitter notes
- `reviewer_notes` (text) - Reviewer notes
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Status Flow

```
submitted → Initial Review → rejected_initial
                          → committee_review → Committee Review → approved
                                                                → implemented
                                                                → rejected_committee
```

## Scripts

- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Lint all packages
- `npm run format` - Format code with Prettier

## Security Notes

- Passwords are simple string comparisons (suitable for internal use)
- For production, consider implementing proper authentication (JWT, OAuth, etc.)
- Change `COOKIE_SECRET` in production environment
- Use HTTPS in production

## License

MIT
