# Sheggar Wheels — Project Boundaries

## 1. Purpose

Sheggar Wheels is a frontend car-rental marketplace developed as an IBT capstone demonstration. This document defines the project's scope, exclusions, data boundaries, and requirements for future production development.

The project demonstrates frontend workflows. It is not a complete production car-rental service.

## 2. In Scope

The intended project scope includes:

- A public homepage and car catalogue.
- Car search, filtering, sorting, and browsing.
- Car detail pages.
- Demo renter and owner registration and sign-in flows.
- Owner car-listing creation, editing, and deletion.
- Booking forms and booking confirmation.
- An administration interface for reviewing bookings and managing booking statuses.
- Browser-based demo data persistence.
- Responsive layouts and car images.
- Owner booking and earnings views where implemented.
- Project documentation, code-quality checks, and production-build verification.

These items describe the intended scope. Each feature must be tested against the current implementation before it is reported as working.

## 3. Out of Scope

The current frontend demonstration does not provide the following production services:

- A shared production database or automatic cross-device synchronization.
- Real payment processing or payment verification.
- Independently verified user identities.
- Production-grade authentication and server-enforced authorization.
- Guaranteed real-time vehicle availability or booking-conflict prevention.
- Live GPS vehicle tracking.
- Automated email or SMS notifications.
- Legally binding rental agreements or contract management.
- Verified vehicle ownership, insurance, or driver eligibility.
- Production monitoring, incident response, or service-level guarantees.

Any capability not implemented and tested should be treated as unavailable or future work.

## 4. Data and Security Boundaries

### 4.1 Data Storage

Sample cars are defined in project code. Demo accounts, owner-created listings, and bookings use browser storage where implemented.

- `localStorage` stores demo records associated with the browser profile and website origin.
- `sessionStorage` stores the active browser-side demo session.
- Data is not automatically shared between devices, browsers, or different website origins.
- Clearing browser storage can remove locally stored demo records.

See `DATA.md` for the documented storage keys, data lifecycle, validation requirements, and recovery limitations.

### 4.2 Authentication and Authorization

The current demo uses browser-side session data and frontend role checks to demonstrate renter, owner, and administrator workflows.

These checks do not provide secure server-side authorization. Browser storage and client-side code can be inspected or modified by users.

Do not use this implementation to protect real customer information, financial transactions, or other sensitive operations. A production version must verify identity and enforce roles, ownership, and permitted actions on the server.

See `AUTH.md` for authentication and authorization details.

### 4.3 Financial and Booking Boundaries

Booking totals and status values are demo records, not proof of payment or confirmed real-world availability.

A booking marked `Completed` does not establish that a payment was received, a vehicle was rented, or a rental agreement was fulfilled.

Production booking workflows would require server-side validation, conflict prevention, and appropriate payment verification.

## 5. External Services and Dependencies

Car images may be hosted by external image providers. Displaying these images may require an internet connection, and images may fail to load if a URL is invalid or a provider is unavailable.

The application also depends on its installed packages and the supported Node.js environment. Dependency changes and framework updates should be checked with the project's available lint and build commands.

External services must not be assumed to provide availability, uptime, or functionality beyond what has actually been verified.

## 6. Testing and Deployment Boundaries

A successful local build confirms that the project passes the checks performed by that build; it does not prove that every user journey works correctly in production.

Before release, test:

- Main routes and navigation.
- Registration and sign-in flows.
- Car listing creation and catalogue integration.
- Booking submission and confirmation.
- Administrative status transitions.
- Owner-specific booking and earnings views.
- Invalid inputs and unexpected browser-storage data.
- Responsive behavior, keyboard accessibility, and deployed image loading.

Record actual test results and deployment details. Do not describe untested features as verified.

## 7. Future Production Requirements

A production version would require:

1. A backend API and shared persistent database.
2. Secure server-managed authentication and session handling.
3. Server-enforced role, ownership, and permission checks.
4. Server-side validation and booking-conflict prevention.
5. Secure payment-provider integration, if payments are required.
6. Privacy controls, appropriate data retention, and backup and recovery procedures.
7. Automated functional and security testing.
8. Monitoring, logging, error handling, and an incident-response process.

These are future requirements unless they have been explicitly implemented and verified.