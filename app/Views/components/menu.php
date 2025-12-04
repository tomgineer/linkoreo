<ul class="menu rounded-box w-full">
    <li>
        <h2 class="menu-title text-xl">Explore</h2>
        <ul>
            <?php foreach ($nav_tabs as $tab_id => $sections): ?>
                <?php $tab_name = esc($sections[0]['tab']); ?>
                <li>
                    <button type="button"
                        class="w-full text-left font-semibold"
                        data-tab-id="<?= $tab_id ?>"
                        data-section-id="0"
                        data-action="js-fetch-links">
                        <?= $tab_name ?>
                    </button>

                    <?php if (!empty($sections[0]['section_id'])): ?>
                        <ul class="hidden lg:block">
                            <?php foreach ($sections as $sec): ?>
                                <?php if (!empty($sec['section'])): ?>
                                    <li>
                                        <button type="button"
                                            class="w-full text-left"
                                            data-tab-id="<?= $sec['tab_id'] ?>"
                                            data-section-id="<?= $sec['section_id'] ?>"
                                            data-action="js-fetch-links">
                                            <?= esc($sec['section']) ?>
                                        </button>
                                    </li>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </ul>
                    <?php endif; ?>
                </li>
            <?php endforeach; ?>
        </ul>
    </li>
</ul>