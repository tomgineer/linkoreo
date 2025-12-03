<?php namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model {

    protected $db;

    function __construct() {
        $this->db = \Config\Database::connect();
    }

/**
 * Retrieves a single user record by their email address.
 *
 * This method queries the "users" table and returns the first matching row
 * as an associative array. If no user with the given email exists,
 * the method returns null.
 *
 * @param string $email The email address of the user to retrieve.
 * @return array|null The user's data as an associative array if found, or null if not found.
 */
function getUserByEmail(string $email): ?array {
    return $this->db->table('users')
                    ->where('email', $email)
                    ->get()
                    ->getRowArray() ?: null;
}



} // END Class