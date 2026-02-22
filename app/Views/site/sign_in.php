<?= $this->extend('layout_default') ?>
<?= $this->section('content') ?>

<main class="relative flex-1 flex justify-center px-6 py-10">

    <div class="absolute inset-0 -z-10">
        <img
            src="<?= base_url('gfx/bg.svg') ?>"
            class="h-full w-full object-cover">
    </div>

    <?php if (! logged_in()): ?>
        <form action="<?= site_url('users/login') ?>" method="post" class="w-full max-w-md mt-[10vh]">
            <?= csrf_field() ?>

            <fieldset class="fieldset bg-base-100 border-base-300 rounded-box border p-6 shadow-xl">
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
                    placeholder="••••••••"
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
    <?php endif; ?>

</main>

<?= $this->endSection() ?>