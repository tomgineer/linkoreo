<?php
namespace App\Controllers;
use CodeIgniter\API\ResponseTrait;
use App\Models\AdminModel;
// use App\Models\MainModel;

class Ajax extends BaseController {
    use ResponseTrait;
    protected AdminModel $admin;

    function __construct() {
        $this->admin = new AdminModel();
    }

/**
 * Handles AJAX search requests and returns JSON results.
 *
 * Validates the request type, retrieves the search term from the
 * query string, and calls the model search method. Returns an
 * empty array for short or empty queries and handles exceptions
 * gracefully with proper error responses.
 *
 * @return \CodeIgniter\HTTP\ResponseInterface JSON response containing search results or an error message.
 */
public function search() {
    // Ensure it's an AJAX request
    if (! $this->request->isAJAX()) {
        return $this->failForbidden('Not an AJAX request');
    }

    // Get search term from query string: /ajax/search?q=foo
    $query = trim((string) $this->request->getGet('q'));

    // Gracefully ignore short or empty queries
    if ($query === '' || mb_strlen($query) < 2) {
        return $this->respond([]);
    }

    try {
        // Call your model (adjust to your actual model name/method)
        $results = $this->main->search($query);

        // Ensure we always return an array
        if (! is_array($results)) {
            $results = [];
        }

        return $this->respond($results); // 200 with JSON
    } catch (\Throwable $e) {
        log_message('error', 'Search error: {message}', ['message' => $e->getMessage()]);
        return $this->failServerError('An error occurred while performing the search.');
    }
}

/**
 * Handles AJAX requests for generating multiple hash values.
 *
 * Accepts a JSON payload containing a `text` field and returns a JSON object
 * with common hash algorithm results (MD5, SHA-1, SHA-256, SHA-384, SHA-512).
 *
 * @return \CodeIgniter\HTTP\ResponseInterface JSON response containing hashes
 */
public function hash_all() {
    if (! $this->request->isAJAX()) {
        return $this->failForbidden('Not an AJAX request');
    }

    $body = $this->request->getJSON(true);
    $text = (string) ($body['text'] ?? '');

    $algos = ['md5', 'sha1', 'sha256', 'sha384', 'sha512'];

    $result = [];

    foreach ($algos as $algo) {
        if (in_array($algo, hash_algos(), true)) {
            $result[$algo] = hash($algo, $text);
        } else {
            $result[$algo] = null;
        }
    }

    return $this->response->setJSON($result);
}

/**
 * Deletes a record from the specified table via AJAX request.
 *
 * Expects a POST request to `ajax/delete_record/{table}/{id}`.
 * Only processes AJAX requests; otherwise returns a forbidden response.
 *
 * @param string $table The database table name.
 * @param int    $id    The ID of the record to delete.
 * @return CodeIgniter\HTTP\ResponseInterface JSON response indicating success or failure.
 */
public function delete_record(string $table, int $id) {
    // Ensure user is logged in
    if (! logged_in()) {
        return $this->failUnauthorized('You must be logged in to perform this action.');
    }

    if (! $this->request->isAJAX()) {
        return $this->failForbidden('Not an AJAX request');
    }

    // Basic validation
    if (empty($table) || $id <= 0) {
        return $this->failValidationError('Invalid table name or ID.');
    }

    try {
        $deleted = $this->admin->delete_record($table, $id);

        if ($deleted) {
            return $this->respond([
                'success' => true,
                'message' => 'Record deleted successfully.'
            ]);
        }

        return $this->failNotFound('Record not found or could not be deleted.');
    } catch (\Throwable $e) {
        log_message('error', 'Delete record failed: ' . $e->getMessage());

        return $this->failServerError('An error occurred while deleting the record.');
    }
}

/**
 * Update Order
 */
// public function update_order($table) {
//     if ( !logged_in() ) {return;}

// 	if($this->request->getMethod()=='post') {
// 		$data = $this->request->getJSON(TRUE);
// 		$this->admin->updateOrder($data, $table);
// 		$json_data = ['message' => 'done'];
// 		return $this->respond($json_data);
// 	}
// }

/**
 * Returns rendered links view for the given tab and section, using monthly caching.
 *
 * @param int $tab_id     Tab ID to fetch links for.
 * @param int $section_id Section ID to fetch links for (0 for all).
 * @return string         Rendered HTML view (cached for one month).
 */
public function get_links_view(int $tab_id, int $section_id) {
    // Ensure it's an AJAX request
    if (!$this->request->isAJAX()) {
        return $this->failForbidden('Not an AJAX request');
    }

    // Cache settings
    $cacheName = "links_{$tab_id}_{$section_id}";
    // if ($cachedView = cache($cacheName)) return $cachedView; //Disabled for DEV

    // Generate view content
    $data['links'] = $this->main->getLinksArr($tab_id, $section_id);
    $output = view('site/links', $data);

    // Store in cache for 1 month
    cache()->save($cacheName, $output, MONTH);

    return $output;
}

/**
 * Returns all sections for a given tab via AJAX.
 *
 * @param int $tab_id Tab ID to fetch sections for.
 * @return \CodeIgniter\HTTP\Response JSON response with raw section data.
 */
public function get_tabs_list(int $tab_id) {
    // Ensure it's an AJAX request
    if (! $this->request->isAJAX()) {
        return $this->failForbidden('Not an AJAX request');
    }

    // Get the sections as-is from the model/helper
    $sections = $this->admin->getSectionsInTab($tab_id);

    // Return raw result array as JSON (no shaping)
    return $this->response->setJSON($sections);
}

/**
 * Fetches page metadata (title & description) for a given URL.
 *
 * Expects a JSON payload: { "url": "https://example.com" }
 * Returns JSON: { "title": "...", "description": "..." } or { "error": "..." }.
 */
public function ai_autofill() {
    // Ensure user is logged in
    if (! logged_in()) {
        return $this->failUnauthorized('You must be logged in to perform this action.');
    }

    // Ensure it's an AJAX request
    if (! $this->request->isAJAX()) {
        return $this->failForbidden('Not an AJAX request');
    }

    // Read JSON body
    $payload = $this->request->getJSON(true);
    $url     = trim($payload['url'] ?? '');

    // Basic URL validation
    if ($url === '' || ! filter_var($url, FILTER_VALIDATE_URL)) {
        return $this->response->setJSON([
            'error' => 'Invalid URL',
        ]);
    }

    // Fetch HTML (simple server-side fetch)
    $context = stream_context_create([
        'http' => [
            'timeout'     => 5,
            'user_agent'  => 'LinkoreoMetaBot/1.0 (+https://your-site.example)',
        ],
    ]);

    $html = @file_get_contents($url, false, $context);

    if ($html === false) {
        return $this->response->setJSON([
            'error' => 'Unable to fetch URL content',
        ]);
    }

    // Parse HTML for <title> and <meta name="description">
    $title       = '';
    $description = '';

    libxml_use_internal_errors(true);

    $dom = new \DOMDocument();
    $loaded = $dom->loadHTML($html);

    if ($loaded) {
        // <title>
        $titleNodes = $dom->getElementsByTagName('title');
        if ($titleNodes->length > 0) {
            $title = trim($titleNodes->item(0)->textContent ?? '');
        }

        // <meta name="description"> or <meta property="og:description">
        $metaTags = $dom->getElementsByTagName('meta');

        foreach ($metaTags as $meta) {
            $name     = strtolower($meta->getAttribute('name'));
            $property = strtolower($meta->getAttribute('property'));

            if ($name === 'description' || $property === 'og:description') {
                $content = trim($meta->getAttribute('content'));
                if ($content !== '') {
                    $description = $content;
                    break;
                }
            }
        }
    }

    libxml_clear_errors();

    return $this->response->setJSON([
        'title'       => $title,
        'description' => $description,
    ]);
}

/**
 * Handle AJAX request to update the sort order of records.
 *
 * Expects JSON payload:
 * {
 *   "table": "tabs",
 *   "order": [3, 1, 2]
 * }
 *
 * @return \CodeIgniter\HTTP\ResponseInterface
 */
public function update_order() {
    // Ensure user is authenticated
    if (! logged_in()) {
        return $this->failUnauthorized('You must be logged in to perform this action.');
    }

    // Ensure it's an AJAX request
    if (! $this->request->isAJAX()) {
        return $this->failForbidden('Not an AJAX request.');
    }

    $payload = $this->request->getJSON(true);
    if (! is_array($payload)) {
        return $this->failValidationError('Invalid JSON payload.');
    }

    $table = $payload['table'] ?? '';
    $order = $payload['order'] ?? [];

    // Whitelist allowed tables
    $allowedTables = ['tabs', 'sections'];
    if ($table === '' || ! in_array($table, $allowedTables, true)) {
        return $this->failValidationError('Invalid table.');
    }

    if (! is_array($order) || empty($order)) {
        return $this->failValidationError('Invalid order data.');
    }

    // Sanitize IDs
    $ids = array_values(
        array_filter(
            array_map('intval', $order),
            static fn($id) => $id > 0
        )
    );

    if (empty($ids)) {
        return $this->failValidationError('No valid IDs provided.');
    }

    try {
        $this->admin->updateOrder($table, $ids);

        return $this->respond([
            'success' => true,
            'message' => 'Order updated successfully.',
        ]);
    } catch (\Throwable $e) {
        log_message('error', 'Update order failed: ' . $e->getMessage());
        return $this->failServerError('An error occurred while updating the order.');
    }
}

/**
 * Handles AJAX requests to fetch all sections belonging to a specific tab.
 *
 * Performs authentication and request-type validation before returning
 * the section list as JSON.
 *
 * @param int $tab_id The ID of the tab whose sections should be retrieved.
 * @return \CodeIgniter\HTTP\ResponseInterface JSON response containing the sections or an error message.
 */
public function get_sections_by_tab(int $tab_id) {
    // Auth check
    if (! logged_in()) {
        return $this->failUnauthorized('You must be logged in to perform this action.');
    }

    // AJAX check
    if (! $this->request->isAJAX()) {
        return $this->failForbidden('Not an AJAX request.');
    }

    if ($tab_id <= 0) {
        return $this->failValidationError('Invalid tab ID.');
    }

    try {
        $sections = $this->admin->getSectionsInTab($tab_id);

        return $this->respond($sections);
    } catch (\Throwable $e) {
        log_message('error', 'get_sections_by_tab failed: ' . $e->getMessage());
        return $this->failServerError('An error occurred while fetching sections.');
    }
}

} // END Class

