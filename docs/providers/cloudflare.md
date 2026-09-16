# Cloudflare
Follow these steps to configure Cloudflare Analytics for Metrix.

## Connecting to Cloudflare Analytics

### Connect to the Cloudflare API
1. Go to the [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) page.
1. Click the **Create Token** button.
1. Under **Custom Token**, click the **Use Template** button for the **Read Analytics** template.
1. Configure the permissions as needed for your zones.
1. Copy the generated **API Token** and paste it into the **API Token** field in Metrix.
1. Select the **Zone ID** in Metrix using the dynamic dropdown.
1. Save the Source, use **Connect** if prompted, and confirm a widget can load data for the selected zone.

## Available History

Cloudflare limits analytics history and query ranges according to your zone’s plan. **All Time** uses UTC date buckets that begin within Cloudflare’s available history, through the current day, and divides requests to stay within its query limits. Older traffic outside that retention window is unavailable. Other periods can return a provider error if they exceed your plan’s retention.
