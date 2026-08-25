# Changelog

## Unreleased

### Added
- Add new sources **Umami**, **GoatCounter**, **Simple Analytics**, and **Pirsch**.
- Add grouped metric/dimension picker UI (Common vs provider).
- Add canonical metric/dimension vocabulary for cross-provider presets and a grouped “Common” picker tier.
- Add Dashboard permission enforcement on all dashboard AJAX actions.
- Add batch widget data endpoint with client-side parallel widget hydration on dashboard load.
- Add Dashboard-level date range control in the header (view-scoped; overrides all widgets for the session).
- Add line chart previous-period comparison series when the selected period supports it.
- Add widget manual refresh via the widget actions menu (server-side cache bypass).
- Add Dashboard widget hydration uses parallel per-widget requests again (progressive render; batch endpoint remains for API use).

### Changed
- Rebuild the Dashboard UI on [Plugin Kit](https://docs.verbb.io/plugin-kit/react/).
- Widget settings can store `canonicalMetric` / `canonicalDimension`; resolved to provider-native API values at fetch time.
- Source option lists prepend mapped Common metrics/dimensions before the provider’s full native catalog.
- Widget data cache keys include the source settings hash; counter comparison periods are cached separately.
- Widget data responses include `_meta.fetchedAt` and `_meta.fromCache`.
- Default presets use semantic templates with canonical keys; fresh installs seed Website Overview, Content Performance, Acquisition, and Realtime.
- Google Analytics OAuth default scope reduced to `analytics.readonly`.

### Fixed
- Fix lack of validation for Presets when saving.
- Fix typo in `getNewWigetConfig()` to `getNewWidgetConfig()`.

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
