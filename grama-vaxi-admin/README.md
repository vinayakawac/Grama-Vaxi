# Grama-Vaxi Admin Dashboard

The Grama-Vaxi Admin Dashboard is a high-performance web platform designed for veterinary officers and regional health administrators. It provides a centralized interface for monitoring livestock health trends, managing disease outbreaks, and coordinating vaccination logistics across multiple villages.

---

## Key Functional Modules

### 1. Dashboard Analytics
*   **Real-time Statistics**: Monitor total animal registrations, pending disease reports, and regional vaccination coverage.
*   **Visual Data**: Interactive charts showing vaccination trends and geographic distribution of livestock.
*   **Activity Feed**: Live updates on recent farmer registrations and reported symptoms.

### 2. Camp Alert Management
*   **Broadcast System**: Create and send vaccination camp alerts to specific villages.
*   **FCM Integration**: Direct integration with Firebase Cloud Messaging to send push notifications to farmers' mobile devices.
*   **History & Acknowledgement**: Track previously sent alerts and monitor farmer acknowledgement rates.

### 3. Disease Report Management
*   **Incoming Feed**: A paginated, filterable list of all disease reports submitted via the mobile app.
*   **Severity Assessment**: Visual indicators for critical vs. standard reports.
*   **Review Workflow**: Mark reports as reviewed and coordinate medical response.

### 4. Animal Database
*   **Comprehensive Registry**: View and manage the complete database of registered livestock.
*   **Detail Management**: Update animal records, breed information, and vaccination dates through a streamlined interface.
*   **Search & Filter**: Advanced filtering by species, village, and vaccination status.

---

## Technical Architecture

*   **Framework**: Next.js 14+ (App Router)
*   **Styling**: Tailwind CSS v4 with custom Grama-Vaxi theme
*   **UI Components**: shadcn/ui (Radix UI primitives)
*   **State Management**: Zustand
*   **Data Handling**: TanStack Table (Data Grids) & Recharts (Analytics)
*   **Backend Integration**:
    *   **Firebase Admin SDK**: Secure server-side access to Firestore and FCM.
    *   **Firebase Client SDK**: Phone OTP sign-in flow in admin login.
    *   **Next.js API Routes**: Direct server-side camp alert dispatch without Cloud Functions.

---

## Directory Structure

*   `app/`: Next.js App Router pages and API routes.
*   `components/`: Reusable React components (UI elements, layout, module-specific forms).
*   `lib/`: Core logic including Firebase initialization and Firestore query helpers.
*   `store/`: Zustand state definitions for global filters and application state.
*   `types/`: TypeScript interface definitions for the shared data model.

---

## Configuration

The application requires the following environment variables in `.env.local`:

*   `NEXT_PUBLIC_FIREBASE_*`: Client-side Firebase configuration.
*   `FIREBASE_ADMIN_PROJECT_ID`: Service account credentials for Admin SDK.
*   `FIREBASE_ADMIN_CLIENT_EMAIL`: Service account credentials for Admin SDK.
*   `FIREBASE_ADMIN_PRIVATE_KEY`: Service account credentials for Admin SDK.

## Notification Flow

1. Admin creates a camp alert from `/dashboard/camps`.
2. API writes a `camps` document and immediately sends FCM multicast to recipients from `notificationTokens`.
3. API writes per-user `alerts` docs and updates dispatch counters (`deliveredCount`, `failedCount`).
4. Invalid device tokens are auto-disabled.

## Security Notes

*   Admin routes require a verified Firebase session cookie (`firebase-session`).
*   Session cookies are created only after OTP login and admin role validation.
*   Firestore rules now permit owner-scoped writes to `users/{uid}` and `notificationTokens/{id}` while preserving admin-only access elsewhere.

---

## Deployment

1.  Install dependencies: `npm install`
2.  Run development server: `npm run dev`
3.  Build for production: `npm run build`
