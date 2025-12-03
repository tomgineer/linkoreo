<?php
namespace App\Controllers;
use App\Models\AdminModel;

class Admin extends BaseController {
    protected AdminModel $admin;

    function __construct() {
        $this->admin = new AdminModel();
    }

/**
 * Displays the Edit Link form for an existing or new link.
 *
 * @param int $link_id The ID of the link to edit (0 for a new link).
 * @return string|null Rendered view or null if not logged in.
 */
public function edit_link(int $link_id = 0) {
    if (!logged_in()) return;

    if ($link_id === 0) {
        // New link defaults
        $link = [
            'id'          => 0,
            'url'         => '',
            'label'       => '',
            'description' => '',
            'section_id'  => 0,
            'tab_id'      => 1,
            'importance'  => 0,
            'created'     => date('Y-m-d H:i:s'),
        ];
    } else {
        $link = $this->admin->getLink($link_id);
    }

    $data = [
        ...$this->data,
        'link' => $link,
        'tabs' => $this->admin->getTabs(),
        'importanceLabels' => [
            0 => 'Normal',
            1 => 'Important',
            2 => 'Very Important',
            3 => 'Game Changer'
        ],
    ];

    return view('admin/edit_link', $data);
}

/**
 * Handles form submission to update or create a link.
 *
 * @param int $link_id The ID of the link being updated.
 * @return \CodeIgniter\HTTP\RedirectResponse|null Redirects after update or null if not logged in.
 */
public function update_link(int $link_id) {
    if (!logged_in()) return;
    $data = $this->request->getPost();
    $this->admin->updateLink($data, $link_id);
    return redirect()->to( base_url() );
}

/**
 * Display the Edit Tab page.
 *
 * Loads an existing tab for editing or initializes defaults for a new one.
 * Requires the user to be logged in.
 *
 * @param int $tab_id Tab ID to edit (0 to create a new tab).
 * @return \CodeIgniter\HTTP\Response|string|null
 */
public function edit_tab(int $tab_id = 0) {
    if (!logged_in()) return;

    if ($tab_id === 0) {
        // New tab defaults
        $tab = [
            'id'          => 0,
            'title'       => '',
            'description' => '',
        ];
    } else {
        $tab = $this->admin->getTab($tab_id);
    }

    $data = [
        ...$this->data,
        'tab'      => $tab,
        'tab_list' => $this->admin->getTabs(),
    ];

    return view('admin/edit_tab', $data);
}

/**
 * Update an existing tab.
 *
 * @param int $tab_id Tab ID to update.
 * @return \CodeIgniter\HTTP\RedirectResponse|null Redirects to base URL or null if not logged in.
 */
public function update_tab(int $tab_id) {
    if (!logged_in()) return;

    if (! $this->request->is('post')) {
        return redirect()->to(base_url())->with('error', 'Invalid request method.');
    }

    $data = $this->request->getPost();
    $this->admin->updateTab($data, $tab_id);
    return redirect()->to( base_url() );
}

public function edit_section(int $section_id = 0) {
    if (!logged_in()) return;

    if ($section_id === 0) {
        // New section defaults
        $section = [
            'id'          => 0,
            'title'       => '',
            'description' => '',
            'tab_id'      => null,
        ];
    } else {
        $section = $this->admin->getSection($section_id);
    }

    $data = [
        ...$this->data,
        'section'      => $section,
        'tab_list'     => $this->admin->getTabs(),
    ];

    return view('admin/edit_section', $data);
}

/**
 * Handle section updates or creation.
 *
 * Updates an existing section if an ID is provided, or creates a new one.
 * Only accessible to logged-in users.
 *
 * @param int $section_id Section ID to update (0 to create a new section).
 * @return \CodeIgniter\HTTP\RedirectResponse|null
 */
public function update_section(int $section_id) {
    if (!logged_in()) return;

    if (! $this->request->is('post')) {
        return redirect()->to(base_url())->with('error', 'Invalid request method.');
    }

    $data = $this->request->getPost();
    $this->admin->updateSection($data, $section_id);
    return redirect()->to( base_url() );
}

} // END Class

