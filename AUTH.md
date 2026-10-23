# Sheggar Wheels — Authentication and Authorization

## 1. Overview

Sheggar Wheels uses a demo authentication flow for its frontend capstone. Users can sign up or sign in and use renter or owner roles. A demo administrator account is also provided.

This implementation is intended for learning and demonstration, not production authentication.

## 2. Demo Session

The application stores the active demo session in browser `sessionStorage` using the key:

`sheggar-session`

The stored session contains basic demo account information, such as the account ID, name, email, and role.

The session is specific to the browser tab's session-storage context. It is not a secure, server-managed authentication session.

## 3. Demo Accounts

Regular demo accounts are created through the application's sign-up flow. The documented demo administrator email is:

`admin@sheggarwheels.demo`

This email is for demonstration only. The application must not be treated as verifying a real user's identity.

## 4. Roles

### Renter

- Browse cars.
- View car details.
- Submit demo booking requests.
- View booking confirmation.

### Owner

- Create car listings.
- Edit and delete demo listings, subject to the implemented behavior.
- View owner dashboard information and related bookings, where implemented.

### Administrator

- View the admin dashboard.
- Review demo bookings.
- Change booking statuses, where implemented.

## 5. Authorization Limitations

Role checks currently run in the frontend. Browser storage can be modified by a user, so these checks do not provide secure authorization.

A production application must validate user identity, permissions, and resource ownership on the server for every protected operation.

## 6. Security Recommendations

A production implementation should include:

- Secure server-side authentication.
- Password hashing with an established password-hashing algorithm.
- Server-enforced role and resource-ownership checks.
- Securely configured session cookies.
- Input validation and protection against common web attacks.
- Rate limiting and appropriate audit logging.
- No storage of passwords, secrets, or payment credentials in browser storage.

## 7. Data Privacy

Use only fictional or non-sensitive information in this demo. Browser-stored data is not encrypted by the application and should not be considered confidential.
