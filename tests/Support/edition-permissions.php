<?php

declare(strict_types=1);

require dirname(__DIR__) . '/runtime/bootstrap.php';

$edition = \craft\enums\CmsEdition::fromHandle($argv[1]);
putenv('CRAFT_EDITION=' . $edition->handle());
$_ENV['CRAFT_EDITION'] = $_SERVER['CRAFT_EDITION'] = $edition->handle();
$app = require CRAFT_VENDOR_PATH . '/craftcms/cms/bootstrap/console.php';
$names = [];
foreach ($app->getUserPermissions()->getAllPermissions() as $group) {
    $names = array_merge($names, array_keys($group['permissions']));
}

$teamGranted = null;
if ($edition === \craft\enums\CmsEdition::Team) {
    $group = $app->getUserGroups()->getTeamGroup();
    $app->getUserPermissions()->saveGroupPermissions($group->id, ['accessPlugin-metrix', 'metrix-dashboard']);
    $app->getProjectConfig()->flush();
    $teamGranted = $app->getUserPermissions()->doesGroupHavePermission($group->id, 'metrix-dashboard');
}

echo json_encode(['edition' => $app->edition->handle(), 'permissions' => $names, 'teamGranted' => $teamGranted], JSON_THROW_ON_ERROR);
