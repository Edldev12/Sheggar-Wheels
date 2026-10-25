# Sheggar Wheels — Future Improvements

## 1. Overview

Sheggar Wheels is currently a frontend capstone demonstration. This document describes proposed improvements for evolving it into a more reliable, secure, and maintainable car-rental marketplace.

The items below are future plans, not claims about existing functionality. Each improvement should be implemented and tested before being described as complete.

## 2. Backend and Database

### Planned improvements

- Build a backend API for vehicles, accounts, bookings, and user profiles.
- Introduce a shared database for persistent records across users and devices.
- Define database schemas, relationships, constraints, and migration procedures.
- Validate incoming requests on the server.
- Prevent conflicting bookings for the same vehicle and rental period.
- Add appropriate backups, recovery procedures, and data-retention policies.
- Handle concurrent requests and failed operations reliably.

### Completion criteria

- Authorized users can access and update the appropriate records through the API.
- Booking conflicts are rejected by server-side rules.
- Data remains available across supported devices and sessions.
- Backup and recovery procedures are tested.

## 3. Authentication and Security

### Planned improvements

- Replace browser-only demo authentication with production authentication.
- Hash passwords using an established password-hashing algorithm.
- Enforce roles, permissions, and listing ownership on the server.
- Use secure session cookies and appropriate CSRF protections.
- Add rate limiting, security logging, and account recovery.
- Protect personal information, credentials, and application secrets.
- Validate authorization on every protected server operation.

### Completion criteria

- Unauthenticated users cannot access protected operations.
- Users cannot access or modify another owner's restricted records.
- Invalid role changes and unauthorized requests are rejected by the server.
- Security controls are tested before production release.

## 4. Booking and Payments

### Planned improvements

- Implement server-side availability checks and booking-conflict prevention.
- Define booking status transitions and cancellation policies.
- Integrate a reputable payment provider, beginning with its test environment.
- Support appropriate receipts, refunds, and payment-status tracking.
- Send booking confirmations and reminders through email or SMS.
- Provide clear rental terms and agreement workflows.
- Keep booking completion separate from payment verification.

### Completion criteria

- Conflicting reservations are prevented.
- Payment status is verified through trusted server-side provider responses.
- Failed, cancelled, and refunded transactions are handled consistently.
- Booking and payment records can be reconciled.

Real payments should not be enabled until the relevant security, legal, operational, and testing requirements are satisfied.

## 5. Vehicle Listings and Discovery

### Planned improvements

- Support multiple vehicle photos and optimized image delivery.
- Introduce listing approval and moderation where needed.
- Improve search using location, availability, vehicle features, and price ranges.
- Add owner profiles, ratings, and renter reviews.
- Validate vehicle details and ownership where appropriate.
- Improve listing management and availability updates.

### Completion criteria

- Listings are validated before publication.
- Owners can manage only their permitted listings.
- Search and filtering return consistent results.
- Listing images and unavailable vehicles are handled gracefully.

## 6. Maps and Location

### Planned improvements

- Add accurate pickup and drop-off locations.
- Integrate a suitable mapping provider.
- Validate location data and handle unavailable map services.
- Provide clear privacy controls for location information.
- Introduce live tracking only if the product requires it and appropriate consent and safeguards are in place.

### Completion criteria

- Displayed locations correspond to the intended pickup and drop-off points.
- Location data is protected against unauthorized access.
- Any tracking functionality follows appropriate consent, privacy, and retention requirements.

## 7. User Experience and Accessibility

### Planned improvements

- Improve mobile responsiveness and page-loading performance.
- Test keyboard navigation, focus visibility, color contrast, form labels, and screen-reader support.
- Improve empty, loading, success, and error states.
- Provide clear booking, confirmation, and cancellation feedback.
- Improve form validation messages and recovery from user errors.
- Maintain consistent layouts and accessible interaction patterns.

### Completion criteria

- Main user flows are usable on supported screen sizes.
- Forms and interactive controls support keyboard use.
- Important actions provide clear feedback.
- Accessibility issues found during testing are documented and addressed.

## 8. Testing and Operations

### Planned improvements

- Add unit tests for validation and business rules.
- Add integration tests for APIs and data access.
- Add end-to-end tests for registration, listing management, booking, and administration.
- Automate linting, tests, and production-build checks.
- Monitor production errors and service availability.
- Measure performance with Lighthouse and real-user data where available.
- Document deployment, recovery, maintenance, and incident-response procedures.

### Completion criteria

- Critical user journeys have repeatable automated tests.
- Deployment checks identify relevant build and test failures.
- Performance measurements are recorded from actual test runs.
- Recovery and maintenance procedures are documented and tested.

## 9. Prioritized Roadmap

| Priority | Improvement | Reason |
|---|---|---|
| 1 | Shared backend and database | Establishes reliable shared data |
| 2 | Server-side authentication and authorization | Protects accounts, listings, and bookings |
| 3 | Booking validation and conflict prevention | Reduces inconsistent or overlapping reservations |
| 4 | Automated testing and deployment checks | Helps prevent regressions |
| 5 | Secure payment integration and notifications | Supports a complete rental workflow |
| 6 | Enhanced maps, reviews, and analytics | Expands functionality after core controls are established |

This priority order is a proposed development plan, not a statement that any item has already been completed.

## 10. Release Readiness

Before the application is used with real customers, review the following:

- Server-side security and data validation.
- Database reliability, backup, and recovery.
- Booking conflict prevention and cancellation handling.
- Payment security and transaction verification, if applicable.
- Privacy, data retention, and applicable legal requirements.
- Automated testing and production monitoring.
- Accessibility, performance, and deployment verification.

The project should move toward production only when the relevant requirements have been implemented, tested, and documented.