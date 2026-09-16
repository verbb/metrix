# Selecting Sources

A source represents a configured connection. To work with a specific source, use the handle saved in its settings. The following example assumes a source with handle `analytics`; a missing source is handled explicitly:

```twig
{% set source = craft.metrix.getSourceByHandle('analytics') %}
{% if source %}
    <p>{{ source.name }}</p>
{% else %}
    <p>The analytics source is unavailable.</p>
{% endif %}
```

## List Available Sources

Use configured Sources when a template needs to present a choice without including incomplete connections:

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

`getAllSources()` includes every saved Source, while `getAllEnabledSources()` excludes disabled Sources. `getAllConfiguredSources()` is the safest choice for a task that needs working credentials. OAuth credentials can still expire, so handle provider errors where the data request occurs.

These calls return [Source](docs:developers/source) objects. Do not expose provider credentials, tokens or raw settings in template output.
