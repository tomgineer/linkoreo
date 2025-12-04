<?= $this->extend('layout_default') ?>
<?= $this->section('content') ?>

<div class="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:flex-1">
    <aside class="w-full lg:w-[300px] lg:shrink-0 bg-base-200 p-4">
        <?= $this->include('components/menu') ?>
    </aside>

    <main class="lg:flex-1 p-4 lg:p-8">
        <div class="lg:sticky lg:top-8" data-display-links></div>
    </main>
</div>

<?= $this->endSection() ?>