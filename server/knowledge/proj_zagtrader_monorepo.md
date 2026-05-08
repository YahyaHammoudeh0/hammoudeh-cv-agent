# ZagTrader Projects Monorepo (project README)
Source: /Users/yahya/Documents/ZagTrader/README.md

# ZagTrader Projects

Monorepo for all ZagTrader projects.

## Projects

### `/rag` — ZagTrader AI Platform (RAG)
Unified AI platform with RAG, Voice Agent, Knowledge Base, and Admin Dashboard.
- Stack: Express, React (Vite), MongoDB, OpenRouter (Qwen models)
- Features: 5 retrieval pipelines (Folder, Portal, Knowledge, Jira, Media), voice mode, WebSocket chat

### `/gateway` — ZagTrader API Gateway
NestJS gateway that normalizes ZagTrader's 77 backend PHP endpoints into clean RESTful APIs.
- Stack: NestJS, TypeScript, Swagger
- Features: kebab-case URLs, camelCase fields, proper HTTP methods, auto-documentation

### `/zagconnect` — ZagConnect
ZagConnect application with frontend and backend.

## Setup

Each project has its own `package.json`. Install dependencies per project:

```bash
cd rag && npm install
cd gateway && npm install
cd zagconnect/backend && npm install
cd zagconnect/frontend && npm install
```
