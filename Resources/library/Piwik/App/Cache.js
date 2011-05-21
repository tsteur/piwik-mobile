/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Caches values beyond application sessions. It is possible to cache any data except not 
 *          serializable Titanium objects. Acts more like a storage than a cache. A cache entry is identfied by a
 *          unique string. Because settings are also stored in the application store, the class adds a prefix
 *          'cache_' to each key. Each cache entry is automatically expired as soon as the app version changes.
 *          If you need a cache which caches not beyond application sessions, use Piwik.App.Session instead.
 *          Currently, following keys are in use:
 *          piwik_sites_allowed                        All allowed sites an user has at least view access
 *          accounts_available                         A list/array of all available account ids
 *          account_{accountId}                        Account information
 *
 * @static
 *
 * @todo rename to something like storage? or storageCache?
 */
Piwik.App.Cache = new function () {

    /**
     * A constant which can be used to verify a cache entry. The getter method returns this value if the given key
     * was not found or the key is expired.
     *
     * @example
     * if (Piwik.App.Cache.KEY_NOT_FOUND === Piwik.App.Cache.get('my0815key')) { //key does not exist/is not valid }
     *
     * @type string
     * @constant
     */
    this.KEY_NOT_FOUND = 'IamNotExistingCacheKeyValue';

    /**
     * Adds a prefix/namespace to each cache key because other libraries - like Settings - stores key/values in the
     * same application store. This ensures it does not influence those other libraries.
     *
     * @param   {string}  key    The key used in the application.
     *
     * @returns {string}  The updated key used internally in the Cache object.
     * @private
     */
    this._addCacheKeyPrefix = function (key) {

        return 'cache_' + key;
    };

    /**
     * Stores the given value in the cache.
     *
     * The cache entry is stored in JSON as a string and contains following values:
     * 'value'   The stored value
     * 'date'    The date in ms since 1.1.1970
     * 'version' The current version of the mobile app.
     *
     * @param {string}                              key     An unique key which identifies the stored value. The same
     *                                                      identifier is needed to get the stored value.
     * @param {string|Array|Object|Number|boolean}  value   The value
     *
     * @example
     * Piwik.App.Cache.set('mykey', [1, 2, 3]); // stores the array under the key 'mykey'
     * Piwik.App.Cache.set('mykey', {key: 'value'}); // stores the object under the key 'mykey'
     * Piwik.App.Cache.get('mykey') // returns the previous stored object
     *
     * @throws {Error} In case of a missing key
     */
    this.set = function (key, value) {

        Piwik.Log.debug('' + key + value, 'Piwik.App.Cache::set');

        if (!key) {

            throw new Error('Missing parameter key');
        }

        key            = this._addCacheKeyPrefix(key);

        var now        = new Date();
        var cacheEntry = {value: value,
                          date: Date.parse(now.toGMTString()),
                          version: Ti.App.version};

        value          = JSON.stringify(cacheEntry);

        Ti.App.Properties.setString(key, value);

        cacheEntry     = null;
        value          = null;
    };

    /**
     * Returns the item that was previously stored under the given key. If the item/key is not found or the app
     * version of the cache entry does not match, it returns the const {@link Cache#KEY_NOT_FOUND}.
     *
     * @param {string}  key     The previously used key to store the value.
     *
     * @returns {string|Array|Object|Number|boolean} The value.
     *
     * @throws {Error} In case of a missing key
     */
    this.get = function (key) {

        Piwik.Log.debug('' + key, 'Piwik.App.Cache::get');

        if (!key) {

            throw new Error('Missing parameter key');
        }

        key = this._addCacheKeyPrefix(key);

        if (Ti.App.Properties.hasProperty(key)) {

            var cacheEntry = Ti.App.Properties.getString(key);
            cacheEntry     = JSON.parse(cacheEntry);

            // do not invalidate the cache cause of a version mismatch if the key starts with account. Otherwise 
            // previously added accounts will no longer be available and the user has to setup the accounts again
            // @todo we should handle this via an option / parameter in set(key, value, cacheBeyondVersions=false) {}
            if ((!cacheEntry.version || Ti.App.version !== cacheEntry.version)
                 && 0 !== key.indexOf(this._addCacheKeyPrefix('account'))) {

                Piwik.Log.debug('Cache invalid because of new app version' + Ti.App.version, 'Piwik.App.Cache::get#invalid');

                // clear cached entry because entry is not in valid time range
                Ti.App.Properties.removeProperty(key);

                return this.KEY_NOT_FOUND;
            }

            return cacheEntry.value;
        }

        Piwik.Log.debug('Not existing key ' + key, 'Piwik.App.Cache::get#notExisting');

        return this.KEY_NOT_FOUND;
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
    this.remove = function (key) {

        Piwik.Log.debug('' + key, 'Piwik.App.Cache::remove');

        if (!key) {

            throw new Error('Missing parameter key');
        }

        key = this._addCacheKeyPrefix(key);

        if (Ti.App.Properties.hasProperty(key)) {

            Ti.App.Properties.removeProperty(key);

        }
    };
};