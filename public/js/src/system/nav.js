/**
 * Initializes navbar dropdown behavior.
 *
 * Ensures only one <details> menu is open at a time and closes all menus
 * when clicking outside, pressing Escape, or when the avatar dropdown gains focus.
 *
 * @returns {void}
 */
export default function initNavbarDropdowns() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const detailsList = navbar.querySelectorAll('ul.menu details');
    const dropdown = navbar.querySelector('.dropdown');

    // Helper: close all <details> menus
    const closeAll = () => {
        detailsList.forEach(d => { d.open = false; });
    };

    // Close other <details> when one opens
    detailsList.forEach(details => {
        details.addEventListener('toggle', () => {
            if (details.open) {
                detailsList.forEach(other => {
                    if (other !== details) {
                        other.open = false;
                    }
                });
            }
        });
    });

    // Close all <details> when clicking outside navbar
    document.addEventListener('click', event => {
        if (!navbar.contains(event.target)) {
            closeAll();
        }
    });

    // Close all <details> when pressing Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeAll();
        }
    });

    // Close all <details> when the .dropdown gains focus (opens)
    if (dropdown) {
        dropdown.addEventListener('focusin', () => {
            closeAll();
        });
    }
}
