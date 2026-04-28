# GEMINI.md - Kiosk Link Project Mandates

## Project Overview
**Kiosk Link** is a specialized STEM lab interactive system for **Drishti RC Jain Innovative Public School**. It bridges a vertical, non-touch kiosk screen with a mobile PWA used by students as a remote controller.

## Core Mandates

### Architecture & Display
- **Vertical First:** The Kiosk interface is strictly vertical (flipped screen). Design all kiosk-facing layouts for a 9:16 aspect ratio (e.g., 1080x1920).
- **Non-Touch Kiosk:** The physical kiosk has no touch input. All interaction MUST happen through the Mobile PWA or via automatic state updates from Supabase.
- **Mobile PWA:** The primary input device. Must support Camera (for "Master of the Day" profile pictures) and Microphone (for AI Voice Chat).

### AI & Brain
- **OpenAI Integration:** Use OpenAI API for the AI Assistant's reasoning and conversation.
- **Visual Persona:** The AI should have a visually appealing, animated persona on the Kiosk screen to make the STEM lab feel "alive".

### Gamification: Master of the Day
- **Daily Question:** A new STEM-related question is posted daily.
- **Criteria:** The first student to answer correctly via the PWA becomes the "Master of the Day".
- **Display:** The winner's profile picture and name are prominently displayed on the Kiosk for the entire next day.
- **Scope:** Classes 2 to 10, sections A and B. Questions must be age-appropriate based on the student's registered class.

### Tech Stack
- **Frontend:** React + Vite + TypeScript.
- **Styling:** Tailwind CSS (Modern, sleek, STEM-themed).
- **Backend/Realtime:** Supabase (Auth, Database, Storage for photos, Realtime for Kiosk updates).

## Development Workflow
- **Kiosk View:** Located at `/kiosk`.
- **Mobile/Student View:** Located at `/`.
- **Validation:** Test the PWA's camera/mic access thoroughly. Ensure Realtime subscriptions update the Kiosk view immediately when a new "Master" is crowned.
