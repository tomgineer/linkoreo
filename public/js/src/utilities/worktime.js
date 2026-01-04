/**
 * Work Time Tracker
 *
 * - Reads and stores start time in localStorage
 * - Updates live clock, 8h progress, and end time
 * - Applies 6h / 9h break deduction rules
 *
 * Usage:
 * import { initWorkTime } from '/js/modules/workTime.js';
 * initWorkTime();
 */
export default function initWorkTime() {
    const startInput     = document.querySelector('.work-time-start');
    const startButton    = document.querySelector('.work-time-go');
    const displayEl      = document.querySelector('.work-time-display');
    const endTimeEl      = document.querySelector('.work-time-end');
    const progressEl     = document.querySelector('.progress');
    const progressTextEl = document.querySelector('[data-work-progress-text]');

    if (!startInput || !startButton || !displayEl || !endTimeEl) return;

    // Constants
    const STORAGE_KEY    = 'workTimeStartAt';
    const NET_WORK_HOURS = 8;
    const MS_PER_SECOND  = 1000;
    const MS_PER_MINUTE  = 60 * MS_PER_SECOND;
    const MS_PER_HOUR    = 60 * MS_PER_MINUTE;

    let startTime = null;
    let timerId   = null;

    // --- Utility functions ---
    const pad = (num) => num.toString().padStart(2, '0');

    const formatDuration = (ms) => {
        if (ms < 0) ms = 0;
        const totalSeconds = Math.floor(ms / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    };

    const formatTime = (date) =>
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

    const getBreakMs = (elapsedMs) => {
        const hours = elapsedMs / MS_PER_HOUR;
        let minutes = 0;
        if (hours >= 6) minutes += 30;
        if (hours >= 9) minutes += 15;
        return minutes * MS_PER_MINUTE;
    };

    const computeTargetEndTime = (startDate) => {
        if (!startDate) return null;
        const totalMinutes = NET_WORK_HOURS * 60 + 30; // 8h + 30m break
        return new Date(startDate.getTime() + totalMinutes * MS_PER_MINUTE);
    };

    const saveStartTime = (date) => {
        try {
            localStorage.setItem(STORAGE_KEY, date.toISOString());
        } catch (e) {
            console.error('Could not save start time:', e);
        }
    };

    const loadStartTime = () => {
        try {
            const iso = localStorage.getItem(STORAGE_KEY);
            if (!iso) return null;
            const d = new Date(iso);
            return Number.isNaN(d.getTime()) ? null : d;
        } catch {
            return null;
        }
    };

    const parseTimeFromInput = () => {
        const val = startInput.value; // "HH:MM"
        if (!val || !/^\d{2}:\d{2}$/.test(val)) return null;
        const [h, m] = val.split(':').map(Number);
        if (Number.isNaN(h) || Number.isNaN(m)) return null;

        const now = new Date();
        const start = new Date(now);
        start.setHours(h, m, 0, 0);
        if (start > now) start.setDate(start.getDate() - 1);
        return start;
    };

    const syncInputFromStartTime = (date) => {
        if (!date) return;
        startInput.value = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    // --- Core logic ---
    const updateDisplay = () => {
        if (!startTime) return;
        const now = new Date();
        let elapsed = now - startTime;
        if (elapsed < 0) elapsed = 0;

        const breakMs = getBreakMs(elapsed);
        const netMs   = Math.max(0, elapsed - breakMs);

        // Big clock
        displayEl.textContent = formatDuration(netMs);

        // Progress percentage toward 8h net
        const targetMs = NET_WORK_HOURS * MS_PER_HOUR;
        const pctRaw   = (netMs / targetMs) * 100;
        const pct      = Math.min(100, Math.max(0, pctRaw));

        if (progressEl) {
            progressEl.value = pct;
        }

        // Update the text message under the clock
        if (progressTextEl) {
            const pctDisplay = Math.round(pct);

            //progressValueEl.textContent = `${pctDisplay}%`;

            if (pctDisplay >= 100) {
                progressTextEl.textContent = 'Fantastic! You have completed your 8-hour workday!';
            } else if (pctDisplay >= 75) {
                progressTextEl.textContent = `Almost there! You have already worked ${pctDisplay}% of your 8-hour day.`;
            } else if (pctDisplay >= 50) {
                progressTextEl.textContent = `Nice progress! You have already worked ${pctDisplay}% of your 8-hour day.`;
            } else {
                progressTextEl.textContent = `Keep up the good work! You have already worked ${pctDisplay}% of your 8-hour day.`;
            }
        }
    };

    const updateEndTime = () => {
        if (!startTime) return;
        const end = computeTargetEndTime(startTime);
        if (end) endTimeEl.textContent = formatTime(end);
    };

    const startTimer = () => {
        if (timerId) clearInterval(timerId);
        timerId = setInterval(() => updateDisplay(), 1000);
        updateDisplay();
        updateEndTime();
    };

    // --- Event Handlers ---
    startButton.addEventListener('click', () => {
        const parsed = parseTimeFromInput();
        if (!parsed) {
            alert('Please enter a valid start time (HH:MM).');
            return;
        }
        startTime = parsed;
        saveStartTime(startTime);
        startTimer();
    });

    // --- Restore previous session ---
    const stored = loadStartTime();
    if (stored) {
        startTime = stored;
        syncInputFromStartTime(startTime);
        startTimer();
    } else if (progressEl) {
        progressEl.value = 0;
    }
}
