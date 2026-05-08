# Seiq Jordan Marketplace (project README)
Source: /Users/yahya/Documents/Seiq/jordan-marketplace/README.md

# Jordan Marketplace - Deploy Test

A modern multi-vendor e-commerce platform built with Next.js 14, TypeScript, and Supabase.

## Features

- Multi-vendor marketplace
- PayPal integration for payments
- Mobile-responsive design
- Secure authentication with Supabase
- Modern UI with Tailwind CSS
- Product management for vendors
- Shopping cart functionality
- Jordan-specific features (JOD currency, local shipping)

## Tech Stack

- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: Supabase (PostgreSQL)
- Payment: PayPal SDK
- Deployment: Vercel/Railway (recommended)

## Getting Started

```bash
git clone <repo>
cd jordan-marketplace
npm install
cp .env.example .env.local   # add Supabase + PayPal credentials
npm run dev
# Open http://localhost:3000
```

## Deployment

This app is ready to deploy on Vercel (recommended for Next.js), Railway, Render, or any platform that supports Node.js.

## License

Private project - All rights reserved.
