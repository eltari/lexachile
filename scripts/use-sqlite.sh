#!/bin/bash
# Switch to SQLite for local development
cp prisma/schema.sqlite.prisma prisma/schema.prisma
echo "Switched to SQLite schema"
echo "Make sure DATABASE_URL=\"file:./dev.db\" is in your .env"
npx prisma generate
