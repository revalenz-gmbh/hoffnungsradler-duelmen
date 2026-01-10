# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website for **Hoffnungsradler Dülmen e.V.**, a German charity cycling organization. The website is built with React + TypeScript + Vite, uses shadcn-ui components, and integrates with Google Sheets/Apps Script for dynamic data management.

## Essential Commands

```bash
# Development
npm install           # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)

# Build & Deploy
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint

# Node Version
nvm use             # Use Node.js 24.x (required, see .nvmrc)
```

**Important:** This project requires Node.js >= 24.0.0. Always run `nvm use` when switching to this project.

## Quick Reference: Common Tasks

**Update current year donations:** Edit mock data in `src/lib/buchhaltung-api.ts` (mockDashboard.ausgaben.uebergeben) OR update Google Sheets Dashboard

**Add press article:** Edit `src/pages/Presse.tsx` → add to `pressArticles` array + image in `public/zeitungsartikel/`

**Update tour dates:** Edit `src/components/TourDates.tsx` → modify `tours` array

**Add new route:** Create page in `src/pages/`, add route in `src/App.tsx`, include `<SEOHead />` component

## Architecture Overview

### Core Technology Stack
- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **UI Components:** shadcn-ui (Radix UI primitives)
- **Styling:** Tailwind CSS with custom theme
- **Routing:** React Router v6
- **Data Fetching:** TanStack Query (React Query)
- **Backend Integration:** Google Apps Script Web Apps

### Key Design Patterns

**1. Dual Data Source Strategy**
The application supports both live Google Sheets data and fallback mock data:
- `src/lib/api-config.ts` - Central configuration for API endpoints
- `src/lib/buchhaltung-api.ts` - Accounting data with fallback logic
- `src/lib/google-sheets-api.ts` - Direct Google Sheets CSV access + historical constants

Environment variables control data source:
- `VITE_APPS_SCRIPT_URL` - Google Apps Script Web App URL
- `VITE_USE_LIVE_API=true` - Force live API in development
- If no URL configured, automatically uses mock data

**2. Multi-Service Google Apps Script Architecture**
Three independent Google Apps Script services in separate directories:
- `Service-Vereinsverwaltung/` - Accounting system (donations, receipts, annual reports)
- `Service-Tourverwaltung/` - Tour management (historical tours, GPX data, voting system)
- `Service-Newsletter/` - Newsletter system (subscribers, email campaigns)

Each service has its own `google-apps-script/Code.gs` entry point and operates independently.

**Security Architecture:**
- Frontend communicates with Google Apps Script via Vercel serverless functions (proxy pattern)
- Google Apps Script URL is never exposed to the browser
- Proxy configuration in `api/` directory (Vercel Functions)
- Environment variable `GOOGLE_APPS_SCRIPT_URL` configured on Vercel only

**3. Single Source of Truth for Donations**
- **Historical donations (2004-2024):** Hardcoded in `src/data/donations.ts` and `src/lib/google-sheets-api.ts` (HISTORICAL_DONATIONS)
- **Current year (2025):** Loaded from Google Sheets Dashboard via API (`ausgabenUebergeben` field)
- **Total:** Historical sum (91,055€) + current year amount

**4. Tour Management with Variants**
Tours can have multiple route variants (e.g., 48km, 78km, 106km):
- `src/components/TourDates.tsx` - Current year tour dates (manually maintained)
- `src/pages/UnsereTouren.tsx` - Historical tour archive (loaded from Apps Script)
- Tour variants automatically match GPX files from archive based on name/distance matching

### Critical Integration Points

**Google Apps Script Web App Integration:**
1. Deploy Apps Script as Web App: Extensions → Apps Script → Deploy → New deployment → Web app
2. Set execution: "Me", access: "Anyone"
3. Copy deployment URL to `.env` file: `VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec`

**API Endpoints (proxied through Vercel):**
- `/api/buchhaltung?action=getDashboard` - Current year accounting dashboard
- `/api/buchhaltung?action=getUebergabeSummen` - Total donations by year + grand total
- `/api/buchhaltung?action=getAllYearlyData` - All yearly donation data
- `/api/buchhaltung?action=getJahresabschluss&year=YYYY` - Annual financial report
- `/api/voting?action=getVotingTours` - Tours available for voting (Tourverwaltung)

**Data Layer Architecture:**
- `src/lib/buchhaltung-api.ts` - API client with automatic fallback to mock data
- `src/lib/donations-validator.ts` - Zod schema validation for all API responses
- `src/lib/donations-cache.ts` - LocalStorage caching (5-minute TTL)
- `src/lib/donations-consistency.ts` - Cross-validation of donation data integrity
- `src/data/donations.ts` - Immutable historical donation constants (2004-2024)

### Directory Structure Philosophy

```
src/
├── components/       # Reusable React components
│   ├── ui/          # shadcn-ui primitives (don't edit directly)
│   └── schemas/     # SEO Schema.org structured data components
├── pages/           # Route-level page components (1:1 with routes)
├── lib/             # Utilities and API integration logic
│   ├── api-config.ts            # API endpoints and configuration
│   ├── buchhaltung-api.ts       # Accounting API client
│   ├── donations-validator.ts   # Zod schemas for data validation
│   ├── donations-cache.ts       # LocalStorage caching layer
│   ├── donations-consistency.ts # Data integrity validation
│   └── google-sheets-api.ts     # Direct Google Sheets integration
├── data/            # Static data and constants (donations, tours)
└── hooks/           # Custom React hooks

public/              # Static assets served as-is
├── zeitungsartikel/ # Press article images
├── photos/          # Gallery photos
└── logos/           # Logo files

api/                 # Vercel serverless functions (proxy layer)
├── buchhaltung.ts   # Accounting API proxy
└── voting.ts        # Voting API proxy

Service-*/           # Google Apps Script backend services (separate repos conceptually)
docs/                # Comprehensive documentation for accounting system
```

### Routing Structure

All routes defined in `src/App.tsx`:
- `/` - Homepage (Hero, News, Tour dates, Gallery)
- `/tour-termine` - Current year tour calendar
- `/unsere-touren` - Historical tour archive
- `/spenden` - Donations page (shows total donations by year)
- `/ueber-uns` - About us
- `/presse` - Press articles
- `/sponsoren` - Sponsors
- `/kontakt` - Contact form
- `/newsletter/abmelden` - Newsletter unsubscribe
- `/datenschutz`, `/impressum`, `/medienhinweis` - Legal pages

### Styling System

**Theme Colors:**
- `prussian` (#003366) - Primary brand color (dark blue)
- `forest` (hsl(130, 16%, 37%)) - Secondary color (green)
- `snow` (#F8FAFA) - Light background

**Typography:**
- `font-anton` - Display headings
- `font-inter` - Body text
- `font-playfair` - Decorative serif

**Custom Animations:**
- `animate-fade-in` - Subtle entry animation
- `animate-fade-in-up` - Entry with upward motion
- `animate-slide-in` - Horizontal slide entry

### SEO Implementation

Comprehensive SEO with Schema.org structured data:
- `src/components/SEOHead.tsx` - Meta tags component for all pages
- `src/components/schemas/` - Typed Schema.org JSON-LD components:
  - `OrganizationSchema.tsx` - Organization info
  - `LocalBusinessSchema.tsx` - Local business data
  - `EventSchema.tsx` - Tour events
  - `ArticleSchema.tsx` - Press articles
  - `BreadcrumbSchema.tsx` - Breadcrumb navigation

Each page component should import and use `SEOHead` with appropriate props.

### Data Layer: Caching & Validation Architecture

The project uses a three-layer approach for data integrity:

**1. Caching Layer (`src/lib/donations-cache.ts`):**
- LocalStorage-based caching with 5-minute TTL
- Automatic cache invalidation on expiry
- Manual cache clearing available via `clearCache()`
- Cache keys: `donations:${action}:${year?}`
- Reduces API calls and improves performance

**2. Validation Layer (`src/lib/donations-validator.ts`):**
- Zod schemas for runtime type validation
- Validates all API responses before use
- Catches data structure changes early
- Provides type-safe TypeScript types
- Schemas: `DashboardData`, `UebergabeSummen`, `AllYearlyData`, `Jahresabschluss`

**3. Consistency Layer (`src/lib/donations-consistency.ts`):**
- Cross-validates that totals match sum of individual entries
- Verifies historical donations match hardcoded constants
- Ensures current year + historical = grand total
- Logs warnings for inconsistencies without breaking UI
- Example: `validateUebergabeSummenConsistency()`, `validateAllYearlyDataConsistency()`

**Flow for API calls:**
```
User Request → Check Cache → [Cache Hit] → Return cached data
                          → [Cache Miss] → Fetch from API
                                         → Validate with Zod
                                         → Cross-validate consistency
                                         → Store in cache
                                         → Return data
                          → [API Error] → Return fallback/mock data
```

This architecture ensures data integrity while providing excellent performance and graceful degradation.

## Content Management

### Updating Donation Amounts
**Current year donations (2025):**
Managed via Google Sheets Dashboard (if connected) OR update mock data in `src/lib/buchhaltung-api.ts` (mockDashboard.ausgaben.uebergeben)

**Historical donations (2004-2024):**
Rarely change. If needed, update both:
1. `src/data/donations.ts` - donations array
2. `src/lib/google-sheets-api.ts` - HISTORICAL_DONATIONS object

### Adding Press Articles
Edit `src/pages/Presse.tsx`:
1. Add new entry to `pressArticles` array (newest first)
2. Add image to `public/zeitungsartikel/`
3. Format: `{ date: "DD.MM.YYYY", title: "...", source: "...", excerpt: "...", image: "/zeitungsartikel/filename.png" }`

### Managing Tour Dates
**Current year tours:**
Edit `src/components/TourDates.tsx` - update `tours` array

**Tours with multiple variants (e.g., Baumberge Alpin-Tour):**
```typescript
{
  date: "28.09.2025",
  name: "Baumberger Alpin-Tour",
  distance: "48/78/106 km",
  variants: [
    { label: "48 km", gpxUrl: "", mapUrl: "", komootUrl: "" },
    { label: "78 km", gpxUrl: "", mapUrl: "", komootUrl: "" },
    { label: "106 km", gpxUrl: "", mapUrl: "", komootUrl: "" }
  ],
  // ... other fields
}
```

GPX URLs are automatically populated from archive if tour names match "baumbergealpintour" pattern.

**Historical tours:**
Managed via Service-Tourverwaltung Google Spreadsheet (auto-imported)

### Newsletter Integration
The newsletter system uses Service-Newsletter Apps Script:
- Subscriber management in Google Sheets
- Automated email campaigns with personalized voting links
- Unsubscribe functionality via `/newsletter/abmelden` page

## Development Workflow

### Environment Setup
1. Clone repository
2. Run `nvm use` to activate Node.js 24.x
3. Run `npm install`
4. Create `.env` file (optional - app works without it using mock data):
   ```
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
   VITE_USE_LIVE_API=true  # Optional: force live API in dev mode
   ```
5. Run `npm run dev`

### Working with Lovable
This project was created with Lovable (lovable.dev). Changes made in Lovable are automatically synced to this repository.

### Vercel Serverless Functions (API Proxy Layer)
The `api/` directory contains Vercel serverless functions that act as a secure proxy between the frontend and Google Apps Script:

**Why use a proxy?**
- Hides Google Apps Script URL from browser (security)
- Enables server-side environment variables
- Provides consistent error handling
- Allows for future API enhancements without frontend changes

**Adding a new API endpoint:**
1. Create file in `api/` directory (e.g., `api/my-endpoint.ts`)
2. Export handler function following Vercel serverless pattern
3. Configure `GOOGLE_APPS_SCRIPT_URL` environment variable on Vercel
4. Add endpoint to `src/lib/api-config.ts`
5. Create corresponding function in `src/lib/` for frontend consumption

**Example proxy function:**
```typescript
// api/my-endpoint.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return res.status(500).json({ error: 'Configuration error' });
  }

  const response = await fetch(`${scriptUrl}?action=myAction`);
  const data = await response.json();

  return res.status(200).json(data);
}
```

### Deployment
- **Platform:** Vercel (automatic deployment)
- **Branch:** main (auto-deploys on push)
- **Build command:** `npm run build`
- **Output directory:** `dist`

## Documentation

Extensive documentation in `docs/` directory (primarily for accounting system):
- `docs/README.md` - Documentation overview
- `docs/INSTALLATION.md` - Google Sheets + Apps Script setup guide
- `docs/BUCHHALTUNG_HANDBUCH.md` - Accounting system user manual
- `docs/JAHRESWECHSEL.md` - **Year-end transition guide (Spreadsheet + Website code)**
- `docs/JAHRESABSCHLUSS_CHECKLISTE.md` - Annual financial statement checklist
- `docs/GOOGLE_APPS_SCRIPT_SETUP.md` - Detailed Apps Script configuration
- `docs/SICHERHEIT.md` - Security and data protection guidelines

## Important Constraints

**Security (CRITICAL):**
- **NEVER read or commit `.env` files** - contains sensitive Google Apps Script URLs
- **NEVER read or display `.env.local`, `.env.production`, or any environment files**
- **NEVER expose Google Apps Script URLs** - all API calls go through Vercel proxy
- Google Sheets API only exposes aggregated, non-personal data
- Sensitive endpoints (personal donor data) are blocked in Apps Script Web App
- All personal data (names, IBANs, email addresses) stays in private Google Sheets
- When debugging API issues, use mock data or ask user to check Vercel environment variables
- API proxy pattern ensures Google Apps Script URL is never exposed to browser

**Data Integrity:**
- Historical donation data (2004-2025) is immutable - only current year changes
- Total donations = 101,055€ (historical 2004-2025) + current year amount
- Always verify totals match after any donation data changes
- Year-end transition: See `docs/JAHRESWECHSEL.md` for complete guide

**Node Version:**
- Project REQUIRES Node.js >= 24.0.0 (specified in package.json engines)
- Always use `nvm use` before development

## Common Patterns

**Adding a new page:**
1. Create component in `src/pages/PageName.tsx`
2. Add route in `src/App.tsx` Routes section
3. Add `<SEOHead />` component with title, description, keywords
4. Add schema.org structured data if applicable

**Adding shadcn-ui component:**
```bash
npx shadcn@latest add [component-name]
```
Components installed to `src/components/ui/` - do not edit directly.

**API integration with fallback:**
```typescript
import { getDashboard } from '@/lib/buchhaltung-api';

// In component:
const { data, isLoading, error } = useQuery({
  queryKey: ['dashboard'],
  queryFn: getDashboard,
});

// Mock data automatically used if Google Sheets not configured
// Data is validated with Zod schemas and cached for 5 minutes
// Cache can be manually cleared with: import { clearCache } from '@/lib/donations-cache'
```

**Data validation pattern:**
```typescript
import { validateDashboardData } from '@/lib/donations-validator';
import { getCache, setCache } from '@/lib/donations-cache';

// All API responses are:
// 1. Fetched from cache if available and fresh (5 min TTL)
// 2. Validated with Zod schemas for type safety
// 3. Cross-validated for consistency (totals match sum of parts)
// 4. Cached on success
// 5. Fallback to mock data on error
```

**Custom animations:**
Use Tailwind animation classes: `animate-fade-in`, `animate-fade-in-up`, `animate-slide-in`

## Troubleshooting

**If donation data not loading:**
1. Check browser console for API errors
2. Verify `VITE_APPS_SCRIPT_URL` in `.env`
3. Confirm Apps Script deployed as Web App with "Anyone" access
4. App gracefully falls back to mock data if API unavailable

**If tour GPX links missing:**
1. Check Service-Tourverwaltung Google Spreadsheet has tour entries
2. Verify tour names match expected patterns (e.g., "BaumbergeAlpintour")
3. Ensure `downloadUrl` field contains valid public Google Drive link

**If builds fail:**
1. Verify Node.js version: `node --version` (must be >= 24.0.0)
2. Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
3. Check for TypeScript errors: `npm run build`
