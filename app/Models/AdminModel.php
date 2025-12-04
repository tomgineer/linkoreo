<?php namespace App\Models;

use CodeIgniter\Model;

class AdminModel extends Model {

    protected $db;

    function __construct() {
        $this->db = \Config\Database::connect();
    }

/**
 * Get Tabs
 *
 * Retrieves all tabs ordered by position and title.
 *
 * @return array The list of tabs as an associative array.
 */
public function getTabs():?array {
    $results = $this->db->table('tabs')
                        ->orderBy('position', 'ASC')
                        ->orderBy('title', 'ASC')
                        ->get()
                        ->getResultArray();
    return $results;
}

/**
 * Get Sections in Tab
 *
 * Retrieves all sections within a specific tab, ordered by position and title.
 *
 * @param int $tab_id The ID of the tab.
 * @return array The list of sections as an associative array.
 */
public function getSectionsInTab($tab_id) {
    $results = $this->db->table('sections')
                        ->where('tab_id', $tab_id)
                        ->orderBy('position', 'ASC')
                        ->orderBy('title', 'ASC')
                        ->get()
                        ->getResultArray();
    return $results;
}

/**
 * Delete Old Session Files
 *
 * Deletes old session files from the writable/session directory
 * that are older than the specified number of days.
 *
 * @param int $days The number of days to retain session files. Defaults to 2.
 * @return void
 */
public function deleteOldSessionFiles(int $days = 2):void {
    $sessionPath = ROOTPATH . 'writable' . DIRECTORY_SEPARATOR . 'session' . DIRECTORY_SEPARATOR;
    $now = time();

    foreach (glob($sessionPath . '*') as $file) {
        if (is_file($file) && ($now - filemtime($file)) >= 86400 * $days) {
            unlink($file);
        }
    }
}

/**
 * Inserts or updates a link record based on the given ID.
 *
 * @param array $data The form data matching the 'links' table columns.
 * @param int   $link_id The link ID. If 0, a new record will be created.
 * @return void
 */
public function updateLink(array $data, int $link_id):void{
    $builder = $this->db->table('links');

    if ($link_id === 0) {
        // Insert new link
        $builder->insert($data);
        return;
    }

    // Update existing link
    $builder->where('id', $link_id)
            ->update($data);

    // Clear all cache after update
    cache()->clean();
}

/**
 * Insert or update a tab record.
 *
 * @param array $data   Tab data to insert or update.
 * @param int   $tab_id Tab ID (0 to insert a new record).
 * @return void
 */
public function updateTab(array $data, int $tab_id):void{
    $builder = $this->db->table('tabs');

    if ($tab_id === 0) {
        // Insert new link
        $builder->insert($data);
        return;
    }

    // Update existing tab
    $builder->where('id', $tab_id)
            ->update($data);

    // Clear all cache after update
    cache()->clean();
}

/**
 * Insert or update a section record.
 *
 * If the given section ID is 0, a new section will be inserted.
 * Otherwise, the existing section record is updated with the provided data.
 *
 * @param array $data        Associative array of section fields to save.
 * @param int   $section_id  Section ID (0 to create a new section).
 * @return void
 */
public function updateSection(array $data, int $section_id):void{
    $builder = $this->db->table('sections');

    if ($section_id === 0) {
        // Insert new link
        $builder->insert($data);
        return;
    }

    // Update existing tab
    $builder->where('id', $section_id)
            ->update($data);

    // Clear all cache after update
    cache()->clean();
}

/**
 * Retrieves a single link by its ID.
 *
 * @param int $link_id The ID of the link.
 * @return array|null The link data as an associative array, or null if not found.
 */
public function getLink(int $link_id):?array {
    return $this->db->table('links l')
                    ->select([
                            'l.*',
                            's.tab_id',
                        ])
                    ->join('sections s', 'l.section_id = s.id')
                    ->where('l.id', $link_id)
                    ->get()
                    ->getRowArray();
}

/**
 * Retrieve a single tab record by its ID.
 *
 * @param int $tab_id Tab ID to retrieve.
 * @return array|null The tab data as an associative array, or null if not found.
 */
public function getTab(int $tab_id):?array {
    return $this->db->table('tabs')
                    ->where('id', $tab_id)
                    ->get()
                    ->getRowArray();
}

/**
 * Retrieves a single section by its ID.
 *
 * @param int $section_id Section ID to fetch.
 * @return array|null The section data as an associative array, or null if not found.
 */
public function getSection(int $section_id):?array {
    return $this->db->table('sections')
                    ->where('id', $section_id)
                    ->get()
                    ->getRowArray();
}

/**
 * Deletes a record from the specified table by ID.
 *
 * @param string $table The table name.
 * @param int    $id    The ID of the record to delete.
 * @return bool True if a record was deleted, false otherwise.
 */
public function delete_record(string $table, int $id): bool {
    if (empty($table) || $id <= 0) {
        return false;
    }

    try {
        $this->db->table($table)
                 ->where('id', $id)
                 ->delete();

        if ($this->db->affectedRows() > 0) {
            cache()->clean();
            return true;
        }
    } catch (\Throwable $e) {
        log_message('error', 'Delete record failed in model: ' . $e->getMessage());
        return false;
    }
}

/**
 * Update the position/order of records in a given table.
 *
 * @param string $table Table name (e.g. 'tabs').
 * @param array  $ids   Ordered array of record IDs.
 * @return void
 */
public function updateOrder(string $table, array $ids): void {
    // Ensure table name is safe (whitelist)
    $allowedTables = ['tabs', 'sections'];
    if (! in_array($table, $allowedTables, true)) {
        log_message('error', "updateOrder() rejected invalid table: {$table}");
        return;
    }

    $builder = $this->db->table($table);

    // Loop through IDs and update position field
    foreach ($ids as $position => $id) {
        $builder->where('id', (int) $id)
                ->update(['position' => $position + 1]);
    }

    // Clear all cache after update
    cache()->clean();
}

} // END Class