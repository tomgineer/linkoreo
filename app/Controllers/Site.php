<?php
namespace App\Controllers;

class Site extends BaseController {

/**
 * Renders the frontpage with cached navigation and visitor tracking.
 *
 * @return string Rendered frontpage HTML.
 */
public function links() {
    $this->main->trackVisitor();

    // Cache settings
    $cacheName = 'frontpage';
    if (!logged_in() && $cachedView = cache($cacheName)) return $cachedView;

    // Generate view content
    $data = [
        ...$this->data,
        'nav_tabs' => $this->main->getNavTabs(),
    ];
    $output = view('site/main', $data);

    // Store in cache for 1 month
    if (!logged_in()) {
        cache()->save($cacheName, $output, MONTH);
    }

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
