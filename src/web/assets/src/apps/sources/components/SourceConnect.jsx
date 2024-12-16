import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@components/ui/Dialog';

import { Button } from '@components/ui/Button';
import LoadingSpinner from '@components/LoadingSpinner';

import { cn, getErrorMessage } from '@utils';

export const SourceConnect = ({ connected }) => {
    const [statusText, setStatusText] = useState('');
    const [statusIndicator, setStatusIndicator] = useState('disabled mc-border');
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setStatusText(connected ? Craft.t('metrix', 'Connected') : Craft.t('metrix', 'Not connected'));
    }, [connected]);

    const getFormInputs = () => {
        const form = document.getElementById('main-form') || document.getElementById('main');

        return form ? form.querySelectorAll('input, select, textarea') : [];
    };

    const serializeForm = () => {
        const values = {};

        getFormInputs().forEach((input) => {
            const name = input.getAttribute('name');

            if (name) {
                values[name] = input.value;
            }
        });

        return values;
    };

    const refresh = async() => {
        setShowModal(false);
        setErrorMessage(null);
        setLoading(true);
        setStatusText(Craft.t('metrix', 'Connecting...'));

        const data = serializeForm();

        try {
            const response = await Craft.sendActionRequest('POST', 'metrix/sources/check-connection', { data });

            if (response.data.message) {
                throw new Error(response.data);
            }

            setStatusText(Craft.t('metrix', 'Connected'));
            setStatusIndicator('on');
        } catch (error) {
            setShowModal(true);

            setErrorMessage(getErrorMessage(error));
            setStatusText(Craft.t('metrix', 'Error'));
            setStatusIndicator('off');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="heading">
                <span className={cn('status', statusIndicator)}></span>
                <span>{statusText}</span>
            </div>

            <div className="input ltr">
                <button
                    className="btn small"
                    title={Craft.t('metrix', 'Refresh')}
                    onClick={refresh}
                    disabled={loading}
                    style={{
                        backgroundColor: 'var(--ui-control-bg-color)',
                    }}
                >
                    {Craft.t('metrix', 'Refresh')}
                </button>
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogTitle className="mc-sr-only">{Craft.t('metrix', 'Source Error')}</DialogTitle>
                    <DialogDescription className="mc-sr-only">{Craft.t('metrix', 'Source Error')}</DialogDescription>

                    {errorMessage && (
                        <div className="mc-text-center mc-p-8 mc-text-red-500 mc-break-words mc-w-full">
                            <strong className="mc-block mc-mb-1">{errorMessage.heading}</strong>
                            <div className="mc-block mc-mb-2">{errorMessage.text}</div>

                            <small className="mc-block mc-font-mono mc-text mc-overflow-auto">
                                {errorMessage.trace.map((str) => {
                                    return <span key={str} className="mc-block">{str}</span>;
                                })}
                            </small>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
