/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   This simple session manager preserve certain data across multiple MvcWindows. Each session entry is 
 *          identified by an unique key and is accessible as long as the session persists. Currently following keys 
 *          are in use:
 *          piwik_parameter_period                     The current selected period
 *          piwik_parameter_date                       The current selected date
 *          piwik_report_metadata_{accountId}_{lang}   Report metadata for a specific account
 *
 * @example
 * Session.set('period', 'week');   // store the value week under the key period
 * Session.get('period');           // fetch the value of the key period, stored in the session
 *
 * @static
 */
Session = {};

/**
 * All current available values will be stored in this object under the regarding key.
 *
 * @type Object
 */
Session.values = {};

/**
 * Returns the value that was previously stored in the session under the given key. If the key is not found, it returns 
 * the default value or null if no default value was specified.
 * 
 * @param   {string}                              key               A previously used key.
 * @param   {string|Array|Object|Number|boolean}  [defaultValue]    Optional default value if no value is stored 
 *                                                                  under this key.
 *
 * @example
 * Session.get('period', 'day');
 * 
 * @returns {string|Array|Object|Number|boolean} The value.
 *
 * @throws {Error} In case of a missing key
 */
Session.get = function (key, defaultValue) {
    
    Log.debug(key, 'Session.get');

    if (!key) {
        throw new Error('Missing parameter key');
    }

    if ('undefined' != (typeof this.values[key])) {
    
        return this.values[key];
    }
    
    if ('undefined' !== (typeof defaultValue)) {
    
        return defaultValue;
    }
};

/**
 * Stores the given value in the session.
 * 
 * @param {string}                              key     A unique key which identifies the stored value. The same
 *                                                      identifier is needed to get the stored value.
 * @param {string|Array|Object|Number|boolean}  value   The value 
 * 
 * @example
 * Session.set('period', 'year');
 * 
 * @type null
 * @throws {Error} In case of a missing key
 */
Session.set = function (key, value) {
    
    Log.debug(key, 'Session.set');

    if (!key) {
        throw new Error('Missing parameter key');
    }
    
    this.values[key] = value;
};

/**
 * Removes the key and the related value from the session.
 * 
 * @param {string}  key     The key to be removed.
 * 
 * @returns {boolean} true if an existing key/value pair was removed, false otherwise.
 *
 * @throws {Error} In case of a missing key
 */
Session.remove = function (key) {
    
    Log.debug(key, 'Session.remove');

    if (!key) {

        throw new Error('Missing parameter key');
    }

    if ('undefined' != (typeof this.values[key])) {

        this.values[key] = null;
        delete this.values[key];
        
        return true;
    }
    
    return false;
};
