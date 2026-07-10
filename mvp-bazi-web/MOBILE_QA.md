# Mobile QA

Date: 2026-07-08

Base checked: `http://127.0.0.1:3000`

## Method

Automated layout QA was run with Microsoft Edge through Playwright. No browser binary was installed. Screenshots and raw results are saved under `docs/mobile-qa/`.

Checked viewports:

- `360x800`
- `375x812`
- `390x844`
- `414x896`
- `430x932`
- `768x1024`
- `1440x900`

Checked pages:

- Homepage
- Birth info form
- Preview page
- Locked full report page
- Paid full report page
- Full report loading/progress page
- Sample Report page
- Privacy
- Terms
- Refund
- Disclaimer
- Methodology
- SEO pages: What is Bazi, Four Pillars of Destiny, Day Master

## Automated Checks

- No global horizontal overflow.
- No clipped links, buttons, inputs, selects, or textareas.
- Primary CTA tap targets are not below the minimum checked height.
- Footer links render and remain usable.
- Four Pillars table, Five Elements visualization, Luck Pillar timeline, and loading/progress UI render inside the viewport.
- Paid report page renders paid-report content.
- Loading/progress page renders waiting copy.

## Result

Passed: `105 / 105` page and viewport combinations.

Failures: `0`.

Screenshots created: `30`.

Representative screenshot paths:

- `docs/mobile-qa/screenshots/homepage-390x844.png`
- `docs/mobile-qa/screenshots/birth-form-390x844.png`
- `docs/mobile-qa/screenshots/preview-page-390x844.png`
- `docs/mobile-qa/screenshots/paid-full-report-390x844.png`
- `docs/mobile-qa/screenshots/loading-progress-390x844.png`
- `docs/mobile-qa/screenshots/sample-report-390x844.png`
- `docs/mobile-qa/screenshots/paid-full-report-1440x900.png`

## Notes

- The QA used the current local build state, including final launch-polish changes.
- Creem hosted checkout itself remains an external provider UI. The app-side Creem return page was checked through `/reading/[id]/full?checkout_id=...`.
- A real Creem live-mode payment still requires Creem live/KYC approval before it can be tested with real money.

## 2026-07-10 Re-Check Needed

The sample report CTA was changed after this run. Before public launch, repeat at least the homepage -> form -> preview -> sample report -> unlock path at:

- `360x800`
- `390x844`
- `430x932`
- `768x1024`

Required result: no clipped CTA, no horizontal overflow, and the sample report must show a clear `Unlock Full Report — $2.99` path plus `Generate My Free Preview`.
