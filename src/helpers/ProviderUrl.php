<?php
namespace verbb\metrix\helpers;

use verbb\metrix\Metrix;

use Craft;

use yii\base\InvalidArgumentException;

use CraftCms\UrlValidator\UrlValidationException;
use CraftCms\UrlValidator\UrlValidator;
use GuzzleHttp\RequestOptions;
use GuzzleHttp\TransferStats;

class ProviderUrl
{
    // Properties
    // =========================================================================

    private static mixed $_resolver = null;


    // Public Methods
    // =========================================================================

    /**
     * Build Guzzle safeguards for a configurable provider origin.
     */
    public static function requestOptions(string $url): array
    {
        if (parse_url($url, PHP_URL_USER) !== null || parse_url($url, PHP_URL_PASS) !== null) {
            throw new InvalidArgumentException(Craft::t('metrix', 'Provider URLs cannot contain user credentials.'));
        }

        $validator = self::_validator($url);

        try {
            $ips = $validator->validate($url);
        } catch (UrlValidationException $e) {
            throw new InvalidArgumentException(Craft::t('metrix', 'The provider URL is not a permitted remote address.'), previous: $e);
        }

        $host = (string)parse_url($url, PHP_URL_HOST);
        $port = parse_url($url, PHP_URL_PORT)
            ?? (strtolower((string)parse_url($url, PHP_URL_SCHEME)) === 'https' ? 443 : 80);

        $options = [
            RequestOptions::ALLOW_REDIRECTS => false,
            RequestOptions::ON_STATS => function(TransferStats $stats) use ($url, $validator) {
                $ip = $stats->getHandlerStat('primary_ip');

                if ($ip && !$validator->validateIp($ip)) {
                    throw new InvalidArgumentException(Craft::t('metrix', 'The provider URL resolved to a prohibited address: {url}', [
                        'url' => $url,
                    ]));
                }
            },
        ];

        // Pin cURL to the already-validated answers so DNS cannot change between
        // validation and connection. The transfer check covers non-cURL handlers.
        if (defined('CURLOPT_RESOLVE')) {
            $options['curl'] = [
                CURLOPT_RESOLVE => ["$host:$port:" . implode(',', $ips)],
            ];
        }

        return $options;
    }

    /** Test seam for deterministic DNS without weakening production defaults. */
    public static function setResolver(?callable $resolver): void
    {
        self::$_resolver = $resolver;
    }


    // Private Methods
    // =========================================================================

    private static function _validator(string $url): UrlValidator
    {
        $host = self::_normalizeHost((string)parse_url($url, PHP_URL_HOST));
        $allowedHosts = array_map(self::_normalizeHost(...), Metrix::$plugin->getSettings()->allowedPrivateProviderHosts);
        $options = null;

        if (in_array($host, $allowedHosts, true)) {
            // A config-file allowlist is an administrator-owned exception for
            // internal self-hosted providers. URL syntax and DNS pinning still apply.
            $options = [
                'disallowedHostnames' => [],
                'disallowedIpv4Addresses' => [],
                'disallowedIpv4Ranges' => [],
                'ipv4FilterFlags' => FILTER_FLAG_IPV4,
                'ipv6FilterFlags' => FILTER_FLAG_IPV6,
            ];
        }

        return new UrlValidator(self::$_resolver, $options);
    }

    private static function _normalizeHost(string $host): string
    {
        return rtrim(strtolower($host), '.');
    }
}
