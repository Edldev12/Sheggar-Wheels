# Sheggar Wheels — Data Management

## 1. Overview

Sheggar Wheels is a frontend capstone demonstration for a car-rental platform. It uses static sample data and browser storage rather than a shared backend database.

The application manages demo car listings, account records, the active demo session, and booking records. Data is stored locally in the user's browser, so it is not automatically shared across devices or users.

## 2. Data Sources and Storage

### 2.1 Static Sample Cars

Sample vehicle listings are defined in the project, including information such as:

- Car ID, name, and category
- Price and rental specifications
- Description and pickup location
- Image references and other display information

Sample cars are the initial catalogue data. Owner-created listings may be stored separately in browser storage.

### 2.2 localStorage

The application uses `localStorage` to persist demo records across page reloads for the same browser profile and website origin.

| Storage key | Purpose |
|---|---|
| `sheggar-cars` | Owner-created car listings |
| `sheggar-bookings` | Demo booking records |
| `sheggar-accounts` | Demo account records |

The stored data is controlled by the browser and can be inspected, edited, or deleted by the user. These records are not a shared database.

### 2.3 sessionStorage

The application uses the following key for the active demo session:

| Storage key | Purpose |
|---|---|
| `sheggar-session` | Current signed-in demo account information and role |

Session data is stored in the browser tab's session storage. It is not a secure server-managed session and must not be treated as proof of identity for production authorization.

Storage keys and their exact data structures should be checked against the current source code whenever the implementation changes.

## 3. Main Data Entities

### 3.1 Car

A car listing may contain an ID, name, category, rental price, specifications, description, location, and image references.

Owner-created listings may also contain an `ownerId` or `ownerEmail` to associate the listing with its owner.

Sample listings and owner-created listings may follow different data paths. Catalogue loading should account for both where the implementation supports them.

### 3.2 Account

A demo account may contain an ID, name, email, and role. The role is used by the frontend to display the appropriate demo experience, such as renter, owner, or administrator features.

Account and session data are browser-side demo data, not independently verified identity records.

### 3.3 Booking

A booking record may include a booking ID, car ID, pickup date, return date, booking total, creation date, and status.

The demo booking statuses are:

- `Pending`
- `Confirmed`
- `Completed`
- `Cancelled`

A booking should be associated with its selected car through `carId`. Owner-specific booking views should determine ownership from the owner's car listings rather than trusting ownership information supplied by a booking record.

A `Completed` booking represents a demo workflow status. It does not prove that payment was received or verified.

## 4. Data Lifecycle

The intended demonstration workflow is:

1. Sample cars are loaded from project data.
2. Owners create or manage listings through the owner interface, where supported.
3. Owner-created listings are saved in `localStorage` and made available to the catalogue.
4. Renters select a car and submit a booking request.
5. Booking records are stored in `localStorage`.
6. Administrators review demo bookings and update their statuses through the administration interface.
7. Owner booking and earnings views use the owner's listings and associated bookings to calculate demo summaries.

The exact behavior of each step should be verified against the current implementation and tested after relevant code changes.

## 5. Persistence and Data Isolation

- `localStorage` persists data across page reloads for the same browser profile and website origin until the data is cleared or changed.
- `sessionStorage` is scoped to the browser tab's session and is cleared when that session ends.
- Data does not automatically synchronize across devices, different browsers, or different website origins.
- Clearing browser storage may remove accounts, listings, bookings, or session information.
- Browser storage does not provide database transactions, centralized backups, or reliable multi-user synchronization.

Because the application does not use a shared backend database, records created on one device should not be expected to appear on another.

## 6. Validation and Error Handling

Data should be validated before it is saved or used in calculations.

Important validation requirements include:

- Check required fields and expected data types.
- Ensure prices and booking totals are finite, non-negative numbers.
- Validate pickup and return dates and require the return date to be later than the pickup date.
- Ensure a booking references a valid car.
- Check booking status transitions before updating records.
- Verify the current demo role and relevant ownership before protected frontend actions.
- Handle missing, malformed, or unexpected browser-storage data without crashing the application.
- Avoid treating client-side validation as a replacement for server-side validation.

These are the expected validation requirements. Their implementation and test results must be confirmed against the current code rather than assumed from this document.

## 7. Privacy and Security

Browser storage is accessible to client-side JavaScript and can be modified by the user. It must not be treated as a secure location for sensitive information.

The demo should use fictional account and booking data. Do not store real passwords, API secrets, payment-card details, or other sensitive information in browser storage.

Client-side role checks and ownership checks can improve the demonstration's user experience, but they do not provide production-grade security. A production application must validate identity, permissions, ownership, and data changes on the server.

## 8. Recovery and Maintenance

For local demonstration data:

- Avoid clearing browser storage if demo records need to be preserved.
- Keep source-controlled sample data available so the initial catalogue can be restored.
- Test the application with missing or malformed storage values.
- Confirm that updated data structures remain compatible with previously stored demo records.
- Do not assume locally stored records can be recovered after browser data is deleted.

A production implementation should provide appropriate backup and recovery procedures.

## 9. Future Improvements

A production version should introduce:

1. A shared database with defined schemas and relationships.
2. Backend API endpoints for accounts, cars, and bookings.
3. Server-side authentication, authorization, and ownership checks.
4. Consistent input validation and booking-status transition rules.
5. Reliable handling of concurrent updates and duplicate requests.
6. Database backups, recovery procedures, audit logs, and data-retention policies.
7. Appropriate privacy controls and protection of personal information.
8. Automated tests for data validation, ownership restrictions, booking workflows, and failure cases.

These improvements are future work unless they are explicitly implemented and verified in the current project.