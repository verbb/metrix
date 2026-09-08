# Widget

## Attributes

Attribute | Description
--- | ---
`id` | The unique identifier for the widget.
`sourceId` / `source` | The Source the widget reads from.
`viewId` / `view` | The View the widget belongs to.
`period` | Period class for data (unless inheriting the View range).
`inheritPeriod` | When true, use the View’s dashboard date range.
`metric` | Metric key for the widget.
`dimension` | Dimension key (table/pie and similar).
`canonicalMetric` / `canonicalDimension` | Normalised keys across providers.
`width` | Layout width (1–3 thirds).
`title` / `subtitle` | Optional display labels.
`limit` | Optional row limit for table/pie-style widgets.
`sortOrder` | Order within the View.
`uid` | Unique identifier string.
`dateCreated` / `dateUpdated` | Timestamps.

## Methods

Method | Description
--- | ---
`getSource()` / `setSource()` | Resolve or assign the Source.
`getView()` / `setView()` | Resolve or assign the View.
`getData()` | Retrieves data for the widget using its configured source, metric, and dimension.
`setSettings($settings)` | Updates widget settings attributes.
