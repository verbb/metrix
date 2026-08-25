<?php
namespace verbb\metrix\helpers;

use verbb\metrix\Metrix;
use verbb\metrix\base\WidgetInterface;
use verbb\metrix\models\View;

use Craft;
use craft\web\User;

use yii\web\ForbiddenHttpException;

class DashboardPermissions
{
    // Static Methods
    // =========================================================================

    public static function requireDashboardAccess(): void
    {
        $user = Craft::$app->getUser();

        if (!$user->getIdentity()) {
            throw new ForbiddenHttpException(Craft::t('metrix', 'You do not have permission to access the dashboard.'));
        }

        if (!$user->checkPermission('metrix-dashboard')) {
            throw new ForbiddenHttpException(Craft::t('metrix', 'You do not have permission to access the dashboard.'));
        }
    }

    public static function requireViewAccess(?View $view): void
    {
        self::requireDashboardAccess();

        if (!$view) {
            throw new ForbiddenHttpException(Craft::t('metrix', 'Unable to find view.'));
        }

        if (!self::canAccessView($view)) {
            throw new ForbiddenHttpException(Craft::t('metrix', 'You do not have permission to view “{name}”.', [
                'name' => $view->name,
            ]));
        }
    }

    public static function requireViewHandleAccess(?string $viewHandle): ?View
    {
        if (!$viewHandle) {
            throw new ForbiddenHttpException(Craft::t('metrix', 'Provide a valid view.'));
        }

        $view = Metrix::$plugin->getViews()->getViewByHandle($viewHandle);
        self::requireViewAccess($view);

        return $view;
    }

    public static function requireWidgetAccess(WidgetInterface $widget): void
    {
        self::requireViewAccess($widget->getView());
    }

    public static function canAccessView(View $view): bool
    {
        return self::user()->checkPermission('metrix-dashboard:' . $view->uid);
    }

    private static function user(): User
    {
        return Craft::$app->getUser();
    }
}
