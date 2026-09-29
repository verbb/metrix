<?php
namespace verbb\metrix\helpers;

use verbb\metrix\base\CredentialSourceInterface;
use verbb\metrix\base\CredentialsSource;
use verbb\metrix\base\SourceInterface;

use Craft;

class SourceSecurity
{
    // Static Methods
    // =========================================================================

    /**
     * Keep credentials and indirect configuration references behind the dedicated
     * permission while allowing delegated managers to update ordinary settings.
     */
    public static function validateDelegatedChange(SourceInterface $source, ?SourceInterface $original = null): bool
    {
        $settings = $source->getSettings();
        $originalSettings = $original?->getSettings() ?? [];
        $credentialAttributes = $source instanceof CredentialSourceInterface ? $source->getCredentialAttributes() : [];
        $valid = true;

        if ($original && get_class($source) !== get_class($original)) {
            $source->addError('type', Craft::t('metrix', 'You do not have permission to change a source’s provider type.'));
            $valid = false;
        }

        foreach ($credentialAttributes as $attribute) {
            if (self::_valuesDiffer($settings[$attribute] ?? null, $originalSettings[$attribute] ?? null)) {
                $source->addError($attribute, Craft::t('metrix', 'You do not have permission to add or change source credentials.'));
                $valid = false;
            }
        }

        foreach ($settings as $attribute => $value) {
            if (in_array($attribute, $credentialAttributes, true)) {
                continue;
            }

            if (self::_containsReference($value) && ($original === null || ($originalSettings[$attribute] ?? null) !== $value)) {
                $source->addError($attribute, Craft::t('metrix', 'You do not have permission to add or change environment-variable and alias references.'));
                $valid = false;
            }
        }

        if ($source instanceof CredentialsSource && self::_containsReference($settings)) {
            foreach ($source->getEndpointAttributes() as $attribute) {
                if (($settings[$attribute] ?? null) !== ($originalSettings[$attribute] ?? null)) {
                    $source->addError($attribute, Craft::t('metrix', 'You do not have permission to change a provider URL while this source uses environment-backed settings.'));
                    $valid = false;
                }
            }
        }

        return $valid;
    }

    /**
     * Preserve protected database values when config overrides mask them on the
     * runtime source used for validation.
     */
    public static function settingsForPersistence(SourceInterface $source, SourceInterface $storedSource): array
    {
        $settings = $source->getSettings();
        $storedSettings = $storedSource->getSettings();

        foreach (self::_protectedAttributes($storedSource) as $attribute) {
            if (array_key_exists($attribute, $storedSettings)) {
                $settings[$attribute] = $storedSettings[$attribute];
            } else {
                unset($settings[$attribute]);
            }
        }

        return $settings;
    }


    // Private Methods
    // =========================================================================

    private static function _protectedAttributes(SourceInterface $source): array
    {
        $settings = $source->getSettings();
        $attributes = $source instanceof CredentialSourceInterface ? $source->getCredentialAttributes() : [];

        foreach ($settings as $attribute => $value) {
            if (self::_containsReference($value)) {
                $attributes[] = $attribute;
            }
        }

        if ($source instanceof CredentialsSource && self::_containsReference($settings)) {
            $attributes = array_merge($attributes, $source->getEndpointAttributes());
        }

        return array_values(array_unique($attributes));
    }

    private static function _valuesDiffer(mixed $value, mixed $originalValue): bool
    {
        if (($value === null || $value === '') && ($originalValue === null || $originalValue === '')) {
            return false;
        }

        return $value !== $originalValue;
    }

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
