# Dashboard
The Metrix Dashboard is your central hub for viewing analytics data from various sources. It provides a customizable and intuitive interface, allowing you to monitor and analyze your data at a glance.

This differs to the Craft Dashboard (and not to be confused with it), where widgets are defined per-user. While this is benefitial in its own way, in practice this is a bit of a pain to setup and manage for your clients.

## Views
**Views** in Metrix allow you to segment and organize your widgets based on specific data sources or goals. Each view represents a collection of widgets tailored to a particular focus area, such as website traffic, e-commerce performance, or social media engagement.

Combined with user permissions, you can even allow only certain user groups to access views. Each Metrix install comes with a default view.

## Presets
When first creating a new view, you'll have the choice to be able to add new widgets to it. While this is great for a few widgets, it can get tedious for multiple widgets, which can be compounded when you want to setup multiple views.

Which is where **Presets** come in. Set in your plugin settings and project config, you can create one or many presets to quickly spin up widgets in an empty view.

## Widgets
Widgets are the building blocks of your Metrix dashboard. They allow you to visualize data in different formats, such as charts, tables, or counters. Metrix provides several widget types to cater to different data presentation needs.

Widgets can visually take up 1, 2, or 3 thirds of the screen, and are responsive.

### Widget Types

#### Bar
The **Bar** widget displays data as vertical bars, making it ideal for comparing discrete categories or time periods. 
- **Use Case**: Visualize daily traffic for the last 7 days or compare bounce rates across different referrers.

#### Counter
The **Counter** widget is a simple, yet powerful tool for showing key metrics at a glance. It also compares data to the previous period.
- **Use Case**: Display the total number of visitors, pageviews, or conversions for a specific period.

#### Line
The **Line** widget is perfect for showing trends over time. It connects data points with lines to help you visualize changes.
- **Use Case**: Track the growth of traffic or user engagement over the past month.

#### Pie
The **Pie** widget provides a visual breakdown of data in a circular chart, illustrating proportions between different segments.
- **Use Case**: Show the distribution of traffic sources (e.g., direct, organic, referral).

#### Realtime
The **Realtime** widget provides live updates on your data, displaying the current activity on your website or app.
- **Use Case**: Monitor active visitors, real-time pageviews, or live conversion rates.

#### Table
The **Table** widget organizes data into rows and columns, providing a detailed breakdown of metrics and dimensions.
- **Use Case**: Display a list of pages ranked by pageviews or a breakdown of user sessions by device.

Each widget is customizable, allowing you to configure data sources, metrics, dimensions, periods, and width.

## Periods
**Periods** in Metrix define the time range for your data analysis. They determine the scope of data displayed in widgets and allow for quick comparisons across different time frames.

This is something set into the settings of a widget, but can be easily switched when viewing a widget (without needing to update and save a widget).

### Available Periods:
- **Today**: Data from the current day, starting at midnight.
- **Yesterday**: Data from the previous day.
- **Last 7 Days**: Data from the past week.
- **Week to Date**: Data from the beginning of the current week to today.
- **Last Week**: Data from the previous week (Monday to Sunday).
- **Last 30 Days**: Data from the past month.
- **Month to Date**: Data from the first day of the current month to today.
- **Last Month**: Data from the entire previous month.
- **Last 12 Months**: Data from the past 12 months.
- **Year to Date**: Data from the first day of the current year to today.
- **Last Year**: Data from the previous year.
- **All Time**: Data from the earliest available record to today.
