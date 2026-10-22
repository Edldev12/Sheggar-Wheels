# Sheggar Wheels — Implementation Strategy

## 1. Project Overview

Sheggar Wheels is a frontend car-rental marketplace demo focused on helping renters discover cars and owners manage car listings. Administrators can review bookings and manage booking statuses.

## 2. Technology Stack

- Next.js and React
- JavaScript
- Tailwind CSS v4
- Browser localStorage for persistent demo data
- Browser sessionStorage for the active demo session
- Next.js Image component for car images

## 3. Implementation Approach

The project is developed incrementally:

1. Build the main layout and navigation.
2. Create the car catalogue with search, filtering, and sorting.
3. Implement car details and booking forms.
4. Add renter and owner session flows.
5. Implement owner car listing management.
6. Connect owner-created cars to the public catalogue and booking flow.
7. Add admin dashboard and booking status controls.
8. Verify production builds and document limitations.

## 4. Data Strategy

The application uses static sample car data and browser storage for demo-created data. No production database or real payment gateway is used. Data stored in a browser is specific to that browser profile and origin.

## 5. Testing Strategy

- Test navigation and catalogue filters.
- Create an owner account and add a car.
- Confirm the owner-created car appears in the catalogue.
- Submit a booking and verify its confirmation.
- Test admin booking status changes.
- Run `npm run build` before deployment.
- Verify the deployed application and its main user flows.

## 6. Known Limitations

This is a frontend capstone demonstration. Browser storage and client-side role checks are not suitable for securing a production marketplace. A future production version should use server-side authentication, authorization, shared persistent storage, and a secure payment provider.
