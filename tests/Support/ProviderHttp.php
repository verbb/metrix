<?php

declare(strict_types=1);

namespace Tests\Support;

use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\Psr7\Response;
use verbb\metrix\base\CredentialsSource;

final class ProviderHttp
{
    public static function mock(CredentialsSource $source, array $responses, array &$history): void
    {
        $handler = HandlerStack::create(new MockHandler(array_map(
            fn($response) => $response instanceof Response ? $response : new Response(200, ['Content-Type' => 'application/json'], json_encode($response)),
            $responses,
        )));
        $handler->push(Middleware::history($history));
        $config = $source->getClient()->getConfig();
        $config['handler'] = $handler;
        (new \ReflectionProperty(CredentialsSource::class, '_client'))->setValue($source, new Client($config));
    }
}
