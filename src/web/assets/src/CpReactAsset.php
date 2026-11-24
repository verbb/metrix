<?php
namespace verbb\metrix\web\assets\src;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset as CraftCpAsset;
use craft\web\View;

use verbb\base\web\assets\cp\CpAsset as VerbbCpAsset;

class CpReactAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = '@verbb/metrix/web/assets/dist';

        $this->depends = [
            MetrixCpAsset::class,
            VerbbCpAsset::class,
            CraftCpAsset::class,
        ];

        parent::init();
    }

    public function registerAssetFiles($view): void
    {
        parent::registerAssetFiles($view);

        if ($view instanceof View) {
            $view->registerTranslations('metrix', [
                '(done)' => '(done)',
                'Add a source' => 'Add a source',
                'Add and connect a source to see its data here.' => 'Add and connect a source to see its data here.',
                'Add New Widget' => 'Add New Widget',
                'Add widgets' => 'Add widgets',
                'Add widgets or load a preset' => 'Add widgets or load a preset',
                'An error occurred.' => 'An error occurred.',
                'Are you sure you want to delete this widget? This action cannot be undone.' => 'Are you sure you want to delete this widget? This action cannot be undone.',
                'Build Your Analytics Dashboard' => 'Build Your Analytics Dashboard',
                'Cancel' => 'Cancel',
                'Choose the analytics service Metrix reads from, such as Google Analytics, Plausible or Fathom.' => 'Choose the analytics service Metrix reads from, such as Google Analytics, Plausible or Fathom.',
                'Column Size' => 'Column Size',
                'Column {num}' => 'Column {num}',
                'Configure views' => 'Configure views',
                'Configure views to display your widgets.' => 'Configure views to display your widgets.',
                'Connect source' => 'Connect source',
                'Connect your source' => 'Connect your source',
                'Connect “{name}” so Metrix can read its data.' => 'Connect “{name}” so Metrix can read its data.',
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
                'Go to sources' => 'Go to sources',
                'Loading…' => 'Loading…',
                'Metrix can read data from your source.' => 'Metrix can read data from your source.',
                'New source' => 'New source',
                'No dashboard views are available to you.' => 'No dashboard views are available to you.',
                'No widgets have been added to this view.' => 'No widgets have been added to this view.',
                'Presets' => 'Presets',
                'Sign in to the service or check its API credentials so Metrix can read its data.' => 'Sign in to the service or check its API credentials so Metrix can read its data.',
                'Someone who can manage Metrix sources and dashboard layouts can finish these steps.' => 'Someone who can manage Metrix sources and dashboard layouts can finish these steps.',
                'Start from a preset dashboard or add widgets one at a time.' => 'Start from a preset dashboard or add widgets one at a time.',
                'This source needs to be reconnected. Open Sources, edit the source, and connect again.' => 'This source needs to be reconnected. Open Sources, edit the source, and connect again.',
                'Failed to load options. Please try again.' => 'Failed to load options. Please try again.',
                'Failed to load preset widgets.' => 'Failed to load preset widgets.',
                'Failed to load widgets.' => 'Failed to load widgets.',
                'Failed to update widget. Please try again.' => 'Failed to update widget. Please try again.',
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
                'Show error details' => 'Show error details',
                'Something went wrong' => 'Something went wrong',
                'Start adding widgets to see your data at a glance.' => 'Start adding widgets to see your data at a glance.',
                'The dashboard failed to load. Please refresh the page or try again.' => 'The dashboard failed to load. Please refresh the page or try again.',
                'The presets editor failed to load. Please refresh the page or try again.' => 'The presets editor failed to load. Please refresh the page or try again.',
                'This source does not support realtime data.' => 'This source does not support realtime data.',
                'Reload' => 'Reload',
                'Unable to load preset.' => 'Unable to load preset.',
                'Widget Settings' => 'Widget Settings',
                'Your widgets will show here. Each step ticks itself off when Metrix sees it done.' => 'Your widgets will show here. Each step ticks itself off when Metrix sees it done.',
                '{attribute} is required.' => '{attribute} is required.',
                '{attribute} must be at least {value} characters long.' => '{attribute} must be at least {value} characters long.',
                '{attribute} must be no more than {value} characters long.' => '{attribute} must be no more than {value} characters long.',
                '{done} of {total} done' => '{done} of {total} done',
            ]);
        }
    }
}
