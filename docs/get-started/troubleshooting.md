# Troubleshooting

## A Source Will Not Connect

Confirm its client credentials, API token and redirect URI match the provider configuration. Save credential changes before connecting. For OAuth providers, check the application's audience, test users and requested scopes, then disconnect and reconnect the Source.

If Google Analytics disconnects after several days, check whether the external OAuth application is still in Testing. Change the provider-side publishing status when appropriate and reconnect to issue a new token.

## A Widget Shows No Data

First distinguish an empty result from an error. Confirm the selected property or site contains data for the same metric and period. Then check the widget's Source, metric, dimension and inherited View date range. A View's Craft site, path or hostname scope can legitimately exclude all rows.

Use **Refresh** on the widget once to bypass its cache. If the provider account also shows no matching data, changing Metrix cache settings will not help.

## A Metric or Widget Type Is Unavailable

Sources advertise whether they support dimensions, real-time data and analytics scope. A Realtime widget requires a Source with real-time support, while table and pie choices depend on dimensions. Plugin configuration can also restrict `enabledWidgetTypes` and periods.

## Users Cannot Manage or View Metrix

Dashboard access and nested View permissions are separate from **Sources** and **Views** management permissions. Test each user group with a non-admin account after permission changes. Controller actions enforce these permissions even when a user knows the action URL.
