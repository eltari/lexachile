#!/bin/bash
# Switch to PostgreSQL for production/Vercel
cp prisma/schema.postgresql.prisma prisma/schema.prisma
echo "Switched to PostgreSQL schema"
echo "Make sure DATABASE_URL points to your PostgreSQL database"
npx prisma generate
