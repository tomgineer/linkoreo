import { getStateFromUrl, setStateInUrl } from './state.js';

/**
 * Initializes tab buttons and handles tab switching.
 *
 * Attaches click listeners to all tab buttons marked with
 * `data-action="js-fetch-links"`. When a tab is clicked,
 * its corresponding links are fetched and displayed. The
 * active tab/section are restored from URL query params
 * (`tab` and `section`) when available.
 *
 * @function tabsInit
 * @returns {void}
 */
export function tabsInit() {
    const buttons = document.querySelectorAll('[data-action="js-fetch-links"]');
    if (!buttons.length) return;
    const searchInput = document.querySelector('[data-js-search]');
    const { tab: urlTab, section: urlSection } = getStateFromUrl();

    // Clear active search term if home button was used
    const homeButton = document.querySelector('[js-home-button]');
    homeButton?.addEventListener('click', () => {
        if (searchInput) {
            searchInput.value = '';
        }
        sessionStorage.removeItem('searchTerm');
    });

    let activeButton = [...buttons].find(btn => (
        btn.dataset.tabId === urlTab && btn.dataset.sectionId === urlSection
    ));

    if (!activeButton) {
        // Fallback to the first button
        activeButton = buttons[0];
    }

    // Attach click listeners
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tabId;
            const sectionId = button.dataset.sectionId;

            // Remove menu-active from all buttons
            buttons.forEach(btn => btn.classList.remove('menu-active'));

            // Add it to the clicked one
            button.classList.add('menu-active');

            // Clear any active search term when navigating the menu
            if (searchInput) {
                searchInput.value = '';
                sessionStorage.removeItem('searchTerm');
            }

            setStateInUrl({ tab: tabId, section: sectionId });

            // Load links for this tab
            displayLinks(tabId, sectionId);
        });
    });

    // Activate the restored or first tab
    activeButton.classList.add('menu-active');
    setStateInUrl(
        {
            tab: activeButton.dataset.tabId,
            section: activeButton.dataset.sectionId,
        },
        { replace: true }
    );
    displayLinks(activeButton.dataset.tabId, activeButton.dataset.sectionId);
}

/**
 * Fetches and displays links for the specified tab and section.
 *
 * Sends an AJAX request to retrieve rendered HTML content for the
 * selected tab and section. While loading, a spinner is shown.
 * On success, the response HTML replaces the current links content.
 * On failure, an error message is displayed in the target container.
 *
 * @async
 * @function displayLinks
 * @param {string|number} tabId - The ID of the tab to load.
 * @param {string|number} sectionId - The ID of the section to load.
 * @returns {Promise<void>}
 */
export async function displayLinks(tabId, sectionId) {
    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!baseUrl) return;

    const target = document.querySelector('[data-display-links]');
    if (!target) return;

    // Loading state
    target.innerHTML = `<span class="loading loading-ring loading-xl text-secondary"></span>`;

    try {
        const response = await fetch(`${baseUrl}ajax/get_links_view/${tabId}/${sectionId}`, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Fetch error:', text);
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text(); // <-- expecting rendered HTML
        target.innerHTML = html;

    } catch (err) {
        console.error('Error fetching HTML:', err);
        target.innerHTML = `
            <p class="text-error">Failed to load links for tab ${tabId}.</p>
        `;
    }
}
