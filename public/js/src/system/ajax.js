/**
 * Initializes tab buttons and handles tab switching.
 *
 * Attaches click listeners to all tab buttons marked with
 * `data-action="js-fetch-links"`. When a tab is clicked,
 * its corresponding links are fetched and displayed. The
 * last visited tab is restored from localStorage if available;
 * otherwise, the first tab is automatically activated.
 *
 * @function tabsInit
 * @returns {void}
 */
export function tabsInit() {
    const buttons = document.querySelectorAll('[data-action="js-fetch-links"]');
    if (!buttons.length) return;

    // Reset localStorage if home button was used
    const homeButton = document.querySelector('[js-home-button]');
    homeButton?.addEventListener('click', () => {
        localStorage.removeItem('lastTab');
        localStorage.removeItem('lastSection');
    });

    // Try to restore the last active tab from localStorage
    const lastTab = localStorage.getItem('lastTab');
    const lastSection = localStorage.getItem('lastSection');

    let activeButton = [...buttons].find(btn =>
        btn.dataset.tabId === lastTab && btn.dataset.sectionId === lastSection
    );

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

            // Store the active tab
            localStorage.setItem('lastTab', tabId);
            localStorage.setItem('lastSection', sectionId);

            // Load links for this tab
            displayLinks(tabId, sectionId);
        });
    });

    // Activate the restored or first tab
    activeButton.classList.add('menu-active');
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
