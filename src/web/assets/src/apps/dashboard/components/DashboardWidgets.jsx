import { AnimatePresence } from 'framer-motion';

import { cn } from '@utils';

export const DashboardWidgets = ({ widgets, loading }) => {
    return (
        <div
            className={cn(
                'mc-grid mc-auto-rows-widgets mc-gap-4 mc-grid-cols-1 md:mc-grid-cols-2 lg:mc-grid-cols-3',
                loading ? 'mc-opacity-10' : '',
            )}
        >
            <AnimatePresence>
                {widgets.map((widget) => {
                    const Component = widget.component;

                    return widget.component !== null ? (
                        <Component
                            key={widget.__id}
                            widget={widget}
                            wrapperClassName={cn(
                                'mc-col-span-1',
                                widget.data.width === '2' ? 'lg:mc-col-span-2' : '',
                                widget.data.width === '3' ? 'lg:mc-col-span-3' : '',
                            )}
                        />
                    ) : '';
                })}
            </AnimatePresence>
        </div>
    );
};
