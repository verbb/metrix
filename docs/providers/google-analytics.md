# Google Analytics

Create a Google OAuth client so Metrix can read reporting data and list the analytics properties available to the connected account.

## Connecting to Google Analytics

### Connect to the Google Analytics API

1. Open the [Google Cloud Console](https://console.cloud.google.com/) and select or create a project.
2. In **APIs & Services → Library**, enable **Google Analytics Data API** and **Google Analytics Admin API**.
3. Open **Google Auth Platform → Branding** and complete the application details.
4. Open **Audience**, choose the appropriate internal or external audience, and add the connecting Google account as a test user when the app is in testing.
5. Open **Clients**, create an OAuth client and choose **Web application**.
6. Give the client a name that identifies this Craft environment.
7. Under **Authorised redirect URIs**, add the exact **Redirect URI** shown by the Metrix Source. Add a URI for each environment that will connect independently.
8. Copy the generated **Client ID** and **Client Secret** into the Metrix Source and save it.
9. Click **Connect** and authorise read-only analytics access.
10. Select the intended GA4 account and property in the Source settings, save again, and confirm the Source reports a connected account.


## Local Testing Proxy

When Google will not accept your local callback, enable **Proxy Redirect URI** on the Source and register the generated proxy URL with Google. The proxy sends the OAuth response through Verbb's public endpoint and back to your local Craft URL.

For example, you might have a Redirect URI like the following:

```
http://my-site.test/metrix/auth/callback
```

The proxy changes it to:

```
https://proxy.verbb.io?return=http://my-site.test/metrix/auth/callback
```

Use the proxy only for local development. Register each production or staging callback directly with Google over HTTPS.

## OAuth Consent Screen Publishing Status
Google may issue refresh tokens that expire after seven days while an external OAuth application is in **Testing**. Metrix then marks the Source as disconnected and asks you to reconnect.

For production sites:

1. In Google Auth Platform, set the app's audience and publishing status appropriately for your organisation.
2. Reconnect the Metrix Google Analytics source once so a long-lived refresh token is issued.

Tokens issued while the app was in Testing retain their original expiry, so reconnect after changing its publishing status. Google determines whether verification is required from the app's audience, scopes and use.

## Multi-Site Craft Installs
If several Craft sites share one GA4 property, set **Analytics scope** on the Metrix View (Craft site, path prefix, or hostname). Metrix applies a GA `dimensionFilter` on `hostName` and/or `pagePath` for widgets in that view.

If each site has its own GA4 property, create one Metrix Source per property instead.
