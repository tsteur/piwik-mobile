/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'help/feedback.js' .
 */

/**
 * @class Displays a 'Give us feedback' window containing information about the users device and platform.
 *
 * @this     {Piwik.UI.Window}
 * @augments {Piwik.UI.Window}
 */
function window () {

    /**
     * @see Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: _('General_GiveUsYourFeedback')};

    /**
     * @see Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {};
    
    var that          = this;

    var scrollView    = Ti.UI.createScrollView({id: 'giveFeedbackScrollView'});
    
    this.add(scrollView);
    
    var title    = Ti.UI.createLabel({text: _('Feedback_DoYouHaveBugReportOrFeatureRequest'),
                                      id: 'giveFeedbackBugOrFeatureLabel'});
    
    var contact  = Ti.UI.createLabel({text: 'Please, visit http://piwik.org/mobile or contact mobile@piwik.org . If you report a bug, please, add the following information:',
                                      autoLink: Ti.UI.Android ? Ti.UI.Android.LINKIFY_ALL : null,
                                      id: 'giveFeedbackReportBugInfoLabel'});

    var platform = Ti.UI.createLabel({text: String.format('Platform: %s %s %s', 
                                                          '' + Ti.Platform.name, 
                                                          '' + Ti.Platform.version, 
                                                          '' + Ti.Platform.model), 
                                      className: 'giveFeedbackDeviceInfoLabel'});
    
    var version  = Ti.UI.createLabel({text: String.format("Version: %s - %s %s",
                                                          '' + Ti.App.version,
                                                          '' + Ti.version,
                                                          '' + Ti.buildHash),
                                      className: 'giveFeedbackDeviceInfoLabel'});
    
    var memory   = Ti.UI.createLabel({text: "Available memory: " + Ti.Platform.availableMemory,
                                      className: 'giveFeedbackDeviceInfoLabel'});
    
    var caps        = Ti.Platform.displayCaps;
    var resolution  = Ti.UI.createLabel({text: String.format("Resolution: %sx%s %s (%s)",
                                                             '' + caps.platformWidth, 
                                                             '' + caps.platformHeight, 
                                                             '' + caps.density, 
                                                             '' + caps.dpi),
                                         className: 'giveFeedbackDeviceInfoLabel'});
    
    var locale   = Ti.UI.createLabel({text: String.format("Locale: %s", '' + Ti.Platform.locale),
                                      className: 'giveFeedbackDeviceInfoLabel'});
    
    var network  = Ti.UI.createLabel({text: String.format("Network: %s", '' + Ti.Network.networkTypeName),
                                      className: 'giveFeedbackDeviceInfoLabel'});


    var work     = Ti.UI.createLabel({text: 'Piwik is a project made by the community, you can participate in the Piwik Mobile App or Piwik. Please contact us.',
                                      id: 'giveFeedbackMadeByCommunityLabel'});

    scrollView.add(title);
    scrollView.add(contact);
    scrollView.add(platform);
    scrollView.add(version);
    scrollView.add(memory);
    scrollView.add(resolution);
    scrollView.add(locale);
    scrollView.add(network);
    scrollView.add(work);

    var sendEmail = function () {
        var emailDialog = Ti.UI.createEmailDialog();
        emailDialog.setSubject("Feedback Piwik Mobile");
        emailDialog.setToRecipients(['mobile@piwik.org']);

        if (emailDialog.setBarColor) {
            emailDialog.setBarColor('#B2AEA5');
        }

        if (!emailDialog.isSupported()) {

            return;
        }

        var message = 'Your Message: \n\n\nYour Device: \n' + platform.text + '\n';
        message    += version.text + '\n' + memory.text + '\n';
        message    += resolution.text + '\n' + locale.text + '\n' + network.text;

        emailDialog.setMessageBody(message);

        emailDialog.addEventListener('complete', function (event) {

            if (Piwik.isIos && event && event.result && event.result == emailDialog.SENT) {
                // android doesn't give us useful result codes. it anyway shows a toast.
                alert(_('Feedback_ThankYou'));
            }
        });

        emailDialog.open();
    };
    
    Piwik.UI.OptionMenu.addItem({title: 'Email us'}, sendEmail);
    this.addEventListener('focusWindow', function () {

        if (Piwik.isIos) {
            var emailus = Ti.UI.createButton({title: 'Email us'});
            emailus.addEventListener('click', sendEmail);
            that.rootWindow.rightNavButton = emailus;
        }

    });

    this.open = function () {

    };
}