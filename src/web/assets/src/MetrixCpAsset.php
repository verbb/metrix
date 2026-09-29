<?php
namespace verbb\metrix\web\assets\src;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset as CraftCpAsset;

use verbb\base\assetbundles\CpAsset as VerbbCpAsset;

class MetrixCpAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = '@verbb/metrix/web/assets/dist';

        $this->depends = [
            VerbbCpAsset::class,
            CraftCpAsset::class,
        ];

        $this->css = [
            'src/cp/css/metrix-cp.css',
        ];

        parent::init();
    }
}
