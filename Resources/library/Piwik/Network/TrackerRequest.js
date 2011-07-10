/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    Sends tracking requests to a piwik instance. The piwik instance can be configured within the config.
 *
 * @augments Piwik.Network.HttpRequest
 */
Piwik.Network.TrackerRequest = function () {

    this.baseUrl    = config.tracking.piwikServerUrl;
    
    this.sendErrors = false;
    
    /**
     * Sends the tracking request.
     *
     * @type void
     */
    this.send = function () {

        if (!this.parameter) {
            this.parameter = {};
        }

        this.handle();
        
        return;
    };
};

/**
 * Extend Piwik.Network.HttpRequest.
 */
Piwik.Network.TrackerRequest.prototype = Piwik.require('Network/HttpRequest');