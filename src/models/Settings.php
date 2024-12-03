<?php
namespace verbb\metrix\models;

use craft\base\Model;

class Settings extends Model
{
    // Properties
    // =========================================================================

    public string $pluginName = 'Metrix';
    public bool $hasCpSection = true;
}
