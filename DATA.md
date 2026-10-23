# Sheggar Wheels — Data Management

## 1. Overview

Sheggar Wheels is a frontend capstone demonstration. It uses static sample data and browser storage instead of a shared backend database.

## 2. Data Sources

### Static Sample Cars

Sample vehicle listings are defined in the project. They may include car names, prices, specifications, descriptions, locations, and image references.

### localStorage

The application uses browser `localStorage` for demo data that persists across page reloads.

Known storage keys include:

- `sheggar-cars` — owner-created car listings.
- `sheggar-bookings` — booking records.
- `sheggar-accounts` — demo account records.

These keys should be checked against the implementation when the application changes.

### sessionStorage

The application uses browser `sessionStorage` for the active demo session:

- `sheggar-session` — current signed-in demo account and role.

This is browser-side session data, not a secure server-managed session.

## 3. Data Lifecycle

The intended demo workflow is:

1. Sample cars are loaded from project code.
2. Owners create or edit listings through the owner dashboard.
3. Owner-created listings are saved in browser storage and displayed in the catalogue.
4. Renters select a car and submit a booking request.
5. Booking records are saved in browser storage.
6. Administrators review demo bookings and update their statuses.

Individual steps should be tested against the current implementation.

## 4. Persistence and Isolation

`localStorage` data persists across page reloads for the same browser profile and website origin until it is cleared or changed.

`sessionStorage` is scoped to the browser tab's session.

Data does not automatically synchronize between devices, different browsers, or different origins. Clearing browser storage can remove demo records.

## 5. Data Validation

The application should validate required fields and numeric values before saving. Booking dates should be valid, and the return date should be later than the pickup date. Prices and totals should be calculated consistently.

Malformed or missing browser-storage data should be handled gracefully wherever possible.

These are validation requirements; their implementation and test results must be verified separately.

## 6. Privacy and Security

Browser storage is controlled by the browser and can be inspected or modified by the user. Do not store real passwords, API secrets, payment-card details, or other sensitive information in it.

This storage approach is for demonstration only and is not a replacement for a secure database or server-side validation.

## 7. Future Improvements

A production implementation should use a shared database and backend API, with schema validation, access controls, backups, auditability, and defined data-retention policies.
