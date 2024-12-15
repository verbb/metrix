<?php
namespace verbb\metrix\events;

use verbb\metrix\base\WidgetInterface;

use yii\base\Event;

class WidgetEvent extends Event
{
    // Properties
    // =========================================================================

    public WidgetInterface $widget;
    public bool $isNew = false;

}
