# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

MedTracker is a React-based web application for medication tracking with gamification features. It's built with TypeScript, Vite, TailwindCSS, and uses IndexedDB for client-side data persistence.

## Development Commands

### Core Development
```bash
yarn dev          # Start development server on port 3000
yarn build        # Build for production (TypeScript compilation + Vite build)
yarn preview      # Preview production build
yarn lint         # Run ESLint with TypeScript extensions
```

### Package Management
This project uses **yarn** as the package manager (per user preference).

## Architecture Overview

### Technology Stack
- **Frontend**: React 19, TypeScript, TailwindCSS
- **Build Tool**: Vite with React plugin
- **Storage**: IndexedDB (browser-based database)
- **Styling**: TailwindCSS with custom design tokens

### Code Structure

**Core Architecture Pattern**: Service-Repository-Model pattern with local IndexedDB persistence

```
src/
├── components/          # React components
├── models/             # Business logic models (MedicationModel, UserStatsModel)
├── services/           # Business services (AchievementService, NotificationService, etc.)
├── repositories/       # Data access layer (MedicationRepository)
├── types/             # TypeScript type definitions
└── App.tsx            # Main application component
```

### Key Architectural Decisions

1. **IndexedDBService**: Centralized singleton service managing all browser database operations
2. **Model Classes**: Business logic encapsulation (e.g., `MedicationModel` with methods like `isTimeForDose()`, `calculateAdherenceRate()`)
3. **Gamification System**: Achievement-based system with XP, levels, and streak tracking
4. **Type Safety**: Comprehensive TypeScript interfaces for all data structures

### Data Models

**Primary Entities**:
- `User`: Core user account with email, name, and timezone
- `UserProfile`: Extended user information (bio, emergency contacts, medical info)
- `UserPreferences`: User settings (theme, notifications, dashboard layout)
- `UserSession`: Session management for authentication
- `Medication`: Core medication tracking with dosing schedules (user-associated)
- `MedicationLog`: Individual dose-taking records (user-associated)
- `UserStats`: Gamification data (level, XP, streaks, adherence)
- `Achievement`: Unlockable achievements with requirement criteria

### Path Aliases
- `@/*` maps to `./src/*` (configured in both vite.config.ts and tsconfig.json)

### Styling System
- Custom TailwindCSS theme with primary/success/warning/error color palettes
- Custom CSS classes in `App.css` for cards, buttons, and animations
- Responsive grid layouts using TailwindCSS utilities

### Database Schema
IndexedDB stores: users, user_profiles, user_preferences, user_sessions, medications, medication_logs, user_stats, achievements, settings, medication_conversations, chat_messages
- All entities use UUID primary keys
- User-associated data includes userId foreign keys
- Indexed fields for efficient queries (email, userId, isActive, scheduledTime, conversationId, etc.)
- Session management with expiration and device tracking
- Chat data includes conversation metadata and message history

### Gamification Features
- Level progression based on XP earned from taking medications
- Streak tracking for consecutive days
- Achievement system with various unlock criteria
- Adherence rate calculation over configurable periods

### AI Chat Features
- Medication-specific conversations using Google's Gemini 2.0 Flash API
- Context-aware responses based on medication details (name, dosage, frequency, notes)
- Persistent chat history stored in IndexedDB
- Rate limiting and request deduplication to manage API costs
- Comprehensive error handling for network issues and API failures
- Medical safety guidelines built into AI prompts

## Development Patterns

### User Authentication
Simplified demo authentication system:
- Local-only authentication (no backend required)
- Session management with IndexedDB persistence
- UserService singleton manages current user state
- Session restoration on app initialization

### State Management
Currently uses React's built-in state with UserService for user context. No external state management library implemented yet.

### Error Handling
Database operations use try-catch with promisified IndexedDB requests in `IndexedDBService`.

### Date Handling
Medications use time strings ("08:00", "12:00") for scheduling. Date objects for logs and timestamps.
User timezone support for accurate medication scheduling.

## File Conventions

- TypeScript files use `.ts` extension for utilities, `.tsx` for React components
- Models contain business logic methods, not just data structures
- Services handle cross-cutting concerns (notifications, achievements)
- Repositories abstract data access patterns

## Browser Compatibility

Built for modern browsers supporting:
- IndexedDB
- ES2020+ features
- CSS Grid and Flexbox