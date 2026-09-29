# Plausible

Connect a Plausible site to show its traffic in Metrix. On Plausible Cloud, the Stats API requires a Business plan. Create the key under the team that owns the site; access to another team's dashboard as a guest does not give your key access to that team's data. [Plausible's API access requirements](https://plausible.io/docs/stats-api#authentication) explain which team roles can create keys.

## Connecting to Plausible Analytics

### Connect to the Plausible API

1. Sign in to [Plausible](https://plausible.io/) and select the team that owns the site.
2. Open your account settings and go to **API Keys**.
3. Create a **Stats API** key and save its value when it is shown.
4. In **Metrix → Sources**, create a Plausible source and paste the key into **API Key**.
5. Enter the site's domain as **Site ID**, matching its Plausible settings, such as `example.com`.
6. If you host Plausible yourself, set **Base URL** to your instance and confirm it provides the Stats API needed by Metrix.
7. Save the Source, then use **Connect** if prompted.

Create a counter using that Source and compare its pageviews with Plausible over the same dates. If access is rejected, check the Cloud plan and the key's team before replacing credentials. A valid key for the wrong team cannot read the intended site.
