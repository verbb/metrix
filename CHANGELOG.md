# Changelog

## 2.1.3 - 2026-10-05

### Fixed
- Fixed a high-severity information disclosure vulnerability.
- Fixed a medium-severity server-side request forgery vulnerability.

## 2.1.2 - 2026-10-02

### Changed
- Updated the required version of `verbb/base` to 3.0.19.

## 2.1.1 - 2026-09-30

### Changed
- Keep OAuth callback redirects literal.
- Authorize OAuth connection management.
- Validate OAuth callback transactions.

## 2.1.0 - 2026-09-29

### Added
- Add a dedicated permission for managing Source credentials and connections. Existing non-admin Source managers must be granted this permission to continue managing credentials.
- Add new sources **Umami**, **GoatCounter**, **Simple Analytics**, and **Pirsch**.
- Add View **analytics scope** controls to filter widget data by Craft site, path prefix, or hostname.
- Add a Dashboard-level date range control, inherited widget periods, and previous-period comparison series.
- Add provider-neutral Common metrics and dimensions for widgets and presets, alongside each provider's native options.
- Add optional widget **title**, **subtitle**, and table/pie **row limit** settings.
- Add widget manual refresh and data freshness indicators.
- Add a batch widget data endpoint for API consumers.
- Add source capability metadata for custom control-panel integrations.

### Changed
- Rebuild the Dashboard UI on [Plugin Kit](https://docs.verbb.io/plugin-kit/react/).
- Improve keyboard and screen-reader access to widget controls, charts, tables, pagination, provider choices, and refresh actions.
- Reduce the dashboard's initial JavaScript by lazy-loading chart renderers, widget settings, and schema field controls.
- Improve widget data caching and invalidate affected caches when sources, views, credentials, or calendar periods change.
- Seed fresh installs with provider-neutral Website Overview, Content Performance, Acquisition, and Realtime presets.
- Reduce the Google Analytics OAuth scope to `analytics.readonly`.
- Use Matomo Reporting API breakdown methods for browser, country, city, and referrer dimensions.
- Require authenticated POST requests and the appropriate permissions when connecting, disconnecting, or managing sources, views, presets, and settings.
- Require the Views permission to change shared dashboard widget layouts.
- Require `verbb/auth` `^2.0.48` for secure OAuth callback transactions and reconnect handling when refresh tokens are permanently rejected.
- Route plugin settings through the plugin’s authorised settings controller.
- Link source setup screens to their provider guides and expand dashboard setup, provider prerequisites, configuration, and custom extension documentation.
- Update Plugin Kit and lodash dependencies to their patched releases.

### Fixed
- Fixed a high-severity information disclosure vulnerability.
- Fixed a high-severity server-side request forgery and information disclosure vulnerability.
- Fixed a medium-severity resource exhaustion vulnerability.
- Fixed information disclosure vulnerabilities.
- Fixed OAuth callback security and redirect handling.
- Fix dashboard permissions being unavailable in Craft Team and Enterprise.
- Fix source status, connection checks, credentials, and provider options retaining stale or invalid state.
- Fix Google Analytics and other OAuth sources staying connected after a permanently rejected refresh token.
- Fix date range boundaries, All Time chart ordering, rolling-period cache expiry, and Last 30 Days axis labels.
- Fix fractional metrics, bounce-rate scales, percentages, durations, and zero-value tooltips in widget reports.
- Fix invalid cache durations and real-time refresh intervals causing failed or repeated requests.
- Fix custom plot data transformers receiving aggregate reports instead of time series.
- Fix registered custom periods missing from date-range options and settings.
- Fix Cloudflare report queries, available history, bandwidth values, monthly totals, dimension breakdowns, API errors, and zone selection.
- Fix Fathom connection checks, site pagination, date filtering, visitor metrics, aggregate counters, and All Time queries.
- Fix Google Analytics account and property pagination, aggregate counters, and top-row ordering.
- Fix Matomo report ranges, dimension formatting, aggregate counters, pageviews, site selection with view-only tokens, and API errors.
- Fix Mixpanel event selection, series counts, service account connection checks, and All Time reports.
- Fix Plausible aggregate totals, page dimensions, and All Time queries.
- Fix stale source, view, and widget records after saving, reordering, or deleting them in the same request.
- Fix source, view, preset, and widget validation allowing invalid relationships, names, handles, or disabled types.
- Fix deleting sources and views from their edit pages, stale deleted-view forms recreating views, and Save and continue editing redirects.
- Fix project config rebuilding presets under the wrong key and preserve preset widgets when sources or dashboard views are unavailable.
- Fix unavailable custom sources and widgets preventing dashboards, presets, or layout settings from loading.
- Fix typo in `getNewWigetConfig()` to `getNewWidgetConfig()`.
- Fix widget API errors showing Guzzle’s truncated `(truncated…)` body instead of the full provider response.

### Fixed
- Fixed OAuth callback transaction validation.
- Fixed authorization for connecting and disconnecting OAuth sources.
- Fixed OAuth callback redirects being evaluated as Twig templates.

## 2.0.9 - 2026-09-14

### Fixed
- Fix the presets admin table after settings normalization.

## 2.0.8 - 2026-09-13

### Changed
- Normalize plugin settings.

## 2.0.7 - 2026-08-29

### Fixed
- Fix Matomo Site ID dropdown failing for API tokens without superuser access.
- Fix presets not always creating correctly on first install.
- Fix an error when viewing presets when invalid.
- Fix source status indicator.
- Fix source index status indicator.

## 2.0.6 - 2026-08-20

### Fixed
- Fix Last Week period date range and plot dimensions to consistently use the previous Monday–Sunday week.

## 2.0.5 - 2026-05-03

### Changed
- Bump `verbb/auth` to allow `firebase/php-jwt` 7.x.

## 2.0.4 - 2026-02-07

### Fixed
- Fix a redirect error when connecting to a source in the control panel.
- Fix an error when creating a new source.

## 2.0.3 - 2025-09-02

### Added
- Add Region, Browser, Device Type and OS to available dimensions for Fathom.

### Fixed
- Fix Fathom “Today” values for Counter widget.
- Fix Fathom grouping and sorting for some dimensions.

## 2.0.2 - 2025-07-18

### Changed
- Update English translations.

## 2.0.1 - 2025-05-01

### Added
- Add correct headers to Plausible source requests.
- Add support for setting the Base URL for self-hosted Plausible setups.
- Add full stack trace error messages to log files.

### Fixed
- Fix logging error.
- Fix Plausible real-time data for self-hosted installs.
- Fix connection visual state for some sources when connected.

## 2.0.0 - 2025-02-26

### Changed
- Now requires Craft 5.0+.

## 1.0.4 - 2026-05-03

### Changed
- Bump `verbb/auth` to allow `firebase/php-jwt` 7.x.

## 1.0.3 - 2025-09-02

### Added
- Add Region, Browser, Device Type and OS to available dimensions for Fathom.

### Fixed
- Fix Fathom “Today” values for Counter widget.
- Fix Fathom grouping and sorting for some dimensions.

## 1.0.2 - 2025-07-18

### Changed
- Update English translations.

## 1.0.1 - 2025-05-01

### Added
- Add correct headers to Plausible source requests.
- Add support for setting the Base URL for self-hosted Plausible setups.
- Add full stack trace error messages to log files.

### Fixed
- Fix logging error.
- Fix Plausible real-time data for self-hosted installs.
- Fix connection visual state for some sources when connected.

## 1.0.0 - 2025-02-26

### Added
- Initial release
