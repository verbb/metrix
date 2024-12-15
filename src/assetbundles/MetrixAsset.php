<?php
namespace verbb\metrix\assetbundles;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use craft\web\View;

use verbb\base\assetbundles\CpAsset as VerbbCpAsset;

class MetrixAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = '@verbb/metrix/web/assets/dist';

        $this->depends = [
            VerbbCpAsset::class,
            CpAsset::class,
        ];

        parent::init();
    }

    public function registerAssetFiles($view): void
    {
        parent::registerAssetFiles($view);

        if ($view instanceof View) {
            $view->registerTranslations('metrix', [
                'Add a data source to start using widgets.' => 'Add a data source to start using widgets.',
                'Add New Widget' => 'Add New Widget',
                'An error occurred.' => 'An error occurred.',
                'Are you sure you want to delete this widget? This action cannot be undone.' => 'Are you sure you want to delete this widget? This action cannot be undone.',
                'Cancel' => 'Cancel',
                'Column Size' => 'Column Size',
                'Column {num}' => 'Column {num}',
                'Configure views to display your widgets.' => 'Configure views to display your widgets.',
                'Create' => 'Create',
                'Create a new widget.' => 'Create a new widget.',
                'Dashboard' => 'Dashboard',
                'Delete' => 'Delete',
                'Details' => 'Details',
                'Duplicate' => 'Duplicate',
                'Edit Widget' => 'Edit Widget',
                'Failed to delete widget. Please try again.' => 'Failed to delete widget. Please try again.',
                'Failed to duplicate widget. Please try again.' => 'Failed to duplicate widget. Please try again.',
                'Failed to fetch widget data. Please try again.' => 'Failed to fetch widget data. Please try again.',
                'Failed to load options. Please try again.' => 'Failed to load options. Please try again.',
                'Failed to load preset widgets.' => 'Failed to load preset widgets.',
                'Failed to load widgets.' => 'Failed to load widgets.',
                'Failed to update widget. Please try again.' => 'Failed to update widget. Please try again.',
                'Load preset widgets' => 'Load preset widgets',
                'Modify widget settings.' => 'Modify widget settings.',
                'New widget' => 'New widget',
                'No data available.' => 'No data available.',
                'No options found.' => 'No options found.',
                'No sources available' => 'No sources available',
                'No views available' => 'No views available',
                'No widgets yet' => 'No widgets yet',
                'Other' => 'Other',
                'Pick a date' => 'Pick a date',
                'Remove Widget' => 'Remove Widget',
                'Save' => 'Save',
                'Search options...' => 'Search options...',
                'Select option...' => 'Select option...',
                'Settings' => 'Settings',
                'Start adding widgets to see your data at a glance.' => 'Start adding widgets to see your data at a glance.',
                'Widget Settings' => 'Widget Settings',
                '{attribute} is required.' => '{attribute} is required.',
                '{attribute} must be at least {value} characters long.' => '{attribute} must be at least {value} characters long.',
                '{attribute} must be no more than {value} characters long.' => '{attribute} must be no more than {value} characters long.',
            ]);
        }
    }
}
