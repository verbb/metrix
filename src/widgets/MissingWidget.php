<?php
namespace verbb\metrix\widgets;

use verbb\metrix\Metrix;
use verbb\metrix\base\Widget;
use verbb\metrix\helpers\Schema;

use Craft;
use craft\base\MissingComponentInterface;
use craft\base\MissingComponentTrait;
use craft\helpers\App;

use Throwable;

class MissingWidget extends Widget implements MissingComponentInterface
{
    // Traits
    // =========================================================================

    use MissingComponentTrait;

}