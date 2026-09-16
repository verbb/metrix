# Cloudflare
Follow these steps to configure Cloudflare Analytics for Metrix.

## Connecting to Cloudflare Analytics

### Connect to the Cloudflare API
1. Go to the [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) page.
1. Click the **Create Token** button.
1. Under **Custom Token**, click the **Use Template** button for the **Read Analytics** template.
1. Configure the permissions as needed for your zones.
1. Copy the generated **API Token** and paste it into the **API Token** field in Metrix.
1. Leave **Enabled** off and save the Source. Reopen it and click **Connect**.
1. Open the **Provider** tab and click the refresh button beside **Zone ID** to load the available zones.
1. Select the intended **Zone ID**, turn **Enabled** on, and save.
1. Reopen the Source and click **Connect** if it is shown as disconnected after saving the settings. Confirm a widget can load data for the selected zone.

## Available History

Cloudflare limits analytics history and query ranges according to your zone’s plan. **All Time** uses UTC date buckets that begin within Cloudflare’s available history, through the current day, and divides requests to stay within its query limits. Older traffic outside that retention window is unavailable. Other periods can return a provider error if they exceed your plan’s retention.
