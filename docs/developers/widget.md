# Widget

## Attributes

Attribute | Description
--- | ---
`id` | The unique identifier for the widget.
`source` | The source for the widget.
`period` | The period the widget retrieves data for.
`metric` | The metric displayed by the widget.
`dimension` | The dimension the widget uses for grouping data.
`dateCreated` | The timestamp when the widget was created.
`dateUpdated` | The timestamp when the widget was last updated.

## Methods

Method | Description
--- | ---
`getData()` | Retrieves data for the widget using its configured source, metric, and dimension.
`setSettings($settings)` | Updates the settings for the widget.
