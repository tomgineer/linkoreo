/**
 * Handles clipboard copy functionality for buttons marked with [data-copy-pwd].
 * When clicked:
 * - Copies the associated input value to clipboard
 * - Temporarily changes the button style from 'btn-soft' to 'btn-success'
 * - Switches the SVG icon from COPY_ICON to CHECK_ICON
 * - Reverts styles and icon after 2 seconds
 *
 * Usage:
 * import { initCopyPasswordButtons } from '/js/modules/copyPassword.js';
 * initCopyPasswordButtons();
 */
export default function initCopyPasswordButtons() {
    if(!document.querySelector('[data-js-passgen]')) return;

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

    document.addEventListener('click', async (event) => {
        const button = event.target.closest('[data-copy-pwd]');
        if (!button) return;

        const join = button.closest('.join');
        if (!join) return;

        const input = join.querySelector('input');
        if (!input) return;

        const value = input.value.trim();
        if (!value) return;

        try {
            await navigator.clipboard.writeText(value);

            // Show success state
            button.innerHTML = CHECK_ICON;
            button.classList.remove('btn-soft');
            button.classList.add('btn-success');

            // Revert after 2 seconds
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
