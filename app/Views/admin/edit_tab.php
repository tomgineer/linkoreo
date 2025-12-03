<?= $this->extend('layout_default') ?>
<?= $this->section('content') ?>

<main class="flex-1 px-6 pt-30 pb-10 custom-bg-2" data-js-edit-tab>
    <div class="max-w-5xl mx-auto">
        <div class="card bg-base-200 shadow-xl overflow-hidden">
            <!-- Make the card itself a grid -->
            <div class="grid md:grid-cols-[1fr_280px] min-h-[500px]">

                <!-- LEFT SIDE -->
                <div class="p-8 flex flex-col">
                    <h2 class="card-title text-2xl font-semibold mb-6">Edit Tab</h2>

                    <form class="flex flex-col flex-1 gap-4" action="<?= base_url('admin/update_tab/' . $tab['id']) ?>" method="post">
                        <?= csrf_field() ?>
                        <!-- Title -->
                        <div>
                            <label class="label">
                                <span class="label-text font-medium">Title</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value="<?= esc($tab['title']) ?>"
                                maxlength="50"
                                class="input input-bordered w-full"
                                placeholder="Enter title"
                                required>
                        </div>

                        <!-- Description -->
                        <div>
                            <label class="label">
                                <span class="label-text font-medium">Description</span>
                            </label>
                            <textarea
                                name="description"
                                maxlength="255"
                                class="textarea textarea-bordered w-full min-h-28"
                                placeholder="Optional short description"><?= esc($tab['description']) ?></textarea>
                        </div>


                        <!-- Bottom actions -->
                        <div class="mt-auto flex justify-between items-center pt-4 border-t border-base-300">
                            <button
                                type="button"
                                class="btn btn-square btn-ghost hover:btn-error"
                                data-js-delete-tab
                                data-type="tabs"
                                data-id="<?= esc($tab['id']) ?>">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                    class="size-5 text-base-content/65">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>

                            <div class="flex gap-3">
                                <a href="<?= base_url() ?>" class="btn btn-ghost">Cancel</a>
                                <button type="submit" class="btn btn-success">Save Changes</button>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- RIGHT SIDE -->
                <aside class="bg-base-100 border-l border-base-300 p-6 pb-12 flex flex-col">
                    <h3 class="font-semibold text-base mb-4">Sort Tabs</h3>

                    <p class="text-xs opacity-70 mb-3">
                        Drag and drop to reorder tabs.
                    </p>

                    <ul
                        class="menu bg-base-100 rounded-box flex-1 w-full flex flex-col gap-1"
                        aria-label="Sort tabs"
                        data-sortable-list>
                        <?php foreach ($tab_list as $item): ?>
                            <li
                                class="w-full"
                                data-item-id="<?= esc($item['id']) ?>"
                                data-sortable-item
                                draggable="true">
                                <button
                                    type="button"
                                    class="btn btn-soft btn-sm w-full justify-between cursor-move select-none">
                                    <span class="truncate text-left text-sm font-medium">
                                        <?= esc($item['title']) ?>
                                    </span>

                                    <!-- Drag handle icon -->
                                    <span class="opacity-60">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" stroke-width="1.5"
                                            class="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M9 5h.01M9 9h.01M9 13h.01M9 17h.01M15 5h.01M15 9h.01M15 13h.01M15 17h.01" />
                                        </svg>
                                    </span>
                                </button>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </aside>


            </div>
        </div>
    </div>
</main>

<?= $this->endSection() ?>