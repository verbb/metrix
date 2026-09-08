<?php
/**
 * Registers DocsDemoSource for ephemeral docs-screenshot Craft installs.
 */

namespace modules\metrixdocs;

use craft\events\RegisterComponentTypesEvent;
use verbb\metrix\services\Sources;
use yii\base\Event;
use yii\base\Module as BaseModule;

class Module extends BaseModule
{
    public function init(): void
    {
        parent::init();

        Event::on(
            Sources::class,
            Sources::EVENT_REGISTER_SOURCE_TYPES,
            static function(RegisterComponentTypesEvent $event): void {
                $event->types[] = DocsDemoSource::class;
            },
        );
    }
}
