<?php
namespace verbb\metrix\events;

use verbb\metrix\base\SourceInterface;

use yii\base\Event;

class SourceEvent extends Event
{
    // Properties
    // =========================================================================

    public SourceInterface $source;
    public bool $isNew = false;

}
