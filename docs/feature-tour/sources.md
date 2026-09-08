# Sources

Sources connect Metrix to analytics providers. Create them under **Metrix → Sources**, then pick a Source when configuring each widget.

![Metrix Sources index with connected analytics providers](/_screenshots/feature-tour/sources.png)

You can mix Sources from different providers on the same dashboard. OAuth providers (such as Google Analytics) use a Connect handshake; others use API keys or client credentials you paste into the Source settings.

If a Source shows as **Not Connected** after tokens expire, reconnect from the Sources screen — widgets will surface a reconnect message instead of a raw API error.

See the [provider docs](docs:providers/google-analytics) for setup details per platform.

## Provider capabilities

Not every provider supports every widget feature. Rough guide:

| Provider | Realtime | Dimensions (table/pie) | View analytics scope | Auth |
|---|---|---|---|---|
| Google Analytics | Yes | Yes | Yes | OAuth |
| Plausible | Yes | Yes | Yes (path) | API key |
| Matomo | — | Yes | Yes | Credentials |
| Fathom | Yes | Yes | — | Credentials |
| Umami | Yes | Yes | — | Credentials |
| Pirsch | Yes | Yes | — | Credentials |
| Cloudflare | — | Yes | — | Credentials |
| Goat Counter | — | Yes | — | Credentials |
| Simple Analytics | — | Yes | — | Credentials |
| Mixpanel | — | No | — | Credentials |

Realtime requires a Realtime widget **and** a Source that implements realtime fetch. View scope is configured on the [View](docs:feature-tour/dashboard#multi-site--analytics-scope); unsupported Sources ignore it.
