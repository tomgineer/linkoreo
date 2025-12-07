<?php

/**
 * Path Helpers
 */

if(!function_exists('path_css')) {
	function path_css() {
		return base_url(). 'css/';
	}
}

if(!function_exists('path_gfx')) {
	function path_gfx() {
		return base_url(). 'gfx/';
	}
}

if(!function_exists('path_img')) {
	function path_img() {
		return base_url(). 'images/';
	}
}

if(!function_exists('path_assets')) {
	function path_assets() {
		return base_url(). 'assets/';
	}
}

if(!function_exists('path_js')) {
	function path_js() {
		return base_url(). 'js/';
	}
}

/**
 * Formatting
 */
if(!function_exists('nf')) {
	function nf($number) {
		return number_format($number,0,',','.');
	}
}

/**
 * Users
 */
if(!function_exists('logged_in')) {
	function logged_in() {
		if ( session('logged_in') ) {
			return session('logged_in');
		} else {
			return FALSE;
		}
	}
}

/**
 * Version
 */
if(!function_exists('version')) {
	function version() {
		return '7.04';
	}
}

/**
 * Password Generator
 */
if(!function_exists('pwd')) {
    function pwd(int $length = 8, bool $secure = false): string {
        $model = new \App\Models\MainModel();
        return $model->passgen($length, $secure);
    }
}

/**
 * Body Class
 */
if ( ! function_exists('body_class')) {
    function body_class() {
		$router = service('router');
        $method = $router->methodName();
		$controller_str = $router->controllerName();
		$controller = str_replace('\\App\\Controllers\\', '', $controller_str);
		return strtolower($controller . '-' . $method);
    }
}