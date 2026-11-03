# Agent Context & Instructions

## Project Overview
**Name:** Universal Web Monitor
**Goal:** Build a scalable, cloud-based monitoring system that tracks arbitrary webpage changes (inventory, pricing, text) 24/7, independent of the user's device state.

## Architecture
- **Backend/API:** Next.js (Serverless functions for ingestion and API).
- **Database & Cron:** Supabase (PostgreSQL, Auth, RLS) and Vercel/Supabase Cron Jobs.
- **Scraping:** Cheerio (for lightweight DOM parsing) via serverless workers.
- **Client:** Chrome Extension (Manifest V3) acting as the UI for selecting targets.
- **Notifications:** Resend (Email) and/or Webhooks (Telegram/Discord) for device-agnostic alerts.

## Agent Directives
1. **Cloud-First:** Always assume the polling engine runs in a serverless environment, not the browser.
2. **Decoupled Logic:** The Chrome extension is purely for configuration (capturing URLs/Selectors) and viewing status; it does not perform the polling.
3. **Scalability:** Design database schemas and API routes with multi-tenancy in mind, even if currently testing for a single user.
4. **Tone Guidelines:** User-facing repository documentation must be strictly professional, completely devoid of emojis, and avoid enthusiastic conversational phrasing.