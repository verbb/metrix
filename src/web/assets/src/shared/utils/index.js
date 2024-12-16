export * from './api';
export * from './classes';
export * from './theme';
export * from './chart-colors';
export * from './format';
export * from './sort';
export * from './forms';
export * from './query';

// Add a single container for portal content to be added to. Radix doesn't support customising the portal
// attributes, and we need to add `metrix-ui` to all portal items, and we can't add extra divs to
// portal components without messing up things (Dialog).
export const addPortalContainer = () => {
    if (!document.querySelector('.metrix-portal-container.metrix-ui')) {
        const portalContainer = document.createElement('div');
        portalContainer.className = 'metrix-portal-container metrix-ui';

        document.body.appendChild(portalContainer);
    }
};
