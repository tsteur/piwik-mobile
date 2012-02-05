/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'help/about.js' .
 */

/** @private */
var Piwik = require('library/Piwik');
/** @private */
var _     = require('library/underscore');

/**
 * @class     Displays an 'About Piwik' window containing links to source and Piwik project website.
 *            Also displays Piwik Mobile license information.
 *
 * @exports   window as WindowHelpAbout
 * @this      Piwik.UI.Window
 * @augments  Piwik.UI.Window
 */
function window () {

    /**
     * @see  Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: String.format(_('General_AboutPiwikX'), 'Mobile')};
    
    /**
     * @see  Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {};

    var view = Ti.UI.createView({id: 'aboutPiwikView'});

    this.add(view);
    
    var piwikOrgLink  = Ti.UI.createLabel({text: 'Website: http://piwik.org',
                                           id: 'aboutPiwikLinkToPiwiwkLabel'});
    piwikOrgLink.addEventListener('click', function () {

        var link = 'http://piwik.org';

        Piwik.getTracker().trackLink(link, 'link');
        Ti.Platform.openURL(link);
    });
    
    var piwikDevLink  = Ti.UI.createLabel({text: 'Source Code: http://dev.piwik.org/svn/mobile',
                                           id: 'aboutPiwikLinkToSvnLabel'});
    piwikDevLink.addEventListener('click', function () {
        var link = 'http://dev.piwik.org/svn/mobile';

        Piwik.getTracker().trackLink(link, 'link');
        Ti.Platform.openURL('http://dev.piwik.org/svn/mobile');
    });

    var gplContent    = Ti.UI.createWebView({url: '/license.html',
                                             id: 'aboutPiwikLicenseWebView'});

    view.add(piwikOrgLink);
    view.add(piwikDevLink);
    view.add(gplContent);
    gplContent    = null;
    piwikDevLink  = null;
    piwikOrgLink  = null;

    this.open = function () {

    };
    
    this.cleanup = function () {
        
        this.remove(view);
        view              = null;
        
        this.menuOptions  = null;
        this.titleOptions = null;
    };
}

module.exports = window;