<nav class="navbar bg-base-300 z-999">
    <div class="flex-1">
        <a class="btn btn-ghost text-xl" href="<?= base_url() ?>">
            <img class="h-8 w-auto opacity-85 hover:opacity-100 transition-opacity duration-200 select-none" src="<?= path_gfx() . 'logo.svg' ?>" alt="Linkoreo Logo">
        </a>
    </div>

    <div class="flex items-center gap-2">
        <ul class="menu menu-horizontal px-1">
            <?php if (logged_in()): ?>
                <li>
                    <a href="<?= site_url('admin/edit_link/0') ?>" class="gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-info">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>New Link</span>
                    </a>
                </li>
                <li>
                    <details>
                        <summary>Administration</summary>
                        <ul class="bg-base-200 rounded-t-none p-2 min-w-52">
                            <li>
                                <a href="<?= site_url('admin/edit_section/0') ?>" class="gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-info">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>

                                    <span>New Section</span>
                                </a>
                            </li>

                            <li>
                                <a href="<?= site_url('admin/edit_tab/0') ?>" class="gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-info">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>

                                    <span>New Tab</span>
                                </a>
                            </li>

                            <li>
                                <span class="font-semibold select-none pointer-events-none text-info">Edit Tab</span>
                                <ul>
                                    <?php foreach ($edit_tabs as $edit_tab): ?>
                                        <li>
                                            <a href="<?= site_url('admin/edit_tab/' . $edit_tab['id']) ?>" class="flex items-center gap-2">
                                                <span><?= esc($edit_tab['title']) ?></span>
                                            </a>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            </li>
                        </ul>
                    </details>
                </li>

            <?php endif; ?>
            <li>
                <details>
                    <summary>Utilities</summary>
                    <ul class="bg-base-200 rounded-t-none p-2 min-w-52">
                        <li><a href="<?= site_url('utilities/passgen') ?>">Password Generator</a></li>
                        <li><a href="<?= site_url('utilities/hashing') ?>">Hashing</a></li>
                        <li><a href="<?= site_url('utilities/datetime') ?>">DateTime</a></li>
                        <li><a href="<?= site_url('utilities/worktime') ?>">Worktime</a></li>
                    </ul>
                </details>
            </li>

            <li><a href="<?= site_url('about') ?>">About</a></li>
            <li><a href="<?= site_url('contact') ?>">Contact</a></li>

        </ul>

        <?php if (body_class() === 'site-links'): ?>
            <input
                type="text"
                placeholder="Search"
                data-js-search
                class="input input-bordered w-96 text-base" />
        <?php endif; ?>

        <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                <div class="w-10 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </div>
            </div>
            <ul
                tabindex="-1"
                class="menu dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow">

                <?php if (logged_in()): ?>
                    <li>
                        <a href="<?= site_url('users/logout') ?>" class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-red-500">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                            </svg>

                            <span>Sign out</span>
                        </a>
                    </li>
                <?php else: ?>
                    <li>
                        <a href="<?= site_url('sign-in') ?>" class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-accent">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                            </svg>
                            <span>Sign in</span>
                        </a>
                    </li>
                <?php endif; ?>

            </ul>
        </div>
    </div>
</nav>