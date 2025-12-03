/******************************************************************************
 * UTILITIES
 *****************************************************************************/

import initHashTool from './utilities/hashing.js';
initHashTool();

import initCopyPasswordButtons from './utilities/passwords.js';
initCopyPasswordButtons();

import initWorkTime from './utilities/worktime.js';
initWorkTime();

import initDateTime from './utilities/datetime.js';
initDateTime();

/******************************************************************************
 * ADMIN
 *****************************************************************************/

import initEditLink from './admin/editLink.js';
initEditLink();

import initEditTab from './admin/editTab.js';
initEditTab();

import initEditSection from './admin/editSection.js';
initEditSection();

/******************************************************************************
 * SYSTEM
 *****************************************************************************/

import * as ajax from './system/ajax.js';
ajax.tabsInit();

import initNavbarDropdowns from './system/nav.js';
initNavbarDropdowns();

import initSearch from './system/search.js';
initSearch();


