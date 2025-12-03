import { displayLinks } from '../system/ajax.js';

/**
 * Initializes the search input listener with debounce functionality.
 *
 * Listens for user input in the search field and triggers the search
 * request after a short delay to avoid excessive requests. If the
 * input is cleared, the current search results are reset.
 *
 * @function initSearch
 * @returns {void}
 */
export default function initSearch() {
    const searchInput = document.querySelector('[data-js-search]');
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener('input', () => {
        const rawQuery = searchInput.value;
        const query = rawQuery.trim();

        if (!query) {
            clearTimeout(debounceTimer);
            restoreDefaultSection();
            return;
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            displaySearchResults(query);
        }, 300); // tweak delay as you like
    });
}

/**
 * Restores the default view by reloading the first tab's links.
 *
 * Removes any active state from other menu buttons, activates
 * the first button, and displays its associated links.
 *
 * @function restoreDefaultSection
 * @returns {void}
 */
function restoreDefaultSection() {
    const buttons = document.querySelectorAll('[data-tab-id]');
    const firstButton = buttons[0];
    if (!firstButton) return;

    // Remove active state from all buttons
    buttons.forEach(btn => btn.classList.remove('menu-active'));

    // Mark the first one active and reload its content
    firstButton.classList.add('menu-active');
    displayLinks(firstButton.dataset.tabId, firstButton.dataset.sectionId);
}

/**
 * Fetches search results from the backend and displays them in the UI.
 *
 * Sends an AJAX request to the server with the given query, handles
 * response and error states, and updates the search results container.
 *
 * @async
 * @function displaySearchResults
 * @param {string} query - The search term entered by the user.
 * @returns {Promise<void>}
 */
async function displaySearchResults(query) {
    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!baseUrl) return;

    const target = document.querySelector('[data-display-links]');
    if (!target) return;

    // Show a loading indicator while fetching
    target.innerHTML = `<span class="loading loading-ring loading-xl text-secondary"></span>`;

    try {
        const response = await fetch(
            `${baseUrl}ajax/search?q=${encodeURIComponent(query)}`,
            {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            }
        );

        if (!response.ok) {
            const text = await response.text();
            console.error('Fetch error:', text);
            throw new Error(`HTTP ${response.status}`);
        }

        // Parse response
        const results = await response.json();

        const html = buildSearchResultsHtml(results, query);
        target.innerHTML = html;

    } catch (err) {
        console.error('Error fetching search results:', err);
        target.innerHTML = `
            <p class="text-error">Failed to load search results.</p>
        `;
    }
}

/**
 * Builds the HTML structure for search results.
 *
 * Generates an HTML section containing a heading with the search term
 * and a responsive grid of link cards. Each card displays the link’s
 * label, description, and visual importance.
 *
 * @function buildSearchResultsHtml
 * @param {Array<Object>} results - Array of search result objects.
 * @param {string} query - The user’s search term.
 * @returns {string} The HTML markup for the search results.
 */
function buildSearchResultsHtml(results, query) {
    const safeQuery = escapeHtml(query ?? '');

    // No results case
    if (!Array.isArray(results) || results.length === 0) {
        return `
            <section class="mb-6">
                <h3 class="text-2xl font-semibold mb-1 text-neutral-content">
                    Search results for: "<span class="italic">${safeQuery}</span>"
                </h3>
                <p class="opacity-70">No links found.</p>
            </section>
        `;
    }

    const itemsHtml = results.map(link => {
        const url = escapeHtml(link.url ?? '#');
        const label = escapeHtml(link.label || link.url || '');
        const description = escapeHtml(link.description || '');
        const importance = link.importance ?? 3;

        return `
            <li>
                <a href="${url}"
                    rel="nofollow"
                    class="btn shadow-md flex flex-col gap-0 p-8 importance-${importance}
                           transform transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                    <span class="text-base font-medium">
                        ${label}
                    </span>
                    ${
                        description
                            ? `<span class="text-sm opacity-90 font-normal">
                                   ${description}
                               </span>`
                            : ''
                    }
                </a>
            </li>
        `;
    }).join('');

    return `
        <section class="mb-6">
            <h3 class="text-2xl font-semibold mb-4 text-neutral-content">
                Search results for: "<span class="italic">${safeQuery}</span>"
            </h3>

            <ul class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                ${itemsHtml}
            </ul>
        </section>
    `;
}

/**
 * Escapes HTML special characters in a string to prevent injection.
 *
 * @function escapeHtml
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string safe for HTML insertion.
 */
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
