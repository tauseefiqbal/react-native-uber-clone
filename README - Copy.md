# Uber Ride Booking App

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [Test and Admin Users Credentials](#test-and-admin-users-credentials)
- [How to Use App for Regular User](#how-to-use-app-for-regular-user)
- [How to Use App for Admin User](#how-to-use-app-for-admin-user)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Install and Run](#install-and-run)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)

## Features

- ✅ Create an account with email verification or sign in with Clerk.
- ✅ Search for a destination using Google Places autocomplete.
- ✅ View the current location and ride route on a map.
- ✅ Choose from available drivers and review fare, pickup time, rating, and seats.
- ✅ Pay for a ride using Stripe.
- ✅ View recent rides and the full ride history.
- ✅ View account profile details and sign out.

## Tech Stack

- **Mobile and web app:** React Native, Expo SDK 51, Expo Router, TypeScript
- **Styling:** NativeWind and Tailwind CSS
- **Authentication:** Clerk Expo
- **Database and API:** Neon Serverless Postgres with Expo Router API routes
- **Maps and places:** `react-native-maps`, Google Places Autocomplete, Maps Directions, Geoapify static maps
- **Payments:** Stripe React Native SDK and Stripe server SDK
- **State management:** Zustand

## Deployment

**App live URL:** (APP URL)

The live URL has not been configured in this repository. Replace `(APP URL)` with the deployed app URL when available. Mobile builds also require the platform-specific Expo/EAS deployment configuration and valid service credentials.

## Test and Admin Users Credentials

- **Test user:** No shared test account credentials are configured in this repository. Create an account in the app or use a test account configured in the Clerk dashboard for this deployment.
- **Admin user:** No admin credentials, roles, or admin interface are present in the current app.

Do not commit real passwords, API keys, or payment credentials to this README or source control.

## How to Use App for Regular User

1. Create an account with your name, email, and password, then enter the email verification code. Alternatively, sign in with an existing account.
2. Grant location permission when prompted so the app can show your current location.
3. Search for a destination from the home screen. Adjust the pickup and destination locations if needed, then select **Find Now**.
4. Review the available drivers and ride details, select a ride, and continue to booking.
5. Review the fare and route, then complete payment through Stripe.
6. Open **Rides** to review previous bookings or **Profile** to view your account details. Sign out from the home screen.

## How to Use App for Admin User

There is currently no admin workflow in this app. The available screens and API routes support rider account and ride-booking flows only. An admin console, admin authorization, and admin credentials must be added and configured separately before admin tasks can be performed.

## Getting Started

### Prerequisites

- Node.js and npm
- Expo-compatible development environment (Expo Go or native iOS/Android tooling as appropriate)
- Clerk, Neon, Stripe, Google Places/Maps, and Geoapify accounts and credentials for the features you intend to run

### Environment Variables

Create a `.env` file at the project root and configure the values below. Keep secret values private. Expo variables prefixed with `EXPO_PUBLIC_` are bundled into the client app and must not contain secrets.

| Variable                             | Used for                              |
| ------------------------------------ | ------------------------------------- |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`  | Clerk authentication in the app       |
| `DATABASE_URL`                       | Neon database access in API routes    |
| `STRIPE_SECRET_KEY`                  | Stripe server-side payment API routes |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client-side payment setup      |
| `EXPO_PUBLIC_PLACES_API_KEY`         | Google Places autocomplete            |
| `EXPO_PUBLIC_DIRECTIONS_API_KEY`     | Map directions                        |
| `EXPO_PUBLIC_GEOAPIFY_API_KEY`       | Ride history static map images        |

Configure Clerk, Stripe, map API restrictions, and the Neon database schema for your environment before expecting the related flows to work. Never expose `DATABASE_URL` or `STRIPE_SECRET_KEY` as public client variables.

### Install and Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add the required environment variables to `.env`.
3. Start the Expo development server:

   ```bash
   npm start
   ```

4. Use the Expo CLI prompts to open the app on a device, emulator, or web browser. Platform features such as native maps and Stripe may require a development build and may not be fully available on web.

## Available Scripts

| Command                 | Description                            |
| ----------------------- | -------------------------------------- |
| `npm start`             | Start the Expo development server      |
| `npm run android`       | Start Expo and open the Android target |
| `npm run ios`           | Start Expo and open the iOS target     |
| `npm run web`           | Start Expo for web                     |
| `npm run lint`          | Run Expo lint                          |
| `npm test`              | Run Jest in watch mode                 |
| `npm run reset-project` | Run the project reset script           |

## Project Structure

- `app/` — Expo Router screens, layouts, and API routes
- `components/` — Reusable UI components, maps, and payment UI
- `constants/` — Shared app constants and assets
- `lib/` — Authentication, API fetch, mapping, and utility helpers
- `store/` — Zustand application state
- `types/` — Shared TypeScript types
- `assets/` — Fonts, icons, and images

## API Routes

- `POST /(api)/user` — Create or register a user record
- `GET /(api)/driver` — Retrieve available drivers
- `GET /(api)/ride/:id` — Retrieve rides for a user
- `POST /(api)/ride/create` — Create a ride record
- `POST /(api)/stripe/create` — Create a Stripe payment intent
- `POST /(api)/stripe/pay` — Handle the payment flow
