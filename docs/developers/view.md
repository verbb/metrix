# View

## Attributes

Attribute | Description
--- | ---
`id` | The unique identifier for the view.
`name` | The name of the view.
`handle` | The handle of the view.
`settings` | JSON settings bag (includes optional `analyticsScope`).
`dateCreated` | The timestamp when the view was created.
`dateUpdated` | The timestamp when the view was last updated.
`uid` | The unique identifier string for the view.

## Analytics scope

Views can optionally scope every widget fetch to a Craft site, path prefix, or hostname. That is stored under `settings.analyticsScope` and applied by providers that support it (Google Analytics, Plausible path filters, Matomo segments).

When a Craft site is selected, Metrix derives the filter from the site’s base URL: a different host than the primary site becomes a hostname filter; a shared root URL becomes a path-prefix filter.

For separate analytics properties/domains, continue to use separate Sources — View scope is for one property covering multiple Craft sites.

## Methods

Method | Description
--- | ---
`getAnalyticsScope()` | Returns the resolved `AnalyticsScope` model for this view.
`setAnalyticsScope()` | Stores (or clears) analytics scope in `settings`.
