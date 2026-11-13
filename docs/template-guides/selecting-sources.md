# Selecting Sources

A source is an analytics connection saved under **Metrix → Sources**, such as a Google Analytics property. Metrix's dashboards use sources in the control panel without any template code, but you can fetch them in your own templates through `craft.metrix`, for example to show which connections a site has or to check one before linking to its dashboard. Each call returns [Source](docs:reference/source) objects.

## Getting a Source by Its Handle

To work with one specific source, use the handle saved in its settings. `craft.metrix.getSourceByHandle(handle)` returns the matching source, or `null` when no source has that handle. This example assumes a source with the handle `analytics` and shows a message when it's missing or disabled:

```twig
{% set source = craft.metrix.getSourceByHandle('analytics') %}

{% if source and source.enabled %}
    <p>Analytics are collected through {{ source.name }}.</p>
{% else %}
    <p>The analytics source is unavailable.</p>
{% endif %}
```

The call returns disabled sources too, so check `source.enabled` before treating the source as available. Call `source.isConnected()` as well if the template needs to know that its credentials or OAuth token are in place.

If you've stored a source's ID instead of its handle, `craft.metrix.getSourceById(id)` works the same way and returns the source with that ID, or `null`:

```twig
{% set source = craft.metrix.getSourceById(3) %}

{% if source %}
    <p>{{ source.name }} ({{ source.handle }})</p>
{% endif %}
```

## Listing Sources

Three calls return a list of sources, and they differ in how much they filter out. `craft.metrix.getAllSources()` returns every saved source, `craft.metrix.getAllEnabledSources()` leaves out disabled ones, and `craft.metrix.getAllConfiguredSources()` returns only enabled sources that also have the settings or credentials they need to connect. Each returns an array, which is empty when nothing matches.

Use configured sources when a template presents a choice and shouldn't offer incomplete connections:

```twig
{% set sources = craft.metrix.getAllConfiguredSources() %}

{% if sources | length %}
    <ul>
        {% for source in sources %}
            <li>{{ source.name }}</li>
        {% endfor %}
    </ul>
{% else %}
    <p>No analytics sources are configured.</p>
{% endif %}
```

An administrator's overview might use `getAllSources()` instead and mark the disabled ones:

```twig
<ul>
    {% for source in craft.metrix.getAllSources() %}
        <li>
            {{ source.name }}

            {% if not source.enabled %}
                (disabled)
            {% endif %}
        </li>
    {% endfor %}
</ul>
```

A configured source can still fail to return data, because OAuth credentials can expire or a provider can reject a request. Handle provider errors where the data request happens.

Sources hold provider credentials, tokens and site IDs in their settings. Don't output a source's settings in a template, and keep pages that list sources to people who should see them.
