<?= $this->extend('layout_default') ?>
<?= $this->section('content') ?>

<main class="mt-10 mb-4 px-6 flex-1" data-js-passgen>
    <div class="grid gap-y-4 gap-x-8 md:grid-cols-2 max-w-[75rem] mx-auto">

    <h1 class="col-span-2 text-2xl mb-2 font-semibold text-neutral-content">Password Generator</h1>

        <?php for ($i = 5; $i <= 50; $i += 5): ?>

            <!-- Normal password -->
            <label class="form-control w-full">
                <div class="label mb-1">
                    <span class="label-text font-medium"><?= $i ?> Characters</span>
                </div>
                <div class="join w-full">
                    <input
                        type="text"
                        class="input font-mono text-sm w-full"
                        placeholder="#"
                        value="<?= pwd($i) ?>"
                        readonly />
                    <button
                        type="button"
                        class="btn btn-soft btn-square join-item"
                        data-copy-pwd
                        aria-label="Copy password">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                        </svg>

                    </button>
                </div>
            </label>

            <!-- Strong password -->
            <label class="form-control w-full">
                <div class="label mb-1">
                    <span class="label-text font-medium">
                        <?= $i ?> Characters
                        <span class="ml-1 text-error font-semibold">Strong</span>
                    </span>
                </div>
                <div class="join w-full">
                    <input
                        type="text"
                        class="input font-mono text-base w-full"
                        placeholder="#"
                        value="<?= pwd($i, true) ?>"
                        readonly />
                    <button
                        type="button"
                        class="btn btn-soft btn-square join-item"
                        data-copy-pwd
                        aria-label="Copy strong password">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                        </svg>
                    </button>
                </div>
            </label>

        <?php endfor; ?>

    </div>
</main>

<?= $this->endSection() ?>