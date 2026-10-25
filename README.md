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
- View owner earnings reports based on completed bookings.
- Store demo data in browser storage.

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

Clone the repository and navigate into the project directory:

```bash
git clone https://github.com/Edldev12/Sheggar-Wheels.git
cd Sheggar-Wheels
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Lint and production build

Run the lint checks:

```bash
npm run lint
```

Build the project:

```bash
npm run build
```

After a successful build, start the production server:

```bash
npm run start
```

## Demo Usage

1. Open the homepage and browse the car catalogue.
2. Create a demo account as a renter or owner.
3. As an owner, create a car listing and check the public catalogue.
4. As a renter, open a car and submit a demo booking.
5. Use the demo administrator sign-in to inspect bookings and test status management.
6. As an owner, review booking activity and completed rental revenue.

The demo administrator email is `admin@sheggarwheels.demo`. This is a demonstration account, not a secure production credential. Follow the application's sign-in flow to access it.

## Data and Security Limitations

This capstone uses browser storage rather than a shared backend database.

- Demo data is scoped to the browser profile and origin.
- Data does not automatically synchronize across devices or browsers.
- Clearing browser storage may delete demo records.
- Client-side role checks are not production-grade authorization.
- Owner earnings are calculated from bookings marked `Completed`; they do not represent verified payments.
- No real payment processing is provided.
- Browser-stored account and booking data can be modified by the user.

Do not enter real passwords, payment information, or sensitive personal data into the demo.

## Project Documentation

- [STRATEGY.md](./STRATEGY.md) — implementation strategy.
- [BOUNDARY.md](./BOUNDARY.md) — project scope and limitations.
- [AUTH.md](./AUTH.md) — demo authentication and roles.
- [DATA.md](./DATA.md) — data storage and lifecycle.
- [PERF.md](./PERF.md) — performance testing and results.
- [FUTURE.md](./FUTURE.md) — future improvements.
- [.env.example](./.env.example) — example environment configuration.

## Deployment

The project can be deployed to a compatible Next.js hosting provider, such as Vercel.

Before submitting:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Test the renter, owner, and admin flows.
4. Verify that external car images load correctly.
5. Test the deployed URL.
6. Capture screenshots of the homepage, car details, booking flow, owner dashboard, and admin booking management.

**Live Demo:** Add your deployed project URL here.

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
