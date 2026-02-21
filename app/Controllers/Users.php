<?php
namespace App\Controllers;
use App\Models\AdminModel;

/**
 * Handles user authentication session flows.
 */
class Users extends BaseController {

    /**
     * Admin model instance used for maintenance tasks.
     *
     * @var AdminModel
     */
    protected AdminModel $admin;

    /**
     * Initialize required model dependencies.
     */
    function __construct() {
        $this->admin = new AdminModel();
    }

    /**
     * Authenticate a user and initialize a fresh session.
     *
     * @return \CodeIgniter\HTTP\RedirectResponse
     */
    public function login() {
    $input_data = $this->request->getPost();

    if (empty($input_data['email']) || empty($input_data['password'])) {
        return redirect()->to(base_url());
    }

    $email    = trim($input_data['email']);
    $password = $input_data['password'];

    $user = $this->user->getUserByEmail($email);

    if (empty($user)) {
        return redirect()->to(base_url());
    }

    if (! password_verify($password, $user['password'])) {
        return redirect()->to(base_url());
    }

    $session = session();
    $session->regenerate(true); // prevent session fixation

    $userdata = [
        'user_id'   => $user['id'],
        'name'      => $user['name'],
        'logged_in' => true,
    ];
    $session->set($userdata);

    $this->admin->deleteOldSessionFiles();

    return redirect()->to(base_url());
    }


    /**
     * Log out the currently authenticated user.
     *
     * @return \CodeIgniter\HTTP\RedirectResponse
     */
    public function logout() {
	if ( !logged_in() ) {return redirect()->to(base_url());}

	$session = session();

	$session_items = ['id','name','logged_in'];
	$session->remove($session_items);

	$session->destroy();
	return redirect()->to(base_url());
    }

} // END Class
