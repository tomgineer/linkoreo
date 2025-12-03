/**
 * Hash Tool
 *
 * - Reads input from [data-hash-input]
 * - Optional trimming via [data-hash-trim]
 * - Sends text to server (PHP) to calculate multiple hashes
 * - Fills [data-hash-output="<algo>"] fields
 * - Handles copy buttons [data-copy-hash="<algo>"] with checkmark feedback
 *
 * Usage:
 * import { initHashTool } from '/js/modules/hashTool.js';
 * initHashTool();
 */
export default function initHashTool() {
    const root = document.getElementById('hash-tool');
    if (!root) return;

    const inputEl = root.querySelector('[data-hash-input]');
    const trimCheckbox = root.querySelector('[data-hash-trim]');
    const hashUrl = root.dataset.hashUrl;

    if (!inputEl || !hashUrl) return;

    const CHECK_ICON = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    `;

    const COPY_ICON = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
        </svg>
    `;

    // Simple debounce
    let debounceTimer = null;
    function debounce(fn, delay = 250) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fn, delay);
    }

    async function updateHashes() {
        let text = inputEl.value;
        const shouldTrim = !!(trimCheckbox && trimCheckbox.checked);

        if (shouldTrim) {
            text = text.trim();
        }

        // Clear outputs if empty
        if (!text.length) {
            root.querySelectorAll('[data-hash-output]').forEach(out => {
                out.value = '';
            });
            return;
        }

        try {
            const response = await fetch(hashUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            Object.entries(data).forEach(([algo, hashValue]) => {
                const out = root.querySelector(`[data-hash-output="${algo}"]`);
                if (out) {
                    out.value = hashValue || '';
                }
            });
        } catch (err) {
            console.error('Failed to update hashes:', err);
        }
    }

    // Input listeners
    inputEl.addEventListener('input', () => debounce(updateHashes));
    if (trimCheckbox) {
        trimCheckbox.addEventListener('change', () => debounce(updateHashes, 0));
    }

    // Copy handling (like your password copy, but for hashes)
    root.addEventListener('click', async (event) => {
        const button = event.target.closest('[data-copy-hash]');
        if (!button) return;

        const algo = button.dataset.copyHash;
        const output = root.querySelector(`[data-hash-output="${algo}"]`);
        if (!output || !output.value) return;

        try {
            await navigator.clipboard.writeText(output.value);

            button.innerHTML = CHECK_ICON;
            button.classList.remove('btn-soft');
            button.classList.add('btn-success');

            setTimeout(() => {
                button.innerHTML = COPY_ICON;
                button.classList.remove('btn-success');
                button.classList.add('btn-soft');
            }, 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    });
}
