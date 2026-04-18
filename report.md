# Project Audit Report

Date: 2026-04-16
Scope: Full repository audit (`app`, API routes, middleware, auth/profile flows, config, build/lint tooling, secrets handling)

## Executive Summary

This project is functionally rich and builds successfully, but it has several **critical security and reliability risks** that should be addressed before production hardening. The highest-risk items are secret exposure, unauthenticated messaging endpoint abuse, and server-client misuse in API auth helpers.

I ranked issues from most important to least important below.

---

## Ranked Issues (Most Important → Least Important)

## 1) CRITICAL — Committed secrets in `.env.local`
- **Evidence:** `.env.local:4`, `.env.local:7`
- **What’s wrong:** Real credentials/tokens are present in versioned project files, including `TELEGRAM_BOT_TOKEN` and `SUPABASE_SERVICE_ROLE_KEY`.
- **Impact:** Full compromise risk (service-role DB operations, external API abuse, data exfiltration, impersonation).
- **Fix:**
  - Immediately rotate exposed secrets (Supabase service role + Telegram bot token).
  - Purge leaked secrets from git history.
  - Keep only `.env.example` in repo.

## 2) CRITICAL — Public `/api/telegram` endpoint lacks server-side auth/rate-limit
- **Evidence:** `app/api/telegram/route.js:21` (no user/session validation), `app/contact/page.js:95` (client-only gate)
- **What’s wrong:** Endpoint accepts arbitrary POSTs from anyone. UI check in `contact/page.js` is bypassable.
- **Impact:** Spam/abuse, operational disruption, potential reputation damage, token exhaustion.
- **Fix:**
  - Enforce authentication in route handler (validate Supabase user server-side).
  - Add IP/user rate limiting server-side.
  - Validate payload schema strictly.

## 3) HIGH — Server Supabase helper is async but API routes call it sync
- **Evidence:** `app/utils/supabase/server.js:4` (`async function createClient`), called without await in:
  - `app/api/account/delete/route.js:9`
  - `app/api/notifications/route.js:7`
  - `app/api/notifications/route.js:29`
  - `app/api/notifications/send/route.js:6`
- **What’s wrong:** Routes treat returned Promise as a Supabase client object.
- **Impact:** Runtime crashes or undefined behavior in auth/data calls under API traffic.
- **Fix:** Use `const supabase = await createClient();` in all server route handlers, or make helper non-async if compatible.

## 4) HIGH — Signup profile persistence likely fails for new users
- **Evidence:** `app/login/page.js:657-660`
- **What’s wrong:** After sign-up, profile write uses `.update(...).eq('id', profileData.id)` rather than insert/upsert for first-time rows.
- **Impact:** New users may have missing `profiles` rows, breaking role checks, UI assumptions, admin/user workflows.
- **Fix:** Use `upsert` with PK conflict target or fallback `insert` when no row exists.

## 5) HIGH — Account deletion route runs as Edge while using service-role admin actions
- **Evidence:** `app/api/account/delete/route.js:5` (`runtime='edge'`) + admin service usage at `:45-49`, `:113`
- **What’s wrong:** Sensitive admin operations in Edge increase deployment/runtime compatibility risk and secret handling complexity.
- **Impact:** Potential runtime failures or environment mismatches across providers; hard-to-debug auth/admin failures.
- **Fix:** Prefer Node runtime for service-role/admin auth flows.

## 6) HIGH — Lint pipeline is broken
- **Evidence:** `package.json:10` (`"lint": "next lint"`) and execution output:
  - `npm run lint` fails with “Invalid project directory provided ... /qudwa/lint”
- **What’s wrong:** Current lint command is not valid in current setup/version.
- **Impact:** No enforceable static quality gate in CI/dev.
- **Fix:** Migrate to direct ESLint CLI (e.g., `eslint .`) with current Next.js-compatible config.

## 7) MEDIUM — Toolchain/version skew (Next 16 + eslint-config-next 14)
- **Evidence:** `package.json:19`, `package.json:33`
- **What’s wrong:** Core framework and lint config major versions are misaligned.
- **Impact:** Undefined lint behavior, config incompatibilities, future upgrade friction.
- **Fix:** Align `eslint-config-next` to framework major version.

## 8) MEDIUM — Build warning: incorrect workspace root due multiple lockfiles
- **Evidence:** `npm run build` output (selected root `/Users/mac/package-lock.json`, additional lockfile in project)
- **What’s wrong:** Next/Turbopack infers root outside repo.
- **Impact:** Potentially wrong caching/resolution behavior in some environments.
- **Fix:** Set explicit `turbopack.root` or remove unrelated lockfile from ancestor path.

## 9) MEDIUM — Deprecated middleware convention still in use
- **Evidence:** Build warning + `middleware.js` exists at repository root
- **What’s wrong:** Next warns middleware convention is deprecated in current version.
- **Impact:** Future compatibility risk and migration debt.
- **Fix:** Migrate to new proxy convention per Next docs.

## 10) MEDIUM — `markAllAsRead` in UI ignores API failure and mutates local state optimistically
- **Evidence:** `app/notifications/page.js:37-44`, `app/components/NotificationBell.js:129-138`
- **What’s wrong:** UI marks all read regardless of server success.
- **Impact:** State divergence (UI says read while DB remains unread).
- **Fix:** Check `response.ok`; rollback/refetch on failure.

## 11) LOW — Unused imports / dead references indicate code hygiene drift
- **Evidence examples:**
  - `app/notifications/page.js:7` imports `FaTrash` unused
  - `app/activities/page.js:4` imports `useRouter` and defines `router` but not used
  - `app/gallery/page.js:4` imports `useRouter` and defines `router` but not used
- **Impact:** Noise, harder maintenance, weaker code clarity.
- **Fix:** Remove unused symbols and enforce lint rules once lint pipeline is fixed.

## 12) LOW — Client-side object URL lifecycle not fully cleaned in image editor flows
- **Evidence:** `app/components/ImageEditorModal.js:57-59`, `app/profile/page.js:231`
- **What’s wrong:** Object URLs are created for previews without robust cleanup on all lifecycle paths.
- **Impact:** Minor memory leaks in long sessions / repeated edits.
- **Fix:** Revoke previous object URLs in cleanup effects.

---

## Additional Observations

- `npm run build` passes successfully and all routes compile.
- Project has strong UI implementation depth and broad feature coverage.
- Security posture is currently the primary blocker (secrets + unauthenticated external messaging path).

---

## Recommended Fix Order

1. Rotate/revoke exposed secrets and remove from git history.
2. Lock down `/api/telegram` with server auth + rate limiting.
3. Fix server Supabase helper usage (`await createClient()` in API routes).
4. Fix signup profile creation reliability (`update` → `upsert/insert`).
5. Repair lint script and align Next/eslint package versions.
6. Handle build warnings (workspace root, middleware migration).

---

## Validation Performed

- Repository structure and route/component audit.
- Static review of auth, profile, admin, notifications, contact, and media flows.
- `npm run build` executed successfully with warnings.
- `npm run lint` executed and currently fails due script/tooling mismatch.
