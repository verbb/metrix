<?php
namespace verbb\metrix\assetbundles;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

use verbb\base\assetbundles\CpAsset as VerbbCpAsset;

class MetrixAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        // $this->sourcePath = "@verbb/metrix/resources/dist";

        $this->depends = [
            VerbbCpAsset::class,
            CpAsset::class,
        ];

        // $this->css = [
        //     'css/metrix.css',
        // ];

        // $this->js = [
        //     'js/metrix.js',
        // ];

        parent::init();
    }
}
