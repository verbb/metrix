import { Button } from '@verbb/plugin-kit-react/components/Button';
import {
    DropdownItem,
    DropdownLabel,
    DropdownMenu,
    DropdownSeparator,
} from '@verbb/plugin-kit-react/components/DropdownMenu';

import useAppStore from '@dashboard/hooks/useAppStore';

// One "Add widgets" button for an empty view, offering the presets first and a blank widget last.
export const AddWidgetsMenu = ({
    slot,
    variant,
    loading,
    onPresetSelect,
    onNewWidget,
}) => {
    const presets = useAppStore((state) => state.presets);

    // The setup checklist sets the trigger's variant itself, so only pass one when asked to.
    const variantProps = variant ? { variant } : {};

    return (
        <DropdownMenu slot={slot} placement="bottom-start">
            <Button
                slot="trigger"
                type="button"
                withCaret
                loading={loading}
                disabled={loading}
                {...variantProps}
            >
                {Craft.t('metrix', 'Add widgets')}
            </Button>

            {presets.length > 0 ? (
                <>
                    <DropdownLabel>{Craft.t('metrix', 'Presets')}</DropdownLabel>

                    {presets.map((preset) => (
                        <DropdownItem
                            key={preset.value}
                            value={preset.value}
                            onPkSelect={() => onPresetSelect(preset.value)}
                        >
                            {preset.label}
                        </DropdownItem>
                    ))}

                    <DropdownSeparator />
                </>
            ) : null}

            <DropdownItem value="new-widget" onPkSelect={onNewWidget}>
                {Craft.t('metrix', 'New widget')}
            </DropdownItem>
        </DropdownMenu>
    );
};
