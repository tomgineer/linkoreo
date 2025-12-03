<?php namespace App\Models;

use CodeIgniter\Model;

class MainModel extends Model {

    protected $db;

    function __construct() {
        $this->db = \Config\Database::connect();
    }

/**
 * Returns links for a given tab and section, grouped by section ID.
 *
 * If $section_id is 0, all sections under the tab are included.
 *
 * @param int $tab_id     Tab ID to fetch links from.
 * @param int $section_id Section ID to filter by, or 0 for all sections.
 * @return array          Links grouped by section ID with tab and section metadata.
 */
public function getLinksArr(int $tab_id, int $section_id): array {
    $builder = $this->db->table('tabs t')
                        ->select([
                            'l.id',
                            'l.url',
                            'l.label',
                            'l.description',
                            'l.importance',
                            's.id AS section_id',
                            's.title AS section',
                            's.description AS section_desc',
                            't.id AS tab_id',
                            't.title AS tab',
                        ])
                        ->join('sections s', 's.tab_id = t.id', 'left')
                        ->join('links l', 'l.section_id = s.id', 'left')
                        ->where('t.id', $tab_id);

    // Apply only if not "all sections"
    if ($section_id !== 0) {
        $builder->where('s.id', $section_id);
    }

    $results = $builder->orderBy('t.position', 'ASC')
                       ->orderBy('s.position', 'ASC')
                       ->orderBy('s.title', 'ASC')
                       ->orderBy('l.importance', 'DESC')
                       ->orderBy('l.label', 'ASC')
                       ->get()
                       ->getResultArray();

    if (empty($results)) {
        return [];
    }

    $grouped = $this->array_group_by($results, 'section_id');
    return $grouped;
}

/**
 * Retrieves all tabs with their associated sections, grouped by tab ID.
 *
 * @return array Tabs grouped by tab ID, each containing related section data.
 */
public function getNavTabs(): array {
    $results = $this->db->table('tabs t')
                        ->select([
                            't.id AS tab_id',
                            't.title AS tab',
                            's.id AS section_id',
                            's.title AS section'
                        ])
                        ->join('sections s', 's.tab_id = t.id', 'left')
                        ->orderBy('t.position', 'ASC')
                        ->orderBy('s.position', 'ASC')
                        ->get()
                        ->getResultArray();

    if (empty($results)) {
        return [];
    }

    $grouped = $this->array_group_by($results, 'tab_id');
    return $grouped;
}

/**
 * Track Visitor
 *
 * Updates the visitor statistics by incrementing the `hits` column by 1
 * for the record with `id = 1` in the `stats` table.
 *
 * The update is performed directly on the database without retrieving the record.
 *
 * @return void
 */
public function trackVisitor(): void{
    $this->db->table('stats')
             ->set('hits', 'hits+1', false)
             ->where('id', 1)
             ->update();
}

/**
 * Retrieve Total Hits
 *
 * Fetches the total number of hits from the `stats` table for the record with `id = 1`.
 * If the record is not found, it returns 0 as a fallback.
 *
 * @return int The total number of hits.
 */
public function getHits(): int {
    $row = $this->db->table('stats')
                    ->select('hits')
                    ->where('id', 1)
                    ->get()
                    ->getRow();
    return !empty($row) ? (int) $row->hits : 0;
}

/**
 * Count Total Links
 *
 * Retrieves the total number of records in the `links` table.
 *
 * @return int The total count of links.
 */
public function countTotalLinks(): int {
    $row = $this->db->table('links')
                    ->selectCount('id', 'cnt')
                    ->get()
                    ->getRow();
    return (int) $row->cnt;
}

/**
 * Performs a full-text search across link fields using BOOLEAN MODE.
 *
 * Supports partial word matches and orders results by relevance score.
 *
 * @param string $term Search term entered by the user.
 * @return array       Matching links with relevance scores.
 */
public function search(string $term): array {
    $term = trim($term);
    if ($term === '' || mb_strlen($term) < 2) {
        return [];
    }

    $escaped = $this->db->escape($term . '*');

    $builder = $this->db->table('links')
        ->select([
            'id',
            'url',
            'label',
            'description',
            'importance',
            "MATCH(label, description, url) AGAINST ($escaped IN BOOLEAN MODE) AS relevance"
        ])
        ->where("MATCH(label, description, url) AGAINST ($escaped IN BOOLEAN MODE)", null, false)
        ->having('relevance >', 0) // boolean mode returns 0 for non-matching rows
        ->orderBy('relevance', 'DESC')
        ->limit(50);

    return $builder->get()->getResultArray();
}

/**
 * Groups an array by a given key or callback.
 *
 * Supports grouping arrays or objects by a field name or a callable.
 * Can perform nested grouping if more keys or callbacks are provided.
 *
 * @param array $arr Input array to group.
 * @param string|int|float|callable $key Grouping key or callback.
 * @param string|int|float|callable ...$additionalKeys Optional keys or callbacks for nested grouping.
 * @return array Grouped array.
 */
protected function array_group_by(
    array $arr,
    string|int|float|callable $key,
    string|int|float|callable ...$additionalKeys
): array {
    $isFunction = is_callable($key);
    $grouped = [];

    // For non-callable keys, we use it as a field/index name
    $field = $isFunction ? null : (string) $key;

    foreach ($arr as $value) {
        if ($isFunction) {
            // Callback gets the full item and returns the group key
            $groupKey = $key($value);
        } elseif (is_object($value)) {
            $groupKey = $value->{$field} ?? null;
        } elseif (is_array($value)) {
            $groupKey = $value[$field] ?? null;
        } else {
            // Unsupported item type, skip it
            continue;
        }

        $grouped[$groupKey][] = $value;
    }

    // Recursive / nested grouping if more keys were provided
    if (!empty($additionalKeys)) {
        foreach ($grouped as $groupKey => $groupItems) {
            $grouped[$groupKey] = $this->array_group_by($groupItems, ...$additionalKeys);
        }
    }

    return $grouped;
}

/**
 * Generates a random password string.
 *
 * Produces an alphanumeric password of the specified length.
 * When `$secure` is true, additional special characters are included.
 * Uses `random_int()` for cryptographically secure randomness.
 *
 * @param int  $length Desired password length. Default is 8.
 * @param bool $secure Whether to include special characters for stronger passwords. Default is false.
 * @return string The generated password.
 */
public function passgen($length = 8, $secure = false){
	if($secure) {
		$chars =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.
            '0123456789`-=~!@#$%^&*()_+,./<>?;:[]{}\|';
	} else {
		$chars =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.
            '0123456789';
	}

  $str = '';
  $max = strlen($chars) - 1;

  for ($i=0; $i < $length; $i++)
    $str .= $chars[random_int(0, $max)];

  return $str;
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

} // END Class