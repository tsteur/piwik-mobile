/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Provides a simple logger. Logs messages to standard iOS/Android SDK log which is accessible for example
 *          via Titanium Developer. Uses the Titanium.API module to log messages.
 * @static
 */
Piwik.Log = new function () {

    /**
     * True if logging is enabled, false otherwise. Should be disabled in a production release.
     *
     * @type boolean
     */
    this.ENABLED     = config.logEnabled;

    /**
     * An instance of any profiler. For example Piwik.Profiler.
     *
     * @type Object
     */
    this.profiler    = null;

    /**
     * Sets the profiler. The profiler has to implement at least a method named 'step'. Otherwise the profiler will
     * not be used. The 'step' method will be triggered on each logging call.
     * 
     * @param {Object}   profiler
     */
    this.setProfiler = function (profiler) {
        if (!profiler || !profiler.step) {
            // has the profiler implemented the required method 'step'? Do not accept the logger if not.

            if (this.ENABLED) {
                Ti.API.warn('No valid profiler set', 'Piwik.Log::setProfiler');
            }

            return;
        }

        this.profiler = profiler;
    };

    /**
     * Logs debug messages. It is recommended to always define a title, but not required. Logs the message only if
     * logging is enabled.
     *
     * @param {string|Array|Object|Number|boolean|null}  message    The proper message/value. The message is automatically
     *                                                              converted to JSON If message is not a string.
     * @param {string|Array|Object|Number|boolean|null}  [title]    Optional title. Preceded to the message. The title is
     *                                                              automatically converted to JSON if message is not a
     *                                                              string.
     *
     * @example
     * Piwik.Log.debug([1, 2, 3], 'Piwik.UI.Menu::create');
     *
     * @type void
     */
    this.debug = function (message, title) {
        if (!this.ENABLED) {
            
            return;
        }

        var logMessage  = '';

        if (title) {
            logMessage += this.stringify(title) + ': ';
        }

        logMessage     += this.stringify(message);

        // trigger step() before logging the message. This ensures the profiling output appears in log before the next
        // logging message.
        if (this.profiler) {
            this.profiler.step();
        }

        Ti.API.debug(logMessage);

        logMessage      = null;
    };

    /**
     * Converts the log message to JSON or anything else readable if type of log is not already a string.
     *
     * @returns {string} The converted value.
     */
    this.stringify = function (log) {

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
     * @type void
     */
    this.error = function (message, title) {
        if (!this.ENABLED) {
            return;
        }

        var logMessage  = '';

        if (title) {
            logMessage += this.stringify(title) + ': ';
        }

        logMessage     += this.stringify(message);

        if (this.profiler) {
            this.profiler.step();
        }

        Ti.API.error(logMessage);

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
     * @type void
     */
    this.warn = function (message, title) {
        if (!this.ENABLED) {
            return;
        }

        var logMessage  = '';

        if (title) {
            logMessage += this.stringify(title) + ': ';
        }

        logMessage     += this.stringify(message);

        if (this.profiler) {
            this.profiler.step();
        }

        Ti.API.warn(logMessage);

        logMessage      = null;
    };
};