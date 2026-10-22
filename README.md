# Sheggar Wheels

Sheggar Wheels is a frontend car-rental marketplace capstone project built with Next.js, React, JavaScript, and Tailwind CSS. It demonstrates car discovery, owner listings, demo bookings, and administrative booking management.

## Features

- Browse sample and owner-created car listings.
- Search, filter, and sort cars.
- View car details and rental prices.
- Sign up and sign in using demo accounts.
- Create, edit, and delete owner car listings.
- Submit demo bookings and view booking confirmations.
- View owner and administrator dashboards.
- Manage demo booking statuses.
- Store demo data in the browser.

## Technology Stack

- Next.js
- React
- JavaScript
- Tailwind CSS v4
- Browser `localStorage` and `sessionStorage`
- Next.js Image component

## Getting Started

### Requirements

Install a supported Node.js version and npm.

### Installation

Clone the repository, then navigate into the project directory:

```bash
cd sheggar-wheels
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

Check that the project compiles for production:

```bash
npm run build
```

To start the production server after a successful build:

```bash
npm run start
```

## Demo Usage

1. Open the homepage and browse the car catalogue.
2. Create a demo account as a renter or owner.
3. As an owner, add a car listing and check the public catalogue.
4. As a renter, open a car and submit a booking.
5. Use the demo administrator sign-in to inspect bookings and test status management.

The demo administrator email is `admin@sheggarwheels.demo`. It is a demonstration account, not a secure production credential. Follow the application's sign-in flow to access it.

## Data and Security Limitations

This capstone uses browser storage rather than a shared backend database.

- Demo data is scoped to the browser profile and origin.
- Data does not automatically synchronize across devices or browsers.
- Clearing browser storage may delete demo records.
- Client-side role checks are not production-grade authorization.
- No real payment processing is provided.

Do not enter real passwords, payment information, or sensitive personal data into the demo.

## Project Documentation

- [STRATEGY.md](./STRATEGY.md) — implementation strategy
- [BOUNDARY.md](./BOUNDARY.md) — scope and limitations
- [AUTH.md](./AUTH.md) — demo authentication and roles
- [DATA.md](./DATA.md) — data storage and lifecycle
- [PERF.md](./PERF.md) — performance testing and results
- [FUTURE.md](./FUTURE.md) — future improvements
- [.env.example](./.env.example) — example environment configuration

## Deployment

The project can be deployed to a compatible Next.js hosting provider, such as Vercel.

Before deploying:

1. Run `npm run build`.
2. Verify the primary renter, owner, and admin flows.
3. Confirm external car images load correctly.
4. Review the demo authentication and browser-storage limitations.
5. Test the deployed URL.

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
