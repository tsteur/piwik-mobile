/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'index/index.js' .
 */

/**
 * @class Displays a list of all available websites where the user has at least view access. The user is able to select
 *        a website which opens a new window.
 *
 * @todo sort websites by accountId
 *
 * @this     {Piwik.UI.Window}
 * @augments {Piwik.UI.Window}
 */
function window () {

    /**
     * @see Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: 'Piwik Mobile'};

    /**
     * @see Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {settingsChooser: true};

    var websitesList  = Piwik.UI.createWebsitesList({view: this, handleOnlyOneSiteAvailableEvent: true});

    websitesList.addEventListener('onChooseSite', function (event) {
        if (!event || !event.site) {

            return;
        }

        Piwik.UI.createWindow({url: 'site/index.js',
                               site: event.site});
    });

    websitesList.addEventListener('onOnlyOneSiteAvailable', function (event) {
        if (!event || !event.site) {

            return;
        }
        
        // user has access to only one site. jump directly to site view
        // @see http://dev.piwik.org/trac/ticket/2120
        Piwik.UI.createWindow({url: 'site/index.js',
                               closeCurrentWindow: true,
                               site: event.site});
    });

    /**
     * Send the request async to fetch a list of all available websites.
     */
    this.open = function () {
        websitesList.request();
    };
}