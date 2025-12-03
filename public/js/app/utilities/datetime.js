// Top-level helper is OK as a normal function
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

export default function initDateTime() {
    const container = document.querySelector('[data-js-datetime]');
    if (!container) return;

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

    const setButtonToCopyState = (button) => {
        button.innerHTML = COPY_ICON;
        button.classList.remove('btn-success');
        if (!button.classList.contains('btn-soft')) {
            button.classList.add('btn-soft');
        }
    };

    const setButtonToSuccessState = (button) => {
        button.innerHTML = CHECK_ICON;
        button.classList.remove('btn-soft');
        button.classList.add('btn-success');
    };

    const handleCopyClick = async (event) => {
        const button = event.target.closest('[data-copy-datetime]');
        if (!button) return;
        if (!container.contains(button)) return; // scope to this module

        const join = button.closest('.join');
        if (!join) return;

        const input = join.querySelector('input');
        if (!input) return;

        const value = input.value.trim();
        if (!value) return;

        try {
            await navigator.clipboard.writeText(value);

            // success visual
            setButtonToSuccessState(button);

            // revert after 2s
            setTimeout(() => {
                setButtonToCopyState(button);
            }, 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    document.addEventListener('click', handleCopyClick);

    const fields = container.querySelectorAll('[data-datetime-field]');
    const copyButtons = container.querySelectorAll('[data-copy-datetime]');

    // ---- Helper functions inside main (ES6 arrows) ----

    const formatCurrency = (amount, currency, maximumFractionDigits = 0) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits
        }).format(amount);

    const timeUntil = (targetDate) => {
        const now = new Date();
        const diff = targetDate - now;
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor(diff / (1000 * 60 * 60)),
            seconds: Math.floor(diff / 1000),
        };
    };

    const timeSince = (pastDate) => {
        const now = new Date();
        const diff = now - pastDate;
        return {
            years: Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)),
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            seconds: Math.floor(diff / 1000),
        };
    };

    const copyToClipboard = (text) => {
        if (!navigator.clipboard) {
            console.warn('Clipboard API not available');
            return;
        }
        navigator.clipboard.writeText(text).catch(console.error);
    };

    // ---- Very rough debt baselines (not accurate, just for a “clock” feel) ----
    // US: ~38.0T USD in Oct 2025, approximate +2T/year -> ~63k USD/s
    const US_DEBT_BASE = {
        date: new Date('2025-10-23T00:00:00Z'),
        amount: 38_000_000_000_000, // 38T
        perSecond: 63_000,          // USD / second
    };

    // Germany: ~2.52T EUR in early 2025, increase ~14.3B/Q -> ~1.8k EUR/s
    const DE_DEBT_BASE = {
        date: new Date('2025-03-31T00:00:00Z'),
        amount: 2_520_000_000_000,  // 2.52T EUR
        perSecond: 1_800,           // EUR / second
    };

    // Greece: ~403B EUR in 2025, pretend ~5B/year -> ~160 EUR/s
    const GR_DEBT_BASE = {
        date: new Date('2025-06-30T00:00:00Z'),
        amount: 403_000_000_000,    // 403B EUR
        perSecond: 160,             // EUR / second
    };

    const getDebtEstimate = (base, now) => {
        const secondsSinceBase = (now - base.date) / 1000;
        return base.amount + base.perSecond * secondsSinceBase;
    };

    const updateFields = () => {
        const now = new Date();

        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1);
        const greatReset = new Date('2030-01-01T00:00:00Z');
        const greatEvent = new Date('2015-06-15T10:30:00Z');
        const unixEpoch = new Date('1970-01-01T00:00:00Z');

        fields.forEach(field => {
            const title = field.dataset.title;
            let value = '';

            switch (title) {
                // ---- Current Date & Time ----
                case 'Current Time':
                    value = now.toLocaleTimeString('en-GB');
                    break;
                case 'Current Date':
                    value = now.toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    });
                    break;
                case 'Current Week':
                    value = `Week ${getWeekNumber(now)}`;
                    break;
                case 'Current Timestamp':
                    value = Math.floor(now.getTime() / 1000);
                    break;

                // ---- Progress within the year ----
                case 'Day Of The Year':
                    value = Math.ceil((now - startOfYear) / (1000 * 60 * 60 * 24));
                    break;
                case 'Minute Of The Year':
                    value = Math.floor((now - startOfYear) / (1000 * 60));
                    break;
                case 'Second Of The Year':
                    value = Math.floor((now - startOfYear) / 1000);
                    break;

                // ---- Unix time ----
                case 'Seconds Since 1/1/1970':
                    value = Math.floor((now - unixEpoch) / 1000);
                    break;

                // ---- Time left in month/year ----
                case 'Days Left For This Month':
                    value = Math.floor((startOfNextMonth - now) / (1000 * 60 * 60 * 24));
                    break;
                case 'Hours Left For This Month':
                    value = Math.floor((startOfNextMonth - now) / (1000 * 60 * 60));
                    break;
                case 'Seconds Left For This Month':
                    value = Math.floor((startOfNextMonth - now) / 1000);
                    break;
                case 'Days Left For This Year':
                    value = Math.floor((startOfNextYear - now) / (1000 * 60 * 60 * 24));
                    break;
                case 'Hours Left For This Year':
                    value = Math.floor((startOfNextYear - now) / (1000 * 60 * 60));
                    break;
                case 'Seconds Left For This Year':
                    value = Math.floor((startOfNextYear - now) / 1000);
                    break;

                // ---- Time until Great Reset ----
                case 'Days Left Until the Great Reset':
                    value = timeUntil(greatReset).days;
                    break;
                case 'Hours Left Until the Great Reset':
                    value = timeUntil(greatReset).hours;
                    break;
                case 'Seconds Left Until the Great Reset':
                    value = timeUntil(greatReset).seconds;
                    break;

                // ---- Time since Great Event ----
                case 'Years Since the Great Event':
                    value = timeSince(greatEvent).years;
                    break;
                case 'Days Since the Great Event':
                    value = timeSince(greatEvent).days;
                    break;
                case 'Seconds Since the Great Event':
                    value = timeSince(greatEvent).seconds;
                    break;

                // ---- Debt counters (rough estimates) ----
                case 'US Dept Counter': {
                    const estimate = getDebtEstimate(US_DEBT_BASE, now);
                    value = formatCurrency(estimate, 'USD', 0);
                    break;
                }
                case 'Germanys Dept Counter': {
                    const estimate = getDebtEstimate(DE_DEBT_BASE, now);
                    value = formatCurrency(estimate, 'EUR', 0);
                    break;
                }
                case 'Greece Dept Counter': {
                    const estimate = getDebtEstimate(GR_DEBT_BASE, now);
                    value = formatCurrency(estimate, 'EUR', 0);
                    break;
                }

                default:
                    value = '';
            }

            field.value = value;
        });
    };

    // ---- Copy buttons ----
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.copyDatetime;
            const field = container.querySelector(`[data-datetime-field="${index}"]`);
            if (field) copyToClipboard(field.value);
        });
    });

    // ---- Tick ----
    updateFields();
    setInterval(updateFields, 1000);
}
