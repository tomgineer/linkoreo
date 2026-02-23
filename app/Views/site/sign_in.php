<?= $this->extend('layout_default') ?>
<?= $this->section('content') ?>

<main class="flex-1 flex justify-center px-6 py-10">

    <div class="absolute inset-0 -z-10">
        <img src="<?= base_url('gfx/bg.svg') ?>" class="h-full w-full object-cover">
    </div>

    <?php if (! logged_in()): ?>
        <section class="w-full max-w-4xl mt-[8vh]">

            <div class="grid grid-cols-1 lg:grid-cols-2 items-center overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-xl">
                <div class="p-4 md:p-12 bg-base-200 flex flex-col justify-center">
                    <img
                        src="<?= base_url('gfx/branding.svg') ?>"
                        alt="LinkOreo Branding"
                        class="w-auto h-50">
                    <p class="mt-4 text-sm md:text-base text-base-content/80">
                        Linkoreo is the bookmark manager I always wished existed, so I built it.
                        It is designed to be fast, distraction free, and fully under your control.
                        Follow the journey on
                        <a class="text-info underline" href="https://github.com/tomgineer/linkoreo" target="_blank" rel="nofollow noopener noreferrer">GitHub</a>
                        and see how it evolves.
                    </p>
                    <p class="mt-4 text-sm md:text-base text-base-content/80">
                        Currently <span class="text-info"><?= $count ?></span> bookmarks have been served in
                        <span class="text-info">{elapsed_time}</span> sec for
                        <span class="text-info"><?= nf($hits) ?></span> times.
                        You are browsing version <span class="text-info">v<?= LINKOREO_VERSION ?></span>.
                    </p>
                </div>

                <form action="<?= site_url('users/login') ?>" method="post" class="p-6 md:p-8">
                    <?= csrf_field() ?>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend text-lg font-semibold">Sign-in</legend>

                        <label class="label" for="email">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            class="input input-bordered w-full bg-base-200"
                            placeholder="you@example.com"
                            minlength="8"
                            required>

                        <label class="label mt-4" for="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            class="input input-bordered w-full bg-base-200"
                            placeholder="********"
                            minlength="3"
                            required>

                        <div class="flex justify-end mt-6">
                            <button
                                class="btn btn-primary"
                                type="submit"
                                name="submitLogin"
                                value="Submit Login">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                </svg>

                                <span>Sign in</span>
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </section>
    <?php endif; ?>


</main>

<?= $this->endSection() ?>