import { initSorting } from './utilities.js';

/**
 * Initializes the Edit Tab page functionality.
 *
 * Sets up tab deletion and drag-and-drop sorting behavior
 * by calling their respective initialization functions.
 *
 * @returns {void}
 */
export default function initEditTab() {
    const root = document.querySelector('[data-js-edit-tab]');
    if (!root) return;

    initDeleteTab();
    initSorting('tabs');
}

/**
 * Initializes the "Delete Tab" button functionality.
 *
 * Attaches a click listener to the element with `[data-js-delete-tab]`
 * that sends an authenticated AJAX request to delete a tab record.
 * On success, the user is redirected to the base URL.
 *
 * Requires a `<meta name="base-url" content="...">` tag and
 * `data-type` / `data-id` attributes on the delete button.
 *
 * @returns {void}
 */
function initDeleteTab() {
    const deleteBtn = document.querySelector('[data-js-delete-tab]');
    if (!deleteBtn) return;

    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!baseUrl) return;

    const type = deleteBtn.dataset.type;
    const id   = deleteBtn.dataset.id;

    deleteBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete this tab?')) return;

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
