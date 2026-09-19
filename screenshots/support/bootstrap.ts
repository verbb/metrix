import { registerPluginBootstrap } from '@verbb/craft-screenshots/api';

export default registerPluginBootstrap({
    id: 'metrix',
    async setup(context) {
        await context.runCraft(['migrate/up', '--plugin=metrix'], { allowFailure: true });
    },
});
