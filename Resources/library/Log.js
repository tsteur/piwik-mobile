/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Provides a simple logger. Logs messages to standard iOS/Android SDK log and is accessible for example
 *          in Titanium Developer.
 * @static
 */
var Log = {};

/**
 * Enables/disables logging. Will be automatically disabled when preparing a build by the minifijs script. 
 * This makes the app a bit more faster.
 *
 * @define {boolean}
 * c
 * @type boolean
 */
Log.ENABLED         = true;

/**
 * Enables/disables profiling. If enabled it logs the elapsed time in ms between two logging calls and the current
 * available memory.
 *
 * @define {boolean}
 * c
 * @type boolean
 */
Log.PROFLINGENABLED = false;

/**
 * Holds the number of milliseconds since 1/1/1970. Will be updated on each logging call if profiling and logging
 * is enabled.
 * 
 * @type null|int
 */
Log.time            = null;
        
/**
 * Logs debug messages.
 * 
 * @param {string|Array|Object|Number|boolean|null}  message    The proper message/value. The message is automatically
 *                                                              converted to JSON If message is not a string.
 * @param {string|Array|Object|Number|boolean|null}  [title]    Optional title. Preceded to the message. The title is 
 *                                                              automatically converted to JSON if message is not a 
 *                                                              string.
 * 
 * @example
 * Log.debug([1,2,3], 'Response of getPageUrl request');
 * 
 * @type null
 */
Log.debug = function (message, title) {
    if (!Log.ENABLED) { 
        return;
    }

    var logMessage  = '';

    if (title) {
        logMessage += Log.stringify(title) + ': ';
    }
    
    logMessage     += Log.stringify(message);

    Log.profile();
    Titanium.API.debug(logMessage);
    
    logMessage      = null;
};
    
/**
 * Converts the log message to JSON if the type of the log is not already a string.
 *
 * @returns {string} The converted value. 
 */
Log.stringify = function (log) {

    if ('undefined' === (typeof log)) {
    
        return 'undefined';
    }
    
    if (null === log) {
    
        return 'null';
    }

    if ('string' === (typeof log).toLowerCase()) {

        return log;
    
    }
    
    try {
    
        return JSON.stringify(log);
    
    } catch (e) {
        
        var type = (typeof log);
        
        return type;
    }
};

/**
 * Logs error messages. Use this only in case of a "real error". Just be a bit careful.
 * 
 * @param {string|Array|Object|Number|boolean|null}  message    The proper message/value. The message is automatically
 *                                                              converted to JSON If message is not a string.
 * @param {string|Array|Object|Number|boolean|null}  [title]    Optional title. Preceded to the message. The title is 
 *                                                              automatically converted to JSON if message is not a 
 *                                                              string.
 * 
 * @type null
 */
Log.error = function (message, title) {
    if (!Log.ENABLED) { 
        return;
    }
    
    Log.profile();

    var logMessage  = '';

    if (title) {
        logMessage += Log.stringify(title) + ': ';
    }
    
    logMessage     += Log.stringify(message);

    Log.profile();
    Titanium.API.error(logMessage);

    logMessage      = null;
};

/**
 * Logs warning messages.
 * 
 * @param {string|Array|Object|Number|boolean|null}  message    The proper message/value. The message is automatically
 *                                                              converted to JSON If message is not a string.
 * @param {string|Array|Object|Number|boolean|null}  [title]    Optional title. Preceded to the message. The title is 
 *                                                              automatically converted to JSON if message is not a 
 *                                                              string.
 * 
 * @type null
 */
Log.warn = function (message, title) {
    if (!Log.ENABLED) { 
        return;
    }

    var logMessage  = '';

    if (title) {
        logMessage += Log.stringify(title) + ': ';
    }
    
    logMessage     += Log.stringify(message);

    Log.profile();
    Titanium.API.warn(logMessage);

    logMessage      = null;
};

/**
 * Logs the elapsed time since the last logging call if profiling is enabled.
 * 
 * @type null
 */
Log.profile = function () {
    if (!Log.PROFLINGENABLED) {
        return;
    }
    
    if (!Log.time) {
        Log.time = new Date().getTime();
        
        return;
    }
    
    var now = new Date().getTime();
    
    Titanium.API.debug("Time: " + (now - Log.time) + 'ms');
    Titanium.API.debug("Free mem: " + (Titanium.Platform.availableMemory / 1000) + 'kb');
    
    Log.time = now;
};
