# ZagTrader RAG System (project README)
Source: /Users/yahya/Documents/zagtrader-rag/README.md

# RAG System - Web Crawler

A portable, modular web crawler for extracting data from web applications. Supports authentication, form filling, screenshot capture, and MongoDB storage.

## Features

- Automatic Authentication - Detects login pages and handles authentication
- Form Filling - JSON-configurable form field values
- Screenshot Capture - Multiple modes (full, batches, hybrid)
- GridFS Storage - Screenshots stored in MongoDB GridFS
- Session Persistence - Maintains login state between runs
- Pattern Matching - Filter routes by URL patterns
- CLI Interface - Easy command-line usage

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your settings
npm run crawl -- --url https://example.com/page.php
npm run crawl -- --all
npm run crawl -- --pattern "statement.*account" --limit 5
```

## Configuration

Environment variables include `MONGODB_URI`, `DB_NAME`, `GRIDFS_BUCKET`, `WEB_BASE_URL`, `WEB_ALLOWED_HOST`, `WEB_LOGIN_URL`, `WEB_USERNAME`, `WEB_PASSWORD`, `WEB_USER_SELECTOR`, `WEB_PASS_SELECTOR`, `WEB_SUBMIT_SELECTOR`, `HEADLESS`, `BROWSER_EXECUTABLE`, `WEB_STORAGE_STATE`, `SCREENSHOT_MODE`.

Form fields are configured per page via `form-fields.json` with selectors, values and types. Routes are defined in `routes.json` as `{routeKey, exampleUrl}`.

## CLI Usage

```bash
node src/web/cli.js --help
node src/web/cli.js --url https://example.com/page.php
node src/web/cli.js --all
node src/web/cli.js --pattern "report|statement"
node src/web/cli.js --all --limit 10 --skip-existing --headless --mode full
node src/web/cli.js --url https://example.com/form.php --no-submit
```

## Programmatic Usage

```javascript
const { Crawler, crawl, crawlAll } = require("./src/web/crawler");
const results = await crawl("https://example.com/page.php");
const allResults = await crawlAll({ limit: 10, skipExisting: true });
const crawler = new Crawler({ headless: true });
await crawler.init();
await crawler.start();
const result = await crawler.processUrl("https://example.com/page.php");
await crawler.stop();
```

## Project Structure

```
rag-system/
├── src/web/
│   ├── core/          # config, utils, browser, auth, forms, screenshots, database, tiler
│   ├── crawler.js     # Main Crawler class
│   ├── cli.js         # CLI entry point
│   └── ingest/ingestWithForms.js
├── scripts/export-routes.js
├── testing/testFormFill.js
├── form-fields.json
├── routes.json
├── storageState.web.json
├── .env / .env.example
└── package.json
```

## Database Collections

- `web_pages` - Successfully crawled pages with screenshot references
- `web_failures` - Failed crawl attempts with error details
- `web_screens.files/chunks` - GridFS screenshot storage
- `web_knowledge` - Vision-extracted knowledge per page
- `web_chunks` - Embedded vector chunks from knowledge text

Screenshot Modes: `full` (single full-page), `batches` (multiple viewport-sized scrolling), `hybrid` (full page + batches if tall).

## NPM Scripts

`npm run crawl`, `crawl:url`, `crawl:all`, `crawl:pattern`, `migrate`, `extract`, `extract:all`, `embed:web`, `embed:web:all`, `pipeline:web`.

## Part 2: Portal Knowledge Pipeline (Vision + RAG)

Workflow: crawl all pages → extract knowledge from screenshots via Ollama vision model → embed extracted knowledge into vector chunks. Or run the full pipeline via `npm run pipeline:web`.

The `/ask` endpoint accepts a `source` parameter: `folder` (PDF documents), `portal` (web portal knowledge from screenshots), or `both` (merged by similarity score).

## Dependencies

- playwright (Browser automation)
- mongodb (Database driver)
- dotenv (Environment configuration)
