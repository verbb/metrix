import { get, uniq } from 'lodash-es';

export const getErrorMessage = function(error) {
    const content = {
        heading: '',
        text: '',
        trace: [],
    };

    // The category of error - should be `Internal Server Error` or `Bad Request`.
    // Fallback on generic message - likely JS-side which doesn't have a category.
    content.heading = get(error, 'response.statusText', 'An error has occurred');

    // Check for application errors returning via `asFailure()` from controllers, handle generic `error`,
    // or fallback on a string-cast of the error (likely JS-side error)
    content.text = (get(error, 'response.data.message', get(error, 'response.data.error', error)) || '').toString();

    // Gather all trace lines
    const traceLines = [];

    // Add the first trace line from `response.data.file` and `response.data.line`
    const mainFile = get(error, 'response.data.file', '');
    const mainLine = get(error, 'response.data.line', '');

    if (mainFile && mainLine) {
        traceLines.push(`${mainFile}:${mainLine}`);
    }

    // Add up to 4 more lines from `response.data.trace.X.file` and `response.data.trace.X.line`
    const trace = get(error, 'response.data.trace', []);

    for (let i = 0; i < 5; i++) {
        const file = get(trace[i], 'file', '');
        const line = get(trace[i], 'line', '');

        if (file && line) {
            traceLines.push(`${file}:${line}`);
        }
    }

    // Ensure uniqueness of trace lines
    const uniqueTraceLines = uniq(traceLines);

    // Add the JS-side stack trace if no server-side trace is present
    if (uniqueTraceLines.length === 0) {
        const jsStack = get(error, 'stack', '');

        if (jsStack) {
            content.trace.push(jsStack);
        }
    } else {
        content.trace = uniqueTraceLines;
    }

    return content;
};
