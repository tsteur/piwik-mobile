/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   Provides methods needed in most Network Requests. Serves as a base class for network classes. A request
 *          should extend this class.
 */
Piwik.Network.Request = function () {
    
    /**
     * A prefix for event handlers. Fixes an issue that the same event names fires multiple times. Cause other requests
     * do also fire 'onload' event on the same object (Piwik.UI.currentWindow)
     *
     * @type string
     */
    this.eventPrefix    = null;

    /**
     * Add an event listener to receive triggered events. The callback will be executed in the
     * Piwik.UI.Window context.
     *
     * @param   {string}     name       Name of the event you want to listen to.
     * @param   {Function}   callback   Callback function to invoke when the event is fired
     */
    this.addEventListener = function (name, callback) {

        if (!this.eventPrefix) {
            this.eventPrefix = String(Math.random()).slice(2,8);
        }

        if (Piwik.isAndroid) {
            // android seems to execute Ti.App in another "subcontext". This does currently cause an error 
            // "Piwik is undefined" when trying to access "Piwik" within an event listener.
            // @todo check whether this "bug" still exists and whether we can remove this condition
            Piwik.UI.currentWindow.addEventListener(this.eventPrefix + name, callback);
            
        } else {
            
            Ti.App.addEventListener(this.eventPrefix + name, callback);
        }
    };

    /**
     * Fires an event to all listeners. The event will be fired in Piwik.UI.Window context.
     *
     * @param   {string}     name       Name of the event you want to fire.
     * @param   {Function}   event      An event object that will be passed to the callback function which was added
     *                                  via addEventListener.
     */
    this.fireEvent = function (name, event) {

        if (!this.eventPrefix) {
            this.eventPrefix = String(Math.random()).slice(2,8);
        }

        if (Piwik.isAndroid) {
            
            Piwik.UI.currentWindow.fireEvent(this.eventPrefix + name, event);
            
        } else {
            
            Ti.App.fireEvent(this.eventPrefix + name, event);
        }
    };
}
