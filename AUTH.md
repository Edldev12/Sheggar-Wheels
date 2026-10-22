# Sheggar Wheels — Authentication and Authorization

## 1. Overview

Sheggar Wheels uses a demo authentication flow for its frontend capstone. Users can sign up or sign in and select a renter or owner role. A demo administrator account is also available.

This implementation is intended for learning and demonstration, not production authentication.

## 2. Demo Session

The application stores the active demo session in browser `sessionStorage` using the key:

`sheggar-session`

The session contains basic demo account information, such as the account ID, name, email, and role.

The session is browser-specific and is generally cleared when the browser session ends.

## 3. Demo Accounts

Regular demo accounts are created through the application's sign-up flow. The application also provides a demo administrator sign-in using:

`admin@sheggarwheels.demo`

This email is for demonstration only. The application must not be treated as verifying a real user's identity.

## 4. Roles

### Renter
- Browse available cars.
- View car details.
- Submit demo booking requests.
- View booking confirmation.

### Owner
- Create car listings.
- Edit and delete their demo listings.
- View owner dashboard information and related bookings, where implemented.

### Administrator
- View the admin dashboard.
- Review demo bookings.
- Change booking statuses, where implemented.

## 5. Authorization Limitations

Role checks currently run in the frontend. Browser storage can be modified by a user, so these checks do not provide secure authorization.

A production application must validate the user's identity and permissions on the server for every protected operation.

## 6. Security Recommendations

A production implementation should include:

- Secure server-side authentication.
- Hashed passwords using an established password-hashing algorithm.
- Server-enforced role and ownership checks.
- Secure, appropriately configured session cookies.
- Input validation and protection against common web attacks.
- Rate limiting and appropriate audit logging.
- No storage of passwords, secrets, or payment credentials in browser storage.

## 7. Data Privacy

Only use fictional or non-sensitive information in this demo. Browser-stored data is not encrypted by the application and should not be considered confidential.
