# Kiosk Link — Drishti STEM Lab Companion

Kiosk Link is the always-on **STEM Lab kiosk** for Drishti RC Jain Innovative Public School. A large screen in the lab loops the daily challenge and the "Master of the Day"; students join from their phones to answer the question, view lesson carousels, chat with an AI tutor, and submit photo answers.

**Live:** deployed on Vercel · Shares the ZeroAI STEM Suite Supabase project (same `students` table as ZaiSim / ZaiBlock / ZeroSpark / ZaiPy).

---

## Two Views

| Route | Audience | Purpose |
|---|---|---|
| `/` | Lab display (big screen) | Live clock, the day's question, Master of the Day photo + name, kiosk URL for students to scan |
| `/join` | Students on their phone | Sign in via the shared `students` table, answer the daily question, view lessons, chat with the AI tutor, upload their photo |

A single deployment serves both — the kiosk PC opens `/` in kiosk mode, students load `/join` on their own device.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Routing | React Router 7 |
| Animation | Framer Motion |
| State | Zustand 5 with `localStorage` persistence for student session |
| Auth | Shared `students` table from the ZeroAI suite — no new student accounts |
| Database | Supabase (same project as ZaiSim / ZaiBlock / ZeroSpark / ZaiPy) |
| Styling | Tailwind CSS |
| Package manager | Bun |

---

## Commands

```bash
bun install        # install dependencies
bun run dev        # dev server → http://localhost:5173
bun run build      # Vite build (MUST pass before every commit)
bun run lint       # ESLint
bun run preview    # serve dist/ locally
```

---

## Environment Variables

Copy `.env.example` → `.env`. Same Supabase project as the rest of the suite.

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Database Setup

Run `supabase/kiosk-link-schema.sql` in the Supabase SQL editor. Idempotent — safe to re-run.

Tables created (all `kiosk_` prefixed to avoid suite conflicts):
- `kiosk_daily_questions` — one question per grade-group per day (junior / middle / senior)
- `kiosk_daily_answers` — student responses, one per student per question
- `kiosk_master_of_day` — featured student + photo for the day
- `kiosk_student_photos` — student avatar uploads

> The kiosk reads students from the shared `students` table (already created by ZaiPy). Zero duplicate registrations.

---

## Architecture

### Data flow

```
KioskView (/)                       StudentApp (/join)
  │                                   │
  ├─ getTodayMaster()                ├─ StudentAuth (login)
  ├─ getTodayQuestion()              ├─ DailyChallenge
  ├─ Live clock                      ├─ LessonsCarousel (PDF-derived,
  └─ Floating orb cycles content     │    12 questions per class,
                                     │    grade-locked)
                                     ├─ AIChat
                                     └─ ProfileTab (photo upload)
        │                                  │
        └──────────────┬───────────────────┘
                       ▼
                  Supabase
                       │
       ┌───────────────┴────────────────┐
       ▼                                ▼
  Shared tables                  Kiosk-specific tables
  (students)                     (kiosk_daily_questions,
                                  kiosk_daily_answers,
                                  kiosk_master_of_day,
                                  kiosk_student_photos)
```

### Session model

Students authenticate using their existing credentials (`students.username` + password) via the shared `student_login` Postgres RPC — no new student accounts in this app. The returned student record is persisted in `localStorage` as `kiosk-link-student` so refresh / lab-shift handoff doesn't lose state.

### Grade-group lessons

Lessons and daily questions are split into three grade groups:

| Group | Classes |
|---|---|
| `junior` | Classes 2–4 |
| `middle` | Classes 5–7 |
| `senior` | Classes 8–10 |

A student's class number maps to a group; they only see their group's content.

---

## Relationship to the STEM Suite

Kiosk Link **is not** one of the four licensed product apps (ZaiSim / ZaiBlock / ZeroSpark / ZaiPy). It's a custom companion app for Drishti's physical STEM lab. It:

- ✅ Shares the same Supabase project, auth, and `students` table
- ✅ Reads daily content from kiosk-specific tables
- ❌ Does **not** consume an entry in `school_apps` — no per-school entitlement gating
- ❌ Is not currently productized for other schools

If you want to license a kiosk experience to another school in future, the cleanest path is to add a `school_id` column to the `kiosk_*` tables and wire in the standard entitlement gate from the four product apps.

---

## Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — auto-deploys to Vercel |

---

## Related repositories

| Repo | Role |
|---|---|
| [zeroai-admin](https://github.com/Lottie128/zeroai-admin) | Admin console for the productized suite |
| [zaisim](https://github.com/Lottie128/zaisim) | Arduino circuit simulator |
| [zaiblock](https://github.com/Lottie128/zaiblock) | Block coding IDE |
| [zerospark](https://github.com/Lottie128/zerospark) | Visual circuit blocks |
| [zaipy](https://github.com/Lottie128/zaipy) | Python IDE |

See [CHANGELOG.md](CHANGELOG.md) for release notes.

---

## License

[MIT](LICENSE) © ZeroAI Technologies Inc.
