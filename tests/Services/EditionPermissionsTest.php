<?php

declare(strict_types=1);

it('registers dashboard permissions in every Craft edition with user permissions', function(string $edition) {
    $process = proc_open([PHP_BINARY, dirname(__DIR__) . '/Support/edition-permissions.php', $edition], [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
    $output = stream_get_contents($pipes[1]);
    $errors = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);

    expect(proc_close($process))->toBe(0, $errors);
    $result = json_decode($output, true, 512, JSON_THROW_ON_ERROR);
    expect($result['edition'])->toBe($edition)->and($result['permissions'])->toContain('metrix-dashboard');
    if ($edition === 'team') {
        expect($result['teamGranted'])->toBeTrue();
    }
})->with(['team', 'pro', 'enterprise']);
