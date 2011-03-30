/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview View template help/about.
 */

/**t
 * View template. 
 *
 * @this {View}
 */
function template () {

    var headline    = this.helper('headline', {headline: String.format(_('General_AboutPiwikX'), 'Mobile')});
    
    this.add(headline.subView);

    var scrollView  = Titanium.UI.createScrollView({
        width: this.width,
        height: this.height - headline.subView.height,
        contentWidth: 'auto',
        contentHeight: 'auto',
        layout: 'vertical',
        top: headline.subView.height,
        left: 0,
        right: 0,
        showVerticalScrollIndicator: true,
        showHorizontalScrollIndicator: false
    });
    this.add(scrollView);
    
    var piwikOrgLink = Ti.UI.createLabel({text: 'Website: http://piwik.org', 
                                         focusable: true,
                                         top: 5, left: 5, right: 5,
                                         textAlign: 'left',
                                         height: 'auto',
                                         color: config.theme.titleColor});
    piwikOrgLink.addEventListener('click', function () {
        Titanium.Platform.openURL('http://piwik.org');
    });
    scrollView.add(piwikOrgLink);
    
    var piwikDevLink = Ti.UI.createLabel({text: 'Source Code: http://dev.piwik.org/svn/mobile', 
                                          focusable: true, 
                                          top: 5, left: 5, right: 5,
                                          textAlign: 'left',
                                          height: 'auto',
                                          color: config.theme.titleColor});
    piwikDevLink.addEventListener('click', function () {
        Titanium.Platform.openURL('http://dev.piwik.org/svn/mobile');
    });
    scrollView.add(piwikDevLink);

    var gplContent = Ti.UI.createWebView({url: 'license.html', height: 'auto', top: 8, left: 0, right: 0});
    scrollView.add(gplContent);
}

