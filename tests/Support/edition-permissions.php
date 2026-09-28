<?php

declare(strict_types=1);

require dirname(__DIR__) . '/runtime/bootstrap.php';

$edition = \craft\enums\CmsEdition::fromHandle($argv[1]);
putenv('CRAFT_EDITION=' . $edition->handle());
$_ENV['CRAFT_EDITION'] = $_SERVER['CRAFT_EDITION'] = $edition->handle();
$app = require CRAFT_VENDOR_PATH . '/craftcms/cms/bootstrap/console.php';
$names = [];
$collectNames = function(array $permissions) use (&$collectNames, &$names): void {
    foreach ($permissions as $name => $config) {
        $names[] = $name;

        if (isset($config['nested'])) {
            $collectNames($config['nested']);
        }
    }
};

foreach ($app->getUserPermissions()->getAllPermissions() as $group) {
    $collectNames($group['permissions']);
}

$teamGranted = null;
if ($edition === \craft\enums\CmsEdition::Team) {
    $transaction = $app->getDb()->beginTransaction();
    try {
        $group = $app->getUserGroups()->getTeamGroup();
        $app->getUserGroups()->saveGroup($group);
        $app->getUserPermissions()->saveGroupPermissions($group->id, ['accessPlugin-metrix', 'metrix-dashboard']);
        $app->getProjectConfig()->saveModifiedConfigData();
        $teamGranted = $app->getUserPermissions()->doesGroupHavePermission($group->id, 'metrix-dashboard');
    } finally {
        $transaction->rollBack();
        $app->getProjectConfig()->reset();
    }
}

echo json_encode(['edition' => $app->edition->handle(), 'permissions' => $names, 'teamGranted' => $teamGranted], JSON_THROW_ON_ERROR);
