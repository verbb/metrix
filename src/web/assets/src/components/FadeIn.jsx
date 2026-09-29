import { cn } from '@utils';

export function FadeIn({ className, show, children }) {
    return (
        <div
            className={cn(
                'h-full',
                (show ? 'fade-enter-active' : 'fade-enter'),
                className,
            )}
        >
            {show ? children : null}
        </div>
    );
}
