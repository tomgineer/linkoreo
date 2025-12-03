<?= $this->extend('layout_default') ?>
<?= $this->section('content') ?>

<?php
    // Most popular / commonly used hash algorithms
    $hashAlgorithms = [
        'md5'    => 'MD5',
        'sha1'   => 'SHA-1',
        'sha256' => 'SHA-256',
        'sha384' => 'SHA-384',
        'sha512' => 'SHA-512',
    ];
?>

<main class="mt-10 mb-4 px-6 flex-1">
    <div
        id="hash-tool"
        class="max-w-[75rem] mx-auto flex flex-col gap-6"
        data-hash-url="<?= site_url('ajax/hash_all') ?>"
    >
        <!-- Title -->
        <h1 class="text-2xl font-semibold text-neutral-content">
            Hash Generator
        </h1>

        <!-- Input & options -->
        <section class="flex flex-col gap-4" data-hash-column="input">
            <!-- Main input string -->
            <label class="form-control w-full">
                <div class="label mb-1">
                    <span class="label-text font-medium">Input string</span>
                </div>
                <textarea
                    class="textarea textarea-bordered font-mono text-base w-full min-h-[6rem]"
                    placeholder="Enter text to hash…"
                    data-hash-input
                ></textarea>
            </label>

            <!-- Trim option -->
            <div class="form-control">
                <label class="label cursor-pointer justify-start gap-3">
                    <input
                        type="checkbox"
                        class="checkbox checkbox-sm"
                        data-hash-trim
                        checked
                    />
                    <span class="label-text text-sm">
                        Trim whitespace before hashing
                    </span>
                </label>
            </div>
        </section>

        <!-- Outputs -->
        <section class="flex flex-col gap-4" data-hash-column="output">
            <?php foreach ($hashAlgorithms as $algoKey => $algoLabel): ?>
                <label
                    class="form-control w-full"
                    data-hash-row="<?= esc($algoKey) ?>"
                >
                    <div class="label mb-1">
                        <span class="label-text font-medium">
                            <?= esc($algoLabel) ?>
                        </span>
                    </div>

                    <div class="join w-full">
                        <input
                            type="text"
                            class="input font-mono text-sm w-full text-rose-500"
                            placeholder="<?= esc($algoLabel) ?> hash will appear here…"
                            readonly
                            data-hash-output="<?= esc($algoKey) ?>"
                        />

                        <button
                            type="button"
                            class="btn btn-soft btn-square join-item"
                            data-copy-hash="<?= esc($algoKey) ?>"
                            aria-label="Copy <?= esc($algoLabel) ?> hash"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" class="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                            </svg>
                        </button>
                    </div>
                </label>
            <?php endforeach; ?>
        </section>
    </div>
</main>

<?= $this->endSection() ?>
