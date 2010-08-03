/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * Builtin object.
 * @class
 * @name String
 */
 
/**#@+
 * Extension to builtin string.
 * @memberOf String
 * @method
 */

/**
 * Parses a string - which is in the following format '2010-05-12' - and converts it to a Date object. 
 * This format is used in piwik rest calls.
 *
 * @example
 * '2010-05-31'.toPiwikDate();
 *
 * @returns {Date}  The created date object.
 */
String.prototype.toPiwikDate = function () {

    var changedDate = this.split('-');
    
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
