# Changelog

## Unreleased

### Added
- Add new sources **Umami**, **GoatCounter**, **Simple Analytics**, and **Pirsch**.
- Add grouped metric/dimension picker UI (Common vs provider).
- Add canonical metric/dimension vocabulary for cross-provider presets and a grouped “Common” picker tier.
- Add Dashboard permission enforcement on all dashboard AJAX actions.
- Add batch widget data endpoint with client-side parallel widget hydration on dashboard load.
- Add Dashboard-level date range control in the header (view-scoped; widgets inherit unless overridden).
- Add line chart previous-period comparison series when the selected period supports it.
- Add widget manual refresh via the widget actions menu (server-side cache bypass).
- Add Dashboard widget hydration uses parallel per-widget requests again (progressive render; batch endpoint remains for API use).
- Add source capability flags (`realtime`, `dimensions`, …) exposed to the CP for schema/UI gating.
- Add optional widget **title**, **subtitle**, and table/pie **row limit** settings.
- Add shared Chart.js renderer for line/bar/pie widgets.
- Add “Updated …” in widget headers to show data freshness.
- Add View **analytics scope** (Craft site, path prefix, or hostname) to filter widget data for multi-site installs.

### Changed
- Link every source setup screen to its provider guide.
- Reduce the dashboard’s initial JavaScript by lazy-loading chart renderers, widget settings, and schema field controls.
- Update Plugin Kit and lodash dependencies to their patched releases.
- Rebuild the Dashboard UI on [Plugin Kit](https://docs.verbb.io/plugin-kit/react/).
- Widget settings can store `canonicalMetric` / `canonicalDimension`; resolved to provider-native API values at fetch time.
- Source option lists prepend mapped Common metrics/dimensions before the provider’s full native catalog.
- Widget data cache keys include the source settings hash; counter comparison periods are cached separately.
- Widget data cache entries are tagged per source and invalidated on source save, delete, connect, and disconnect.
- Widget data cache keys/tags include View analytics scope; View save invalidates scoped widget caches.
- Dimension widget responses are sorted and truncated by row limit (provider `limit`/`filter_limit` where supported).
- Widget data responses include `_meta.fetchedAt` and `_meta.fromCache`.
- Default presets use semantic templates with canonical keys; fresh installs seed Website Overview, Content Performance, Acquisition, and Realtime.
- Google Analytics OAuth default scope reduced to `analytics.readonly`.
- Matomo dimension widgets use Reporting API breakdown methods (browsers, country, city, referrers) instead of VisitsSummary.
- Require `verbb/auth` `^2.0.45` for OAuth reconnect handling when refresh tokens are permanently rejected.
- Expand dashboard setup, provider prerequisites and custom extension examples, and clarify configuration.
- Align documentation filenames with page titles and update internal links.

### Fixed
- Fixed an information disclosure vulnerability.
- Fix dashboard permissions being unavailable in Craft Team and Enterprise.
- Fix refreshed source options treating provider labels and values as HTML.
- Fix connection checks returning a server error for deleted sources.
- Fix sources with missing environment credentials being treated as configured.
- Fix source credential changes retaining old authentication and provider option caches.
- Fix Mixpanel event selection, series counts, and service account connection checks.
- Fix Last 30 Days charts showing midnight instead of dates on the horizontal axis.
- Fix chart values and comparison series being unavailable to screen readers.
- Fix inherited widgets losing their date range and data after reloading the dashboard.
- Fix custom plot data transformers receiving aggregate reports instead of time series.
- Fix registered custom periods missing from date-range options and settings.
- Fix All Time charts omitting earlier unordered data or inventing history for empty reports.
- Fix rolling date ranges reusing cached results from the previous calendar day.
- Fix older widget requests replacing newer data after a refresh or period change.
- Fix initial widget errors repeatedly retrying requests instead of waiting for a manual refresh.
- Fix a period selected in widget settings being overridden by the dashboard date range.
- Fix fractional metrics being truncated in counters and dimension charts, including percentage comparisons.
- Fix date ranges including extra days or months, and keep comparison ranges within the intended calendar period.
- Fix previous-period comparisons ignoring the view’s analytics scope and cache refresh settings.
- Fix exact homepage scopes returning traffic for every page.
- Fix Cloudflare All Time reports failing instead of querying the zone’s available history.
- Fix Cloudflare report queries, bandwidth values, monthly totals, dimension breakdowns, API errors, and zone selection.
- Fix Fathom site selection omitting sites after the first page of API results.
- Fix Fathom date filtering, visitor metrics, aggregate counters, and All Time queries.
- Fix GoatCounter requests shifting non-UTC date ranges and extending partial comparison periods.
- Fix GoatCounter All Time reports, dimension reports with more than 100 rows, and recovery from temporary API rate limits.
- Fix GoatCounter hourly and monthly charts, missing dimension labels, and JSON request headers.
- Fix Google Analytics aggregate counters and top-row ordering, and explain unsupported realtime scope filters.
- Fix Matomo monthly charts, All Time reports, unformatted dimension metrics, and site selection with view-only tokens.
- Fix Matomo aggregate counters, pageview reports, percentage values, and API error reporting.
- Fix Mixpanel All Time reports failing before requesting data.
- Fix Pirsch sources failing after an access token is rejected or when no domains are available.
- Fix Pirsch chart intervals, rate and duration values, dimension pagination, and All Time queries.
- Fix Plausible aggregate totals, page dimensions, All Time queries, and scoped realtime counts.
- Fix Simple Analytics hourly charts, dimension row limits and labels, All Time queries, and API error reporting.
- Fix self-hosted Umami reports remaining unavailable after a cached login token is rejected.
- Fix Umami Cloud API paths, dimension rates and durations, monthly chart buckets, and All Time queries.
- Fix delayed view responses replacing the currently selected dashboard’s widgets.
- Fix switching dashboard views failing to load their widgets.
- Fix missing widget sources or views causing server errors when saving.
- Fix presets failing to load after their source is renamed or deleted.
- Fix widget deletion event listeners receiving stale cached records.
- Fix stale source, view and widget data after saving, reordering or deleting records in the same request.
- Fixed new widgets failing to save, and widget edits failing to refresh the displayed data.
- Fix Save and continue editing redirecting to a missing page for views.
- Fix cancelling a preset widget drag outside the list throwing an error.
- Fix saving a preset clearing its widgets when all sources are disabled.
- Fix the preset widget editor crashing before chart components finish loading.
- Fix the preset management table not appearing in settings.
- Fix deleted presets preventing reuse of their names and handles.
- Fix saving edited preset widgets failing on their generated display titles.
- Fix invalid or duplicate source, view and preset names and handles causing save errors or inaccessible views.
- Fix Website Overview and Content Performance presets missing from fresh installations.
- Fix pie chart legend controls being unavailable to keyboard and screen-reader users.
- Fix missing accessible names on widget metric and dimension selectors.
- Fix Table widgets missing accessible table structure and sort direction.
- Fix table sorting being inaccessible by keyboard and add accessible pagination labels.
- Fix duplicated dashboard widgets remaining in a loading state instead of fetching their chart data.
- Roll back failed widget edits and reorders instead of leaving unsaved dashboard state in the UI.
- Fall back to the first permitted dashboard view when the URL contains an unknown view handle.
- Apply dashboard presets through an idempotent, CSRF-protected POST transaction instead of mutating state through GET requests.
- Coalesce concurrent cold-cache widget requests so identical provider queries only run once.
- Keep analytics-scope cache identities limited to the hostname/path match modes they actually use.
- Fix Google Analytics (and other OAuth) sources staying “Connected” after a dead refresh token (e.g. Google Testing-mode 7-day expiry). Dashboard widgets now show a reconnect message instead of a raw API 401, and the source flips to Not Connected so you can reconnect from Sources.
- Fix dashboard index crashing when resolving native metric/dimension labels against a dead OAuth source.
- Fix lack of validation for Presets when saving.
- Fix typo in `getNewWigetConfig()` to `getNewWidgetConfig()`.
- Fix widget API errors showing Guzzle’s truncated `(truncated…)` body instead of the full provider response.
- Fix canonical metric/dimension picker values (e.g. `__canonical__:visitors`) not resolving to provider-native fields before fetch.
- Fix empty widgets treating `rows: []` as populated content.
- Fix counter comparison colour treating `0%` as a decrease.
- Fix empty-dashboard states missing CTAs for sources/views.
- Enforce `metrix-sources` / `metrix-views` / admin on Sources, Views, Presets, and Settings controllers (not only CP nav / Twig).
- OAuth connect is no longer anonymous; connect/disconnect require `metrix-sources` + POST (callback remains anonymous).
- Widget data fetches ignore stale responses after a newer dashboard-wide period/view refresh.
- Plausible analytics scope `begins_with` now uses Stats API `matches` with an anchored regex (not substring `contains`).
- Saving widgets only accepts registered, settings-enabled widget types.
- Provider API error messages redact secret-looking query parameters in request URIs.

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
