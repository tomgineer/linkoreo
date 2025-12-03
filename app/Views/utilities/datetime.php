<?php
$elements = [
    'group1' => [
        'title' => 'Current Date & Time',
        'items' => [
            'Current Time', // Format HH:MM:SS and real time display
            'Current Date', // Format Monday, 25 December 2025
            'Current Week', // Week of the year
            'Current Timestamp',
        ]
    ],

    'group2' => [
        'title' => 'Progress Within the Year',
        'items' => [
            'Day Of The Year', // How many days have passed since the beginning of this year
            'Minute Of The Year',
            'Second Of The Year',
        ]
    ],

    'group3' => [
        'title' => 'Time Until the Great Reset (1/1/2030)',
        'items' => [
            'Days Left Until the Great Reset',
            'Hours Left Until the Great Reset',
            'Seconds Left Until the Great Reset',
        ]
    ],

    'group4' => [
        'title' => 'Time Left in Current Periods',
        'items' => [
            'Days Left For This Month',
            'Hours Left For This Month',
            'Seconds Left For This Month',
            'Days Left For This Year',
            'Hours Left For This Year',
            'Seconds Left For This Year',
        ]
    ],

    'group5' => [
        'title' => 'The Moment That Changed Everything', // Great Event was 15.06.2015 - 10:30
        'items' => [
            'Years Since the Great Event',
            'Days Since the Great Event',
            'Seconds Since the Great Event',
        ]
    ],

    'group6' => [
        'title' => 'Global Debt Counters',
        'items' => [
            'US Dept Counter',
            'Germanys Dept Counter',
            'Greece Dept Counter',
        ]
    ],

    'group7' => [
        'title' => 'Unix Time Reference',
        'items' => [
            'Seconds Since 1/1/1970',
        ]
    ],
];
?>

<?= $this->extend('layout_default') ?>
<?= $this->section('content') ?>

<main class="mt-10 mb-4 px-6 flex-1" data-js-datetime>
    <div class="grid gap-y-4 gap-x-8 md:grid-cols-2 max-w-[75rem] mx-auto mb-24">

        <h1 class="col-span-2 text-2xl mb-2 font-semibold text-neutral-content">
            DateTime Calculator
        </h1>

        <?php $fieldIndex = 0; ?>

        <?php foreach ($elements as $group): ?>
            <fieldset class="fieldset bg-base-200 border border-base-300 rounded-box p-4 space-y-3 col-span-2 md:col-span-1">
                <legend class="fieldset-legend text-sm font-semibold uppercase tracking-wide mb-1 text-accent">
                    <?= esc($group['title']) ?>
                </legend>

                <?php foreach ($group['items'] as $itemTitle): ?>
                    <label class="form-control w-full">
                        <div class="label mb-1">
                            <span class="label-text font-medium text-base">
                                <?= esc($itemTitle) ?>
                            </span>
                        </div>
                        <div class="join w-full">
                            <input
                                type="text"
                                class="input font-mono w-full"
                                placeholder="Result"
                                value="<?= date('Y-m-d H:i:s', strtotime('+' . $fieldIndex . ' hours')) ?>"
                                readonly
                                data-datetime-field="<?= $fieldIndex ?>"
                                data-title="<?= htmlspecialchars($itemTitle, ENT_QUOTES) ?>" />
                            <button
                                type="button"
                                class="btn btn-soft btn-square join-item"
                                aria-label="Copy datetime"
                                data-copy-datetime="<?= $fieldIndex ?>">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24" stroke-width="1.5"
                                     stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                </svg>
                            </button>
                        </div>
                    </label>

                    <?php $fieldIndex++; ?>
                <?php endforeach; ?>
            </fieldset>
        <?php endforeach; ?>

    </div>
</main>

<?= $this->endSection() ?>
