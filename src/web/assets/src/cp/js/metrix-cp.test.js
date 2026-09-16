import { expect, it, vi } from 'vitest';

vi.mock('./cp-field-error.js', () => ({
    clearCpFieldError: vi.fn(),
    getCpFieldErrorLabels: () => ({}),
    mountCpFieldError: vi.fn(),
}));

it('preserves provider option labels and values as text when refreshing settings', async() => {
    let click;
    const options = [{ label: 'News <Daily> & "Updates"', value: 'site"one' }];
    const select = { val: vi.fn(() => ''), html: vi.fn(), empty: vi.fn(), append: vi.fn() };
    const container = { 0: {}, find: () => select };
    const button = {
        parent: () => ({ parent: () => container }),
        parents: () => ({}),
        data: () => 'test',
        addClass: vi.fn(),
        removeClass: vi.fn(),
    };
    const jquery = (element) => element === document ? { on: (_event, _selector, handler) => { click = handler; } } : button;
    jquery.each = (values, handler) => values.forEach((value, index) => handler(index, value));
    vi.stubGlobal('document', {});
    vi.stubGlobal('jQuery', jquery);
    vi.stubGlobal('Option', class {
        constructor(text, value) { this.text = text; this.value = value; }
    });
    vi.stubGlobal('Garnish', { getPostData: () => ({}) });
    vi.stubGlobal('Craft', {
        expandPostArray: () => ({ types: { test: {} } }),
        sendActionRequest: vi.fn().mockResolvedValue({ data: options }),
    });

    await import('./metrix-cp.js');
    click.call({}, { preventDefault: vi.fn() });
    await vi.waitFor(() => expect(button.removeClass).toHaveBeenCalled());

    expect(select.html).not.toHaveBeenCalled();
    expect(select.append).toHaveBeenCalledWith(expect.objectContaining({ text: options[0].label, value: options[0].value }));
    vi.unstubAllGlobals();
});
