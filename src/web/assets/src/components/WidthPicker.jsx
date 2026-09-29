import { useState } from 'react';

import { cn } from '@utils';

export const WidthPicker = ({ value, onChange }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    // Form values may arrive as strings; coerce so active columns match saved widgets.
    const activeWidth = Number(value) || 1;

    return (
        <div className="width-picker" role="group" aria-label={Craft.t('metrix', 'Widget width')}>
            {[0, 1, 2].map((index) => {
                const isHoveredOrPrevious = hoveredIndex !== null ? index <= hoveredIndex : index <= activeWidth - 1;

                const isFirst = index === 0;
                const isLast = index === 2;
                const cornerClass = [];

                if (isHoveredOrPrevious) {
                    if (isFirst) {
                        cornerClass.push('rounded-left');
                    }

                    // Round right corners only for:
                    // - The hovered column
                    // - The active column when no column is being hovered
                    // - The last column
                    if (
                        index === hoveredIndex || // Currently hovered column
                        (hoveredIndex === null && index === activeWidth - 1) || // Active column when no hover
                        (isLast && hoveredIndex === null) // Last column when no hover
                    ) {
                        cornerClass.push('rounded-right');
                    }
                }

                return (
                    <button
                        key={index}
                        type="button"
                        title={Craft.t('metrix', 'Column {num}', { num: index + 1 })}
                        aria-label={Craft.t('metrix', 'Column {num}', { num: index + 1 })}
                        aria-pressed={activeWidth === index + 1}
                        className={cn(
                            'width-picker-column',
                            isHoveredOrPrevious ? 'active' : '',
                            cornerClass,
                        )}
                        onMouseEnter={() => {
                            setHoveredIndex(index);
                        }}
                        onMouseLeave={() => {
                            setHoveredIndex(null);
                        }}
                        onClick={() => {
                            onChange(index + 1);
                        }}
                    ></button>
                );
            })}
        </div>
    );
};
