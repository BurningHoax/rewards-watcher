# Project Timeline: Universal Web Monitor

*Note: This timeline is structured for 2-3 hour work sessions to ensure steady, measurable progress without burnout.*

## Session 1: Cloud & Data Layer (2-3 hours)
*Goal: Have a live database ready to accept and store tracking targets.*
- [ ] **0.5 hr:** Initialize Next.js project (App Router) and install core dependencies (Tailwind, shadcn/ui, Supabase JS client).
- [ ] **1.0 hr:** Set up Supabase project. Create tables: `users`, `targets` (url, css_selector, expected_state, interval), and `logs` (target_id, status, timestamp).
- [ ] **1.0 hr:** Configure Supabase Authentication (Email/Password or OAuth) and set up basic Row Level Security (RLS) so users only see their own targets.

## Session 2: Web Dashboard Front-End (2-3 hours)
*Goal: A functional web interface to manually add, view, and delete tracking targets.*
- [ ] **1.0 hr:** Build the main Dashboard Layout and Authentication UI (Login/Signup).
- [ ] **1.0 hr:** Create the "Active Targets" data table to fetch and display the user's configured targets from Supabase.
- [ ] **1.0 hr:** Build the "Add New Target" modal/form (allowing manual entry of URL and CSS selector) and wire it to insert into the database.

## Session 3: Core Scraping Engine & Cron (2-3 hours)
*Goal: The backend successfully reads the database, scrapes URLs, and logs changes.*
- [ ] **1.0 hr:** Write a Next.js API route (`/api/scraper`) using `cheerio` to fetch a target URL, parse the DOM using the saved CSS selector, and evaluate the state.
- [ ] **1.0 hr:** Write the logic to compare the current scrape result against the last known state in the database. Log the result to the `logs` table.
- [ ] **1.0 hr:** Configure a cron job (via Vercel Cron or Supabase `pg_cron`) to hit this API route automatically based on user intervals.

## Session 4: Chrome Extension - Manifest V3 Scaffold (2-3 hours)
*Goal: A working Chrome extension popup that authenticates the user.*
- [ ] **1.0 hr:** Scaffold the Manifest V3 extension boilerplate (background service worker, popup UI, permissions for `activeTab` and `storage`).
- [ ] **1.5 hr:** Build the Popup UI (using React/Tailwind) and implement session sharing/authentication so the extension knows which Supabase user is logged in.

## Session 5: Chrome Extension - Visual Selector (2-3 hours)
*Goal: Users can click an element on any webpage to auto-generate the tracking configuration.*
- [ ] **1.5 hr:** Develop the Content Script that injects a hover-highlight overlay onto the current webpage.
- [ ] **1.0 hr:** Add click-to-capture logic: when a user clicks an element, generate its unique CSS path and send it back to the Extension Popup.
- [ ] **0.5 hr:** Wire the Popup's "Save Target" button to push this visually selected data directly to the Next.js API / Supabase database.

## Session 6: Notification System (1-2 hours)
*Goal: The user gets pinged when a target changes state.*
- [ ] **1.0 hr:** Integrate Resend (Email) or a Telegram Bot API into the backend scraper logic.
- [ ] **1.0 hr:** Add conditional logic to trigger the alert *only* when the scraping engine detects a state change (e.g., "Out of Stock" disappears), pulling the user's contact info from the database.
