# Sheggar Wheels — Authentication and Authorization

## 1. Overview

Sheggar Wheels uses a demo authentication flow for its frontend capstone. Users can sign up and sign in with renter or owner roles. A demo administrator account is also provided.

This implementation is intended for learning and demonstration, not production authentication.

## 2. Demo Session

The application stores the active demo session in browser `sessionStorage` using the key:

`sheggar-session`

The stored session contains basic demo account information, such as the account ID, name, email, and role.

Session storage is available to JavaScript running on the same origin and is not a secure, server-managed authentication session. It must not be used to protect sensitive production resources.

## 3. Demo Accounts

Regular demo accounts are created through the application's sign-up flow.

The documented demo administrator email is:

`admin@sheggarwheels.demo`

This email is for demonstration only. The application's demo sign-in flow must not be treated as verifying a real user's identity.

## 4. Roles and Permissions

### Renter

- Browse sample and owner-created car listings.
- View car details and rental prices.
- Submit demo booking requests.
- View booking confirmations.

### Owner

- Create car listings.
- Edit and delete demo listings, where implemented.
- View the owner dashboard.
- Review bookings associated with the owner's cars.
- View earnings reports calculated from completed bookings.

### Administrator

- View the admin dashboard.
- Review demo bookings.
- Confirm eligible pending bookings.
- Mark confirmed bookings as completed.
- Cancel eligible pending or confirmed bookings.

These permissions are enforced through frontend demo checks. They are not secure server-side authorization controls.

## 5. Ownership Checks

Owner-related pages identify the owner's cars using the stored owner ID or matching owner email.

Owner booking and earnings reports should include only bookings whose `carId` matches a car owned by the current demo owner.

Booking status updates in the owner interface should verify that the selected booking belongs to one of the owner's cars and that the requested status transition is allowed.

These checks improve the consistency of the demo but cannot prevent a user from manipulating browser storage or client-side code.

## 6. Booking Status Transitions

The admin booking interface supports these transitions:

| Current status | Allowed next statuses |
|---|---|
| Pending | Confirmed, Cancelled |
| Confirmed | Completed, Cancelled |
| Completed | No further transition |
| Cancelled | No further transition |

The frontend validates these transitions before updating browser-stored booking data. A production backend must enforce the same rules independently.

## 7. Authorization Test Plan

Run these tests in the browser using the appropriate demo accounts.

| Test | Expected result |
|---|---|
| Renter opens `/admin/bookings` | Admin access is refused |
| Owner opens `/admin/bookings` | Admin access is refused |
| Unauthenticated user opens an owner dashboard page | Redirected to sign-in |
| Owner opens their earnings page | Only bookings linked to their cars are included |
| Admin confirms a pending booking | Status becomes Confirmed |
| Admin marks a confirmed booking completed | Status becomes Completed |
| Admin attempts an invalid status transition | Update is refused |

Record the actual results after performing each test. Do not mark a test as passed until it has been verified.

## 8. Production Security Requirements

A production implementation should include:

- Server-side authentication and identity verification.
- Password hashing using an established password-hashing algorithm.
- Server-enforced role and resource-ownership checks.
- Securely configured session cookies.
- Server-side validation of booking status transitions.
- Input validation and protection against common web attacks.
- Rate limiting and appropriate audit logging.
- No storage of passwords, secrets, or payment credentials in browser storage.
- Authorization checks on every protected server operation.

## 9. Data Privacy

Use only fictional or non-sensitive information in this demo. Browser-stored data is not encrypted by the application and should not be considered confidential.

## 10. Known Limitations

- Authentication and authorization are simulated in the frontend.
- Session and account information can be modified by the browser user.
- There is no shared backend database.
- Data does not automatically synchronize across devices.
- No real payment processing or verified payment records exist.

These limitations are documented to distinguish the capstone demonstration from a production-ready car-rental platform.
