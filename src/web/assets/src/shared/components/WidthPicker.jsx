import { useState } from 'react';

import { cn } from '@utils';

export const WidthPicker = ({ value, onChange }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="width-picker">
            {[0, 1, 2].map((index) => {
                const isHoveredOrPrevious = hoveredIndex !== null ? index <= hoveredIndex : index <= value - 1;

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
                        (hoveredIndex === null && index === value - 1) || // Active column when no hover
                        (isLast && hoveredIndex === null) // Last column when no hover
                    ) {
                        cornerClass.push('rounded-right');
                    }
                }

                return (
                    <a
                        key={index}
                        title={Craft.t('metrix', 'Column {num}', { num: index + 1 })}
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
                            onChange((index + 1).toString()); // Update value when clicked.
                        }}
                    ></a>
                );
            })}
        </div>
    );
};
