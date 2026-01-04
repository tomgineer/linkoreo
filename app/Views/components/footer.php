<footer
    class="bg-base-300 justify-center items-center text-xs p-4 text-base-content/50
        text-center flex gap-3 flex-col lg:flex-row lg:gap-6 font-mono">
    <p>
        Designed with <span class="text-white">❤️</span> by
        <a href="https://tompapatolis.com" target="_blank" rel="noopener noreferrer nofollow" class="link link-hover text-base-content/85">Tom Papatolis.</a>
        Visit Project on
        <a href="https://github.com/tomgineer/linkoreo" target="_blank" rel="noopener noreferrer nofollow" class="link link-hover text-base-content/85">
            GitHub
        </a>
    </p>
    <p>
        Linkoreo Bookmark Manager
        <span class="text-base-content/85">v<?=LINKOREO_VERSION?></span>
    </p>
    <p>
        Rendered in
        <span class="text-base-content/85">{elapsed_time}s</span>
    </p>
    <p>
        Total:
        <span class="text-base-content/85"><?=$count?></span> bookmarks
    </p>
    <p>
        Proudly served
        <span class="text-base-content/85"><?=nf($hits)?></span> times
    </p>

    <div class="flex gap-1">
        <span class="bg-base-100 size-4 border border-base-content/35"></span>
        <span class="bg-base-200 size-4 border border-base-content/35"></span>
        <span class="bg-base-300 size-4 border border-base-content/35"></span>
        <span class="bg-primary size-4 border border-base-content/35"></span>
        <span class="bg-secondary size-4 border border-base-content/35"></span>
        <span class="bg-accent size-4 border border-base-content/35"></span>
        <span class="bg-info size-4 border border-base-content/35"></span>
    </div>
</footer>
