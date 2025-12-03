<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Linkoreo :: Delicious Bookmark Manager</title>
    <meta name="description" content="Syndesu is your go-to app for organizing, syncing, and accessing bookmarks across devices. Simplify your browsing experience.">
    <meta name="base-url" content="<?=base_url();?>">
    <meta name="keywords" content="bookmarks, bookmark manager, sync bookmarks, organize bookmarks, Linkoreo">
    <meta name="author" content="Tom Papatolis">
    <meta name="robots" content="index, follow">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Linkoreo :: Delicious Bookmark Manager">
    <meta property="og:description" content="Simplify your browsing experience with Syndesu. Organize and sync bookmarks across devices seamlessly.">
    <meta property="og:image" content="https://linkoreo.com/icon.jpg">
    <meta property="og:url" content="https://linkoreo.com">
    <meta property="og:type" content="app">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Linkoreo :: Delicious Bookmark Manager">
    <meta name="twitter:description" content="Simplify your browsing experience with Linkoreo. Organize and sync bookmarks across devices seamlessly.">
    <meta name="twitter:image" content="https://linkoreo.com/icon.jpg">

    <!-- Fonts & CSS -->
	<link rel="stylesheet" href="<?=path_assets()?>fonts/firasans/stylesheet.css?v=<?=version()?>">
	<link rel="stylesheet" href="<?=path_assets()?>fonts/firacode/stylesheet.css?v=<?=version()?>">
    <link rel="stylesheet" href="<?=path_css()?>tailwind.css?v=<?=version()?>">

	<?= $this->include('components/favicon') ?>
	<script src="<?=path_js()?>app-dist.js?v=<?=version()?>" defer></script>

    <?= $this->renderSection('head') ?>

</head>
<body class="min-h-screen flex flex-col">
	<?= $this->include('components/nav') ?>
    <?= $this->renderSection('content') ?>
    <?= $this->include('components/footer') ?>
</body>
</html>