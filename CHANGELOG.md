# Changelog

All notable changes to kiosk-link are documented here. Format inspired by [Keep a Changelog](https://keepachangelog.com); versions follow [Semantic Versioning](https://semver.org/).

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
