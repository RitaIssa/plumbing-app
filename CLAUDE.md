# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A plumbing supplies business management web app for managing suppliers, products (with tiered pricing), and customer accounts (retail vs trade).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **ORM**: Prisma
- **Database**: Supabase (PostgreSQL)

## Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Prisma: generate client after schema changes
npx prisma generate

# Prisma: push schema changes to the database
npx prisma db push

# Prisma: open Prisma Studio (database GUI)
npx prisma studio

# Prisma: run migrations
npx prisma migrate dev --name <migration-name>

# Lint
npm run lint

# Type-check
npx tsc --noEmit
```

## Architecture

### App Router Structure

The app uses Next.js 14 App Router (`/app` directory). Pages are server components by default; client interactivity uses `"use client"` components composed inside them.

Key route groups to expect:
- `/app/(dashboard)/` — authenticated dashboard layout
- `/app/suppliers/` — supplier CRUD
- `/app/products/` — product CRUD (linked to suppliers)
- `/app/accounts/` — customer account management
- `/app/api/` — API route handlers

### Database (Prisma + Supabase)

Schema is defined in `prisma/schema.prisma`. Core models and their relationships:

- **Supplier** — has many Products
- **Product** — belongs to a Supplier; has three price fields: `costPrice`, `retailPrice`, `tradePrice`
- **Account** — customer account with a `type` enum: `RETAIL` or `TRADE`

Always run `npx prisma generate` after modifying `schema.prisma`.

Supabase connection strings are stored in environment variables. The `.env` file must define:
```
DATABASE_URL=
DIRECT_URL=       # required by Prisma for Supabase connection pooling
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Pricing Model

Products have three distinct prices:
- `costPrice` — what the business pays the supplier
- `retailPrice` — price for retail (public) customers
- `tradePrice` — discounted price for trade account holders

### Account Types

Accounts are either `RETAIL` or `TRADE`. This distinction affects which price tier is shown/applied and may gate access to certain features or pricing visibility.

### Data Fetching Pattern

Server components fetch data directly via Prisma (server-side). Client components that need mutations use Next.js Server Actions or `/app/api/` route handlers. Avoid calling Prisma from client components.

## Deployment
- Hosting: Vercel (free tier)
- Database: Supabase (free tier)

## Key Features to Build
1. Supplier management (add, edit, delete, list suppliers)
2. Product management (linked to suppliers, with costPrice, retailPrice, tradePrice)
3. Account management (RETAIL and TRADE account types)
4. Dashboard overview (summary counts of suppliers, products, accounts)
5. Sidebar navigation linking all sections

## Important Notes
- Always handle empty states (e.g. "No suppliers yet. Add your first one.")
- All forms must have loading states and basic error handling
- Keep the UI clean and simple — this is a business management tool
- The person running this app has no coding background, so keep code well commented