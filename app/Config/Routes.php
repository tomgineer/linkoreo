<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Site::links');

/**
 * Site
 * https://codeigniter4.github.io/userguide/incoming/routing.html
 */

/*
(:any)      -> will match all characters from that point to the end of the URI. This may include multiple URI segments.
(:segment)  -> will match any character except for a forward slash (/) restricting the result to a single segment.
(:num)      -> will match any integer.
(:alpha)    -> will match any string of alphabetic characters
(:alphanum) -> will match any string of alphabetic characters or integers, or any combination of the two.
(:hash)     -> is the same as (:segment), but can be used to easily see which routes use hashed ids.
*/
$routes->get('about', 'Site::page/about');
$routes->get('contact', 'Site::page/contact');
$routes->get('sign-in', 'Site::sign_in');

/**
 * Utilities
 */
$routes->get('utilities/passgen', 'Utilities::passgen');
$routes->get('utilities/hashing', 'Utilities::hashing');
$routes->get('utilities/worktime', 'Utilities::worktime');
$routes->get('utilities/datetime', 'Utilities::datetime');

/**
 * Ajax
 */
$routes->get('ajax/search', 'Ajax::search');
$routes->get('ajax/get_links_view/(:num)/(:num)', 'Ajax::get_links_view/$1/$2');
$routes->post('ajax/hash_all', 'Ajax::hash_all');
$routes->get('ajax/get_tabs_list/(:num)', 'Ajax::get_tabs_list/$1');
$routes->post('ajax/ai_autofill', 'Ajax::ai_autofill');
$routes->post('ajax/delete_record/(:alpha)/(:num)', 'Ajax::delete_record/$1/$2');
$routes->post('ajax/update_order', 'Ajax::update_order');
$routes->get('ajax/get_sections_by_tab/(:num)', 'Ajax::get_sections_by_tab/$1');

/**
 * Users
 */
$routes->post('users/login', 'Users::login');
$routes->get('users/logout', 'Users::logout');

/**
 * Admin
 */
$routes->get('admin/edit_link/(:num)', 'Admin::edit_link/$1');
$routes->post('admin/update_link/(:num)', 'Admin::update_link/$1');
$routes->get('admin/edit_tab/(:num)', 'Admin::edit_tab/$1');
$routes->post('admin/update_tab/(:num)', 'Admin::update_tab/$1');
$routes->get('admin/edit_section/(:num)', 'Admin::edit_section/$1');
$routes->post('admin/update_section/(:num)', 'Admin::update_section/$1');
