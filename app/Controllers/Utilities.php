<?php
namespace App\Controllers;

class Utilities extends BaseController {

/**
 * Displays the password generator utility page.
 *
 * Loads the 'utilities/passgen' view and tracks the visitor.
 *
 * @return void
 */
public function passgen() {
    $data = $this->data;
    echo view('utilities/passgen',$data);
    $this->main->trackVisitor();
}

/**
 * Displays the hashing utility page.
 *
 * Loads the 'site/hash' view and tracks the visitor.
 *
 * @return void
 */
public function hashing() {
    $data = $this->data;
    echo view('utilities/hashing',$data);
    $this->main->trackVisitor();
}

/**
 * Displays the worktime utility page and tracks the visitor.
 *
 * @return void
 */
public function worktime() {
    $data = $this->data;
    echo view('utilities/worktime', $data);
    $this->main->trackVisitor();
}


public function datetime() {
    $data = $this->data;
    echo view('utilities/datetime', $data);
    $this->main->trackVisitor();
}


} // END Class
