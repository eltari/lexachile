# LexaChile - Setup Guide

## Local Development (SQLite - Default)

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Switch to SQLite schema:
   ```bash
   npm run db:use-sqlite
   ```

3. Push schema and seed the database:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Login credentials (from seed):
   - **Admin:** admin@lexachile.cl / 123456
   - **Abogado:** maria.soto@lexachile.cl / 123456
   - **Asistente:** rodrigo.valenzuela@lexachile.cl / 123456

## Deploy to Vercel (PostgreSQL)

### Step 1: Create a Neon PostgreSQL Database (Free Tier)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project (e.g., "lexachile")
3. Copy the connection string, it looks like:
   ```
   postgresql://user:password@ep-something.us-east-2.aws.neon.tech/lexachile?sslmode=require
   ```

### Step 2: Configure Vercel

1. Import the project in [vercel.com](https://vercel.com)
2. In **Settings > Environment Variables**, add:
   - `DATABASE_URL` = your Neon connection string
   - `NEXTAUTH_SECRET` = a strong random secret (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = your Vercel URL (e.g., `https://lexachile.vercel.app`)

### Step 3: Deploy

Vercel will automatically:
1. Run `prisma generate` to create the Prisma client
2. Run `prisma db push` to create tables in PostgreSQL
3. Build and deploy the Next.js app

### Step 4: Seed Production Data (Optional)

To seed the production database, set the `DATABASE_URL` locally to your Neon URL temporarily:

```bash
# Make sure you're on the PostgreSQL schema
npm run db:use-postgres

# Set the production DATABASE_URL
export DATABASE_URL="postgresql://user:password@ep-something.neon.tech/lexachile?sslmode=require"

# Push schema and seed
npm run db:push
npm run db:seed
```

Then switch back to SQLite for local work:
```bash
npm run db:use-sqlite
```

## Switching Between SQLite and PostgreSQL

| Command | Description |
|---------|-------------|
| `npm run db:use-sqlite` | Switch schema to SQLite (local dev) |
| `npm run db:use-postgres` | Switch schema to PostgreSQL (production) |
| `npm run db:push` | Push current schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio GUI |

## Environment Variables Reference

| Variable | Local (SQLite) | Production (Vercel) |
|----------|---------------|-------------------|
| `DATABASE_URL` | `file:./dev.db` | `postgresql://...` (Neon URL) |
| `NEXTAUTH_SECRET` | any string | strong random secret |
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://your-app.vercel.app` |

## Alternative: Supabase PostgreSQL

Instead of Neon, you can use [Supabase](https://supabase.com):
1. Create a free project
2. Go to Settings > Database > Connection string (URI)
3. Use that as your `DATABASE_URL`

Both Neon and Supabase offer free PostgreSQL tiers that work with Vercel.
