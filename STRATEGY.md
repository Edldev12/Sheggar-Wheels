# Sheggar Wheels — Implementation Strategy

## 1. Project Overview

Sheggar Wheels is a frontend car-rental marketplace capstone project. It allows renters to discover cars and submit demo bookings, owners to manage car listings, and administrators to review bookings and manage booking statuses.

## 2. Technology Stack

- Next.js 16
- React
- JavaScript
- Tailwind CSS v4
- Browser `localStorage` and `sessionStorage` for demo data and session-related functionality, where implemented
- Next.js Image component for car images

## 3. Implementation Approach

The project follows an incremental development approach:

1. Build the main layout and navigation.
2. Create the car catalogue with search, filtering, and sorting.
3. Implement car details and booking forms.
4. Add renter and owner account flows.
5. Implement owner car-listing management.
6. Connect owner-created listings to the public catalogue and booking flow.
7. Add administrative booking management and status controls.
8. Run available checks, verify the main user flows, and document known limitations.

## 4. Data Strategy

The application uses static sample car data and browser storage for demo-created data, where implemented. It does not currently provide a shared production database or real payment processing.

Browser-stored data is associated with the relevant browser profile and website origin. It does not automatically synchronize between devices or browsers.

## 5. Testing Strategy

The following checks should be performed before deployment:

- Verify navigation and catalogue search, filters, and sorting.
- Create an owner account and add a car listing.
- Confirm that the owner-created listing appears in the public catalogue.
- Submit a demo booking and verify the confirmation.
- Test administrative booking-status changes.
- Run `npm run lint` and address any relevant errors.
- Run `npm run build` and confirm that the production build succeeds.
- Test the deployed application and its main user flows.

Record actual test results separately; listing a test here does not mean it has passed.

## 6. Known Limitations and Future Improvements

Sheggar Wheels is a frontend capstone demonstration. Browser storage and client-side role checks alone do not provide production-grade security or shared data management.

A future production version should introduce server-side authentication and authorization, shared persistent database storage, server-side validation, and integration with a secure payment provider.
