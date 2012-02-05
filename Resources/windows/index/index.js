/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'index/index.js' .
 */

/** @private */
var Piwik = require('library/Piwik');
/** @private */
var _     = require('library/underscore');

/**
 * @class     Displays a list of all available websites where the user has at least view access. The user is able to
 *            select a website which opens a new window.
 *
 * @exports   window as WindowIndexIndex
 * @this      Piwik.UI.Window
 * @augments  Piwik.UI.Window
 *
 * @todo      sort websites by accountId
 */
function window () {

    /**
     * @see  Piwik.UI.Window#titleOptions
     * 
     * The last whitespace forces an redraw of the title on the iPad. Without this redraw the title will be aligned
     * right.
     */
    this.titleOptions = {title: 'Piwik Mobile '};
    
    /**
     * @see  Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {commands: [this.createCommand('OpenSettingsCommand'), 
                                    this.createCommand('RefreshCommand')]};

    var that          = this;

    var websitesList  = this.create('WebsitesList', {handleOnlyOneSiteAvailableEvent: !Piwik.getPlatform().isIpad,
                                                     view: this});

    websitesList.addEventListener('onChooseSite', function (event) {
        if (!event || !event.site) {

            return;
        }
        
        Piwik.getTracker().prepareVisitCustomVariables();

        that.create('Window', {url: 'site/index',
                               target: 'masterView',
                               site: event.site});
    });

    websitesList.addEventListener('onOnlyOneSiteAvailable', function (event) {
        if (!event || !event.site) {

            return;
        }
        
        Piwik.getTracker().prepareVisitCustomVariables();
        
        // user has access to only one site. jump directly to site view
        // @see http://dev.piwik.org/trac/ticket/2120
        that.create('Window', {url: 'site/index',
                               closeWindow: that,
                               target: 'masterView',
                               site: event.site});
    });

    /**
     * Send the request async to fetch a list of all available websites.
     */
    this.open = function () {
        websitesList.request();
    };
    
    this.cleanup = function () {
        // don't need to cleanup. if this window is closed, the app is closed...
    };
}

module.exports = window;