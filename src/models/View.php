<?php
namespace verbb\metrix\models;

use craft\base\Model;

use DateTime;

class View extends Model
{
    // Properties
    // =========================================================================

    public ?int $id = null;
    public ?string $name = null;
    public ?string $handle = null;
    public ?int $sortOrder = null;
    public ?DateTime $dateCreated = null;
    public ?DateTime $dateUpdated = null;
    public ?string $uid = null;

}
