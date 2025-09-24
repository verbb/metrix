<?php
namespace verbb\metrix\models;

use craft\base\Model;

use DateTime;
use DateTimeInterface;

class View extends Model
{
    // Properties
    // =========================================================================

    public ?int $id = null;
    public ?string $name = null;
    public ?string $handle = null;
    public ?int $sortOrder = null;
    public ?DateTimeInterface $dateCreated = null;
    public ?DateTimeInterface $dateUpdated = null;
    public ?string $uid = null;

}
