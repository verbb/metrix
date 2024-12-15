import { useState } from 'react';
import { Check, ChevronsUpDown, ChevronDown } from 'lucide-react';

import { cn } from '@utils';

import { Button } from '@components/ui/Button';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@components/ui/Command';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@components/ui/Popover';

export function Combobox({
    options = [],
    value: controlledValue,
    onChange,
    placeholder = Craft.t('metrix', 'Select option...'),
    inputPlaceholder = Craft.t('metrix', 'Search options...'),
    emptyMessage = Craft.t('metrix', 'No options found.'),
    className,
    triggerProps = {},
    popoverProps = {},
    inputProps = {},
    itemProps = {},
}) {
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState('');
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleSelect = (selectedValue) => {
        if (controlledValue === undefined) {
            setInternalValue(selectedValue === value ? '' : selectedValue);
        }

        if (onChange) {
            onChange(selectedValue === value ? '' : selectedValue);
        }

        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen} {...popoverProps}>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        // Layout
                        'mc-flex mc-items-center mc-justify-between mc-gap-1',
                        'mc-px-2.5 mc-py-1.5 mc-text-sm',

                        // Appearance
                        'mc-rounded-[5px] mc-ring-offset-background mc-bg-slate-200 hover:mc-bg-slate-200',

                        // State
                        'hover:mc-shadow-inputRing placeholder:mc-text-slate-500 focus:mc-outline-none focus:mc-shadow-inputRing',
                        'disabled:mc-cursor-not-allowed disabled:mc-opacity-50 [&>span]:mc-line-clamp-1',
                        className,
                    )}
                    {...triggerProps}
                >
                    {value ? options.find((option) => { return option.value === value; })?.label : placeholder}
                    <ChevronDown className="mc-size-4 mc-ml-4 -mc-mr-1" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="mc-w-[200px] mc-p-0 mc-z-[110]">
                <Command>
                    <CommandInput
                        placeholder={inputPlaceholder}
                        {...inputProps}
                    />

                    <CommandList>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>

                        <CommandGroup>
                            {options.map((option) => {
                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => { return handleSelect(option.value); }}
                                        {...itemProps}
                                    >
                                        <Check
                                            className={cn(
                                                value === option.value ? 'mc-opacity-100' : 'mc-opacity-0',
                                            )}
                                        />

                                        {option.label}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
