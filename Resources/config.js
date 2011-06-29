/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   The config defines configuration data within the application. 
 *
 * @static
 */
var config = {};

/**
 * Enable or disable logging. Should be disabled in a production release. Will be automatically disabled when
 * preparing a build by the 'tools/preparerelease.sh' script. This makes the app a bit more faster.
 *
 * @define {boolean}
 * c
 * @type boolean
 */
config.logEnabled     = true;

/**
 * Enable or disable profiling. Should be disabled in a production release. Will be automatically disabled when
 * preparing a build by the 'tools/preparerelease.sh' script. This makes the app a bit more faster.
 * 
 * @define {boolean}
 * c
 * @type boolean
 */
config.profileEnabled = false;

/**
 * True if debugging is enabled, false otherwise. Has to be disabled in a production release. If enabled it logs more
 * errors and does not cache already included files.
 *
 * @define {boolean}
 * c
 * @type boolean
 */
config.debugging      = false;

/**
 * Piwik related settings.
 *
 * @type Object
 */
config.piwik = {
    timeout: 120000,
    /**
     * default row to be used in all statistics
     */
    usedRow: 'nb_visits',
    defaultReportDate: 'day##yesterday',
    filterLimit: 30,
    multiChartEnabled: false,
    latestServerVersion: '1.5.0',
    graphsEnabled: true,
    trackingEnabled: false
};
