# Permissions

Metrix's permissions let you share analytics with people who don't need to change how they're collected. A marketing team might view the campaign View's widgets, a site manager might arrange Views and their widgets, and a developer might look after the Sources that connect to each analytics provider. Set them in **Settings → Users → User Groups**, or on an individual user's **Permissions** tab.

**Access Metrix** is listed under **General**, with Craft's other permissions for reaching each plugin's section, while `hasCpSection` is on. The others are listed under a **Metrix** heading.

| Permission | What It Allows |
| --- | --- |
| Access Metrix | Reach the plugin's section in the control panel. |
| Dashboard | Open **Metrix → Dashboard**. On its own it shows no widgets, so give it with at least one View's permission. |
| View “{view}” widgets | See that View on the dashboard and load its widgets' data. |
| Sources | Open **Metrix → Sources** to create, edit, reorder and delete Sources, with their credentials hidden. |
| Manage source credentials and connections | See and change a Source's credentials and connection settings, connect or reconnect it to its provider, and check the connection. |
| Manage views and dashboard layouts | Open **Metrix → Views** to create, edit, reorder and delete Views, and add, edit, reorder, duplicate and remove widgets on the Views they can see, including applying a preset. |

Each View gets its own **View “{view}” widgets** permission, generated from the Views in **Metrix → Views** and nested under **Dashboard**. A new View adds a new permission, which nobody but admins holds until you grant it. Views share one layout with everyone who can see them, so anyone with **Manage views and dashboard layouts** changes the dashboard for everyone else too.

**Manage source credentials and connections** is nested under **Sources**. Without it, someone can still change a Source's ordinary settings, but its API keys, tokens and other protected values are hidden from them and can't be changed.

Admins can always do all of this. Presets, widget settings and the plugin settings are for admins only, and only appear where Craft's `allowAdminChanges` setting is on.

Give **Manage source credentials and connections** only to the people who look after your analytics accounts, because it shows the credentials Metrix uses to read from each provider. See [Dashboard](dashboard.md) and [Sources](sources.md) for how Views, widgets and Sources fit together.
