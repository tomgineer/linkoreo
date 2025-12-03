import { initSorting } from './utilities.js';

/**
 * Initializes the Edit Section page functionality.
 *
 * Sets up automatic section list loading based on the selected parent tab
 * and enables drag-and-drop sorting of sections within that tab.
 *
 * @returns {void}
 */
export default function initEditSection() {
    const root = document.querySelector('[data-js-edit-section]');
    if (!root) return;

    initDeleteSection();
    initFillSectionsList();
    initSorting('sections');
}

/**
 * Initializes the "Delete Section" button functionality.
 *
 * Attaches a click listener to the element with `[data-js-delete-tab]`
 * (reused as the delete button for sections) that sends an AJAX request
 * to delete the current section. On success, redirects to the base URL.
 *
 * Requires:
 * - `<meta name="base-url" content="...">`
 * - `data-type="sections"` and `data-id="..."` on the delete button.
 *
 * @returns {void}
 */
function initDeleteSection() {
    const deleteBtn = document.querySelector('[data-js-delete-section]');
    if (!deleteBtn) return;

    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!baseUrl) return;

    const type = deleteBtn.dataset.type;
    const id = deleteBtn.dataset.id;

    deleteBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete this section?')) return;

        const url = `${baseUrl}ajax/delete_record/${type}/${id}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
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

/**
 * Initializes and dynamically fills the sortable section list based on the selected tab.
 *
 * Fetches section data via AJAX when a parent tab is selected from the dropdown,
 * then renders the corresponding list items for drag-and-drop sorting.
 * Automatically refreshes when the tab selection changes.
 *
 * @returns {void}
 */
function initFillSectionsList() {
    const select  = document.querySelector('select[name="tab_id"]');
    const list    = document.querySelector('[data-sortable-list]');
    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;

    if (!select || !list || !baseUrl) return;

    const renderSections = (sections) => {
        list.innerHTML = '';

        if (!Array.isArray(sections) || sections.length === 0) {
            const li = document.createElement('li');
            li.className = 'text-xs opacity-70 px-2 py-1';
            li.textContent = 'No sections for this tab yet.';
            list.appendChild(li);
            return;
        }

        for (const item of sections) {
            const li = document.createElement('li');
            li.className = 'w-full';
            li.dataset.itemId = item.id;
            li.dataset.sortableItem = '';
            li.draggable = true;

            li.innerHTML = `
                <button
                    type="button"
                    class="btn btn-soft btn-sm w-full justify-between cursor-move select-none">
                    <span class="truncate text-left text-sm font-medium">
                        ${item.title}
                    </span>
                    <span class="opacity-60">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="1.5"
                            class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9 5h.01M9 9h.01M9 13h.01M9 17h.01M15 5h.01M15 9h.01M15 13h.01M15 17h.01" />
                        </svg>
                    </span>
                </button>
            `;

            list.appendChild(li);
        }
    };

    const loadSectionsForTab = async (tabId) => {
        list.innerHTML = '';

        if (!tabId) return;

        try {
            const res = await fetch(`${baseUrl}ajax/get_sections_by_tab/${tabId}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            // Expecting data like: [{ id: 1, title: 'Section A' }, ...]
            renderSections(data);
        } catch (err) {
            console.error('Failed to load sections:', err);
            list.innerHTML = '';
            const li = document.createElement('li');
            li.className = 'text-xs text-error px-2 py-1';
            li.textContent = 'Error loading sections.';
            list.appendChild(li);
        }
    };

    // Initial load for pre-selected tab
    if (select.value) {
        loadSectionsForTab(select.value);
    }

    // Reload when tab changes
    select.addEventListener('change', () => {
        loadSectionsForTab(select.value);
    });
}
