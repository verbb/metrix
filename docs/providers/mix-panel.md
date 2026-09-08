# Mixpanel

Follow these steps to configure [Mixpanel](https://mixpanel.com/) for Metrix.

## Connecting to Mixpanel

### Connect to the Mixpanel API

1. Log in to your [Mixpanel Dashboard](https://mixpanel.com/).
1. Go to **Project Settings → Service Account**.
1. Generate a new Service Account token with **Read Access**.
1. Copy the **Username** from Mixpanel and paste it into the **Service Account Username** field in Metrix.
1. Copy the **Password** from Mixpanel and paste it into the **Service Account Password** field in Metrix.
1. Enter your **Project ID** into the corresponding field in Metrix.

:::tip
Mixpanel is event-oriented. Dimension breakdown widgets (table/pie) are not supported for this Source — use counters and time-series styles instead.
:::
