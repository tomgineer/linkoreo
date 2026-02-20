/**
 * Reads tab/section/search state from the current URL query string.
 *
 * @returns {{tab: string, section: string, q: string}}
 */
export function getStateFromUrl() {
    const params = new URLSearchParams(window.location.search);

    return {
        tab: params.get('tab') || '',
        section: params.get('section') || '',
        q: params.get('q') || '',
    };
}

/**
 * Updates URL query params while keeping pathname/hash.
 * Pass `undefined` to keep a param unchanged, or empty string to remove it.
 *
 * @param {{tab?: string|number, section?: string|number, q?: string}} state
 * @param {{replace?: boolean}} [options]
 * @returns {void}
 */
export function setStateInUrl(state, { replace = false } = {}) {
    const url = new URL(window.location.href);

    const syncParam = (key, value) => {
        if (value === undefined) return;
        const normalized = String(value).trim();

        if (normalized) {
            url.searchParams.set(key, normalized);
        } else {
            url.searchParams.delete(key);
        }
    };

    syncParam('tab', state.tab);
    syncParam('section', state.section);
    syncParam('q', state.q);

    const historyMethod = replace ? 'replaceState' : 'pushState';
    window.history[historyMethod]({}, '', `${url.pathname}${url.search}${url.hash}`);
}
