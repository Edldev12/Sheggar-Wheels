# Sheggar Wheels — Performance Report

## 1. Overview

This document describes the performance verification process for the Sheggar Wheels frontend capstone.

Performance results must be measured against the actual application. No Lighthouse scores or benchmark results are claimed unless they have been recorded.

## 2. Verification Environment

Record the environment used for each test:

- **Date:** Date of the actual test.
- **Browser:** Browser and version.
- **Environment:** Development or production build.
- **Device:** Device used for testing.
- **Network:** Connection conditions.

## 3. Build Verification

Run the production build:

```bash
npm run build
```

Record whether the build succeeds and document relevant warnings or errors.

Run the lint check as well:

```bash
npm run lint
```

Record its result separately from the production build.

## 4. Lighthouse Testing

Use Chrome DevTools Lighthouse to test the deployed application or a locally served production build.

Recommended routes, subject to verification against the current application:

- Homepage (`/`)
- Car catalogue (`/cars`)
- Car detail page (`/cars/[id]`)
- Owner dashboard (`/dashboard`)
- Admin dashboard (`/admin`)

Record the actual Performance, Accessibility, Best Practices, and SEO scores. Test mobile and desktop separately when practical.

## 5. Important Metrics

Record the following when available:

- **First Contentful Paint (FCP):** Time until the first content is displayed.
- **Largest Contentful Paint (LCP):** Time until the largest visible content element is displayed.
- **Total Blocking Time (TBT):** Time spent in long tasks that block interaction.
- **Cumulative Layout Shift (CLS):** Amount of unexpected visual movement.
- **Speed Index:** How quickly visible content is populated.

## 6. Performance Considerations

- Use appropriately sized and optimized images.
- Avoid unnecessarily large client-side components.
- Validate image-loading behavior when external image services are slow.
- Test catalogue filtering and sorting with realistic sample data.
- Check whether browser-storage operations cause unnecessary rendering.
- Test the main user flows using a production build.

## 7. Results Log

Record measured results after testing.

| Page | Device | Performance | Accessibility | Best Practices | SEO |
|---|---|---:|---:|---:|---:|
| Homepage | Not measured | — | — | — | — |
| Car catalogue | Not measured | — | — | — | — |
| Car details | Not measured | — | — | — | — |
| Owner dashboard | Not measured | — | — | — | — |
| Admin dashboard | Not measured | — | — | — | — |

## 8. Limitations

Performance may vary based on device, browser, network, deployment configuration, and third-party image availability. Results should be measured and recorded rather than estimated.
