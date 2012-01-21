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
 * Parses a string - which is in the following format '2010-05-12' - and converts it to a Date object. 
 * This format is used in piwik rest calls.
 * 
 * @param    {string}  str
 *
 * @example
 * Piwik.require('Utils/String').toPiwikDate('2010-05-31');
 *
 * @returns  {Date}    The created date object.
 */
StringUtils.prototype.toPiwikDate = function (str) {

    if ('today' == str) {
    
        return new Date();
    };

    if ('yesterday' == str) {
        var now = new Date();
        
        now.setDate(now.getDate() - 1);
        
        return now;
    };

    var changedDate = ('' + str).split('-');
    
    var formatDate  = null;
    
    if (3 <= changedDate.length) {
        formatDate  = new Date(changedDate[0], changedDate[1] - 1, changedDate[2]);
    } else if (2 === changedDate.length) {
        formatDate  = new Date(changedDate[0], changedDate[1] - 1, 1);
    } else if (1 === changedDate.length) {
        formatDate  = new Date(changedDate[0], 0, 1);
    }

    return formatDate;
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

        return str + 'dp';
    }

    return str;
};

module.exports = new StringUtils();