<?php
namespace verbb\metrix\widgets;

use verbb\metrix\base\Widget;

use craft\base\MissingComponentInterface;
use craft\base\MissingComponentTrait;
use craft\helpers\Component as ComponentHelper;

class MissingWidget extends Widget implements MissingComponentInterface
{
    // Traits
    // =========================================================================

    use MissingComponentTrait;


    // Public Methods
    // =========================================================================

    public function __construct(array $config = [])
    {
        $config = ComponentHelper::mergeSettings($config);
        $settings = [];

        // Keep extension-defined settings until the original widget class becomes available.
        foreach ($config as $name => $value) {
            if (!$this->canSetProperty($name)) {
                $settings[$name] = $value;
                unset($config[$name]);
            }
        }

        $config['settings'] = $settings;
        parent::__construct($config);
    }

    public function getFrontEndData(): array
    {
        return array_merge(parent::getFrontEndData(), [
            'expectedType' => $this->expectedType,
            'settings' => $this->settings,
        ]);
    }
}
