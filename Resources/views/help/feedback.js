/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview View template help/feedback.
 */

/**
 * View template. 
 *
 * @this {View}
 */
function template () {

    var headline    = this.helper('headline', {headline: _('General_GiveUsYourFeedback')});
    
    this.add(headline.subView);

    var scrollView  = Ti.UI.createScrollView({
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
    
    var title = Ti.UI.createLabel({text: _('Feedback_DoYouHaveBugReportOrFeatureRequest'), 
                                   color: config.theme.textColor,
                                   top: 5, left: 5, right: 5,
                                   textAlign: 'left',
                                   height: 'auto',
                                   font: {fontWeight: 'bold'}});
    scrollView.add(title);
    
    var contact = Ti.UI.createLabel({text: 'Please, visit http://piwik.org/mobile or contact mobile@piwik.org . If you report a bug, please, add the following information:', 
                                    color: config.theme.textColor,
                                    autoLink: Ti.UI.Android ? Ti.UI.Android.LINKIFY_ALL : null, 
                                    top: 5, left: 5, right: 5,
                                    height: 'auto',
                                    textAlign: 'left'});
    scrollView.add(contact);
    
    var platform = Ti.UI.createLabel({text: String.format('Platform: %s %s %s', 
                                                          '' + Ti.Platform.name, 
                                                          '' + Ti.Platform.version, 
                                                          '' + Ti.Platform.model), 
                                      color: config.theme.textColor,
                                      top: 15, left: 5, right: 5,
                                      height: 'auto',
                                      textAlign: 'left'});
    scrollView.add(platform);
    
    var version = Ti.UI.createLabel({text: String.format("Version: %s - %s %s", 
                                                         '' + Ti.App.version, 
                                                         '' + Ti.version, 
                                                         '' + Ti.buildHash), 
                                     color: config.theme.textColor,
                                     top: 3, left: 5, right: 5,
                                     height: 'auto',
                                     textAlign: 'left'});
    scrollView.add(version);
    
    var memory = Ti.UI.createLabel({text: "Available memory: " + Ti.Platform.availableMemory, 
                                    color: config.theme.textColor,
                                    top: 3, left: 5, right: 5,
                                    height: 'auto',
                                    textAlign: 'left'});
    scrollView.add(memory);
    
    var caps        = Ti.Platform.displayCaps;
    var resoulution = Ti.UI.createLabel({text: String.format("Resolution: %sx%s %s (%s)", 
                                                             '' + caps.platformWidth, 
                                                             '' + caps.platformHeight, 
                                                             '' + caps.density, 
                                                             '' + caps.dpi), 
                                         color: config.theme.textColor,
                                         top: 3, left: 5, right: 5,
                                         height: 'auto',
                                         textAlign: 'left'});
    scrollView.add(resoulution);
    
    var locale = Ti.UI.createLabel({text: String.format("Locale: %s", '' + Ti.Platform.locale), 
                                    color: config.theme.textColor,
                                    top: 3, left: 5, right: 5,
                                    height: 'auto',
                                    textAlign: 'left'});
    scrollView.add(locale);
    
    var network = Ti.UI.createLabel({text: String.format("Network: %s", '' + Ti.Network.networkTypeName), 
                                     color: config.theme.textColor,
                                     top: 3, left: 5, right: 5,
                                     height: 'auto',
                                     textAlign: 'left'});
    scrollView.add(network);

    var work = Ti.UI.createLabel({text: 'Piwik is a project made by the community, you can participate in the Piwik Mobile App or Piwik. Please contact us.', 
                                 color: config.theme.textColor,
                                 top: 15, left: 5, right: 5,
                                 textAlign: 'left',    
                                 height: 'auto',
                                 font: {fontWeight: 'bold'}});
    scrollView.add(work);
}
