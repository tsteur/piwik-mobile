/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'help/license.js' .
 */

/**
 * @class     Displays the Piwik Mobile License.
 *
 * @exports   window as WindowHelpLicense
 * @this      Piwik.UI.Window
 * @augments  Piwik.UI.Window
 */
function window () {

    /**
     * @see  Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: 'Piwik Mobile License'};
    
    /**
     * @see  Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {};

    this.add(Ti.UI.createWebView({url: '/license.html'}));
    
    this.open = function () {

    };
    
    this.cleanup = function () {

        this.menuOptions  = null;
        this.titleOptions = null;
    };
}

module.exports = window;