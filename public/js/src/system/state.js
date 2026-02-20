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

/**
 * Returns the current relative path + query string to return to.
 *
 * @returns {string}
 */
export function getReturnToPath() {
    return `${window.location.pathname}${window.location.search}`;
}

/**
 * Appends/updates `return_to` on internal admin links marked for state preservation.
 *
 * @param {ParentNode} [root=document]
 * @returns {void}
 */
export function applyReturnToLinks(root = document) {
    const links = root.querySelectorAll('a[data-preserve-return]');
    if (!links.length) return;

    const returnTo = getReturnToPath();

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        if (!link.dataset.baseHref) {
            link.dataset.baseHref = href;
        }

        let url;
        try {
            url = new URL(link.dataset.baseHref, window.location.origin);
        } catch {
            return;
        }

        if (url.origin !== window.location.origin) return;

        url.searchParams.set('return_to', returnTo);
        link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
    });
}
