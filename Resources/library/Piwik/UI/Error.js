/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   An error UI widget is created by the method Piwik.UI.createError. The error UI widget is intended to display
 *          error information to the user instead of simply logging to the log. So the user has a good chance to give
 *          us feedback about the occurred error.
 *
 * @param    {Object}           params               See {@link Piwik.UI.View#setParams}
 * @param    {Error|string}     params.exception     An instance of an previously occurred error or a string containing
 *                                                   an error message.
 *
 * @example
 * try {
 *    throw new Error();
 * } catch (error) {
 *    Piwik.UI.createError({exception: error}).showErrorMessageToUser();
 * }
 *
 * @example
 * Piwik.UI.createError({exception: 'An error occurred'}).showErrorMessageToUser();
 *
 * @augments Piwik.UI.View
 */
Piwik.UI.Error = function () {

    /**
     * Initializes the UI error widget. If debugging is enabled in config, it throws the exception. This has the
     * advantage that more information about the occurred exception will be visible. For example file and line where
     * the error occurred.
     *
     * @type Piwik.UI.Error
     */
    this.init = function () {

        var exception = this.getParam('exception');

        if (config.debugging && exception && 'object' == (typeof exception).toLowerCase()) {
            throw exception;
        }

        return this;
    };

    /**
     * Displays an error message to the user. Uses an alert dialog to display the error message and contact information.
     *
     * @example
     * showErrorMessageToUser(Error('push() is not defined in HttpRequest'))
     * showErrorMessageToUser('push() is not defined in HttpRequest')
     * showErrorMessageToUser()
     */
    this.showErrorMessageToUser = function () {
        var message   = "Please, contact mobile@piwik.org or visit http://piwik.org/mobile\n";
        var exception = this.getParam('exception');

        message += "Error: ";
        if ('undefined' !== (typeof exception) && exception) {
            message += exception.toString();
            Piwik.Log.warn(exception.toString(), 'Piwik.UI.Error::showErrorMessageToUser');
        } else {
            message += 'Unknown';
        }

        message += "\nPlease, provide the following information:\n";
        message += "System: " + Ti.Platform.name + ' ' + Ti.Platform.version + "\n";

        message += String.format("Piwik Mobile Version: %s - %s %s\n",
                                 '' + Ti.App.version, '' + Ti.version, '' + Ti.buildHash);
        message += "Available memory " + Ti.Platform.availableMemory + "\n";

        var caps =  Ti.Platform.displayCaps;
        message += String.format("Resolution: %sx%s %s (%s) \n",
                                 '' + caps.platformWidth,
                                 '' + caps.platformHeight,
                                 '' + caps.density,
                                 '' + caps.dpi);

        var alertDialog = Ti.UI.createAlertDialog({
            title: "An error occurred",
            message: message,
            buttonNames: ['OK']
        });

        alertDialog.show();
    };
};

/**
 * Extend Piwik.UI.View
 */
Piwik.UI.Error.prototype = Piwik.require('UI/View');