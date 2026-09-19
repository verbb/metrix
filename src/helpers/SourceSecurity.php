<?php
namespace verbb\metrix\helpers;

use verbb\metrix\base\CredentialsSource;

use Craft;

class SourceSecurity
{
    // Static Methods
    // =========================================================================

    /**
     * Keep environment-backed secrets under administrator control while allowing
     * delegated managers to update ordinary source settings.
     */
    public static function validateDelegatedChange(CredentialsSource $source, ?CredentialsSource $original = null): bool
    {
        $settings = $source->getSettings();
        $originalSettings = $original?->getSettings() ?? [];
        $valid = true;

        foreach ($settings as $attribute => $value) {
            if (self::_containsReference($value) && ($original === null || ($originalSettings[$attribute] ?? null) !== $value)) {
                $source->addError($attribute, Craft::t('metrix', 'Only administrators can add or change environment-variable and alias references.'));
                $valid = false;
            }
        }

        if (self::_containsReference($settings)) {
            foreach ($source->getEndpointAttributes() as $attribute) {
                if (($settings[$attribute] ?? null) !== ($originalSettings[$attribute] ?? null)) {
                    $source->addError($attribute, Craft::t('metrix', 'Only administrators can change a provider URL while this source uses environment-backed settings.'));
                    $valid = false;
                }
            }
        }

        return $valid;
    }


    // Private Methods
    // =========================================================================

    private static function _containsReference(mixed $value): bool
    {
        if (is_array($value)) {
            foreach ($value as $item) {
                if (self::_containsReference($item)) {
                    return true;
                }
            }

            return false;
        }

        if (!is_string($value)) {
            return false;
        }

        return str_starts_with($value, '@')
            || preg_match('/^\$\w+$/', $value) === 1
            || preg_match('/\$\{\w+}/', $value) === 1
            || preg_match('/(?<=^|\/)\$\w+(?=$|\/)/', $value) === 1;
    }
}
