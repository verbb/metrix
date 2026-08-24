// Register Metrix CP icon glyphs before any React tree mounts.
// Importing from `@verbb/plugin-kit-react/components` registers underlying `pk-*`
// elements — there is no registerAll step.

import '@verbb/plugin-kit-react/style.css';

import {
    arrowDown,
    arrowUp,
    check,
    clipboard,
    chevronDown,
    chevronLeft,
    chevronRight,
    ellipsis,
    ellipsisVertical,
    gear,
    gripDotsVertical,
    gripMove,
    magnifyingGlass,
    plus,
    registerIcons,
    trash,
    triangleExclamation,
    xmark,
} from '@verbb/plugin-kit-icons';

import {
    widgetBar,
    widgetCounter,
    widgetLine,
    widgetPie,
    widgetTable,
} from './icons/widgetIcons.js';

let registered = false;

export function registerMetrixIcons() {
    if (registered) {
        return;
    }

    registerIcons({
        arrowDown,
        arrowUp,
        check,
        clipboard,
        chevronDown,
        chevronLeft,
        chevronRight,
        ellipsis,
        ellipsisVertical,
        gear,
        gripDotsVertical,
        gripMove,
        magnifyingGlass,
        plus,
        trash,
        triangleExclamation,
        widgetBar,
        widgetCounter,
        widgetLine,
        widgetPie,
        widgetTable,
        xmark,
    });

    registered = true;
}

registerMetrixIcons();
