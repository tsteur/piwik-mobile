/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   Root namespace of the piwik library.
 *
 * @static
 */
var Piwik        = {};

/**
 * @class   Namespace for all app related stuff like session or settings.
 *
 * @static
 */
Piwik.App        = {};

/**
 * @class   Namespace for all network related stuff. For example httpRequests.
 *
 * @static
 */
Piwik.Network    = {};

/**
 * The name of the current platform (lowercase).
 *
 * @type string
 */
Piwik.osName     = Ti.Platform.osname.toLowerCase();

/**
 * True if the current platform is android, false otherwise.
 *
 * @type boolean
 */
Piwik.isAndroid  = ('android' === Piwik.osName);

/**
 * True if the current platform is iOS (iPod or iPad or iPhone), false otherwise.
 *
 * @type boolean
 */
Piwik.isIos      = ('i' === Piwik.osName.substr(0, 1));

/**
 * True if the current device is an iPad, false otherwise.
 *
 * @type boolean
 */
Piwik.isIpad     = ('ipad' === Piwik.osName);

/**
 * True if the current device is an iPhone or iPod, false otherwise.
 *
 * @type boolean
 */
Piwik.isIphone   = (Piwik.isIos && !Piwik.isIpad);

/**
 * Holds a list of already loaded files. A Ti.include() is very slow, especially on Android.
 * This helps us to decide whether we need to include a file or whether it is already loaded.
 *
 * Object (
 *    [loaded file path] => [Boolean true if already loaded]
 * )
 *
 * @type Object
 */
Piwik.loadedFiles   = {};

/**
 * Holds a list of already loaded windows. A Ti.include() is very slow, especially on Android.
 * This helps us to decide whether we need to include a window or whether it is already loaded.
 *
 * Object (
 *    [window file path] => [window function]
 * )
 *
 * @type Object
 */
Piwik.loadedWindows = {};

/**
 * Includes a file by using Titanium.include. The difference is that this method works like an include_once. If the
 * requested file is already loaded, it will not include the file again cause a Ti.include is slow. You can pass
 * as many arguments as you want. It will include all given files.
 *
 * @param {string}  args   Path + name + extension of the file
 *
 * @example
 * Piwik.include('/library/Session.js')
 * Piwik.include('/library/Piwik/Session.js', '/library/Piwik/Settings.js')
 *
 * @type null
 */
Piwik.include = function (args) {
    
    var file = null;

    for (var index = 0; index < arguments.length; index++) {

        file = arguments[index];

        // if debugging is enabled, always include the file
        if (!config.debugging && this.loadedFiles[file]) {
            // file is already loaded or debugging is enabled.
            continue;
        }

        try {
            Ti.include(file);

            // mark file as loaded
            this.loadedFiles[file] = true;
        } catch (exception) {

            file = '/library/Piwik/UI/Error.js';
            Ti.include(file);
            // do not use Piwik.UI.createError... this would again use Piwik.require/include and we could end in a loop
            var uiError = new Piwik.UI.Error({exception: exception, errorCode: 'PiPiIn16'});
            uiError.showErrorMessageToUser();
        }
    }
};

/**
 * A simple loading system to load any file/module from the Piwik library. It ensures that each module will only
 * included once. If requested module is a class/function, it will automatically instantiate the module and return
 * the instance. If requested module is an object, it will simply return the object.
 *
 * @param {string}  module   The name of the module you want to load. For example 'App/Session' loads Piwik.App.Session.
 *                           Do not add the file extension '.js' to the module name. 
 *
 * @example
 * var session  = Piwik.require('App/Session')
 * var profiler = Piwik.require('Profiler')
 *
 * @returns {Object}
 */
Piwik.require = function (module) {

    file = '/library/Piwik/' + module + '.js';

    Piwik.include(file);

    var modules = module.split('/');
    var target  = Piwik;
    
    for (var index = 0; index < modules.length; index++) {
        target  = target[modules[index]];
    }

    if ('object' == (typeof target)) {

        return target;
    }

    if ('function' == (typeof target)) {

        return new target();
    }
};

/**
 * Loads a window template by using Titanium.include. The difference is that this method works like an include_once.
 * The difference to Piwik.include is that this method will cache the complete window function. Cause each window
 * includes a function named 'window'. We have to cache the function, otherwise we would overwrite a previous
 * loaded window function.
 *
 * @param {string}  file   The path and name of the window file relative to the 'Resources/windows/' directory.
 *
 * @example
 * Piwik.requireWindow('chart/show.js')
 *
 * @returns {Function} The requested window
 */
Piwik.requireWindow = function (file) {

    file = '/windows/' + file;

    if (!config.debugging && this.loadedWindows[file]) {
        
        return this.loadedWindows[file];
    }

    try {
        // do not use Piwik.include here cause we have to make sure that window will be loaded again if not (or no
        // longer) available in loadedWindows
        Ti.include(file);
    } catch (exception) {

        var uiError = Piwik.UI.createError({exception: exception, errorCode: 'PiPiRw19'});
        uiError.showErrorMessageToUser();
    }

    if ('undefined' !== typeof window && window) {
        this.loadedWindows[file] = window;

        return window;
    }

    return function () {};
};

// these files are required by the library
Piwik.include('/library/Piwik/Log.js',
              '/library/Piwik/Profiler.js',
              '/library/Piwik/Date.js',
              '/library/Piwik/String.js',
              '/library/Piwik/Locale.js',
              '/library/Piwik/UI.js',
              '/library/Piwik/Command.js',
              '/library/Piwik/UI/OptionMenu.js',
              '/library/Piwik/Tracker.js');

if (Piwik.Profiler.ENABLED) {
    Piwik.Log.setProfiler(Piwik.Profiler);
}

/**
 * Returns a tracker instance.
 *
 * @type Piwik.Tracker
 */
Piwik.getTracker = function () {

    return Piwik.Tracker;
};