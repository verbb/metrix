# Preset

## Attributes

Attribute | Description
--- | ---
`id` | The unique identifier for the preset (when stored).
`name` | The name of the preset.
`handle` | The handle of the preset.
`enabled` | Whether the preset is enabled.
`sortOrder` | Sort order among presets.
`widgets` | Widget configs applied when the preset is used.
`dateCreated` | When the preset was created.
`dateUpdated` | When the preset was last updated.
`uid` | The unique identifier string for the preset.

## Methods

Method | Description
--- | ---
`getWidgets()` | Widget instances / configs for the preset.
`setWidgets($widgets)` | Assign widget configs.
`getFrontEndWidgets()` | Widgets prepared for the dashboard UI.
`getSerializedWidgets()` | Widgets as stored config.
`normalizeWidgets(array $widgetConfigs)` | Normalize incoming widget configs.
`getCpEditUrl()` | Control Panel edit URL.
