# Qudwa

A Next.js web application for an educational and youth association, focused on showcasing activities, managing registrations, and supporting community engagement.

## Overview

Qudwa is built to help organizations share announcements, highlight past and upcoming activities, display a photo gallery, and provide a member experience with authentication, dashboards, and profile management.

The project uses the Next.js App Router, Supabase for data and authentication, Tailwind CSS for styling, and Cloudflare Pages deployment support.

## Features

- Public landing page and organization overview
- Activities browsing and detail views
- Event gallery and media showcase
- About, FAQ, contact, and donation pages
- Supabase-powered authentication
- Member dashboard and profile management
- Admin dashboard for content and activity management
- Accessibility-focused UI patterns for Arabic/RTL-friendly content
- Telegram notifications for contact and support updates

## Tech Stack

- Framework: Next.js 16
- UI: React 19 + App Router
- Styling: Tailwind CSS + DaisyUI
- Auth & Data: Supabase
- Testing: Vitest + Testing Library
- Deployment: Cloudflare Pages via `@cloudflare/next-on-pages`
- Animations: Framer Motion
- Icons: Lucide React
- Storage: Firebase integration for media upload workflows

## Project Structure

```text
app/
├── about/              # Organization information page
├── activities/         # Activity listings and details
├── admin/              # Admin dashboard features
├── api/                # API routes and backend handlers
├── components/         # Reusable UI components
├── contact/            # Contact page and form
├── context/            # App context providers
├── dashboard/          # User dashboard
├── donate/             # Donation flow page
├── faq/                # FAQ content
├── fonts/              # Custom fonts
├── gallery/            # Event gallery pages
├── hooks/              # Custom React hooks
├── login/              # Authentication pages
├── notifications/      # Notification views
├── profile/            # Profile management
├── reset-password/     # Password reset flow
├── settings/           # User settings and preferences
├── utils/              # Utility helpers and configuration
├── globals.css         # Global styles
├── layout.js           # App layout
├── page.js             # Landing page
├── manifest.js         # PWA manifest config
├── robots.js           # SEO robots config
├── sitemap.js          # Sitemap generation
└── not-found.js        # Custom 404 page

public/
├── logo.png
├── opengraph-image.png
└── ...
```

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 18+
- npm or another package manager
- A Supabase project
- Optional: Telegram bot credentials for contact notifications
- Optional: Firebase configuration if media upload features are enabled

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/subhi-muhshieh/Qudwa.git
cd Qudwa
```

2. Install dependencies

```bash
npm install
```

3. Create your environment file

```bash
cp .env.example .env.local
```

If there is no `.env.example` file in the repo, create `.env.local` manually and add the required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

4. Run the app locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev         # Start the development server
npm run build       # Create a production build
npm run start       # Run the production server
npm run lint        # Run ESLint
npm run test        # Run Vitest in watch mode
npm run test:run    # Run tests once
npm run test:coverage # Run tests with coverage
npm run pages:build # Build for Cloudflare Pages
```

## Deployment

This project includes support for Cloudflare Pages:

```bash
npm run pages:build
```

The generated output is suitable for deployment to Cloudflare Pages or similar static+edge hosting setups.

## Accessibility and Localization

The app includes attention to accessibility and Arabic/RTL-friendly layout patterns. Supporting documentation is included in:

- `COLOR_CONTRAST_AUDIT.md`
- `LOGICAL_PROPERTIES_GUIDE.md`

## License

This project does not currently declare a license in the repository metadata. If you plan to distribute or reuse it publicly, add an appropriate open-source license before publishing.

## Contributing

Contributions are welcome. If you make changes:

1. Create a feature branch
2. Make the update
3. Run validation checks
4. Submit a pull request with a clear summary

## Contact

For project coordination or questions, reach out through the repository owner or relevant organization contact channels.
