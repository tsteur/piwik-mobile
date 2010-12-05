/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Caches values beyond application sessions. It is possible to cache any data except not 
 *          serializable Titanium objects. A cache entry is identfied by a unique string. Because settings are also
 *          stored in the application store, the class adds a prefix 'cache_' to each key. It is also 
 *          possible to define how long a specific cache entry is valid. Each cache entry is automatically expired as
 *          soon as the app version changes. Currently following keys are in use:
 *          piwik_sites_allowed        			All allowed sites a user has at least view access
 *          translations_{locale}      			All available translations
 *          piwik_report_metadata_{accountId}	Report metadata for a specific account
 *
 * @static
 */
var Cache = {};

/**
 * A constant which can be used to verify a cache entry. The getter method returns this value if the given key 
 * was not found or the key is expired.
 * 
 * @example
 * if (Cache.KEY_NOT_FOUND === Cache.get('my0815key')) { //key does not exist/is not valid }
 * 
 * @type string
 * @constant
 */
Cache.KEY_NOT_FOUND = 'IamNotExistingCacheKeyValue';
    
/**
 * Stores the given value in the cache for a specific lifetime. The cache entry is stored in JSON as a string and 
 * contains following values:
 * 'value'   The stored value
 * 'date'    The date in ms since 1.1.1970 
 * 'timeout' The lifetime of the value in ms. Cache entry is not valid if 'date' + 'timeout' > 'now'.
 * 'version' The current version of this mobile app.
 * 
 * @param {string}                              key     A unique key which identifies the stored value. The same
 *                                                      identifier is needed to get the stored value.
 * @param {string|Array|Object|Number|boolean}  value   The value 
 * @param {null|undefined|int}                  [timeout="60000"] Defines the lifetime of the cache entry in ms.
 *                                                      If null, the cache entry is valid as long as the entry exists or
 *                                                      the app version changes. 
 * 
 * @example
 * Cache.set('mykey', [1,2,3], 100000); // stores the array for a lifetime of 100s
 * Cache.set('mykey', {key: 'value'}, null); // stores the object without any lifetime condition
 * 
 * @type null
 * @throws {Error} In case of a missing key
 * @throws {Error} In case of a not valid timeout value
 */
Cache.set = function (key, value, timeout) {

    Log.debug('' + key + value, 'cache.set');

    if (!key) {

        throw new Error('Missing parameter key');
    }

    key            = Cache._addCacheKeyPrefix(key);

    var now        = new Date();
    
    if ('undefined' === typeof timeout) {
        // 60000ms = 60s
        timeout    = 60000;
    }
    
    if (null !== timeout && parseInt(timeout, 10) !== timeout) {
        throw new Error('timeout has to be null or an integer', 99);
    }

    var cacheEntry = {value: value, 
                      timeout: timeout, 
                      date: Date.parse(now.toGMTString()), 
                      version: Titanium.App.version};
    
    value          = JSON.stringify(cacheEntry);

    Titanium.App.Properties.setString(key, value);
    
    cacheEntry     = null;
    value          = null;
};

/**
 * Returns the item that was previously stored under the given key. If the item/key is not found or the cache
 * entry timed out or the app version of the cache entry does not match, it returns a defined 
 * value {@link Cache#KEY_NOT_FOUND}.
 * 
 * @param {string}  key     The previously used key to store the value.
 * 
 * @returns {string|Array|Object|Number|boolean} The value.
 *
 * @throws {Error} In case of a missing key
 */
Cache.get = function (key) {
    
    Log.debug('' + key, 'Cache.get');

    if (!key) {

        throw new Error('Missing parameter key');
    }

    key = Cache._addCacheKeyPrefix(key);

    if (Titanium.App.Properties.hasProperty(key)) {
    
        var cacheEntry = Titanium.App.Properties.getString(key);
        
        var now        = new Date();
        var nowInMs    = Date.parse(now.toGMTString());
        
        cacheEntry     = JSON.parse(cacheEntry);
        
        // verify cache key is in valid time range if timeout is set
        if (cacheEntry.timeout !== null && nowInMs > (cacheEntry.timeout + cacheEntry.date)) {
        
            Log.debug('Cache timeout ' + cacheEntry.timeout + 'Date' + cacheEntry.date + ' Now ' + nowInMs, 'Cache');
        
            // clear cached entry because entry is not in valid time range
            Titanium.App.Properties.removeProperty(key);
        
            return Cache.KEY_NOT_FOUND;
        }

        if (!cacheEntry.version || Titanium.App.version !== cacheEntry.version) {

            Log.debug('Cache invalid because of new app version' + Titanium.App.version, 'Cache');
        
            // clear cached entry because entry is not in valid time range
            Titanium.App.Properties.removeProperty(key);
        
            return Cache.KEY_NOT_FOUND;
        }

        return cacheEntry.value;
    }
        
    Log.debug('Not existing key ' + key, 'Cache');

    return Cache.KEY_NOT_FOUND;
};

/**
 * Removes the key and the related value from the cache.
 * 
 * @param {string}  key     The key to be removed.
 * 
 * @type null
 *
 * @throws {Error} In case of a missing key
 */
Cache.remove = function (key) {
    
    Log.debug('' + key, 'Cache.remove');

    if (!key) {

        throw new Error('Missing parameter key');
    }

    key = Cache._addCacheKeyPrefix(key);

    if (Titanium.App.Properties.hasProperty(key)) {

        Titanium.App.Properties.removeProperty(key);

    }
};

/**
 * Adds an prefix/namespace to each cache key because other libraries - like Settings - stores key/values in the 
 * same application store. This ensures it does not influence those other libraries.
 * 
 * @param   {string}  key The key used in the application.
 * 
 * @returns {string}  The updated key used internally in the Cache object.
 * @private
 */
Cache._addCacheKeyPrefix = function (key) {
    
    return 'cache_' + key;
};
