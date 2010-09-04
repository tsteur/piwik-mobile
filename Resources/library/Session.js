/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   This simple session manager preserve certain data across multiple subcontexts. A unique session id will be 
 *          created on session start. This id is stored in the application store and valid as long as the user does not
 *          close the application. Each session entry is identified by an unique key and is accessible as long as the
 *          session persists. You have to initialize the session on application start. Each session key/value pair is
 *          stored in the application store. This means that session data persists beyond application sessions.
 *          Therefore a session have to be initialized on app start where a new session id will be generated and all
 *          previous sessions will be deleted.
 *
 * @param   {boolean}  [start=false]    true to start a session, otherwise an existing session will be used.
 *
 * @example
 * var mySession = new Session(true); // initialize session on app start
 * mySession.set('period', 'week');   // store the value week under the key period
 *
 * var mySession = new Session();     // get access to the session in any subcontext
 * mySession.get('period');           // fetch the value of the key period, stored in the session
 *
 * @static
 */
function Session (start) {

    /**
     * Holds the unique session id. The session id will be generated on session start.
     * 
     * @type string
     */
    this.sid   = null;

    /**
     * Initializes the session. If the start parameter is set to true, it removes previous sessions and generates a
     * new one. Otherwise, it restores the session id to allow the access to the session from any context.
     *
     * @param {boolean} [start=false]   If true, the session will be started/initialized. Otherwise the existing session
     *                                  will be used.
     *
     * @type null
     */
    this.init  = function (start) {

        if ('undefined' === (typeof start) || !start) {
        
            this.restoreSessionId();
            
        } else {
        
            this.clearLastSession();
            this.createSessionId();
        }
    };

    /**
     * Cleares a previous existing session by removing the session id and each stored session key/value pair.
     *
     * @type null
     */
    this.clearLastSession = function () {
        // remove latest session id
        Titanium.App.Properties.removeProperty('sessionid');
        
        // remove all properties starting with the session key prefix
        var properties    = Titanium.App.Properties.listProperties();
        
        if (properties && properties.length) {

            var sessionPrefix = this._addSessionKeyPrefix('');
            
            for (var index = 0; index < properties.length; index++) {
            
                var propertyName = properties[index];
            
                if (propertyName && 0 === propertyName.indexOf(sessionPrefix)) {
                    Titanium.App.Properties.removeProperty(propertyName);
                }
            }
        }

    };

    /**
     * Creates a new, unique session id and stores it in the application store. This allows us to read the session id
     * from any context.
     *
     * @type null
     */
    this.createSessionId = function () {
        this.sid = Titanium.Platform.createUUID();
    
        Titanium.App.Properties.setString('sessionid', this.sid);
    };

    /**
     * Creates a new, unique session id and stores it in the application store. This allows us to read the session id
     * from any context.
     *
     * @returns {boolean}  Returns true on a successful restore, false otherwise.
     */
    this.restoreSessionId = function () {
    
        if (Titanium.App.Properties.hasProperty('sessionid')) {
        
            this.sid = Titanium.App.Properties.getString('sessionid');
        
            return true;
        } 
        
        // @todo what shall we do in such a case? if sid is not set, the session manager does maybe not work correctly
        this.init(true);
            
        return false;
    };

    /**
     * Returns the value that was previously stored in the session under the given key. If the key is not found or 
     * the sessionId does not match the current sessionId, it returns the default value or null if no default value was
     * specified.
     * 
     * @param   {string}                              key               A previously used key.
     * @param   {string|Array|Object|Number|boolean}  [defaultValue]    Optional default value if no value is stored 
     *                                                                  under this key.
     *
     * @example
     * var mySession = new Session();
     * mySession.get('period', 'day');
     * 
     * @returns {string|Array|Object|Number|boolean} The value.
     *
     * @throws {Error} In case of a missing key
     */
    this.get = function (key, defaultValue) {
        
        Log.debug(key, 'Session.get');

        if (!key) {
            throw new Error('Missing parameter key');
        }

        key = this._addSessionKeyPrefix(key);

        if (Titanium.App.Properties.hasProperty(key)) {
        
            var sessionEntry = Titanium.App.Properties.getString(key);

            sessionEntry     = JSON.parse(sessionEntry);
            var validEntry   = true;
            
            if (!sessionEntry || !sessionEntry.sid || sessionEntry.sid !== this.sid) {

                // invalid/outdated entry
                Titanium.App.Properties.removeProperty(key)
        
                valueEntry   = false;
            }
            
            if (validEntry && 'undefined' !== (typeof sessionEntry.value)) {
            
                return sessionEntry.value;
            }
        }
        
        if ('undefined' !== (typeof defaultValue)) {
        
            return defaultValue;
        }
        
        return;
    };

    /**
     * Stores the given value in the session for a specific lifetime. The session entry is stored in the application 
     * stores as a serialized JSON and contains following values:
     * 'value'   The stored value
     * 'sid'     The current session id
     * 
     * @param {string}                              key     A unique key which identifies the stored value. The same
     *                                                      identifier is needed to get the stored value.
     * @param {string|Array|Object|Number|boolean}  value   The value 
     * 
     * @example
     * var mySession = new Session();
     * mySession.set('period', 'year');
     * 
     * @type null
     * @throws {Error} In case of a missing key
     */
    this.set = function (key, value) {
        
        Log.debug(key, 'Session.set');
    
        if (!key) {
            throw new Error('Missing parameter key');
        }
        
        var key          = this._addSessionKeyPrefix(key);
        
        var sessionEntry = {value: value, sid: this.sid};
        
        sessionEntry     = JSON.stringify(sessionEntry);
        
        Titanium.App.Properties.setString(key, sessionEntry);
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
    this.remove = function (key) {
        
        Log.debug(key, 'Session.remove');

        if (!key) {

            throw new Error('Missing parameter key');
        }

        key = Session._addSessionKeyPrefix(key);

        if (Titanium.App.Properties.hasProperty(key)) {

            Titanium.App.Properties.removeProperty(key);
            
            return true;
        }
        
        return false;
    };

    /**
     * Adds an prefix/namespace to each session key because other libraries - like Settings - stores key/values in the 
     * same application store. This ensures it does not influence those other libraries.
     * 
     * @param   {string}  key   The key used in the application.
     * 
     * @returns {string}  The updated key used internally in the Session object.
     *
     * @private
     */
    this._addSessionKeyPrefix = function (key) {
    
        return 'sessionstore_' + key;
    };
    
    this.init(start);
}
