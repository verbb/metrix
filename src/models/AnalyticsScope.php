<?php
namespace verbb\metrix\models;

use Craft;
use craft\base\Model;
use craft\models\Site;

/**
 * View-level analytics filter applied when fetching widget data.
 *
 * Modes:
 * - none: no filter
 * - craftSite: resolve hostname/path from a Craft site’s base URL
 * - path: explicit path prefix (page path)
 * - hostname: explicit hostname
 */
class AnalyticsScope extends Model
{
    // Constants
    // =========================================================================

    public const MODE_NONE = 'none';
    public const MODE_CRAFT_SITE = 'craftSite';
    public const MODE_PATH = 'path';
    public const MODE_HOSTNAME = 'hostname';

    public const MATCH_BEGINS_WITH = 'begins_with';
    public const MATCH_EXACT = 'exact';
    public const MATCH_CONTAINS = 'contains';


    // Properties
    // =========================================================================

    public string $mode = self::MODE_NONE;
    public ?int $craftSiteId = null;
    public ?string $pathPrefix = null;
    public ?string $hostname = null;
    public string $match = self::MATCH_BEGINS_WITH;


    // Static Methods
    // =========================================================================

    public static function fromConfig(mixed $config): self
    {
        if ($config instanceof self) {
            return $config;
        }

        if (!is_array($config)) {
            return new self();
        }

        return new self([
            'mode' => $config['mode'] ?? self::MODE_NONE,
            'craftSiteId' => isset($config['craftSiteId']) && $config['craftSiteId'] !== ''
                ? (int)$config['craftSiteId']
                : null,
            'pathPrefix' => $config['pathPrefix'] ?? null,
            'hostname' => $config['hostname'] ?? null,
            'match' => $config['match'] ?? self::MATCH_BEGINS_WITH,
        ]);
    }


    // Public Methods
    // =========================================================================

    public function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['mode'], 'in', 'range' => [
            self::MODE_NONE,
            self::MODE_CRAFT_SITE,
            self::MODE_PATH,
            self::MODE_HOSTNAME,
        ]];
        $rules[] = [['match'], 'in', 'range' => [
            self::MATCH_BEGINS_WITH,
            self::MATCH_EXACT,
            self::MATCH_CONTAINS,
        ]];
        $rules[] = [['craftSiteId'], 'required', 'when' => fn() => $this->mode === self::MODE_CRAFT_SITE];
        $rules[] = [['pathPrefix'], 'required', 'when' => fn() => $this->mode === self::MODE_PATH];
        $rules[] = [['hostname'], 'required', 'when' => fn() => $this->mode === self::MODE_HOSTNAME];

        return $rules;
    }

    public function toConfig(): array
    {
        return [
            'mode' => $this->mode,
            'craftSiteId' => $this->craftSiteId,
            'pathPrefix' => $this->pathPrefix !== null && $this->pathPrefix !== ''
                ? $this->normalizePathPrefix($this->pathPrefix)
                : null,
            'hostname' => $this->hostname !== null && $this->hostname !== ''
                ? strtolower(trim($this->hostname))
                : null,
            'match' => $this->match ?: self::MATCH_BEGINS_WITH,
        ];
    }

    public function isActive(): bool
    {
        if ($this->mode === self::MODE_NONE) {
            return false;
        }

        return $this->getResolvedHostname() !== null || $this->getResolvedPathPrefix() !== null;
    }

    /**
     * Stable cache-key fragment for this scope (resolved values, not just stored IDs).
     */
    public function cacheKey(): string
    {
        if (!$this->isActive()) {
            return 'scope:none';
        }

        return 'scope:' . implode(':', array_filter([
            $this->mode,
            $this->getResolvedHostname(),
            $this->getResolvedPathPrefix(),
            $this->getHostnameMatch(),
            $this->getPathMatch(),
        ], fn($v) => $v !== null && $v !== ''));
    }

    public function getResolvedHostname(): ?string
    {
        if ($this->mode === self::MODE_HOSTNAME) {
            $host = strtolower(trim((string)$this->hostname));

            return $host !== '' ? $host : null;
        }

        if ($this->mode === self::MODE_CRAFT_SITE) {
            $resolved = $this->_resolveCraftSite();

            return $resolved['hostname'] ?? null;
        }

        return null;
    }

    public function getResolvedPathPrefix(): ?string
    {
        if ($this->mode === self::MODE_PATH) {
            return $this->normalizePathPrefix((string)$this->pathPrefix);
        }

        if ($this->mode === self::MODE_CRAFT_SITE) {
            $resolved = $this->_resolveCraftSite();

            return $resolved['pathPrefix'] ?? null;
        }

        return null;
    }

    /** Match mode for hostname filters (Craft site → exact). */
    public function getHostnameMatch(): string
    {
        return $this->mode === self::MODE_CRAFT_SITE
            ? self::MATCH_EXACT
            : ($this->match ?: self::MATCH_BEGINS_WITH);
    }

    /** Match mode for path filters (Craft site → begins with). */
    public function getPathMatch(): string
    {
        return $this->mode === self::MODE_CRAFT_SITE
            ? self::MATCH_BEGINS_WITH
            : ($this->match ?: self::MATCH_BEGINS_WITH);
    }

    public function getCraftSite(): ?Site
    {
        if (!$this->craftSiteId) {
            return null;
        }

        return Craft::$app->getSites()->getSiteById($this->craftSiteId);
    }

    public function getSummaryLabel(): ?string
    {
        if (!$this->isActive()) {
            return null;
        }

        if ($this->mode === self::MODE_CRAFT_SITE && ($site = $this->getCraftSite())) {
            return Craft::t('metrix', 'Craft site: {name}', ['name' => $site->name]);
        }

        if ($host = $this->getResolvedHostname()) {
            return Craft::t('metrix', 'Hostname: {value}', ['value' => $host]);
        }

        if ($path = $this->getResolvedPathPrefix()) {
            return Craft::t('metrix', 'Path: {value}', ['value' => $path]);
        }

        return null;
    }

    public function normalizePathPrefix(string $path): ?string
    {
        $path = trim($path);

        if ($path === '') {
            return null;
        }

        if (!str_starts_with($path, '/')) {
            $path = '/' . $path;
        }

        // Root path matches everything — treat as no path filter.
        if ($path === '/') {
            return null;
        }

        return $path;
    }


    // Private Methods
    // =========================================================================

    /**
     * Map a Craft site base URL to hostname and/or path filters.
     * Different host from primary → hostname. Same host → path prefix.
     *
     * @return array{hostname: ?string, pathPrefix: ?string}
     */
    private function _resolveCraftSite(): array
    {
        $site = $this->getCraftSite();

        if (!$site) {
            return ['hostname' => null, 'pathPrefix' => null];
        }

        $siteUrl = rtrim((string)$site->getBaseUrl(), '/');
        $siteParts = parse_url($siteUrl) ?: [];
        $siteHost = isset($siteParts['host']) ? strtolower((string)$siteParts['host']) : null;
        $sitePath = $this->normalizePathPrefix($siteParts['path'] ?? '/');

        $primary = Craft::$app->getSites()->getPrimarySite();
        $primaryUrl = rtrim((string)$primary->getBaseUrl(), '/');
        $primaryHost = strtolower((string)(parse_url($primaryUrl, PHP_URL_HOST) ?: ''));

        // Distinct domain/subdomain → filter by hostname (covers multi-domain Craft).
        if ($siteHost && $primaryHost && strcasecmp($siteHost, $primaryHost) !== 0) {
            return [
                'hostname' => $siteHost,
                'pathPrefix' => null,
            ];
        }

        // Shared root URL → path-prefix filter (e.g. /en, /fr).
        return [
            'hostname' => null,
            'pathPrefix' => $sitePath,
        ];
    }
}
