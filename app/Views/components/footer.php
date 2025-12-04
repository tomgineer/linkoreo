<footer class="bg-base-300 text-neutral-content justify-center items-center text-sm p-4 font-light text-center flex gap-2 flex-col lg:flex-row lg:gap-8">
    <p class="footer__text">
        Designed with ❤️ by
        <a href="https://github.com/tomgineer/linkoreo" target="_blank" rel="nofollow" class="link link-hover text-accent font-semibold">
            Tom Papatolis
        </a>
    </p>
    <p class="footer__text">
        Linkoreo Bookmark Manager
        <span class="text-accent font-semibold">v<?=version()?></span>
    </p>
    <p class="footer__text">
        Rendered in
        <span class="text-accent font-semibold">{elapsed_time}s</span>
    </p>
    <p class="footer__text">
        Total:
        <span class="text-accent font-semibold"><?=$count?></span> bookmarks
    </p>
    <p class="footer__text">
        Proudly served
        <span class="text-accent font-semibold"><?=nf($hits)?></span> times
    </p>
</footer>
