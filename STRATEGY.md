# Sheggar Wheels — Implementation Strategy

## 1. Project Overview

Sheggar Wheels is a frontend car-rental marketplace developed as an IBT capstone project.

The application demonstrates three main user roles:

- **Renter:** Browse available cars, view vehicle details, and submit demo booking requests.
- **Owner:** Manage car listings and review bookings associated with their vehicles, where implemented.
- **Administrator:** Review demo bookings and manage booking statuses.

The project focuses on demonstrating frontend development, navigation, user interactions, data handling, and role-specific interfaces. It is not a production-ready rental or payment platform.

## 2. Technology Stack

The project uses the following technologies:

- **Next.js 16:** Application framework, routing, and rendering.
- **React:** Component-based user interface.
- **JavaScript:** Application logic and interactions.
- **Tailwind CSS v4:** Styling and responsive layouts.
- **localStorage:** Persistence for demo accounts, owner-created cars, and bookings.
- **sessionStorage:** Active browser-side demo session.
- **Next.js Image:** Image rendering where used in the application.

The project uses static sample data alongside browser storage. It does not currently rely on a shared production database or real payment processing.

## 3. Implementation Approach

Development follows an incremental approach, building and checking features in manageable stages.

1. Establish the application structure, shared layout, and navigation.
2. Build the car catalogue with search, filtering, sorting, and vehicle information.
3. Implement car detail pages and the demo booking workflow.
4. Add account registration, sign-in, and browser-side session handling.
5. Develop owner-facing car listing management.
6. Connect owner-created listings to the catalogue and booking workflow where supported.
7. Develop administrative booking management and status transitions.
8. Add owner booking and earnings views where implemented.
9. Improve responsive layouts, accessibility, image handling, and user feedback.
10. Run lint and production-build checks, test important workflows, and document limitations.

Each stage should be checked before moving to the next. Existing routes and data structures should be preserved unless a change is necessary and tested.

## 4. Rendering and Routing Strategy

Next.js routing organizes the application into pages for the main catalogue, car details, booking flows, account access, owner features, and administration.

Rendering methods should be selected according to the needs of each page:

- Use static project data for sample content that does not require live updates.
- Use client-side components for browser interactions and features that depend on browser storage.
- Use server rendering or other Next.js rendering strategies only where appropriate and supported by the implementation.
- Avoid accessing browser-only APIs such as `localStorage` or `sessionStorage` during server rendering.
- Provide appropriate loading, empty, error, and access-denied states where needed.

The actual rendering strategy for each route should be verified against the source code rather than inferred from the use of Next.js alone.

## 5. Data Strategy

The application combines static sample car data with browser-stored demo data.

Known storage keys include:

| Storage key | Purpose |
|---|---|
| `sheggar-accounts` | Demo account records |
| `sheggar-cars` | Owner-created car listings |
| `sheggar-bookings` | Demo booking records |
| `sheggar-session` | Active browser-side demo session, stored in `sessionStorage` |

Browser storage is scoped to the relevant browser profile, session, and website origin. Data is not automatically synchronized across devices or browsers.

Booking totals and statuses represent demo records, not verified financial transactions. See `DATA.md` for data handling, validation, persistence, and recovery details.

## 6. Authentication and Authorization Strategy

The current project demonstrates account flows and role-specific access using browser-side session data and frontend checks.

These checks help demonstrate the expected user experience but are not secure server-side authorization. Users can inspect or modify browser data, so the current approach must not be used to protect sensitive production operations.

The authentication and authorization design, role permissions, ownership rules, and limitations are documented in `AUTH.md`.

A production implementation must authenticate users and enforce permissions, ownership, and booking-status rules on the server.

## 7. Testing Strategy

Testing should cover both the main user journeys and important failure cases.

### Functional testing

- Verify navigation and car catalogue search, filtering, and sorting.
- Open car detail pages and check vehicle information.
- Register a demo account and test the sign-in flow.
- Create an owner listing and confirm its catalogue behavior.
- Submit a demo booking and verify the resulting booking record and confirmation.
- Test administrative booking-status changes and permitted transitions.
- Verify that owner views display only bookings associated with the owner's cars.
- Test invalid dates, missing fields, invalid values, and unexpected storage data.
- Check access restrictions for renter, owner, administrator, and signed-out demo sessions.

### Code and deployment checks

Run the available project checks:

```bash
npm run lint
npm run build
```

Confirm that the commands complete successfully before treating the checks as passed. Then test the deployed application, including its main routes, navigation, booking flow, and role-specific interfaces.

Record the test date, environment, expected result, actual result, and outcome for important tests. A planned test must not be reported as passed until it has actually been performed.

## 8. Performance and Accessibility

Performance and accessibility should be considered throughout development.

- Use optimized image handling where appropriate.
- Avoid unnecessary client-side JavaScript and repeated data processing.
- Provide visible keyboard focus and accessible form labels.
- Ensure interactive controls are usable with a keyboard.
- Use responsive layouts and sufficiently large touch targets.
- Provide clear feedback for loading, empty, successful, and failed actions.
- Measure performance using appropriate tools and document actual results in `PERF.md`.

Performance scores and accessibility compliance should be reported only after testing the relevant build or deployment.

## 9. Known Limitations

The current demonstration has important limitations:

- Browser storage is not a shared database.
- Client-side authentication and role checks are not production-grade security.
- Demo records may be changed or deleted by the user.
- Data does not automatically synchronize between devices.
- Completed bookings do not establish that a payment was received.
- Real payment processing and production booking infrastructure are not provided.

Any feature not implemented and verified should be treated as planned work rather than an existing capability.

## 10. Future Improvements

A future production version should prioritize:

1. Server-side authentication and authorization.
2. A shared database and backend API.
3. Server-side validation and enforcement of booking rules.
4. Reliable ownership checks for cars and bookings.
5. Secure payment-provider integration, if required.
6. Automated tests for critical workflows and security boundaries.
7. Appropriate logging, backup, recovery, and data-retention policies.
8. Further performance, accessibility, and usability improvements.

These improvements should be introduced incrementally, with security and data integrity established before the application is used for real customers or transactions.