# Umami

Follow these steps to configure Umami for Metrix.

## Connecting to Umami

1. Create a Source in **Metrix → Sources** and choose **Umami**.
2. Set **Base URL**:
   - Umami Cloud: `https://api.umami.is/v1` (or `/v1/us` or `/v1/eu` for a specific region). Existing sources using `https://api.umami.is` are resolved automatically.
   - Self-hosted: your instance URL (without `/api`).
3. Enter your **Website ID**.
4. Authenticate with either:
   - an **API Key** (Umami Cloud, or a bearer token on self-hosted), or
   - **Username** and **Password** for self-hosted login (leave API Key blank).
5. Save and use **Connect** if prompted, then pick the Source on your widgets.
