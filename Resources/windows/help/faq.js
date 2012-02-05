/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'help/faq.js' .
 */

/** @private */
var Piwik  = require('library/Piwik');
/** @private */
var _      = require('library/underscore');
/** @private */
var config = require('config');

/**
 * @class     Displays the Piwik Mobile FAQ page within a webview. The url to the 
 *            FAQ page is defined in config.
 *
 * @exports   window as WindowHelpFaq
 * @this      Piwik.UI.Window
 * @augments  Piwik.UI.Window
 */
function window () {

    /**
     * @see  Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: _('General_Faq')};
    
    /**
     * @see  Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {};

    var webview       = Ti.UI.createWebView({url: config.faqUrl,
                                             id: 'faqPageWebView'});

    this.add(webview);

    this.open = function () {};

    this.cleanup = function () {
        
        this.remove(webview);
        webview           = null;

        this.menuOptions  = null;
        this.titleOptions = null;
    };
}

module.exports = window;