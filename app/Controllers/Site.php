<?php
namespace App\Controllers;

class Site extends BaseController {

/**
 * Renders the frontpage with cached navigation and visitor tracking.
 *
 * @return string Rendered frontpage HTML.
 */
public function links() {
    // Cache settings
    $cacheName = 'frontpage';
    // if ($cachedView = cache($cacheName)) return $cachedView; // Disabled for DEV

    // Generate view content
    $data = [
        ...$this->data,
        'nav_tabs' => $this->main->getNavTabs(),
    ];
    $output = view('site/main', $data);

    // Store in cache for 1 month
    cache()->save($cacheName, $output, MONTH);

    // Track visitor (not cached)
    $this->main->trackVisitor();

    return $output;
}

/**
 * Displays a dynamic content page and tracks the visitor.
 *
 * @param string $page The page name to render.
 * @return void
 */
public function page(string $page) {
    $data = $this->data;
    echo view("site/{$page}", $data);
    $this->main->trackVisitor();
}

/**
 * Displays the sign-in page and tracks the visitor.
 *
 * @return void
 */
public function sign_in() {
    $data = $this->data;
    echo view('site/sign_in', $data);
    $this->main->trackVisitor();
}


} // END Class
