/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * Builtin object.
 * @class
 * @name Date
 */
 
/**#@+
 * Extension to builtin date.
 * @memberOf Date
 * @method
 */
 
/**
 * Creates a date range which is similar to the used date range on the website. This date range can be used to fetch 
 * statistics depending on the given period within this date range.
 *
 * @param   {string}  period     The period eg. 'week' or 'day'.
 *
 * @returns {Object|void}  Returns an object containing a property 'from' and a property 'to'. Both are instances of
 *                         the Date object.
 */
Date.prototype.getPiwikDateRange = function (period) {
    
    if (!period) {
        
        return;
    }

    var from = new Date(this.getTime());
    var to   = new Date(this.getTime());
    
    switch(period) {
    
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
 * now.toPiwikDateRangeString('week');
 *
 * @param   {string}  period     The period eg. 'week' or 'day'.
 *
 * @returns {string|void}  Return the date portion as a string, using locale conventions.
 */
Date.prototype.toPiwikDateRangeString = function (period) {
    
    if (!period) {
        
        return;
    }
    
    if ('day' == period) {
    
        return this.toLocaleDateString();
    }
    
    if ('year' == period) {
        
        return (this.getYear() + 1900) + '';
    }
    
    if ('month' == period) {
    
        var translationKeyMonth = 'General_LongMonth_' + (this.getMonth() + 1);
        
        return _(translationKeyMonth) + ' ' + (this.getYear() + 1900);
    }
    
    var format = this.getPiwikDateRange(period);
    
    format     = format.from.toLocaleDateString() + ' - ' + format.to.toLocaleDateString();
    
    return format;
};

/**
 * Formats a string which can be used within the url query part of an piwik api request.
 *
 * @example
 * var now = new Date(2010, 05, 31);
 * now.toPiwikQueryString(); // outputs '2010-05-31'
 *
 * @returns {string}  The in piwik api required date format.
 */
Date.prototype.toPiwikQueryString = function () {

    var month = this.getMonth() + 1;
    var year  = this.getYear() + 1900;
    var day   = this.getDate();
    
    return String(year) + '-' + String(month) + '-' + String(day);
};

/**
 * Convert date to a locale time format.
 *
 * @returns {string}  A string containing only the time. Time should be localized. 
 */
Date.prototype.toLocaleTime = function () {

    return this.toLocaleTimeString().split('GMT')[0];
};
