<?= $this->extend('layout_default') ?>
<?= $this->section('content') ?>

<main class="flex-1 px-6 pt-20 pb-10 custom-bg-1" data-js-edit-link>
    <div class="max-w-3xl mx-auto">
        <div class="card bg-base-200 shadow-xl">
            <div class="card-body space-y-3 relative">
                <h2 class="card-title text-2xl font-semibold mb-0">Edit Link</h2>

                <p class="hidden absolute top-3 right-8" data-js-ai-animation>
                    <span class="skeleton skeleton-text text-base-content/10">AI is thinking hard...</span>
                </p>

                <form action="<?= base_url('admin/update_link/' . $link['id']) ?>" method="post" class="space-y-5">
                    <!-- Hidden Fields -->
                    <?= csrf_field() ?>
                    <input type="hidden" value="<?= esc($link['section_id']) ?>" data-js-initial-section-id>

                    <!-- Display-only -->
                    <p class="text-base-content/65 text-xs mb-8">This link was originally created on <span class="badge badge-dash badge-primary mx-1"><?= esc(date('l, d F Y – H:i', strtotime($link['created']))) ?></span> and is identified by ID <span class="badge badge-dash badge-primary mx-1"><?= esc($link['id']) ?></span></p>

                    <!-- Tab & Section -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="label">
                                <span class="label-text font-medium">Tab</span>
                            </label>
                            <select class="select select-bordered w-full" data-js-tab-selection required>
                                <option value="" disabled selected hidden>Choose a tab</option>
                                <?php foreach ($tabs as $tab): ?>
                                    <option value="<?= esc($tab['id']) ?>"
                                        <?= $link['tab_id'] == $tab['id'] ? 'selected' : '' ?>>
                                        <?= esc($tab['title']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div>
                            <label class="label">
                                <span class="label-text font-medium">Section</span>
                            </label>
                            <select name="section_id" class="select select-bordered w-full" data-js-section-selection required>
                                <option value="" disabled selected hidden>Choose a section</option>
                            </select>
                        </div>
                    </div>

                    <!-- URL -->
                    <div>
                        <label class="label">
                            <span class="label-text font-medium">URL</span>
                        </label>

                        <div class="join w-full">
                            <input type="url" id="url" name="url" value="<?= esc($link['url']) ?>" class="input input-bordered join-item w-full" required>

                            <button type="button" id="pasteUrl" class="btn btn-soft join-item" title="AI Auto-fill" data-js-ai-autofill-link>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                </svg>
                                <span class="font-medium text-xs">AI Auto-fill</span>
                            </button>
                        </div>
                    </div>


                    <!-- Label -->
                    <div>
                        <label class="label">
                            <span class="label-text font-medium">Label</span>
                        </label>
                        <input type="text" name="label" value="<?= esc($link['label']) ?>" class="input input-bordered w-full" required>
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="label">
                            <span class="label-text font-medium">Description</span>
                        </label>
                        <textarea name="description" class="textarea textarea-bordered w-full min-h-28"><?= esc($link['description']) ?></textarea>
                    </div>

                    <!-- Importance -->
                    <div class="flex flex-col gap-1">
                        <label class="label">
                            <span class="label-text font-medium mr-3">Importance</span>
                        </label>

                        <div class="join">
                            <?php foreach ($importanceLabels as $value => $label): ?>
                                <input
                                    type="radio"
                                    name="importance"
                                    value="<?= $value ?>"
                                    class="join-item btn btn-sm btn-soft btn-primary"
                                    aria-label="<?= $label ?>"
                                    <?= $link['importance'] == $value ? 'checked' : '' ?>>
                            <?php endforeach; ?>
                        </div>

                    </div>

                    <!-- Actions -->
                    <div class="flex justify-between items-center pt-4">
                        <!-- Left side -->
                        <button type="button" class="btn btn-square btn-ghost hover:btn-error" data-js-delete-link data-type="links" data-id="<?= esc($link['id']) ?>">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-base-content/65">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>

                        <!-- Right side -->
                        <div class="flex gap-3">
                            <a href="<?= base_url() ?>" class="btn btn-ghost">Cancel</a>
                            <button type="submit" class="btn btn-success">Save Changes</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    </div>
</main>

<?= $this->endSection() ?>