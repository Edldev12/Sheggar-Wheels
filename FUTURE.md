# Sheggar Wheels — Future Improvements

## 1. Overview

Sheggar Wheels is currently a frontend capstone demonstration. The following items are proposed improvements for evolving it into a reliable, secure car-rental marketplace. They are future plans, not claims about existing functionality.

## 2. Backend and Database

- Build a backend API for cars, accounts, bookings, and user profiles.
- Use a shared database for persistent records.
- Validate requests on the server.
- Prevent conflicting bookings for the same vehicle and rental dates.
- Add backups, migrations, and data-retention policies.

## 3. Authentication and Security

- Replace demo sign-in with production authentication.
- Hash passwords using an established password-hashing algorithm.
- Enforce roles and listing ownership on the server.
- Use secure session cookies and appropriate CSRF protections.
- Add rate limiting, audit logs, and account recovery.
- Protect personal information and secrets.

## 4. Booking and Payments

- Add server-side availability checks.
- Introduce a secure payment provider in a test environment before any production launch.
- Support booking cancellation policies, refunds, and receipts.
- Send booking confirmations and reminders through email or SMS.
- Provide clear rental terms and agreement workflows.

## 5. Vehicle Listings

- Support multiple vehicle photos.
- Add listing approval and moderation.
- Improve search with location, availability, vehicle features, and price ranges.
- Add owner profiles, ratings, and renter reviews.
- Validate vehicle information and ownership where appropriate.

## 6. Maps and Location

- Add accurate pickup and drop-off locations.
- Integrate a mapping provider with clear privacy controls.
- If live tracking is introduced, obtain appropriate consent and secure location data.

## 7. User Experience and Accessibility

- Improve mobile responsiveness and loading performance.
- Test keyboard navigation, color contrast, labels, and screen-reader support.
- Improve empty states, loading states, and error messages.
- Add clear confirmation and cancellation feedback.

## 8. Testing and Operations

- Add unit tests and end-to-end tests for important user flows.
- Add automated linting and production-build checks.
- Monitor production errors and availability.
- Measure performance using actual Lighthouse and field data.
- Document deployment, recovery, and maintenance procedures.

## 9. Suggested Priority

1. Shared backend and database.
2. Server-enforced authentication and authorization.
3. Reliable booking and availability validation.
4. Automated tests and deployment checks.
5. Secure payments and notifications.
6. Enhanced maps, reviews, and analytics.
