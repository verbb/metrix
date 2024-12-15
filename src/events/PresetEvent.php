<?php
namespace verbb\metrix\events;

use verbb\metrix\models\Preset;

use yii\base\Event;

class PresetEvent extends Event
{
    // Properties
    // =========================================================================

    public ?Preset $preset = null;
    public bool $isNew = false;

}
