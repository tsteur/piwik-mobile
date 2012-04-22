/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/** @private */
var Piwik = require('library/Piwik');

/**
 * @class    StringUtils
 * 
 * @exports  StringUtils as Piwik.Utils.String
 * @static
 */
function StringUtils () {
}

/**
 * Strip whitespace from the beginning and end of a string.
 * 
 * @param    {string}  str
 *
 * @returns  {string}  The trimmed string
 */
StringUtils.prototype.trim = function (str) {
    
    if (!str) {
        
        return '';
    }

    return ('' + str).replace(/^\s+/, '').replace (/\s+$/, '');
};

/**
 * Adds the size unit, for example dp (densitiy pixels) depending on the current platform.
 * 
 * @param    {string}         str
 *
 * @returns  {string|number}  The converted string on Android, the parsed integer on iOS
 */
StringUtils.prototype.toSizeUnit = function (str) {
    if (!Piwik.getPlatform().isAndroid) {

        return parseInt(str, 10);
    }

    if (!str) {

        return str;
    }

    if (-1 === str.indexOf('dp')) {
        // return Ti.UI.convertUnits(str, Ti.UI.UNIT_DIP);

        return str + 'dp';
    }

    return str;
};

module.exports = new StringUtils();