(() => {
  // public/js/src/utilities/hashing.js
  function initHashTool() {
    const root = document.getElementById("hash-tool");
    if (!root) return;
    const inputEl = root.querySelector("[data-hash-input]");
    const trimCheckbox = root.querySelector("[data-hash-trim]");
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
      if (!text.length) {
        root.querySelectorAll("[data-hash-output]").forEach((out) => {
          out.value = "";
        });
        return;
      }
      try {
        const response = await fetch(hashUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          },
          body: JSON.stringify({ text })
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        Object.entries(data).forEach(([algo, hashValue]) => {
          const out = root.querySelector(`[data-hash-output="${algo}"]`);
          if (out) {
            out.value = hashValue || "";
          }
        });
      } catch (err) {
        console.error("Failed to update hashes:", err);
      }
    }
    inputEl.addEventListener("input", () => debounce(updateHashes));
    if (trimCheckbox) {
      trimCheckbox.addEventListener("change", () => debounce(updateHashes, 0));
    }
    root.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-copy-hash]");
      if (!button) return;
      const algo = button.dataset.copyHash;
      const output = root.querySelector(`[data-hash-output="${algo}"]`);
      if (!output || !output.value) return;
      try {
        await navigator.clipboard.writeText(output.value);
        button.innerHTML = CHECK_ICON;
        button.classList.remove("btn-soft");
        button.classList.add("btn-success");
        setTimeout(() => {
          button.innerHTML = COPY_ICON;
          button.classList.remove("btn-success");
          button.classList.add("btn-soft");
        }, 2e3);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    });
  }

  // public/js/src/utilities/passwords.js
  function initCopyPasswordButtons() {
    if (!document.querySelector("[data-js-passgen]")) return;
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
    document.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-copy-pwd]");
      if (!button) return;
      const join = button.closest(".join");
      if (!join) return;
      const input = join.querySelector("input");
      if (!input) return;
      const value = input.value.trim();
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        button.innerHTML = CHECK_ICON;
        button.classList.remove("btn-soft");
        button.classList.add("btn-success");
        setTimeout(() => {
          button.innerHTML = COPY_ICON;
          button.classList.remove("btn-success");
          button.classList.add("btn-soft");
        }, 2e3);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    });
  }

  // public/js/src/utilities/worktime.js
  function initWorkTime() {
    const startInput = document.querySelector(".work-time-start");
    const startButton = document.querySelector(".work-time-go");
    const displayEl = document.querySelector(".work-time-display");
    const endTimeEl = document.querySelector(".work-time-end");
    const progressEl = document.querySelector(".progress");
    const progressTextEl = document.querySelector("[data-work-progress-text]");
    if (!startInput || !startButton || !displayEl || !endTimeEl) return;
    const STORAGE_KEY = "workTimeStartAt";
    const NET_WORK_HOURS = 8;
    const MS_PER_SECOND = 1e3;
    const MS_PER_MINUTE = 60 * MS_PER_SECOND;
    const MS_PER_HOUR = 60 * MS_PER_MINUTE;
    let startTime = null;
    let timerId = null;
    const pad = (num) => num.toString().padStart(2, "0");
    const formatDuration = (ms) => {
      if (ms < 0) ms = 0;
      const totalSeconds = Math.floor(ms / 1e3);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor(totalSeconds % 3600 / 60);
      const s = totalSeconds % 60;
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    };
    const formatTime = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    const getBreakMs = (elapsedMs) => {
      const hours = elapsedMs / MS_PER_HOUR;
      let minutes = 0;
      if (hours >= 6) minutes += 30;
      if (hours >= 9) minutes += 15;
      return minutes * MS_PER_MINUTE;
    };
    const computeTargetEndTime = (startDate) => {
      if (!startDate) return null;
      const totalMinutes = NET_WORK_HOURS * 60 + 30;
      return new Date(startDate.getTime() + totalMinutes * MS_PER_MINUTE);
    };
    const saveStartTime = (date) => {
      try {
        localStorage.setItem(STORAGE_KEY, date.toISOString());
      } catch (e) {
        console.error("Could not save start time:", e);
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
      const val = startInput.value;
      if (!val || !/^\d{2}:\d{2}$/.test(val)) return null;
      const [h, m] = val.split(":").map(Number);
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      const now = /* @__PURE__ */ new Date();
      const start = new Date(now);
      start.setHours(h, m, 0, 0);
      if (start > now) start.setDate(start.getDate() - 1);
      return start;
    };
    const syncInputFromStartTime = (date) => {
      if (!date) return;
      startInput.value = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };
    const updateDisplay = () => {
      if (!startTime) return;
      const now = /* @__PURE__ */ new Date();
      let elapsed = now - startTime;
      if (elapsed < 0) elapsed = 0;
      const breakMs = getBreakMs(elapsed);
      const netMs = Math.max(0, elapsed - breakMs);
      displayEl.textContent = formatDuration(netMs);
      const targetMs = NET_WORK_HOURS * MS_PER_HOUR;
      const pctRaw = netMs / targetMs * 100;
      const pct = Math.min(100, Math.max(0, pctRaw));
      if (progressEl) {
        progressEl.value = pct;
      }
      if (progressTextEl) {
        const pctDisplay = Math.round(pct);
        if (pctDisplay >= 100) {
          progressTextEl.textContent = "Fantastic! You have completed your 8-hour workday!";
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
      timerId = setInterval(() => updateDisplay(), 1e3);
      updateDisplay();
      updateEndTime();
    };
    startButton.addEventListener("click", () => {
      const parsed = parseTimeFromInput();
      if (!parsed) {
        alert("Please enter a valid start time (HH:MM).");
        return;
      }
      startTime = parsed;
      saveStartTime(startTime);
      startTimer();
    });
    const stored = loadStartTime();
    if (stored) {
      startTime = stored;
      syncInputFromStartTime(startTime);
      startTimer();
    } else if (progressEl) {
      progressEl.value = 0;
    }
  }

  // public/js/src/utilities/datetime.js
  function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 864e5 + 1) / 7);
  }
  function initDateTime() {
    const container = document.querySelector("[data-js-datetime]");
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
      button.classList.remove("btn-success");
      if (!button.classList.contains("btn-soft")) {
        button.classList.add("btn-soft");
      }
    };
    const setButtonToSuccessState = (button) => {
      button.innerHTML = CHECK_ICON;
      button.classList.remove("btn-soft");
      button.classList.add("btn-success");
    };
    const handleCopyClick = async (event) => {
      const button = event.target.closest("[data-copy-datetime]");
      if (!button) return;
      if (!container.contains(button)) return;
      const join = button.closest(".join");
      if (!join) return;
      const input = join.querySelector("input");
      if (!input) return;
      const value = input.value.trim();
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        setButtonToSuccessState(button);
        setTimeout(() => {
          setButtonToCopyState(button);
        }, 2e3);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    };
    document.addEventListener("click", handleCopyClick);
    const fields = container.querySelectorAll("[data-datetime-field]");
    const copyButtons = container.querySelectorAll("[data-copy-datetime]");
    const formatCurrency = (amount, currency, maximumFractionDigits = 0) => new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits
    }).format(amount);
    const timeUntil = (targetDate) => {
      const now = /* @__PURE__ */ new Date();
      const diff = targetDate - now;
      return {
        days: Math.floor(diff / (1e3 * 60 * 60 * 24)),
        hours: Math.floor(diff / (1e3 * 60 * 60)),
        seconds: Math.floor(diff / 1e3)
      };
    };
    const timeSince = (pastDate) => {
      const now = /* @__PURE__ */ new Date();
      const diff = now - pastDate;
      return {
        years: Math.floor(diff / (1e3 * 60 * 60 * 24 * 365.25)),
        days: Math.floor(diff / (1e3 * 60 * 60 * 24)),
        seconds: Math.floor(diff / 1e3)
      };
    };
    const copyToClipboard = (text) => {
      if (!navigator.clipboard) {
        console.warn("Clipboard API not available");
        return;
      }
      navigator.clipboard.writeText(text).catch(console.error);
    };
    const US_DEBT_BASE = {
      date: /* @__PURE__ */ new Date("2025-10-23T00:00:00Z"),
      amount: 38e12,
      // 38T
      perSecond: 63e3
      // USD / second
    };
    const DE_DEBT_BASE = {
      date: /* @__PURE__ */ new Date("2025-03-31T00:00:00Z"),
      amount: 252e10,
      // 2.52T EUR
      perSecond: 1800
      // EUR / second
    };
    const GR_DEBT_BASE = {
      date: /* @__PURE__ */ new Date("2025-06-30T00:00:00Z"),
      amount: 403e9,
      // 403B EUR
      perSecond: 160
      // EUR / second
    };
    const getDebtEstimate = (base, now) => {
      const secondsSinceBase = (now - base.date) / 1e3;
      return base.amount + base.perSecond * secondsSinceBase;
    };
    const updateFields = () => {
      const now = /* @__PURE__ */ new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1);
      const greatReset = /* @__PURE__ */ new Date("2030-01-01T00:00:00Z");
      const greatEvent = /* @__PURE__ */ new Date("2015-06-15T10:30:00Z");
      const unixEpoch = /* @__PURE__ */ new Date("1970-01-01T00:00:00Z");
      fields.forEach((field) => {
        const title = field.dataset.title;
        let value = "";
        switch (title) {
          // ---- Current Date & Time ----
          case "Current Time":
            value = now.toLocaleTimeString("en-GB");
            break;
          case "Current Date":
            value = now.toLocaleDateString("en-GB", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric"
            });
            break;
          case "Current Week":
            value = `Week ${getWeekNumber(now)}`;
            break;
          case "Current Timestamp":
            value = Math.floor(now.getTime() / 1e3);
            break;
          // ---- Progress within the year ----
          case "Day Of The Year":
            value = Math.ceil((now - startOfYear) / (1e3 * 60 * 60 * 24));
            break;
          case "Minute Of The Year":
            value = Math.floor((now - startOfYear) / (1e3 * 60));
            break;
          case "Second Of The Year":
            value = Math.floor((now - startOfYear) / 1e3);
            break;
          // ---- Unix time ----
          case "Seconds Since 1/1/1970":
            value = Math.floor((now - unixEpoch) / 1e3);
            break;
          // ---- Time left in month/year ----
          case "Days Left For This Month":
            value = Math.floor((startOfNextMonth - now) / (1e3 * 60 * 60 * 24));
            break;
          case "Hours Left For This Month":
            value = Math.floor((startOfNextMonth - now) / (1e3 * 60 * 60));
            break;
          case "Seconds Left For This Month":
            value = Math.floor((startOfNextMonth - now) / 1e3);
            break;
          case "Days Left For This Year":
            value = Math.floor((startOfNextYear - now) / (1e3 * 60 * 60 * 24));
            break;
          case "Hours Left For This Year":
            value = Math.floor((startOfNextYear - now) / (1e3 * 60 * 60));
            break;
          case "Seconds Left For This Year":
            value = Math.floor((startOfNextYear - now) / 1e3);
            break;
          // ---- Time until Great Reset ----
          case "Days Left Until the Great Reset":
            value = timeUntil(greatReset).days;
            break;
          case "Hours Left Until the Great Reset":
            value = timeUntil(greatReset).hours;
            break;
          case "Seconds Left Until the Great Reset":
            value = timeUntil(greatReset).seconds;
            break;
          // ---- Time since Great Event ----
          case "Years Since the Great Event":
            value = timeSince(greatEvent).years;
            break;
          case "Days Since the Great Event":
            value = timeSince(greatEvent).days;
            break;
          case "Seconds Since the Great Event":
            value = timeSince(greatEvent).seconds;
            break;
          // ---- Debt counters (rough estimates) ----
          case "US Dept Counter": {
            const estimate = getDebtEstimate(US_DEBT_BASE, now);
            value = formatCurrency(estimate, "USD", 0);
            break;
          }
          case "Germanys Dept Counter": {
            const estimate = getDebtEstimate(DE_DEBT_BASE, now);
            value = formatCurrency(estimate, "EUR", 0);
            break;
          }
          case "Greece Dept Counter": {
            const estimate = getDebtEstimate(GR_DEBT_BASE, now);
            value = formatCurrency(estimate, "EUR", 0);
            break;
          }
          default:
            value = "";
        }
        field.value = value;
      });
    };
    copyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = button.dataset.copyDatetime;
        const field = container.querySelector(`[data-datetime-field="${index}"]`);
        if (field) copyToClipboard(field.value);
      });
    });
    updateFields();
    setInterval(updateFields, 1e3);
  }

  // public/js/src/admin/editLink.js
  function initEditLink() {
    const root = document.querySelector("[data-js-edit-link]");
    if (!root) return;
    const tabSelect = root.querySelector("[data-js-tab-selection]");
    if (!tabSelect) return;
    const sectionSelect = root.querySelector("[data-js-section-selection]");
    if (!sectionSelect) return;
    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!baseUrl) return;
    initReturnToSync({ tabSelect, sectionSelect, baseUrl });
    initEditLinkTabs({ tabSelect, sectionSelect, baseUrl });
    initEditLinkInitialSection({ tabSelect, sectionSelect, baseUrl });
    initAiAutoFill();
    initDeleteLink({ tabSelect, sectionSelect, baseUrl });
  }
  function initEditLinkTabs({ tabSelect, sectionSelect, baseUrl }) {
    tabSelect.addEventListener("change", async (event) => {
      const selectedTabId = event.target.value;
      if (!selectedTabId) return;
      await loadSectionsForTab({ tabId: selectedTabId, sectionSelect, baseUrl });
      syncReturnTo({ tabSelect, sectionSelect, baseUrl });
    });
  }
  async function initEditLinkInitialSection({ tabSelect, sectionSelect, baseUrl }) {
    const initialSectionInput = document.querySelector("[data-js-initial-section-id]");
    if (!initialSectionInput) return;
    const preselectId = initialSectionInput.value;
    if (!preselectId) return;
    const selectedTabId = tabSelect.value;
    if (!selectedTabId) return;
    await loadSectionsForTab({
      tabId: selectedTabId,
      sectionSelect,
      baseUrl,
      preselectId
    });
    syncReturnTo({ tabSelect, sectionSelect, baseUrl });
  }
  function initReturnToSync({ tabSelect, sectionSelect, baseUrl }) {
    tabSelect.addEventListener("change", () => {
      syncReturnTo({ tabSelect, sectionSelect, baseUrl });
    });
    sectionSelect.addEventListener("change", () => {
      syncReturnTo({ tabSelect, sectionSelect, baseUrl });
    });
    syncReturnTo({ tabSelect, sectionSelect, baseUrl });
  }
  function buildReturnTo({ tabSelect, sectionSelect, baseUrl }) {
    const tabId = String(tabSelect?.value || "").trim();
    const sectionId = String(sectionSelect?.value || "").trim();
    const params = new URLSearchParams();
    if (tabId) params.set("tab", tabId);
    if (sectionId) params.set("section", sectionId);
    const base = new URL(baseUrl, window.location.origin);
    const query = params.toString();
    return query ? `${base.href}?${query}` : base.href;
  }
  function syncReturnTo({ tabSelect, sectionSelect, baseUrl }) {
    const returnInput = document.querySelector("[data-js-return-to]");
    if (!returnInput) return;
    returnInput.value = buildReturnTo({ tabSelect, sectionSelect, baseUrl });
  }
  async function loadSectionsForTab({ tabId, sectionSelect, baseUrl, preselectId }) {
    if (!tabId) {
      sectionSelect.innerHTML = '<option value="" disabled selected hidden>Choose a section</option>';
      sectionSelect.disabled = true;
      return;
    }
    sectionSelect.disabled = true;
    sectionSelect.innerHTML = '<option value="" disabled selected hidden>Loading\u2026</option>';
    try {
      const response = await fetch(
        `${baseUrl}ajax/get_tabs_list/${encodeURIComponent(tabId)}`,
        {
          method: "GET",
          headers: {
            "X-Requested-With": "XMLHttpRequest"
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      sectionSelect.innerHTML = '<option value="" disabled selected hidden>Choose a section</option>';
      if (Array.isArray(data) && data.length) {
        data.forEach((section) => {
          const option = document.createElement("option");
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
      console.error("Failed to fetch sections:", error);
      sectionSelect.innerHTML = '<option value="" disabled selected>Failed to load sections</option>';
      sectionSelect.disabled = true;
    }
  }
  function initAiAutoFill() {
    const root = document.querySelector("[data-js-edit-link]");
    if (!root) return;
    const aiButton = root.querySelector("[data-js-ai-autofill-link]");
    if (!aiButton) return;
    const urlInput = root.querySelector('input[name="url"]');
    const labelInput = root.querySelector('input[name="label"]');
    const descriptionTextarea = root.querySelector('textarea[name="description"]');
    const animationEl = root.querySelector("[data-js-ai-animation]");
    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!urlInput || !labelInput || !descriptionTextarea || !animationEl || !baseUrl) {
      return;
    }
    aiButton.addEventListener("click", async () => {
      try {
        const text = (await navigator.clipboard.readText()).trim();
        if (!text) return;
        try {
          new URL(text);
          urlInput.value = text;
        } catch {
          return;
        }
      } catch (err) {
        console.error("Clipboard access failed:", err);
        return;
      }
      await fetchAndFillMetadata({
        urlInput,
        labelInput,
        descriptionTextarea,
        animationEl,
        baseUrl
      });
    });
  }
  async function fetchAndFillMetadata({ urlInput, labelInput, descriptionTextarea, animationEl, baseUrl }) {
    const url = urlInput.value.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      return;
    }
    animationEl.classList.remove("hidden");
    try {
      const response = await fetch(`${baseUrl}ajax/ai_autofill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({ url })
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data.title && !labelInput.value.trim()) {
        labelInput.value = data.title;
      }
      if (data.description && !descriptionTextarea.value.trim()) {
        descriptionTextarea.value = data.description;
      }
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
    } finally {
      animationEl.classList.add("hidden");
    }
  }
  function initDeleteLink({ tabSelect, sectionSelect, baseUrl }) {
    const deleteBtn = document.querySelector("[data-js-delete-link]");
    if (!deleteBtn) return;
    const type = deleteBtn.dataset.type;
    const id = deleteBtn.dataset.id;
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this link?")) return;
      const url = `${baseUrl}ajax/delete_record/${type}/${id}`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          },
          body: JSON.stringify({})
        });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const result = await response.json();
        if (result.success) {
          const returnInput = document.querySelector("[data-js-return-to]");
          const returnTo = (returnInput?.value || "").trim() || buildReturnTo({ tabSelect, sectionSelect, baseUrl });
          window.location.href = new URL(returnTo, window.location.origin).href;
        } else {
          console.error("Delete failed:", result.message || result);
          alert("Delete failed.");
        }
      } catch (err) {
        console.error("Error deleting record:", err);
        alert("An error occurred while deleting.");
      }
    });
  }

  // public/js/src/admin/utilities.js
  function initSorting(table) {
    const list = document.querySelector("[data-sortable-list]");
    if (!list) return;
    let draggedItem = null;
    list.addEventListener("dragstart", (event) => {
      const li = event.target.closest("[data-sortable-item]");
      if (!li) return;
      draggedItem = li;
      li.classList.add("opacity-50");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", li.dataset.itemId || "");
    });
    list.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (!draggedItem) return;
      const target = event.target.closest("[data-sortable-item]");
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
    list.addEventListener("drop", (event) => {
      event.preventDefault();
    });
    list.addEventListener("dragend", () => {
      if (!draggedItem) return;
      draggedItem.classList.remove("opacity-50");
      draggedItem = null;
      const newOrder = Array.from(
        list.querySelectorAll("[data-sortable-item]")
      ).map((item) => item.dataset.itemId);
      saveOrder(table, newOrder);
    });
  }
  async function saveOrder(table, order) {
    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!baseUrl) return;
    try {
      const response = await fetch(`${baseUrl}ajax/update_order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({ table, order })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await response.json();
    } catch (err) {
      console.error(`\u274C Error updating ${table} order:`, err);
    }
  }

  // public/js/src/admin/editTab.js
  function initEditTab() {
    const root = document.querySelector("[data-js-edit-tab]");
    if (!root) return;
    initDeleteTab();
    initSorting("tabs");
  }
  function initDeleteTab() {
    const deleteBtn = document.querySelector("[data-js-delete-tab]");
    if (!deleteBtn) return;
    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!baseUrl) return;
    const type = deleteBtn.dataset.type;
    const id = deleteBtn.dataset.id;
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this tab?")) return;
      const url = `${baseUrl}ajax/delete_record/${type}/${id}`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          },
          body: JSON.stringify({})
        });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const result = await response.json();
        if (result.success) {
          window.location.href = baseUrl;
        } else {
          console.error("Delete failed:", result.message || result);
          alert("Delete failed.");
        }
      } catch (err) {
        console.error("Error deleting record:", err);
        alert("An error occurred while deleting.");
      }
    });
  }

  // public/js/src/admin/editSection.js
  function initEditSection() {
    const root = document.querySelector("[data-js-edit-section]");
    if (!root) return;
    initDeleteSection();
    initFillSectionsList();
    initSorting("sections");
  }
  function initDeleteSection() {
    const deleteBtn = document.querySelector("[data-js-delete-section]");
    if (!deleteBtn) return;
    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!baseUrl) return;
    const type = deleteBtn.dataset.type;
    const id = deleteBtn.dataset.id;
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this section?")) return;
      const url = `${baseUrl}ajax/delete_record/${type}/${id}`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          },
          body: JSON.stringify({})
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        if (result.success) {
          window.location.href = baseUrl;
        } else {
          console.error("Delete failed:", result.message || result);
          alert("Delete failed.");
        }
      } catch (err) {
        console.error("Error deleting record:", err);
        alert("An error occurred while deleting.");
      }
    });
  }
  function initFillSectionsList() {
    const select = document.querySelector('select[name="tab_id"]');
    const list = document.querySelector("[data-sortable-list]");
    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!select || !list || !baseUrl) return;
    const renderSections = (sections) => {
      list.innerHTML = "";
      if (!Array.isArray(sections) || sections.length === 0) {
        const li = document.createElement("li");
        li.className = "text-xs opacity-70 px-2 py-1";
        li.textContent = "No sections for this tab yet.";
        list.appendChild(li);
        return;
      }
      for (const item of sections) {
        const li = document.createElement("li");
        li.className = "w-full";
        li.dataset.itemId = item.id;
        li.dataset.sortableItem = "";
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
    const loadSectionsForTab2 = async (tabId) => {
      list.innerHTML = "";
      if (!tabId) return;
      try {
        const res = await fetch(`${baseUrl}ajax/get_sections_by_tab/${tabId}`, {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json"
          }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        renderSections(data);
      } catch (err) {
        console.error("Failed to load sections:", err);
        list.innerHTML = "";
        const li = document.createElement("li");
        li.className = "text-xs text-error px-2 py-1";
        li.textContent = "Error loading sections.";
        list.appendChild(li);
      }
    };
    if (select.value) {
      loadSectionsForTab2(select.value);
    }
    select.addEventListener("change", () => {
      loadSectionsForTab2(select.value);
    });
  }

  // public/js/src/system/state.js
  function getStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return {
      tab: params.get("tab") || "",
      section: params.get("section") || "",
      q: params.get("q") || ""
    };
  }
  function setStateInUrl(state, { replace = false } = {}) {
    const url = new URL(window.location.href);
    const syncParam = (key, value) => {
      if (value === void 0) return;
      const normalized = String(value).trim();
      if (normalized) {
        url.searchParams.set(key, normalized);
      } else {
        url.searchParams.delete(key);
      }
    };
    syncParam("tab", state.tab);
    syncParam("section", state.section);
    syncParam("q", state.q);
    const historyMethod = replace ? "replaceState" : "pushState";
    window.history[historyMethod]({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  // public/js/src/system/ajax.js
  function tabsInit() {
    const buttons = document.querySelectorAll('[data-action="js-fetch-links"]');
    if (!buttons.length) return;
    const searchInput = document.querySelector("[data-js-search]");
    const { tab: urlTab, section: urlSection } = getStateFromUrl();
    const homeButton = document.querySelector("[js-home-button]");
    homeButton?.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
      }
      sessionStorage.removeItem("searchTerm");
    });
    let activeButton = [...buttons].find((btn) => btn.dataset.tabId === urlTab && btn.dataset.sectionId === urlSection);
    if (!activeButton) {
      activeButton = buttons[0];
    }
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.dataset.tabId;
        const sectionId = button.dataset.sectionId;
        buttons.forEach((btn) => btn.classList.remove("menu-active"));
        button.classList.add("menu-active");
        if (searchInput) {
          searchInput.value = "";
          sessionStorage.removeItem("searchTerm");
        }
        setStateInUrl({ tab: tabId, section: sectionId });
        displayLinks(tabId, sectionId);
      });
    });
    activeButton.classList.add("menu-active");
    setStateInUrl(
      {
        tab: activeButton.dataset.tabId,
        section: activeButton.dataset.sectionId
      },
      { replace: true }
    );
    displayLinks(activeButton.dataset.tabId, activeButton.dataset.sectionId);
  }
  async function displayLinks(tabId, sectionId) {
    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!baseUrl) return;
    const target = document.querySelector("[data-display-links]");
    if (!target) return;
    target.innerHTML = `<span class="loading loading-ring loading-xl text-secondary"></span>`;
    try {
      const response = await fetch(`${baseUrl}ajax/get_links_view/${tabId}/${sectionId}`, {
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });
      if (!response.ok) {
        const text = await response.text();
        console.error("Fetch error:", text);
        throw new Error(`HTTP ${response.status}`);
      }
      const html = await response.text();
      target.innerHTML = html;
    } catch (err) {
      console.error("Error fetching HTML:", err);
      target.innerHTML = `
            <p class="text-error">Failed to load links for tab ${tabId}.</p>
        `;
    }
  }

  // public/js/src/system/nav.js
  function initNavbarDropdowns() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;
    const detailsList = navbar.querySelectorAll("ul.menu details");
    const dropdown = navbar.querySelector(".dropdown");
    const closeAll = () => {
      detailsList.forEach((d) => {
        d.open = false;
      });
    };
    detailsList.forEach((details) => {
      details.addEventListener("toggle", () => {
        if (details.open) {
          detailsList.forEach((other) => {
            if (other !== details) {
              other.open = false;
            }
          });
        }
      });
    });
    document.addEventListener("click", (event) => {
      if (!navbar.contains(event.target)) {
        closeAll();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeAll();
      }
    });
    if (dropdown) {
      dropdown.addEventListener("focusin", () => {
        closeAll();
      });
    }
  }

  // public/js/src/system/search.js
  function initSearch() {
    const searchInput = document.querySelector("[data-js-search]");
    if (!searchInput) return;
    const storageKey = "searchTerm";
    let debounceTimer;
    searchInput.addEventListener("input", () => {
      const rawQuery = searchInput.value;
      const query = rawQuery.trim();
      if (!query) {
        clearTimeout(debounceTimer);
        sessionStorage.removeItem(storageKey);
        setStateInUrl({ q: "" }, { replace: true });
        restoreDefaultSection();
        return;
      }
      sessionStorage.setItem(storageKey, query);
      setStateInUrl({ q: query }, { replace: true });
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        displaySearchResults(query);
      }, 300);
    });
    const syncSearchState = () => {
      const { q: urlQuery } = getStateFromUrl();
      const inputQuery = searchInput.value.trim();
      const storedQuery = sessionStorage.getItem(storageKey) || "";
      const query = inputQuery || urlQuery || storedQuery;
      if (query) {
        if (!inputQuery) {
          searchInput.value = query;
        }
        sessionStorage.setItem(storageKey, query);
        setStateInUrl({ q: query }, { replace: true });
        displaySearchResults(query);
      } else {
        sessionStorage.removeItem(storageKey);
        setStateInUrl({ q: "" }, { replace: true });
        restoreDefaultSection();
      }
    };
    const scheduleSyncSearchState = () => {
      setTimeout(syncSearchState, 0);
    };
    window.addEventListener("pageshow", scheduleSyncSearchState);
    scheduleSyncSearchState();
  }
  function restoreDefaultSection() {
    const buttons = document.querySelectorAll("[data-tab-id]");
    if (!buttons.length) return;
    const { tab, section } = getStateFromUrl();
    const activeButton = [...buttons].find((button) => button.dataset.tabId === tab && button.dataset.sectionId === section) || buttons[0];
    buttons.forEach((btn) => btn.classList.remove("menu-active"));
    activeButton.classList.add("menu-active");
    displayLinks(activeButton.dataset.tabId, activeButton.dataset.sectionId);
  }
  async function displaySearchResults(query) {
    const baseUrl = document.querySelector('meta[name="base-url"]')?.content;
    if (!baseUrl) return;
    const target = document.querySelector("[data-display-links]");
    if (!target) return;
    target.innerHTML = `<span class="loading loading-ring loading-xl text-secondary"></span>`;
    try {
      const response = await fetch(
        `${baseUrl}ajax/search?q=${encodeURIComponent(query)}`,
        {
          headers: { "X-Requested-With": "XMLHttpRequest" }
        }
      );
      if (!response.ok) {
        const text = await response.text();
        console.error("Fetch error:", text);
        throw new Error(`HTTP ${response.status}`);
      }
      const results = await response.json();
      const html = buildSearchResultsHtml(results, query);
      target.innerHTML = html;
    } catch (err) {
      console.error("Error fetching search results:", err);
      target.innerHTML = `
            <p class="text-error">Failed to load search results.</p>
        `;
    }
  }
  function buildSearchResultsHtml(results, query) {
    const safeQuery = escapeHtml(query ?? "");
    if (!Array.isArray(results) || results.length === 0) {
      return `
            <section class="mb-6">
                <h3 class="text-2xl font-semibold mb-1 text-neutral-content">
                    Search results for: "<span class="italic">${safeQuery}</span>"
                </h3>
                <p class="opacity-70">No links found.</p>
            </section>
        `;
    }
    const itemsHtml = results.map((link) => {
      const url = escapeHtml(link.url ?? "#");
      const label = escapeHtml(link.label || link.url || "");
      const description = escapeHtml(link.description || "");
      const importance = link.importance ?? 3;
      return `
            <li>
                <a href="${url}"
                    rel="nofollow"
                    class="btn btn-soft shadow-md flex flex-col gap-0 px-4 py-2 importance-${importance}
                           transform transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg
                           w-full rounded-xl h-auto">
                    <span class="text-lg font-medium">
                        ${label}
                    </span>
                    ${description ? `<div class="text-sm opacity-80 font-light limit-text">
                                   ${description}
                               </div>` : ""}
                </a>
            </li>
        `;
    }).join("");
    return `
        <section class="mb-6">
            <h3 class="text-2xl font-semibold mb-4 text-neutral-content">
                Search results for: "<span class="italic">${safeQuery}</span>"
            </h3>

            <ul class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                ${itemsHtml}
            </ul>
        </section>
    `;
  }
  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  // public/js/src/app.js
  initHashTool();
  initCopyPasswordButtons();
  initWorkTime();
  initDateTime();
  initEditLink();
  initEditTab();
  initEditSection();
  tabsInit();
  initNavbarDropdowns();
  initSearch();
})();
