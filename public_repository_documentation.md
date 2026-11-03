# Internal Project Tracker: Universal Web Monitor

## Project Vision

To transition from a brittle, client-side script into a robust, cloud-hosted tracking engine. The system will allow a user to navigate to any webpage, use a Chrome extension to select a DOM element, and offload the continuous monitoring of that element to a remote server.

## Milestones

* **Milestone 1 (Data Layer):** Establish the Supabase database schema to hold targets, users, and tracking history.

* **Milestone 2 (Execution Layer):** Successfully trigger a cron job that fetches a webpage, parses a specific selector, and logs the result to the database.

* **Milestone 3 (Client Layer):** Build the Chrome Extension UI to easily submit new tracking jobs to the execution layer.

* **Milestone 4 (Alert Layer):** Wire up device-independent notifications (Email/Telegram) when the execution layer detects a state change.

## Work Division (Next Steps)

1. **Database Design:** We need a schema for `users`, `targets` (url, selector, expected_text, interval), and `logs`.

2. **Scraping Worker:** Writing the Next.js API route that the cron job will hit.

3. **Extension Scaffold:** Setting up the boilerplate for the Manifest V3 Chrome Extension.