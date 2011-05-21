/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'help/about.js' .
 */

/**
 * @class Displays an 'About Piwik' window containing links to source and Piwik project website.
 *        Also displays Piwik Mobile license information.
 *
 * @this     {Piwik.UI.Window}
 * @augments {Piwik.UI.Window}
 */
function window () {

    /**
     * @see Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: String.format(_('General_AboutPiwikX'), 'Mobile')};
    
    /**
     * @see Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {};

    var scrollView    = Ti.UI.createScrollView({id: 'aboutPiwkScrollView'});

    this.add(scrollView);
    
    var piwikOrgLink  = Ti.UI.createLabel({text: 'Website: http://piwik.org',
                                           id: 'aboutPiwikLinkToPiwiwkLabel'});
    piwikOrgLink.addEventListener('click', function () {
        Ti.Platform.openURL('http://piwik.org');
    });
    
    var piwikDevLink  = Ti.UI.createLabel({text: 'Source Code: http://dev.piwik.org/svn/mobile',
                                           id: 'aboutPiwikLinkToSvnLabel'});
    piwikDevLink.addEventListener('click', function () {
        Ti.Platform.openURL('http://dev.piwik.org/svn/mobile');
    });

    var gplContent    = Ti.UI.createWebView({url: 'license.html',
                                             id: 'aboutPiwikLicenseWebView',
                                             touchEnabled: false});

    scrollView.add(piwikOrgLink);
    scrollView.add(piwikDevLink);
    scrollView.add(gplContent);

    this.open = function () {

    };
}