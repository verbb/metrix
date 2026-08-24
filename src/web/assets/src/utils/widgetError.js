import { getErrorMessage } from '@verbb/plugin-kit-core';

/** Server file:line entries from a Craft action failure — never client Axios stacks. */
export function getServerTraceLines(error, maxLines = 5) {
    const data = error?.response?.data;

    if (!data) {
        return [];
    }

    const lines = [];

    if (data.file && data.line) {
        lines.push(`${data.file}:${data.line}`);
    }

    const trace = Array.isArray(data.trace) ? data.trace : [];

    for (let i = 0; i < Math.min(maxLines, trace.length); i++) {
        const item = trace[i];

        if (item?.file && item?.line) {
            lines.push(`${item.file}:${item.line}`);
        }
    }

    return [...new Set(lines)];
}

/**
 * Widget error detail — PK `getErrorMessage` heading/text, but trace is server file:line only.
 * Craft `asFailure(message)` responses have no trace; PK would otherwise fall back to Axios stack.
 */
export function getWidgetErrorDetail(error) {
    const detail = getErrorMessage(error);
    const traceAsArray = getServerTraceLines(error);

    return {
        ...detail,
        traceAsArray,
        trace: traceAsArray.join('\n'),
        traceAsString: traceAsArray.join('\n'),
    };
}
