# Sheggar Wheels — Project Boundaries

## 1. In Scope

This frontend capstone includes:

- A public homepage and car catalogue.
- Car search, filtering, sorting, and browsing.
- Car detail pages.
- Demo renter and owner sign-up/sign-in flows.
- Owner car listing creation, editing, and deletion.
- Booking forms and booking confirmation.
- Admin dashboard and booking status management.
- Browser-based demo data persistence.
- Responsive interface and car images.
- Project documentation and production-build verification.

## 2. Out of Scope

The current demo does not provide:

- A production database or cross-device data synchronization.
- Real payment processing or payment credentials.
- Verified user identities.
- Production-grade authentication or authorization.
- Real-time vehicle availability guarantees.
- Live GPS vehicle tracking.
- Automated email or SMS notifications.
- Legally binding rental agreements.
- Production deployment monitoring.

## 3. Data and Security Boundaries

Sample cars are defined in project code. User-created cars, accounts, and bookings use browser storage.

Browser storage can be edited by the user and is limited to the current browser profile and origin. Client-side role checks are for demonstration only and must not be treated as security controls.

Passwords, secret keys, payment card details, and other sensitive credentials must not be stored in browser storage.

## 4. External Services

Car images may use external image providers. Loading these images requires an internet connection and may fail if the external provider is unavailable.

## 5. Future Production Requirements

A production version would need a backend API, shared database, secure server-side sessions, server-enforced permissions, booking conflict prevention, validated payments, privacy controls, and appropriate testing.
