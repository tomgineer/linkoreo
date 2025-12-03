<?= $this->extend('layout_default') ?>
<?= $this->section('content') ?>

<div class="flex flex-1">
    <aside class="w-[300px] shrink-0 bg-base-200 p-4">
        <?= $this->include('components/menu') ?>
    </aside>

    <main class="flex-1 p-8">
        <div class="sticky top-8" data-display-links></div>
    </main>
</div>

<?= $this->endSection() ?>