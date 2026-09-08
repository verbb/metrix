# Dashboard

The Metrix Dashboard is your central hub for viewing analytics data from various sources. It provides a customizable and intuitive interface, allowing you to monitor and analyze your data at a glance.

Widgets are captured individually below so docs can compose a tight dashboard cutout (line + counters + breakdowns) without a single oversized screenshot.

![Sessions line chart widget (two-thirds width)](/_screenshots/feature-tour/widget-sessions-line.png)

![Active users realtime counter widget](/_screenshots/feature-tour/widget-active-users.png)

![Sessions counter widget with period comparison](/_screenshots/feature-tour/widget-sessions-counter.png)

![Browser sessions pie chart widget](/_screenshots/feature-tour/widget-browser-pie.png)

![Operating system sessions table widget](/_screenshots/feature-tour/widget-os-table.png)

![Country sessions table widget with pagination](/_screenshots/feature-tour/widget-country-table.png)

This differs from the Craft Dashboard (and not to be confused with it), where widgets are defined per-user. Metrix views are shared and easier to set up for clients.

## Views

**Views** segment and organise widgets — for example website traffic vs a campaign. Each install comes with a default view.

### Permissions

User groups can be limited with:

- **Metrix → Dashboard** — access the dashboard (with nested permissions per view).
- **Metrix → Sources** — manage Sources.
- **Metrix → Views** — manage Views.

### Multi-site / analytics scope

A View can optionally limit widget data to a **Craft site**, **path prefix**, or **hostname**. Use this when one analytics property (e.g. a single GA4 property) covers multiple Craft sites.

- **Craft site** — Metrix derives a hostname or path filter from the site base URL.
- **Path prefix** — e.g. `/en` or `/fr/` for path-based multi-site.
- **Hostname** — e.g. `fr.example.com` for domain-based multi-site on one property.

If each Craft site has its own analytics property or Plausible site, create separate Sources (and Views) instead.

Supported providers for View scope today: **Google Analytics**, **Plausible** (path), and **Matomo**. Other sources ignore the scope.

## Presets

When creating a new view, you can add widgets one by one — or apply a **Preset** to spin up a full suite. Presets live in plugin settings / project config.

Fresh installs include seeded presets such as **Website Overview**, **Content Performance**, **Acquisition**, and **Realtime**.

## Widgets

Widgets visualise data as charts, tables, or counters.

![Dashboard settings panel listing widgets for the current view](/_screenshots/feature-tour/dashboard-settings.png)

Widgets can take up 1, 2, or 3 thirds of the screen, and are responsive.

Manage the widget list from the view settings (or the Widgets tab when configuring presets):

![Widgets tab with line, counter, pie, and table widgets](/_screenshots/feature-tour/widgets.png)

### Widget settings

![Widget settings for source, chart type, width, period, and metric](/_screenshots/feature-tour/widget-settings.png)

Configure source, chart type, width, period, metric, and dimension. Optional **title**, **subtitle**, and table/pie **row limit** are available. Use **Refresh** on a widget to bypass the data cache. Headers show when data was last updated.

### Widget types

#### Bar
Vertical bars for comparing categories or time periods — e.g. daily traffic for the last 7 days.

#### Counter
A key metric at a glance, with a comparison to the previous period.

#### Line
Trends over time. Line widgets can also show a previous-period comparison series when the selected period supports it.

#### Pie
Proportions between segments — e.g. traffic by browser.

#### Realtime
Live activity (where the Source supports it).

#### Table
Rows and columns for ranked breakdowns — e.g. pages by pageviews.

## Periods

The dashboard header has a **date range** control for the current View. Widgets inherit that period unless you set a specific period on the widget.

### Available periods

- **Today**
- **Yesterday**
- **Last 7 Days**
- **Week to Date**
- **Last Week**
- **Last 30 Days**
- **Month to Date**
- **Last Month**
- **Last 12 Months**
- **Year to Date**
- **Last Year**
- **All Time**
