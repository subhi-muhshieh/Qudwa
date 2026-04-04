# Qudwa Association Project Context

**Project Name:** Qudwa (جمعية قدوة)  
**Type:** Educational Non-Profit Organization Management Web Application  
**Tech Stack:** Next.js 14.1, React 18, Supabase, Firebase (Push Notifications), Tailwind CSS, DaisyUI  
**Deployment:** Cloudflare Pages  
**Language:** Bilingual (Arabic/English) with Arabic-first UI  

---

## 1. PROJECT OVERVIEW

Qudwa is a comprehensive web platform for managing activities, members, and supporters of an educational non-profit organization. The platform supports multiple user types (parents, volunteers, members, donors, followers) with role-based access control and personalized dashboards.

**Mission:** Build awareness and engagement through activity management, member tracking, photo galleries, and community notifications.

**Key Features:**
- User authentication and role-based access control
- Activity management (create, display, mark as upcoming/past)
- Photo management and gallery
- Child profile management (for parents)
- Attendance tracking
- User ranking and achievement system
- Notification system (Firebase Push Notifications)
- Admin panel with member management
- Donation support
- Multi-language support (Arabic/English)

---

## 2. TECH STACK & KEY DEPENDENCIES

```
Framework: Next.js 14.1 (App Router)
UI Library: React 18
Database: Supabase (PostgreSQL)
Authentication: Supabase Auth
Push Notifications: Firebase Cloud Messaging
Styling: Tailwind CSS 3.3 + DaisyUI 4.6
Animation: Framer Motion 12.31
Icons: React Icons 5.5
Image Handling: Sharp 0.34.5, react-easy-crop 5.5.6
Toast Notifications: react-hot-toast 2.6.0
Date Utilities: date-fns 4.1
Deployment: Cloudflare Pages (@cloudflare/next-on-pages)
```

---

## 3. PROJECT STRUCTURE & KEY DIRECTORIES

```
/app
  ├── /api                    # API routes (edge runtime for most)
  │   ├── /account/delete     # User account deletion endpoint
  │   ├── /notifications      # Notification CRUD operations
  │   ├── /telegram           # Telegram integration (if configured)
  │   └── /send (under notifications)
  ├── /components             # Reusable React components
  ├── /context                # React Context providers (ProfileContext)
  ├── /utils                  # Utility functions
  │   ├── constants.js        # Labels, roles, user types, levels
  │   ├── activityHelpers.js  # Activity status updates, throttling
  │   ├── imageUtils.js       # Image processing utilities
  │   └── /supabase           # Supabase client initialization
  │       ├── client.js       # Client-side Supabase instance
  │       └── server.js       # Server-side Supabase instance
  ├── /fonts                  # Custom fonts (FS_Future.ttf)
  ├── /hooks                  # Custom React hooks (if any)
  ├── /pages                  # Route pages (using App Router)
  │   ├── page.js             # Landing page
  │   ├── /dashboard          # Main user dashboard
  │   ├── /admin              # Admin management panel
  │   ├── /profile            # User profile page
  │   ├── /settings           # User settings
  │   ├── /activities         # Activities listing
  │   ├── /gallery            # Photo gallery
  │   ├── /login              # Authentication page
  │   ├── /about              # About page
  │   ├── /contact            # Contact page
  │   ├── /donate             # Donation page
  │   ├── /faq               # FAQ page
  │   ├── /notifications      # Notifications page
  │   ├── /reset-password     # Password reset flow
  │   └── /not-found.js       # 404 page
  ├── firebase.js             # Firebase initialization and messaging
  ├── layout.js               # Root layout with providers
  ├── globals.css             # Global styles
  ├── manifest.js             # PWA manifest
  ├── robots.js               # SEO robots.txt
  └── sitemap.js              # SEO sitemap
├── /public
│   └── firebase-messaging-sw.js  # Service worker for Firebase
├── /__tests__                # Test files (currently empty)
│   ├── /components
│   ├── /integration
│   └── /utils
├── middleware.js             # Route protection, auth redirects
├── next.config.mjs           # Next.js configuration
├── tailwind.config.js        # Tailwind + DaisyUI theming
├── jsconfig.json             # Path aliases (@/*)
├── eslint.config.mjs         # ESLint configuration
├── postcss.config.js         # PostCSS configuration
└── package.json              # Dependencies and scripts
```

---

## 4. AUTHENTICATION & USER ROLES

### Authentication Flow
1. **Supabase Auth** - Manages user signup/login
2. **Middleware** - Protects routes and redirects based on auth status
3. **ProfileContext** - Provides user data globally across the app

### User Types & Roles
```javascript
User Types (userTypes):
- 'parent': Parents registering children
- 'member': Administrative staff (أعضاء جمعية)
- 'volunteer': Volunteers (متطوعون)
- 'donor': Financial supporters (مانحون)
- 'follower': Public followers (متابعون)

Member Ranks (memberRanks):
- 'president': جمعية رئيس (President)
- 'vice_president': نائب رئيس (Vice President)
- 'office_manager': مدير مكتب (Office Manager)
- 'secretary': أمين سر (Secretary)
- 'monetary_manager': مدير مالي (Treasurer)
- 'member': عضو (Regular Member)

Offices (offices):
- 'activity': مكتب الأنشطة (Activities)
- 'media': المكتب الإعلامي (Media)
- 'scientific': المكتب العلمي (Scientific)
- 'logistic': المكتب اللوجستي (Logistics)

Achievement Levels (levelDefinitions):
- 'new': جديد (🌱)
- 'promising': واعد (✨)
- 'distinguished': متميز (⭐)
- 'star': نجم قدوة (🌟)
- 'ideal': قدوة مثالية (👑)
```

### Route Protection
- `/admin` - Admin-only (middleware checks role === 'admin')
- `/dashboard, /settings, /profile` - Login required
- `/login, /` - Redirect authenticated users to `/dashboard`

---

## 5. DATABASE SCHEMA (Supabase)

### Core Tables (inferred from code)
```
activities
├── id (uuid/primary)
├── title
├── short_description
├── description
├── image_url
├── activity_date
├── start_time
├── end_time
├── is_upcoming (boolean, updated by updateActivityStatuses)
├── created_at
└── (likely) created_by (foreign key to users)

activity_photos
├── id (uuid)
├── activity_id (foreign key to activities)
├── image_url
├── caption
└── created_at

children
├── id
├── parent_id (foreign key, deleted with parent)
└── (likely) name, birth_date, etc.

profiles
├── id (foreign key to auth.users)
├── role (admin, member, etc.)
├── level (new, promising, distinguished, etc.)
├── (likely) name, email, phone, bio, avatar_url
└── (likely) created_at, updated_at

likes
├── id
├── user_id
├── activity_id
└── (likely) created_at

notifications
├── id
├── user_id
├── message
├── is_read (boolean)
└── created_at

attendance (implied)
├── id
├── user_id
├── activity_id
└── (likely) attended (boolean)

member_ranks (possible)
├── user_id
├── rank (president, vice_president, etc.)
└── office (if rank is office_manager)
```

---

## 6. KEY COMPONENTS

### Core Components
- **Navbar.js** - Navigation bar with auth state
- **Footer.js** - Footer with links and social media
- **NotificationBell.js** - Real-time notification indicator
- **ChildProfileModal.js** - Modal for displaying/editing child profiles
- **ActivityPhotoManager.js** - Upload and manage activity photos
- **AttendanceManager.js** - Mark/track attendance for activities
- **ImageEditorModal.js** - Image cropping and editing
- **PhotoLightbox.js** - Image gallery viewer

### Custom Hooks
- `useProfile()` - Access ProfileContext (user, profile, loading, updateProfile, refreshProfile)

### Context Providers
- **ProfileProvider** - Wraps app in layout.js, manages authentication state
  - Provides: `user`, `profile`, `loading`, `updateProfile()`, `refreshProfile()`

---

## 7. API ROUTES & ENDPOINTS

### Authentication Endpoints (Supabase managed)
- `POST /login` - User login (handled by client SDK)
- `POST /signup` - User registration (handled by client SDK)
- `POST /reset-password` - Password reset request

### Custom API Routes (Next.js)

#### Account Management
- **POST /api/account/delete**
  - Deletes user account with all related data
  - Requires: password, confirmText === "حذف حسابي"
  - Cascade deletes: children, attendance records, etc.
  - Runtime: edge

#### Notifications
- **GET /api/notifications**
  - Fetch user's notifications (50 most recent)
  - Returns: { notifications: [...] }
  - Runtime: edge

- **PATCH /api/notifications**
  - Mark notification(s) as read
  - Payload: { notificationId?, markAllAsRead? }
  - Runtime: edge

#### Telegram Integration
- **POST /api/telegram/send** (if configured)
  - Send notifications via Telegram webhook

---

## 8. MIDDLEWARE & ROUTE PROTECTION

**File:** `middleware.js`

**Protection Logic:**
1. **Admin Routes** (`/admin/*`)
   - Must be authenticated
   - Profile.role must === 'admin'
   - Else redirect to `/dashboard`

2. **Protected User Routes** (`/dashboard, /settings, /profile`)
   - Must be authenticated
   - Else redirect to `/login`

3. **Auth Redirect** (`/, /login`)
   - If authenticated, redirect to `/dashboard`

**Matcher:** Configured to only run on protected paths to minimize overhead

---

## 9. STYLING & THEMING

### Tailwind + DaisyUI Configuration
```javascript
// tailwind.config.js
Theme: qudwaTheme
- primary: #1281c3 (Light Blue)
- secondary: #1599d3 (Sky Blue)
- accent: #1268b1 (Dark Blue)
- neutral: #0c4a6e (Navy)
- base-100: #f0f9ff (Very Light Blue)
- base-200: #e0f2fe (Light Blue)
- base-300: #bae6fd (Lighter Blue)
- info: #3abff8
- success: #36d399
- warning: #fbbd23
- error: #f87272

Custom Fonts:
- sans: Tajawal (Arabic, Google Fonts)
- slogan: FS_Future (local @font-face)
- nastaliq: Noto Nastaliq Urdu (Google Fonts)

Custom Utilities:
- borderRadius.box: 1.5rem
- backgroundImage.leaf-pattern: SVG patterns
```

### CSS Order (BEM-like with Utility Classes)
- Use DaisyUI components as base
- Override with Tailwind utilities
- Use framer-motion for animations
- Prefer `rounded-xl` and `rounded-box` over custom values

---

## 10. STATE MANAGEMENT

### Context API (ProfileContext)
- **Scope:** Global user auth state
- **Updates:** Automatic on auth state changes (via Supabase listener)
- **Usage:** `useProfile()` hook in any component

### Local Component State
- Activity likes/engagement: useState + toggles
- Modal open/close states
- Image cropping state
- Form input validation

### Server-Side Fetching
- Use Supabase client on initial load
- Update context after data mutations

---

## 11. FIREBASE INTEGRATION

**File:** `app/firebase.js`

**Purpose:** Push notifications via Firebase Cloud Messaging (FCM)

**Configuration:**
```javascript
- Project ID: qudwaassoc-99d7b
- VAPID Key: BJ37XENtEYAoJmkfMpdrAMMNBUj9SvTevUzj_jIsWpZfcZNX2Ug73y_xokS59dYlaJ-CGQPmBsVzR56ny8smVC0
```

**Key Functions:**
- `requestNotificationPermission()` - Prompts user, gets FCM token
- `messaging` - Firebase messaging instance (browser only)

**Service Worker:** `public/firebase-messaging-sw.js` - Handles push notifications in background

---

## 12. IMPORTANT UTILITY FUNCTIONS

### Activity Helpers (`app/utils/activityHelpers.js`)
- **`updateActivityStatuses(supabase)`**
  - Marks past activities as non-upcoming
  - Throttled to once per 5 minutes (sessionStorage)
  - Called on dashboard/landing page load
  - Handles end_time, start_time with 2-hour default

### Constants (`app/utils/constants.js`)
- All labels in Arabic: userTypeLabels, rankLabels, officeLabels, levelDefinitions
- Helper: `getLevelDef(levelId)` - Get level definitions by ID

### Image Utils (`app/utils/imageUtils.js`)
- Image cropping, compression, optimization
- Handles upload to Supabase storage

---

## 13. NEXT.JS CONFIGURATION

**`next.config.mjs`:**
```
- output: NOT set (removed to enable API routes)
- images: optimized with webp/avif formats
- imageSizes & deviceSizes: configured for responsive images
```

**Environment Variables (Required):**
```
NEXT_PUBLIC_SUPABASE_URL={your_supabase_url}
NEXT_PUBLIC_SUPABASE_ANON_KEY={your_supabase_anon_key}
SUPABASE_SERVICE_ROLE_KEY={service_role_for_admin_operations}
NEXT_PUBLIC_FIREBASE_CONFIG={if_using_notifications}
```

---

## 14. CONVENTIONS & PATTERNS TO FOLLOW

### File Naming
- Components: PascalCase (e.g., `ActivityPhotoManager.js`)
- Utils: camelCase (e.g., `activityHelpers.js`)
- Pages: lowercase (e.g., `/dashboard`, `/profile`)
- API routes: lowercase with descriptive names (e.g., `/api/account/delete`)

### Component Structure
```javascript
'use client' // Add if using hooks/state
import dependencies
import { useContext, useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'

export default function ComponentName() {
  const supabase = createClient()
  const [state, setState] = useState(initialValue)
  
  useEffect(() => {
    // async operations
  }, [dependencies])
  
  const handler = async () => { /* logic */ }
  
  return (
    <MainElement className="base-styles">
      {/* JSX */}
    </MainElement>
  )
}
```

### Error Handling
- Use `try-catch` for async operations
- Fallback to `.catch()` for Promise chains
- Display errors via `toast.error()` (react-hot-toast)
- Log to console in development

### Data Fetching
- Use Supabase client methods: `.from('table').select()/.insert()/.update()/.delete()`
- Handle `{ data, error }` destructuring
- Check `error` before assuming success
- Use `.maybeSingle()` for optional single results
- Use `.single()` for guaranteed single results (throw error if multiple)

### Styling Approach
1. Use DaisyUI components (`btn`, `modal`, `card`, etc.)
2. Layer with Tailwind utilities for customization
3. Use responsive classes: `max-sm:`, `md:`, `lg:`, etc.
4. Keep dark mode considerations (DaisyUI supports auto)
5. Use CSS variables for consistent spacing/sizing

### Authentication Pattern
```javascript
const { data: { user } } = await supabase.auth.getUser()
if (!user) return { error: 'Unauthorized' } // API routes
if (!user) navigate('/login') // Client components
```

### API Route Pattern (Edge Runtime)
```javascript
export const runtime = 'edge'

export async function POST(request) {
  const supabase = createClient() // or createAdminClient for service role ops
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  
  // Validation logic
  if (!body.requiredField) return NextResponse.json({ error: 'Missing field' }, { status: 400 })
  
  // Database operation with admin client if needed
  // const supabaseAdmin = createAdminClient(...)
  
  return NextResponse.json({ success: true, data: result })
}
```

---

## 15. WHAT TO AVOID

### ❌ Anti-Patterns & Prohibited Actions

1. **Don't Export Static Files in JSON Form**
   - Never use `output: 'export'` - it breaks API routes
   - We need API routes for `/api/notifications`, `/api/account/delete`, etc.

2. **Don't Use Old Auth Methods**
   - ~~`supabase.auth.signUp()`~~ → Use modern Supabase Auth UI
   - ~~Manual JWT handling~~ → Let Supabase handle cookies/auth

3. **Don't Create Unprotected Admin Routes**
   - Always check `user.role === 'admin'` in middleware & API
   - Never trust client-side role checks alone

4. **Don't Recreate ProfileContext Redundantly**
   - Use `useProfile()` hook if available
   - Don't fetch user data multiple times in different components

5. **Don't Ignore SQL Foreign Key Cascades**
   - Account deletion must delete children, activities, etc. in correct order
   - Check / test cascade behavior before modifying schema

6. **Don't Mix Image Optimization Approaches**
   - Use Next.js Image component or sharp util
   - Don't save full-resolution images to Supabase storage
   - Always compress before upload

7. **Don't Skip Error Boundaries**
   - Always check `{ error }` after Supabase calls
   - Display meaningful error messages to users (in Arabic)
   - Log technical details to console, not UI

8. **Don't Hard-Code Environment Variables**
   - Use `process.env.NEXT_PUBLIC_*` for client-side secrets
   - Use `process.env.*` (server-only) for private keys
   - `.env.local` should never be committed

9. **Don't Make Unnecessary Database Calls**
   - Implement throttling (see `activityHelpers.js`)
   - Cache data in React state when appropriate
   - Use `.maybeSingle()` instead of error handling for optional records

10. **Don't Forget Arabic/RTL Considerations**
    - All user-facing strings must be in Arabic
    - Test RTL rendering with daisyui themes
    - Use appropriate fonts from Google Fonts (Tajawal, Noto Nastaliq)

11. **Don't Deploy Without Testing Authentication**
    - Test all protected routes redirect correctly
    - Test admin role gates
    - Test logout and session expiry

12. **Don't Break Existing Components**
    - Before modifying shared components, check usages
    - Run tests (when added)
    - Update siblings if interface changes

---

## 16. COMMON TASKS & WORKFLOWS

### Add a New Page
1. Create `/app/newpage/page.js`
2. Add route to middleware matcher if protected
3. Add navigation link in Navbar
4. Test authentication redirect (if protected)

### Add a New API Endpoint
1. Create `/app/api/resource/action/route.js`
2. Set `export const runtime = 'edge'`
3. Check user auth: `const { data: { user } } = await supabase.auth.getUser()`
4. Validate request payload
5. Return `NextResponse.json({ ... })`
6. Add error handling with proper status codes

### Add a Database Table
1. Create table in Supabase dashboard
2. Document foreign keys and indexes
3. Update Supabase schema file (if exists)
4. Add type definitions if using TypeScript

### Update User Profile Data
1. Use `updateProfile()` from ProfileContext to update local state
2. Call `refreshProfile()` after server-side changes
3. Listen for changes with Supabase realtime subscriptions (if needed)

### Add a New Component
1. Create file in `/app/components/ComponentName.js`
2. Start with `'use client'` if using hooks
3. Import dependencies (icons, hooks, utilities)
4. Export default function with clear prop types (JSDoc preferred)
5. Use DaisyUI + Tailwind for styling

### Handle Image Uploads
1. User selects image in component
2. Use ImageEditorModal for cropping
3. Compress with `imageUtils.js`
4. Upload to Supabase storage via API or direct upload
5. Store URL in database table
6. Display with `<Image>` component

### Send Notifications
1. Get user's FCM token via `requestNotificationPermission()`
2. Store token in profiles table
3. Call backend/third-party service to send via Firebase
4. Update `notifications` table for in-app display
5. Can also send Telegram via `/api/telegram` (if configured)

---

## 17. TESTING GUIDELINES

**Current Status:** No test files exist yet (`/__tests__/` is empty)

**When Adding Tests:**
- Use Jest (Next.js default)
- Test API routes in `/api` with integration tests
- Mock Supabase client
- Test authentication flows thoroughly
- Test component render and user interactions
- Organize tests in `/__tests__` mirroring `/app` structure

---

## 18. DEPLOYMENT & ENVIRONMENT

**Platform:** Cloudflare Pages  
**Build Command:** `npm run pages:build` (uses @cloudflare/next-on-pages)  
**Dev Command:** `npm run dev`  
**Build Output:** `.next` directory  

**Environment Setup:**
- Copy `.env.local.example` to `.env.local`
- Add Supabase URL, keys, Firebase config
- Add service role key (server-side only)
- Do not commit real credentials

**Health Checks:**
- Verify middleware intercepts auth correctly
- Test admin panel access restrictions
- Confirm push notifications work (Firebase setup)
- Test image uploads and display

---

## 19. CRITICAL INFORMATION FOR AI AGENTS

### What This Project Does
This is a **community platform** for a non-profit organization to:
- Manage and showcase activities/events
- Track member participation
- Gamify engagement (achievement levels)
- Share photos and updates
- Handle donations
- Manage organizational hierarchy (admin, members, volunteers)

### Key Business Rules
1. **Activities** transition from "upcoming" to "past" based on date/time (automatic throttled update)
2. **Users** have hierarchical roles (president → members → followers)
3. **Parents** can register children and see their attendance
4. **Volunteers** can join activities and track hours
5. **Admins** manage everything via `/admin` panel
6. **Account Deletion** is permanent and cascades to remove all associated data

### Must-Have Features (Don't Remove)
- Authentication with Supabase
- Role-based route protection
- Activity management (CRUD)
- Photo management and gallery
- User notifications (in-app + Firebase)
- Admin panel for management
- Responsive mobile-first UI
- Arabic-first language support

### Performance Considerations
- Activity status updates throttled to 5-min intervals
- Use `maybeSingle()` to avoid unnecessary error handling
- Load images optimized through Next.js Image component
- Cache frequently accessed data (profiles, constants)
- Keep API route runtime as 'edge' for zero cold start

### Security Requirements
- Never log credentials
- Always validate user role server-side (not client-side)
- Sanitize user input from forms
- Use Supabase Row-Level Security (RLS) policies
- Service role key must stay server-side only
- CORS properly configured for API routes

---

## 20. QUICK REFERENCE: KEY FILES TO CHECK

| Purpose | File |
|---------|------|
| Add routes | `middleware.js` |
| Add styles | `tailwind.config.js` |
| Add constants | `app/utils/constants.js` |
| User state | `app/context/ProfileContext.js` |
| Database/auth | `app/utils/supabase/client.js` & `server.js` |
| Global config | `app/layout.js` |
| API patterns | `app/api/account/delete/route.js` |
| Component example | `app/components/Navbar.js` |
| Environment vars | `.env.local` (create locally) |
| Build config | `next.config.mjs` |

---

## 21. RELATED RESOURCES & DOCUMENTATION

- **Supabase Docs:** https://supabase.com/docs
- **Next.js App Router:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **DaisyUI:** https://daisyui.com/docs
- **Firebase Messaging:** https://firebase.google.com/docs/messaging/webpush
- **Framer Motion:** https://www.framer.com/motion/
- **React Icons:** https://react-icons.github.io/react-icons

---

**Last Updated:** April 4, 2026  
**Version:** 1.0  
**Maintained By:** AI Agent Support Documentation
