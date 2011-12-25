/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   The top level Command module. The module contains methods to create commands.
 *
 * @static
 */
Piwik.Command = {};

/**
 * Creates an instance of the given command and automatically sets the given parameters.
 * 
 * @param {string}  commandName   The name of the command, such a command has to exist within the library/Piwik/Command
 *                                folder. For example 'AddAccountCommand'.
 * @param {Object}  params        Optional parameters which will be automatically set.
 *
 * @returns {null|Object}         An instance of the created command or null if there was any error.
 */
Piwik.Command.create = function (commandName, params) {
        
    if (!params) {
        params = {};
    }
    
    try {
        var command = Piwik.require('Command/' + commandName);
        
        if (!command) {
            return;
        }
        
        command.setParams(params);
        
    } catch (e) {
        Piwik.Log.warn('Failed to create command: ' + e, 'Piwik.UI.Window::createCommand');
        
        return;
    }
    
    return command;
};