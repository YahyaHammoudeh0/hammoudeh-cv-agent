# ZagTrader Internship Prep Guide (project README)
Source: /Users/yahya/Documents/zagtrader-prep/README.md

# ZagTrader Internship Prep Guide

A learning path for building API integrations at a fintech company, tailored for someone with strong TypeScript/React skills who needs to level up on backend and infrastructure.

## Learning Path Overview

### Phase 1: Foundations (Week 1-2)
- Design Principles (SOLID, DRY, KISS) - 3-4 hrs - High priority
- OOP (Classes, Inheritance, Polymorphism) - 4-5 hrs - High priority
- Data Structures & Algorithms (Big O, Trees, Graphs) - 8-10 hrs - High priority
- Design Patterns (Adapter pattern is crucial for APIs) - 6-8 hrs - High priority

### Phase 2: Core Backend Skills (Week 2-3)
- Node.js (Event loop, async, streams) - 8-10 hrs - High priority
- MongoDB (Documents, queries, indexing) - 6-8 hrs - High priority
- Database Design (Schema design, relationships) - 5-6 hrs - High priority

### Phase 3: Architecture & Scaling (Week 3-4)
- System Design (Architecture, caching, queues) - 8-10 hrs - Medium priority
- Monolithic Architecture (Monolith vs microservices) - 2-3 hrs - Medium priority
- Clustering (Node.js clustering, PM2) - 3-4 hrs - Medium priority

### Phase 4: Production Readiness (Week 4-5)
- High Availability (Load balancing, failover) - 4-5 hrs - Medium priority
- Disaster Recovery (Backups, RTO/RPO) - 3-4 hrs - Medium priority

### Phase 5: Developer Workflow
- Git Advanced (Rebasing, workflows) - 4-5 hrs - Medium priority
- Monorepo (Turborepo, Nx) - 3-4 hrs - Low priority

## Total Time Estimate
- Minimum: ~60 hours (surface level)
- Recommended: ~80-90 hours (solid understanding)
- Deep Dive: 120+ hours (expert level)

## Fintech-Specific Focus Areas

Since you're building API integrations for a fintech company, prioritize:

1. Adapter Pattern - You'll wrap external APIs constantly
2. Error Handling - Financial data requires robust error handling
3. Idempotency - Payments must not double-process
4. Audit Logging - Financial regulations require tracking
5. Data Validation - Never trust external API responses
6. Rate Limiting - Both implementing and handling

## Project Ideas to Apply Learning

Beginner: REST API with Node.js + MongoDB, CRUD with proper error handling.
Intermediate: API adapter for a public financial API (Alpha Vantage, Yahoo Finance), clustering and PM2, schema for a trading journal app.
Advanced: Mock trading system with order processing, job queue for async processing, monorepo with shared types.
