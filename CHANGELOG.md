# Changelog

All notable changes to kiosk-link are documented here. Format inspired by [Keep a Changelog](https://keepachangelog.com); versions follow [Semantic Versioning](https://semver.org/).

---

## [2.0.0] — 2026-05-12

### Summary
**Kiosk Link joins the productized STEM Suite.** Now licensed per-school via the shared `school_apps` table as a 5th licensable app (`'kiosk'`), with country-aware paywall behaviour matching the rest of the suite.

### Added

**Entitlement gate** on the `/join` student route
- New `src/lib/entitlement.ts` — same shape as the other product apps; AppName extended to include `'kiosk'`
- New `src/components/EntitlementGate.tsx` — reads from kiosk-link's `authStore.student` (custom student model) and looks up the student's school via `classes.school_id`
- KioskView (`/`) remains **public, ungated** — it's a passive lab display with no user session, so no licensing check applies
- Paywall contact is country-aware: school's own contact takes priority, then Philippines → Apple Tutors, then ZeroAI global

**Schema changes** (`migrate-kiosk-into-suite.sql`, lives in the zeroai-admin repo)
- `school_apps.app` CHECK constraint extended to include `'kiosk'`
- `pricing_plans.app` constraint extended to include `'kiosk'`
- `kiosk_daily_questions.school_id` and `kiosk_master_of_day.school_id` columns added with FK to `schools(id)`, indexed
- Drishti is granted the `'kiosk'` app through 2028-01-01
- All existing `kiosk_daily_questions` and `kiosk_master_of_day` rows backfilled to Drishti
- `kiosk_find_students` RPC updated to return `class_id` (needed by the entitlement gate)

**`KioskStudent` interface** now includes `class_id: string` (uuid) — required to resolve the student's school via the gate

### Notes
- Existing students who logged in before this release may need to log out + log back in to pick up the new `class_id` field. The persisted `localStorage` session won't include it
- Multi-school kiosks aren't fully wired yet: `KioskView` still reads global daily questions/master rather than filtering by `school_id`. Future work — the columns are in place

### Security
- Same RLS read posture as the other licensing tables — `school_apps`, `schools`, `classes` need open SELECT policies for the gate to work. Run `URGENT-fix-signin.sql` (in zeroai-admin) if upgrading from an older deploy

---

## [1.0.0] — 2026-05-12

### Summary
First formal release. Production-stable kiosk + student companion app for Drishti's STEM lab. Versioned for the first time alongside the broader ZeroAI STEM Suite v2.0.0 audit.

### Features at this version

**Kiosk view** (`/`)
- Live clock, the day's grade-aware question, and the Master of the Day photo + name
- Floating orb cycles content for visibility from across the lab
- QR / URL display for student devices to load `/join`

**Student companion** (`/join`)
- Sign in via the shared `students` table (no new accounts — re-uses ZaiPy/ZaiSim credentials)
- Daily challenge tied to the student's grade group (junior / middle / senior)
- Lesson carousel: 12 questions per class, grade-locked, PDF-derived
- AI chat for tutor-style help
- Profile tab with photo upload + persistence

**Backend** (`kiosk-link-schema.sql`)
- `kiosk_daily_questions` — one question per grade group per day
- `kiosk_daily_answers` — one answer per student per question
- `kiosk_master_of_day` — featured student record
- `kiosk_student_photos` — uploaded avatars
- All `kiosk_` prefixed to avoid conflicts with shared suite tables

### Recent fixes folded into 1.0.0
- Master of the Day display fixed (correct table name + type)
- Camera permission flow corrected
- Fallback daily questions when none configured
- Photo upload option restored
- Student-search RPC errors now surface in the UI for setup-time debugging

### Notes
- Kiosk Link is a **Drishti-specific** custom build, not one of the four productized SaaS apps. It does not consume a `school_apps` entry and is not entitlement-gated. To license a similar kiosk experience to another school, fork or extend the `kiosk_*` tables with a `school_id` column

### Security
- Uses the suite's `student_login` RPC for authentication
- All `kiosk_*` tables should have RLS enabled with policies appropriate to their use; review the schema file before deploying

---

## [0.0.0] — pre-versioning

Iterative development for Drishti's STEM lab. Pre-versioning era — see git history for detailed commits.
