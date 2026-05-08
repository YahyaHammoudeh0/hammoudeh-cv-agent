# Restaurant POS — Next.js 15

A full-featured restaurant point-of-sale system built on Next.js 15 with React 19, tRPC for end-to-end type safety between client and server, and Supabase for data and auth. 324 unit tests on the business logic.

What's in the box: a Kitchen Display System (KDS) that streams active orders to the back of house with state transitions (received, preparing, ready), a table management surface with floor plans, an inventory module with stock-level tracking, and a customer loyalty program. The app is a PWA with offline support — orders taken during a connectivity blip are queued locally and reconciled when the connection returns, which matters in restaurants where wifi is unreliable. Internationalization is Arabic and English, including right-to-left layout for Arabic.

The architectural bet here was tRPC over REST. With the same TypeScript types flowing from Postgres schema to React component, the entire app refactors as one unit and the testing surface stays small. The downside is tighter coupling between client and server, but for a single-tenant POS that's the correct tradeoff. I also have a sister project, POS Predictive Intelligence, that builds demand forecasting and business-insight models on top of POS transaction streams; that one was built for Loving Loyalty, a Danish company.
