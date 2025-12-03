/**
 * Initializes the Edit Link page interactions.
 *
 * Finds the relevant DOM elements and delegates the tab/section
 * behavior to initEditLinkTabs() and initEditLinkInitialSection().
 */
export default function initEditLink() {
    const root = document.querySelector('[data-js-edit-link]');
    if (!root) return;

    const tabSelect = root.querySelector('[data-js-tab-selection]');
    if (!tabSelect) return;

    const sectionSelect = root.querySelector('[data-js-section-selection]');
    if (!sectionSelect) return;

    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!baseUrl) return;

    initEditLinkTabs({ tabSelect, sectionSelect, baseUrl });
    initEditLinkInitialSection({ tabSelect, sectionSelect, baseUrl, root });
    initAiAutoFill();
    initDeleteLink();
}

/**
 * Handles the tab → sections behavior on the Edit Link page.
 *
 * Attaches a listener to the tab <select> element and dynamically
 * fetches and updates the related sections via AJAX when the tab changes.
 */
function initEditLinkTabs({ tabSelect, sectionSelect, baseUrl }) {
    tabSelect.addEventListener('change', async event => {
        const selectedTabId = event.target.value;
        if (!selectedTabId) return;

        await loadSectionsForTab({ tabId: selectedTabId, sectionSelect, baseUrl });
    });
}

/**
 * Ensures the correct section is preselected when editing an existing link.
 *
 * Reads the initially selected tab and section ID from the DOM,
 * loads the sections for that tab, and selects the right one if present.
 *
 * @param {HTMLSelectElement} tabSelect
 * @param {HTMLSelectElement} sectionSelect
 * @param {string} baseUrl
 */
async function initEditLinkInitialSection({ tabSelect, sectionSelect, baseUrl }) {
    const initialSectionInput = document.querySelector('[data-js-initial-section-id]');
    if (!initialSectionInput) return;

    const preselectId = initialSectionInput.value;
    if (!preselectId) return;

    const selectedTabId = tabSelect.value;
    if (!selectedTabId) return;

    // Load sections for the selected tab and preselect the correct one
    await loadSectionsForTab({
        tabId: selectedTabId,
        sectionSelect,
        baseUrl,
        preselectId,
    });
}

/**
 * Loads sections for a given tab and optionally preselects one.
 *
 * @param {Object} options
 * @param {string|number} options.tabId - The ID of the tab.
 * @param {HTMLSelectElement} options.sectionSelect - The <select> element to populate.
 * @param {string} options.baseUrl - The site base URL.
 * @param {string|number} [options.preselectId] - Optional section ID to preselect.
 */
async function loadSectionsForTab({ tabId, sectionSelect, baseUrl, preselectId }) {
    if (!tabId) {
        sectionSelect.innerHTML = '<option value="" disabled selected hidden>Choose a section</option>';
        sectionSelect.disabled = true;
        return;
    }

    sectionSelect.disabled = true;
    sectionSelect.innerHTML = '<option value="" disabled selected hidden>Loading…</option>';

    try {
        const response = await fetch(
            `${baseUrl}ajax/get_tabs_list/${encodeURIComponent(tabId)}`,
            {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // Base placeholder
        sectionSelect.innerHTML = '<option value="" disabled selected hidden>Choose a section</option>';

        if (Array.isArray(data) && data.length) {
            data.forEach(section => {
                const option = document.createElement('option');
                option.value = section.id;
                option.textContent = section.title;

                if (preselectId && String(preselectId) === String(section.id)) {
                    option.selected = true;
                }

                sectionSelect.appendChild(option);
            });

            sectionSelect.disabled = false;
        } else {
            sectionSelect.innerHTML = '<option value="" disabled selected>No sections found</option>';
            sectionSelect.disabled = true;
        }
    } catch (error) {
        console.error('Failed to fetch sections:', error);
        sectionSelect.innerHTML = '<option value="" disabled selected>Failed to load sections</option>';
        sectionSelect.disabled = true;
    }
}

/**
 * On initial load, populates the sections for the selected tab
 * and selects the previously assigned section (if any).
 */
function initAiAutoFill() {
    const root = document.querySelector('[data-js-edit-link]');
    if (!root) return;

    const aiButton = root.querySelector('[data-js-ai-autofill-link]');
    if (!aiButton) return;

    const urlInput = root.querySelector('input[name="url"]');
    const labelInput = root.querySelector('input[name="label"]');
    const descriptionTextarea = root.querySelector('textarea[name="description"]');
    const animationEl = root.querySelector('[data-js-ai-animation]');
    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;

    if (!urlInput || !labelInput || !descriptionTextarea || !animationEl || !baseUrl) {
        return;
    }

    aiButton.addEventListener('click', async () => {
        let urlText = '';

        // Step 1: Try to get a valid URL from clipboard
        try {
            const text = (await navigator.clipboard.readText()).trim();
            if (!text) return;

            try {
                new URL(text); // validate URL
                urlText = text;
                urlInput.value = text;
            } catch {
                return; // Not a URL → stop here
            }
        } catch (err) {
            console.error('Clipboard access failed:', err);
            return;
        }

        // Step 2: Fetch title/description only if a valid URL was pasted
        await fetchAndFillMetadata({
            urlInput,
            labelInput,
            descriptionTextarea,
            animationEl,
            baseUrl
        });
    });

}

/**
 * Fetches metadata for the URL and fills label + description.
 * Shows the AI animation while fetching.
 */
async function fetchAndFillMetadata({ urlInput, labelInput, descriptionTextarea, animationEl, baseUrl }) {
    const url = urlInput.value.trim();
    if (!url) return;

    // Very simple URL validation
    try {
        new URL(url);
    } catch {
        return;
    }

    // Show "AI is thinking..." animation
    animationEl.classList.remove('hidden');

    try {
        const response = await fetch(`${baseUrl}ajax/ai_autofill`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        // Expecting something like: { title: '...', description: '...' }

        if (data.title && !labelInput.value.trim()) {
            labelInput.value = data.title;
        }

        if (data.description && !descriptionTextarea.value.trim()) {
            descriptionTextarea.value = data.description;
        }
    } catch (error) {
        console.error('Failed to fetch metadata:', error);
    } finally {
        // Hide animation again
        animationEl.classList.add('hidden');
    }
}

/**
 * Initializes delete link functionality.
 * Attaches a click event to `[data-js-delete-link]` that sends a POST
 * request to `ajax/delete_record/{type}/{id}` and redirects to baseUrl on success.
 *
 * @returns {void}
 */
function initDeleteLink() {
    const deleteBtn = document.querySelector('[data-js-delete-link]');
    if (!deleteBtn) return;

    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!baseUrl) return;

    const type = deleteBtn.dataset.type;
    const id   = deleteBtn.dataset.id;

    deleteBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete this link?')) return;

        const url = `${baseUrl}ajax/delete_record/${type}/${id}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({}), // optional payload if you need one
            });

            if (!response.ok) throw new Error(`HTTP error ${response.status}`);

            const result = await response.json();

            if (result.success) {
                window.location.href = baseUrl;
            } else {
                console.error('Delete failed:', result.message || result);
                alert('Delete failed.');
            }
        } catch (err) {
            console.error('Error deleting record:', err);
            alert('An error occurred while deleting.');
        }
    });
}
