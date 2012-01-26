/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    DateUtils
 * 
 * @exports  DateUtils as Piwik.Utils.Date
 * @static
 */
function DateUtils () {
}

/**
 * Creates a date range which is similar to the used date range on the website. This date range can be used to fetch 
 * statistics depending on the given period within this date range.
 *
 * @param    {Date}         dateObject
 * @param    {string}       period  The period eg. 'week' or 'day'.
 *
 * @returns  {Object|void}  Returns an object containing a property 'from' and a property 'to'. Both are instances
 *                          of the Date object.
 */
DateUtils.prototype.getPiwikDateRange = function (dateObject, period) {
    
    if (!period || !dateObject) {
        
        return;
    }

    var from = new Date(dateObject.getTime());
    var to   = new Date(dateObject.getTime());
    
    switch (period) {
    
        case 'day':
            break;

        case 'week':
            
            if (0 === from.getDay()) {
                from.setDate(from.getDate() - 7);
                to.setDate(to.getDate() - 7);
            }
            
            from.setDate(from.getDate() - from.getDay() + 1);
            to.setDate(to.getDate() + (7 - to.getDay()));
        
            break;
            
        case 'month':

            from.setDate(1);
            to.setMonth(1 + to.getMonth());
            
            if (2 == (to.getMonth() - from.getMonth())) {
                to.setMonth(to.getMonth() - 1);
            }
            
            to.setDate(0);
            
            break;
            
        case 'year':
        
            from.setDate(1);
            from.setMonth(0);
            
            to.setYear(1900 + 1 + to.getYear());
            to.setMonth(0);
            to.setDate(0);
        
            break;
    }
    
    var dateRange = {from: from, to: to};
    
    return dateRange;
};

/**
 * Creates a human readable/formatted version of the piwik date range {@link Date#getPiwikDateRange} depending on 
 * the period using locale conventions. Can be used to display the current used date range.
 *
 * @example
 * var now = new Date();
 * Piwik.require('Utils/Date').toPiwikDateRangeString(now, 'week');
 *
 * @param    {Date}         dateObject
 * @param    {string}       period  The period eg. 'week' or 'day'.
 *
 * @returns  {string|void}  Return the date portion as a string, using locale conventions.
 */
DateUtils.prototype.toPiwikDateRangeString = function (dateObject, period) {
    
    if (!period || !dateObject) {
        
        return;
    }
    
    if ('day' == period) {
    
        return dateObject.toLocaleDateString();
    }
    
    if ('year' == period) {
        
        return (dateObject.getYear() + 1900) + '';
    }
    
    if ('month' == period) {
    
        var translationKeyMonth = 'General_LongMonth_' + (dateObject.getMonth() + 1);
 
        var _                   = require('library/underscore');
        
        return _(translationKeyMonth) + ' ' + (dateObject.getYear() + 1900);
    }
    
    var format = this.getPiwikDateRange(dateObject, period);
    
    format     = format.from.toLocaleDateString() + ' - ' + format.to.toLocaleDateString();
    
    return format;
};

/**
 * Formats a string which can be used within the url query part of an piwik api request.
 *
 * @param    {Date}    dateObject
 * 
 * @example
 * var now = new Date(2010, 05, 31);
 * Piwik.require('Utils/Date').toPiwikQueryString(now); // outputs '2010-05-31'
 *
 * @returns  {string}  The in piwik api required date format.
 */
DateUtils.prototype.toPiwikQueryString = function (dateObject) {
    
    if (!dateObject) {
        
        return '';
    }

    var month = dateObject.getMonth() + 1;
    var year  = dateObject.getYear() + 1900;
    var day   = dateObject.getDate();
    
    return String(year) + '-' + String(month) + '-' + String(day);
};

/**
 * Convert date to a locale time format.
 * 
 * @param    {Date}    dateObject
 *
 * @returns  {string}  A string containing only the time. Time should be localized. 
 */
DateUtils.prototype.toLocaleTime = function (dateObject) {
    
    if (!dateObject || !dateObject.toLocaleTimeString) {
        
        return '';
    }
    
    return dateObject.toLocaleTimeString().split('GMT')[0];
};

module.exports = new DateUtils();