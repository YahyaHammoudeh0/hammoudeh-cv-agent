# Seiq Marketplace — Founder/Developer (Jan 2025 to May 2026)

I founded and built Seiq, a multi-vendor e-commerce marketplace targeted at the Jordanian market. The web app is Next.js with TypeScript and Tailwind, backed by Supabase (PostgreSQL + auth) and styled with ShadCN UI. The mobile experience ships as cross-platform Android and iOS apps via Capacitor — same codebase, native shells.

The differentiator is the AI Instagram integration. Most small Jordanian sellers run their stores on Instagram and don't want to re-list every product manually. Seiq scrapes a vendor's Instagram posts and uses a multimodal model to parse them into structured product listings — title, description, price, category, and images — so a vendor can onboard their entire catalog in minutes. Product images go through automatic background removal so the catalog has a consistent look without per-photo editing work.

Other moving parts: PayPal for international payments, Careem Express for last-mile delivery integrated at the checkout, JOD currency and Arabic localization for the Jordanian context, and a vendor dashboard that lets sellers manage products, orders, and payouts. The hard parts were the Instagram parsing pipeline (sellers post inconsistently — captions, comments, multi-image carousels) and getting the Capacitor mobile builds production-stable across platforms.
