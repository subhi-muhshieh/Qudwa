# قدوة (Qudwa)

**جيلٌ يبني... أثرٌ يبقى**

Qudwa is a Next.js-based web platform for an educational and youth association. It showcases activities, manages user registrations, and provides a dashboard for members and administrators.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Edge Runtime)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) via `@cloudflare/next-on-pages`
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Notifications**: Telegram Bot API

## Features

### Public Pages
- **Landing Page**: Upcoming activities, recent events gallery, photo showcase
- **Activities**: Browse and view upcoming/past activities
- **Gallery**: Masonry-style photo gallery from events
- **About**: Organization information
- **Contact**: Contact form with Telegram notifications
- **FAQ**: Frequently asked questions

### User Features
- **Authentication**: Email/password login via Supabase Auth
- **Dashboard**: User profile and activity participation history
- **Settings**: Profile customization, avatar cropping
- **Notifications**: In-app notification center

### Admin Features
- **Activity Management**: Create, edit, publish/unpublish activities
- **Photo Uploads**: Add photos to activities with Firebase Storage
- **User Management**: View registered users and participants

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- (Optional) Telegram bot for contact form notifications

### Setup

1. Clone the repository:
```bash
git clone <repo-url>
cd qudwa
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Database Schema

The app expects these Supabase tables:
- `activities` — Activity listings with dates, descriptions, images
- `activity_photos` — Gallery photos linked to activities
- `profiles` — Extended user profile data
- `registrations` — User activity registrations

See `supabase/schema.sql` (if available) for full schema definitions.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run pages:build` | Build for Cloudflare Pages |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/
├── page.js              # Landing page (server component)
├── layout.js            # Root layout with auth provider
├── globals.css          # Global styles + Tailwind
├── components/          # Reusable UI components
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── utils/               # Utility functions (Supabase clients, etc.)
├── api/                 # API routes (contact form, etc.)
├── activities/          # Activities listing & detail pages
├── admin/               # Admin dashboard
├── dashboard/           # User dashboard
├── gallery/             # Photo gallery
├── login/               # Authentication pages
├── profile/             # Profile management
└── settings/            # User settings
```

## Accessibility

This project follows WCAG 2.1 AA guidelines. See `COLOR_CONTRAST_AUDIT.md` for detailed color contrast analysis and `LOGICAL_PROPERTIES_GUIDE.md` for RTL (Arabic) layout best practices.

Key considerations:
- All colors meet 4.5:1 contrast ratio for text
- RTL support for Arabic content
- Semantic HTML and ARIA labels
- Keyboard navigation support

## Deployment

The site is optimized for Cloudflare Pages:

1. Build: `npm run pages:build`
2. Deploy the `.vercel/output/static` folder

Alternatively, use the Vercel Platform for standard Next.js hosting.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Cloudflare Pages + Next.js](https://developers.cloudflare.com/pages/frameworks/nextjs/)
