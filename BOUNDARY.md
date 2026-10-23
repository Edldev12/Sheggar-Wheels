# Sheggar Wheels — Project Boundaries

## 1. In Scope

This frontend capstone includes:

- A public homepage and car catalogue.
- Car search, filtering, sorting, and browsing.
- Car detail pages.
- Demo renter and owner sign-up and sign-in flows.
- Owner car-listing creation, editing, and deletion.
- Booking forms and booking confirmation.
- An admin dashboard and booking-status management.
- Browser-based demo data persistence.
- A responsive interface and car images.
- Project documentation and production-build verification.

These items describe the intended project scope. Individual features should be tested to confirm their behavior.

## 2. Out of Scope

The current demo does not provide:

- A production database or cross-device data synchronization.
- Real payment processing.
- Verified user identities.
- Production-grade authentication or authorization.
- Guaranteed real-time vehicle availability.
- Live GPS vehicle tracking.
- Automated email or SMS notifications.
- Legally binding rental agreements.
- Production deployment monitoring.

## 3. Data and Security Boundaries

Sample cars are defined in project code. User-created cars, demo accounts, and bookings use browser storage.

`localStorage` data is associated with the browser profile and website origin. The active demo session uses `sessionStorage`. These storage mechanisms do not provide shared, server-managed application data.

Browser storage can be inspected or modified by the user. Client-side role checks are for demonstration purposes and must not be treated as security controls.

Do not store real passwords, secret keys, payment-card details, or other sensitive credentials in browser storage.

## 4. External Services

Car images may use external image providers. Loading externally hosted images requires an internet connection and may fail if the provider is unavailable or the image URL is invalid.

## 5. Future Production Requirements

A production version would need a backend API, shared database, secure server-managed authentication, server-enforced permissions, booking-conflict prevention, validated payment integration, privacy controls, and appropriate security and functional testing.
