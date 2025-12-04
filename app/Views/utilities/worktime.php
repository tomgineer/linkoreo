<?= $this->extend('layout_default') ?>

<?= $this->section('content') ?>

<main class="mt-10 mb-12 px-6 flex-1">
    <div class="max-w-[70rem] mx-auto flex flex-col gap-8">

        <!-- Header -->
        <header class="flex flex-col gap-2">
            <h1 class="text-2xl font-semibold text-neutral-content">
                Work Time
            </h1>
            <p class="text-sm text-neutral-content/70">
                The system remembers the time even if you close the page.
            </p>
        </header>

        <!-- Start time input -->
        <section class="flex flex-col gap-4">
            <label class="form-control w-full max-w-sm">
                <div class="label mb-1">
                    <span class="label-text font-medium">
                        When did you start working?
                    </span>
                </div>
                <div class="join w-full">
                    <input
                        type="time"
                        name="arrival"
                        min="07:00"
                        max="19:00"
                        value="08:00"
                        required
                        class="input input-bordered join-item w-full work-time-start" />
                    <button
                        type="button"
                        class="btn btn-soft join-item work-time-go"
                        aria-label="Start work time calculation">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>

                    </button>
                </div>
            </label>
        </section>

        <!-- Big center clock -->
        <section class="flex flex-col items-center justify-center mt-8 gap-3">
            <div class="work-time-display font-mono text-5xl lg:text-[10rem] text-primary-content/85 px-10 text-center select-none leading-tight tracking-[-2px]">
                00:00:00
            </div>

            <p class="text-base text-neutral-content/70 text-center tracking-widest font-light"data-work-progress-text></p>
        </section>

        <section class="mb-8">
            <progress class="progress progress-error w-full" value="40" max="100"></progress>
        </section>

        <!-- Info / end time -->
        <section class="flex flex-col gap-3 mx-auto max-w-xl w-full">
            <div role="alert" class="alert alert-success alert-soft font-light">
                <div>At <span class="work-time-end font-semibold">00:00:00</span> you will have worked <span class="font-semibold">8 full hours</span> (deducted by the lunch break).</div>
            </div>

            <div role="alert" class="alert alert-info alert-soft font-light">
                <div>
                    After <span class="font-semibold">6 hours</span> of work,
                    <span class="font-semibold">30 minutes</span> of break time will be deducted.<br>
                    After <span class="font-semibold">9 hours</span> of work,
                    another <span class="font-semibold">15 minutes</span> are deducted for a second break.
                </div>
            </div>

        </section>

    </div>
</main>

<?= $this->endSection() ?>