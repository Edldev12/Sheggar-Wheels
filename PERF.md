# Sheggar Wheels — Performance Report

## 1. Overview

This document defines the process for verifying performance, accessibility, best practices, and SEO for the Sheggar Wheels frontend capstone.

All scores and measurements must come from actual tests. No Lighthouse scores, benchmark results, or performance improvements are claimed unless they have been measured and recorded.

## 2. Verification Environment

Record the following details for each test run:

| Field | Value |
|---|---|
| Test date | Record the actual date |
| Browser and version | Record the browser used |
| Environment | Local production build or deployed application |
| Device | Record device type and relevant specifications |
| Network | Record connection and throttling conditions |
| Build status | Record the actual result |
| Lighthouse version | Record the version when available |

For consistent comparisons, use the same environment and testing conditions whenever possible.

## 3. Build and Code Verification

Run the production build from the project root:

```bash
npm run build
```

Record whether the command succeeds and note relevant warnings or errors.

Run the lint check separately:

```bash
npm run lint
```

Record its result independently of the build result. Passing these commands does not guarantee that every feature works correctly or that the application is free from runtime errors.

Where practical, test the production build rather than relying only on the development server.

## 4. Lighthouse Testing

Use Chrome DevTools Lighthouse to test the deployed application or a locally served production build.

Test mobile and desktop separately when practical. Record the results for each tested route.

### Suggested routes

Confirm each route exists and is accessible before testing it.

| Page | Suggested route |
|---|---|
| Homepage | `/` |
| Car catalogue | `/cars` |
| Car details | An actual car detail URL |
| Owner dashboard | The implemented owner dashboard route |
| Admin dashboard | An actual admin dashboard route |

The route examples are starting points, not a guarantee that every route exists under that exact path. Use the current application's actual routes.

For each Lighthouse run, record:

- Performance score
- Accessibility score
- Best Practices score
- SEO score
- Relevant warnings and opportunities
- Test environment and date

Lighthouse scores can vary between runs. If comparing before-and-after changes, use comparable conditions and record both sets of measurements.

## 5. Important Performance Metrics

Record these metrics when available:

| Metric | What it measures | General interpretation |
|---|---|---|
| First Contentful Paint (FCP) | Time until the first text or image content appears | Earlier content generally improves perceived loading |
| Largest Contentful Paint (LCP) | Time until the largest qualifying visible content element appears | Indicates loading performance |
| Total Blocking Time (TBT) | Total blocking time from qualifying long tasks during the measured loading period | Lower values generally indicate less main-thread blocking |
| Cumulative Layout Shift (CLS) | Unexpected visual layout movement | Lower values generally indicate a more stable layout |
| Speed Index | How quickly visible content is populated | Lower values generally indicate faster visual completion |

Lighthouse measures these metrics under its test conditions. They should not be treated as identical to field measurements from actual users.

## 6. Performance Considerations

Areas to inspect during testing include:

- Use appropriately sized images and optimized image delivery where supported.
- Avoid unnecessarily large client-side components and JavaScript bundles.
- Check external image-loading behavior and provide suitable fallbacks where appropriate.
- Test catalogue filtering, sorting, and search with representative sample data.
- Check whether browser-storage reads or writes trigger unnecessary rendering.
- Review browser console errors and failed network requests.
- Verify that the main user flows work using a production build.
- Check layout stability while images and other page content load.

These are areas for evaluation, not claims that every optimization has already been implemented.

## 7. Results Log

Enter actual results after each test. Leave values as `Not measured` until measurements are available.

| Page | Device | Performance | Accessibility | Best Practices | SEO |
|---|---|---:|---:|---:|---:|
| Homepage | Not measured | — | — | — | — |
| Car catalogue | Not measured | — | — | — | — |
| Car details | Not measured | — | — | — | — |
| Owner dashboard | Not measured | — | — | — | — |
| Admin dashboard | Not measured | — | — | — | — |

### Detailed test record

For every recorded run, also capture:

- Test date and time
- Actual URL tested
- Mobile or desktop configuration
- Lighthouse scores and available metric values
- Build and deployment environment
- Important warnings or failures
- Changes made after testing

If a route cannot be accessed or a test fails, record that outcome rather than entering an estimated score.

## 8. Limitations

Performance results depend on device capabilities, browser version, network conditions, deployment configuration, caching, and third-party resource availability.

A Lighthouse report is a snapshot under specific test conditions. It does not prove consistent performance for every user or guarantee that the application meets all accessibility, SEO, or production-readiness requirements.

No performance score or improvement should be reported until the corresponding test has been completed and its results recorded.