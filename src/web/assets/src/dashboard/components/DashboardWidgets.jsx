import { AnimatePresence } from 'framer-motion';

import { cn } from '@utils';
import { getWidgetComponent } from '@utils/widgets';

export const DashboardWidgets = ({ widgets, loading }) => {
    return (
        <div
            className={cn(
                'grid auto-rows-widgets gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                loading ? 'opacity-10' : '',
            )}
        >
            <AnimatePresence>
                {widgets.map((widget) => {
                    // Always derive from data.type so chart type changes apply without a grid remount key.
                    const Component = getWidgetComponent(widget.data?.type) ?? widget.component;

                    return Component !== null ? (
                        <Component
                            key={widget.__id}
                            widget={widget}
                            wrapperClassName={cn(
                                'col-span-1',
                                widget.data.width === '2' ? 'lg:col-span-2' : '',
                                widget.data.width === '3' ? 'lg:col-span-3' : '',
                            )}
                        />
                    ) : '';
                })}
            </AnimatePresence>
        </div>
    );
};
