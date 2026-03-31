# SPIL'NE shop

This repository follows the planned `Next.js 14` architecture for the SPIL'NE storefront and is prepared for deployment through `GitHub -> Railway`.

Current foundation:

- `app` router with localized routes `/ua` and `/en`
- home, catalog, product, and protected admin entry pages
- current seed product data with real photo assets
- product and admin API routes
- Telegram deep-link ordering flow
- Supabase-ready repository layer with fallback to local seed data
- SQL schema for Supabase in `supabase/schema.sql`
- Railway-ready `standalone` Next.js output
- GitHub Actions build workflow for deploy safety

## Run locally

1. Install dependencies:
   `npm install`
2. Create local env file:
   `copy .env.example .env.local`
3. Start development server:
   `npm run dev`
4. Open:
   `http://localhost:3000/ua`

## Environment

Use `.env.example` as the template.

Important values:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`
- `NEXT_PUBLIC_TELEGRAM_SUPPORT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_ADMIN_CHAT_ID`
- `ADMIN_PASSWORD`

## Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run:
   `supabase/schema.sql`
3. Create a public storage bucket named:
   `product-images`
4. Add env values into `.env.local`.
5. Restart the Next.js dev server.

Until real credentials are added, the storefront keeps working from local seed data.

## GitHub and Railway deployment

According to Railway's official Next.js guide, self-hosted deployment should use `output: "standalone"` and run the standalone server. This repository is already configured that way.

Recommended flow:

1. Create a GitHub repository and push this project.
2. In Railway, create a new project.
3. Choose `Deploy from GitHub repo`.
4. Select the SPIL'NE repository.
5. Add the production environment variables from `.env.example`.
6. In Railway networking, generate a public domain.
7. Set `NEXT_PUBLIC_SITE_URL` to that public domain and redeploy.

Optional but recommended:

- enable Railway GitHub autodeploys for the main branch
- enable `Wait for CI` after the GitHub Actions workflow is available
- use Node `20.x` in local and production environments

## Current status

Implemented:

- `Next.js 14` app structure
- localized storefront pages
- product API routes
- protected admin login shell
- repository layer ready for Supabase reads
- current product catalog with real photos
- Railway-ready build and start flow

Still planned next:

- real create/edit admin flows backed by Supabase
- storage upload flow for product images
- Telegram bot webhook logic with Telegraf
- final production deployment and domain setup
