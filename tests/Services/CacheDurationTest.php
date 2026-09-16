<?php

declare(strict_types=1);

use verbb\metrix\models\Settings;

it('accepts cache durations in seconds or ISO intervals', function(string $duration, int $seconds) {
    $settings = new Settings(['cacheDuration' => $duration]);
    expect($settings->validate())->toBeTrue()
        ->and($settings->getCacheDuration())->toBe($seconds);
})->with([['600', 600], [' 60 ', 60], ['PT10M', 600], ['P1D', 86400], ['0', 0]]);

it('rejects invalid cache durations before settings are saved', function(string $duration) {
    $settings = new Settings(['cacheDuration' => $duration]);
    expect($settings->validate())->toBeFalse()
        ->and($settings->hasErrors('cacheDuration'))->toBeTrue();
})->with(['tomorrow', '', '-10', '2.5']);

it('does not require a duration when caching is disabled', function() {
    $settings = new Settings(['enableCache' => false, 'cacheDuration' => '']);
    expect($settings->validate())->toBeTrue()->and($settings->getCacheDuration())->toBe(1);
});
