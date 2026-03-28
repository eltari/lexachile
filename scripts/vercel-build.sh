#!/bin/bash
# Vercel build script: swaps to PostgreSQL schema before building

echo "==> Detecting database provider..."

if echo "$DATABASE_URL" | grep -q "^postgresql://\|^postgres://"; then
  echo "==> PostgreSQL detected, swapping schema..."
  cp prisma/schema.postgresql.prisma prisma/schema.prisma
else
  echo "==> Using existing schema (SQLite or other)"
fi

echo "==> Running prisma generate..."
npx prisma generate

echo "==> Pushing schema to database..."
npx prisma db push --accept-data-loss

echo "==> Building Next.js..."
npx next build
