<?php
namespace verbb\metrix\events;

use verbb\metrix\models\View;

use yii\base\Event;

class ViewEvent extends Event
{
    // Properties
    // =========================================================================

    public ?View $view = null;
    public bool $isNew = false;

}
