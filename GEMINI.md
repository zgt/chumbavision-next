# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build production site to ./.next/
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

**Technology Stack:**
- **Framework**: Next.js 15
- **Frontend**: React 19
- **Styling**: Tailwind CSS
- **File Upload**: UploadThing service for video storage and management

**Key Architecture Points:**
- Next.js App Router handles routing via directories in `src/app/`
- API routes in `src/app/api/` provide backend functionality
- React components in `src/components/` handle client-side interactivity
- Server-side UploadThing configuration in `src/app/api/uploadthing/core.ts`
- Client-side UploadThing utilities in `src/lib/uploadthing.ts`

**Video Processing Flow:**
1. Users submit TikTok/Instagram URLs via VideoSubmit component
2. `app/api/submit/route.ts` validates URLs and processes submissions
3. `app/api/videos/route.ts` fetches stored videos from UploadThing service
4. VideoFeed component displays videos in responsive grid

**Environment Variables Required:**
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`
- `APIFY_TOKEN` - Required for Apify API access to scrape TikTok and Instagram videos

**Important Notes:**
- The app uses the Next.js App Router.
- Video uploads are handled by UploadThing.
- URL validation supports TikTok and Instagram domains only
