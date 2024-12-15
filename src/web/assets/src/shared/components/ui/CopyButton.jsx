import { useState, useEffect } from 'react';
import { CheckIcon, ClipboardIcon } from 'lucide-react';

import { Button } from '@components/ui/button';

import { cn } from '@utils';

export async function copyToClipboardWithMeta(value, event) {
    navigator.clipboard.writeText(value);
}

export function CopyButton({
    value,
    className,
    src,
    variant = 'ghost',
    event,
    ...props
}) {
    const [hasCopied, setHasCopied] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    }, [hasCopied]);

    return (
        <Button
            size="icon"
            variant={variant}
            className={cn(
                className,
            )}
            onClick={() => {
                copyToClipboardWithMeta(value);

                setHasCopied(true);
            }}
            {...props}
        >
            <span className="mc-sr-only">Copy</span>
            {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
        </Button>
    );
}
