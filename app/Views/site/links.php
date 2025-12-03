<?php if (empty($links)): ?>
    <p class="opacity-70">No links found for this tab.</p>
<?php else: ?>
    <?php foreach ($links as $sectionId => $sectionLinks): ?>
        <?php
        $first = $sectionLinks[0];
        $sectionTitle = $first['section'] ?? 'Untitled section';
        $sectionDesc  = $first['section_desc'] ?? '';
        ?>

        <section class="mb-6">

            <div class="flex items-center gap-2">
                <h3 class="text-2xl font-semibold text-neutral-content mb-1">
                    <?= esc($sectionTitle) ?>
                </h3>

                <?php if (logged_in()): ?>
                    <a class="btn btn-sm btn-square btn-soft" href="<?= site_url('admin/edit_section/' . $sectionId) ?>">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </a>
                <?php endif; ?>
            </div>

            <?php if ($sectionDesc): ?>
                <p class="text-sm opacity-70 mb-2">
                    <?= esc($sectionDesc) ?>
                </p>
            <?php endif; ?>

            <ul class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                <?php foreach (array_filter($sectionLinks, fn($l) => !empty($l['id'])) as $link): ?>

                    <li>
                        <div class="indicator group relative w-full">
                            <?php if (logged_in()): ?>
                                <a href="<?= base_url('admin/edit_link/' . $link['id']) ?>"
                                    class="indicator-item font-semibold badge badge-primary badge-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 right-3"
                                    title="Edit this link">
                                    EDIT
                                </a>
                            <?php endif; ?>

                            <a href="<?= esc($link['url']) ?>"
                                rel="nofollow"
                                class="btn shadow-md flex flex-col gap-0 h-16 importance-<?= $link['importance'] ?>
                                        transform transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg
                                        w-full text-left">
                                <span class="text-base font-medium">
                                    <?= esc($link['label'] ?: $link['url']) ?>
                                </span>

                                <?php if (!empty($link['description'])): ?>
                                    <div class="text-sm opacity-80 font-normal limit-text">
                                        <?= esc($link['description']) ?>
                                    </div>
                                <?php endif; ?>
                            </a>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>

        </section>
    <?php endforeach; ?>
<?php endif; ?>