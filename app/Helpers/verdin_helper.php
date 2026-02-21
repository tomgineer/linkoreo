<?php

if (! function_exists('nf')) {
	/**
	 * Format a number with dot-separated thousands and no decimals.
	 *
	 * @param float|int|string $number Numeric input to format.
	 *
	 * @return string Formatted number string, e.g. "12.345".
	 */
	function nf($number) {
		return number_format($number, 0, ',', '.');
	}
}

if (! function_exists('logged_in')) {
	/**
	 * Check whether the current user is marked as logged in via session.
	 *
	 * @return mixed Returns the session value of `logged_in` or `false`.
	 */
	function logged_in() {
		if (session('logged_in')) {
			return session('logged_in');
		}

		return false;
	}
}

if (! function_exists('pwd')) {
	/**
	 * Generate a random password using the main model generator.
	 *
	 * @param int  $length Desired password length.
	 * @param bool $secure Whether to include a stronger character set.
	 *
	 * @return string Generated password.
	 */
	function pwd(int $length = 8, bool $secure = false): string {
		$model = new \App\Models\MainModel();
		return $model->passgen($length, $secure);
	}
}

if (! function_exists('body_class')) {
	/**
	 * Build a CSS-ready body class from current controller and method.
	 *
	 * @return string Lowercased "{controller}-{method}" value.
	 */
	function body_class() {
		$router = service('router');
		$method = $router->methodName();
		$controllerStr = $router->controllerName();
		$controller = str_replace('\\App\\Controllers\\', '', $controllerStr);

		return strtolower($controller . '-' . $method);
	}
}

if (! function_exists('isDev')) {
	/**
	 * Determine whether the app runs in the development environment.
	 *
	 * @return bool `true` when `CI_ENVIRONMENT` equals `development`.
	 */
	function isDev(): bool {
		return strtolower((string) env('CI_ENVIRONMENT')) === 'development';
	}
}
