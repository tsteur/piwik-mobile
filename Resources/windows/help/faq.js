/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'help/faq.js' .
 */

/**
 * @class Displays the Piwik Mobile FAQ page within a webview. The url to the 
 *        FAQ page is defined in config.
 *
 * @this     {Piwik.UI.Window}
 * @augments {Piwik.UI.Window}
 */
function window () {

    /**
     * @see Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: _('General_Faq')};
    
    /**
     * @see Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {};

    var webview       = Ti.UI.createWebView({url: config.faqUrl,
                                             id: 'faqPageWebView'});

    this.add(webview);

    this.open = function () {};
}