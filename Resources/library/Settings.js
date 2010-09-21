/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Stores settings beyond application sessions. The stored values are available as long as the user does 
 *          not deinstall the app. Use always this object to access settings.
 *
 * @static
 */
var Settings = {};

/**
 * Sets (overwrites) the userLogin / username of a piwik user.
 *
 * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#UsersManager">UsersManager#userLogin</a>
 * 
 * @param {string}  value   The userLogin 
 * 
 * @type null
 */
Settings.setPiwikUser = function (value) {
    Settings._set('piwikUser', 'String', value);
};

/**
 * Retrieve the stored userLogin / username.
 *
 * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#UsersManager">UsersManager#userLogin</a>
 * 
 * @returns {string|null}  The previously stored userLogin. Value is null if value was not set before.
 */
Settings.getPiwikUser = function () {
    return Settings._get('piwikUser', 'String');
};

/**
 * Sets (overwrites) the password of a piwik user.
 * 
 * @param {string}  value   The matching password for the stored userLogin.
 * 
 * @type null
 *
 * @todo shall we really store the password on the device? or shall we just store the md5Password or nothing?
 */
Settings.setPiwikPassword = function (value) {
    Settings._set('piwikPassword', 'String', value);
};

/**
 * Retrieve the stored piwik password.
 * 
 * @returns {string|null}  The previously stored password. Value is null if value was not set before.
 */
Settings.getPiwikPassword = function () {
    return Settings._get('piwikPassword', 'String');
};

/**
 * Sets (overwrites) the adjusted language key (2 language letters code like en, de, ...). The app translates all
 * output / text to this language if possible.
 * 
 * @param {string}  value   The language
 * 
 * @type null
 */
Settings.setLanguage = function (value) {
    Settings._set('piwikLanguage', 'String', value);
};
    
/**
 * Retrieve the stored language code.
 *
 * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#Otheroptionalparameters">UsersManager#language</a>
 * 
 * @returns {string|null}  The previously stored language code. Value is null if value was not set before.
 */
Settings.getLanguage = function () {
    return Settings._get('piwikLanguage', 'String');
};

/**
 * Sets (overwrites) whether the display of sparklines in multisite view (main screen) is enabled or disabled. 
 * Setting is disabled by default because it needs more time (depending on network, loading time) to start 
 * the app when enabled and requires a bit more memory.
 * 
 * @param {boolean}  value   true to enable sparklines, false otherwise.
 * 
 * @type null
 */
Settings.setPiwikMultiChart = function (value) {
    
    value = Boolean(value);
    
    Settings._set('piwikMultiChart', 'Bool', value);
};

/**
 * Retrieve the stored multichart value.
 * 
 * @returns {boolean}  true if sparklines in multisite view are enabled, false otherwise.
 */
Settings.getPiwikMultiChart = function () {
    return Settings._get('piwikMultiChart', 'Bool', false);
};

/**
 * Sets (overwrites) whether the display of graphs in statistics is enabled or disabled. 
 * Setting is enabled by default.
 * 
 * @param {boolean}  value   true to enable graphs, false otherwise.
 * 
 * @type null
 */
Settings.setGraphsEnabled = function (value) {
    
    value = Boolean(value);
    
    Settings._set('graphsEnabled', 'Bool', value);
};

/**
 * Retrieve the stored graphsEnabled value. Value is true by default.
 * 
 * @returns {boolean}  true if graphs are enabled, false otherwise.
 */
Settings.getGraphsEnabled = function () {
    return Settings._get('graphsEnabled', 'Bool', true);
};

/**
 * Sets (overwrites) the piwik domain. Value should start with 'https://' to do a encrypted request, 'http' otherwise. 
 * 
 * @param {string}  value   The domain/base url which should be considered in further REST requests. 
 * 
 * @type null
 */
Settings.setPiwikUrl = function (value) {
    Settings._set('piwikUrl', 'String', value);
};

/**
 * Retrieve the stored piwik domain/base url. 
 * 
 * @returns {string|null}  The previously stored domain. Value is null if value was not set before.
 */
Settings.getPiwikUrl = function () {
    return Settings._get('piwikUrl', 'String');
};

/**
 * Sets (overwrites) the token_auth which identifies a piwik user in REST calls.
 *
 * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#Makeanauthenticatedcall">token_auth</a>
 * 
 * @param {string}  value   The token_auth value.
 * 
 * @type null
 */
Settings.setPiwikUserAuthToken = function (value) {
    return Settings._set('piwikUserAuthToken', 'String', value);
};

/**
 * Retrieve the stored token_auth.
 *
 * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#Makeanauthenticatedcall">token_auth</a>
 * 
 * @returns {string|null}  The previously stored token_auth value. Value is null if value was not set before.
 */
Settings.getPiwikUserAuthToken = function () {
    return Settings._get('piwikUserAuthToken', 'String');
};

/**
 * Sets (overwrites) the http timeout value.
 * 
 * @param {int}  value   The timeout value in ms.
 * 
 * @type null
 */
Settings.setHttpTimeout = function (value) {
    return Settings._set('httpTimeout', 'Int', value);
};

/**
 * Retrieve the stored http timeout value in ms.
 * 
 * @returns {int}  The timeout value.
 */
Settings.getHttpTimeout = function () {

    var timeoutValue = Settings._get('httpTimeout', 'Int', config.piwik.timeout);
    timeoutValue     = parseInt(timeoutValue, 10);
    
    return timeoutValue;
};

/**
 * Sets (overwrites) the default piwik report date.
 *
 * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#Standardparameters">Standard parameters</a>
 * 
 * @param {string}  value   The default report date.
 * 
 * @type null
 */
Settings.setPiwikDefaultDate = function (value) {
    return Settings._set('piwikDefaultDate', 'String', value);
};

/**
 * Retrieve the stored default piwik report date.
 *
 * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#Standardparameters">Standard parameters</a>
 * 
 * @returns {string}  The default piwik report date. It returns a default value if value was not set before. 
 */
Settings.getPiwikDefaultDate = function () {
    return Settings._get('piwikDefaultDate', 'String', config.piwik.defaultDate);
};

/**
 * Sets (overwrites) the default piwik report period.
 *
 * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#Standardparameters">Standard parameters</a>
 * 
 * @param {string}  value   The default report period.
 * 
 * @type null
 */
Settings.setPiwikDefaultPeriod = function (value) {
    return Settings._set('piwikDefaultPeriod', 'String', value);
};

/**
 * Retrieve the stored default piwik report period.
 *
 * @see <a href="http://dev.piwik.org/trac/wiki/API/Reference#Standardparameters">Standard parameters</a>
 * 
 * @returns {string}  The default piwik report period. It returns a default value if value was not set before. 
 */
Settings.getPiwikDefaultPeriod = function () {
    return Settings._get('piwikDefaultPeriod', 'String', config.piwik.defaultPeriod);
};

/**
 * Retrieve a setting which was previously stored under the given key.
 * 
 * @param   {string}              key               A unique key which identifies a specific setting.
 * @param   {string}              type              The expected type of data.
 * @param   {string|boolean|int}  [defaultValue]    Optional default value if no value is stored unter this key.
 * 
 * @returns {string|boolean|int|null} Tries to retrieve the stored value. If the key is not found and a defaultValue is
                                      given, it returns the defaultValue. Returns null in all other cases.
 * 
 * @private
 */
Settings._get = function (key, type, defaultValue) {
    Log.debug(type + ' ' + key, 'setting._get');
    
    key = Settings._addSettingsKeyPrefix(key);

    if (Titanium.App.Properties.hasProperty(key)) {
    
        var value;

        if (type && 'Bool' === type) {

            if (!defaultValue) {
                defaultValue = false;
            }

            value = Titanium.App.Properties.getBool(key, defaultValue);
            
        } else if (type && 'Int' === type) {

            if (!defaultValue) {
                defaultValue = 0;
            }
            
            value = Titanium.App.Properties.getInt(key, parseInt(defaultValue, 10));
            
        } else {
            
            // eval is not evil here because all type/key values are specified by us. Is not vulnerable
            value = eval('Titanium.App.Properties.get' + type + '("' + key + '")');
        }

        return value;
    }

    if (defaultValue) {
        
        return defaultValue;
    }

    return null;
};

/**
 * Stores a setting in the application store.
 * 
 * @param   {string}              key     A unique key which identifies a specific setting.
 * @param   {string}              type    Identifies what type of data the value is.
 * @param   {string|boolean|int}  value   The value which should be stored.
 * 
 * @type null
 * 
 * @private
 */
Settings._set = function (key, type, value) {
    Log.debug('' + type + key + value, 'setting._set');
    
    key = Settings._addSettingsKeyPrefix(key);

    if (type && 'Bool' === type) {

        return Titanium.App.Properties.setBool(key, value);

    }

    if (type && 'Int' === type) {

        return Titanium.App.Properties.setInt(key, parseInt(value, 10));

    }

    return eval('Titanium.App.Properties.set' + type + '("' + key + '", "' + value + '")');
};

/**
 * Adds an prefix/namespace to each setting key because other libraries - like Cache - stores key/values in the 
 * same application store. This ensures it does not influence those other libraries.
 * 
 * @param   {string}  key The key used in the application.
 * 
 * @returns {string}  The updated key used internally in the Cache object.
 * @private
 */
Settings._addSettingsKeyPrefix = function (key) {

    return 'setting_' + key;
};
