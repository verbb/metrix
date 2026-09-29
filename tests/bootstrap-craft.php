<?php
require_once __DIR__ . '/runtime/bootstrap.php';

$_SERVER['HTTP_HOST'] = 'cp-test.test';
$_SERVER['REQUEST_URI'] = '/index.php?p=admin';
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = CRAFT_WEB_ROOT . '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';
$_SERVER['DOCUMENT_ROOT'] = CRAFT_WEB_ROOT;

$app = require CRAFT_VENDOR_PATH . '/craftcms/cms/bootstrap/web.php';
$app->getUser()->enableSession = false;
$app->getUser()->enableAutoLogin = false;

require __DIR__ . '/runtime/verify.php';
