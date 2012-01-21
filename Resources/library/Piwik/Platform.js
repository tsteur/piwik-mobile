/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * Platform.
 * 
 * @exports  platform as Piwik.Platform
 * @static
 * @class
 */
var platform       = {};

/**
 * The name of the current platform (lowercase).
 *
 * @type  string
 */
platform.osName    = Ti.Platform.osname.toLowerCase();

/**
 * True if the current platform is android, false otherwise.
 *
 * @type  boolean
 */
platform.isAndroid = ('android' === platform.osName);

/**
 * True if the current platform is iOS (iPod or iPad or iPhone), false otherwise.
 *
 * @type  boolean
 */
platform.isIos     = ('i' === platform.osName.substr(0, 1));

/**
 * True if the current device is an iPad, false otherwise.
 *
 * @type  boolean
 */
platform.isIpad    = ('ipad' === platform.osName);

/**
 * True if the current device is an iPhone or iPod, false otherwise.
 *
 * @type  boolean
 */
platform.isIphone  = (platform.isIos && !platform.isIpad);

module.exports     = platform;