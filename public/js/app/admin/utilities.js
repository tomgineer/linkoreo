/**
 * Enables drag-and-drop sorting for tab or section lists.
 *
 * Expects:
 * - a container with [data-sortable-list]
 * - children with [data-sortable-item] and data-item-id attributes
 *
 * @param {string} table - The database table being reordered ('tabs' or 'sections').
 * @returns {void}
 */
export function initSorting(table) {
    const list = document.querySelector('[data-sortable-list]');
    if (!list) return;

    let draggedItem = null;

    list.addEventListener('dragstart', (event) => {
        const li = event.target.closest('[data-sortable-item]');
        if (!li) return;

        draggedItem = li;
        li.classList.add('opacity-50');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', li.dataset.itemId || '');
    });

    list.addEventListener('dragover', (event) => {
        event.preventDefault();

        if (!draggedItem) return;

        const target = event.target.closest('[data-sortable-item]');
        if (!target || target === draggedItem) return;

        const rect = target.getBoundingClientRect();
        const offset = event.clientY - rect.top;
        const halfway = rect.height / 2;

        if (offset < halfway) {
            list.insertBefore(draggedItem, target);
        } else {
            list.insertBefore(draggedItem, target.nextSibling);
        }
    });

    list.addEventListener('drop', (event) => {
        event.preventDefault();
    });

    list.addEventListener('dragend', () => {
        if (!draggedItem) return;

        draggedItem.classList.remove('opacity-50');
        draggedItem = null;

        const newOrder = Array.from(
            list.querySelectorAll('[data-sortable-item]')
        ).map((item) => item.dataset.itemId);

        saveOrder(table, newOrder);
    });
}

/**
 * Sends the new order to the server.
 *
 * @param {string} table - The table name ('tabs' or 'sections').
 * @param {string[]} order - Array of item IDs in the new order.
 * @returns {Promise<void>}
 */
export async function saveOrder(table, order) {
    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!baseUrl) return;

    try {
        const response = await fetch(`${baseUrl}ajax/update_order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ table, order }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        console.log(`✅ ${table} order updated:`, result);
    } catch (err) {
        console.error(`❌ Error updating ${table} order:`, err);
    }
}
