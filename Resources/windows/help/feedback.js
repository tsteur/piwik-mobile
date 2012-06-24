/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'help/feedback.js' .
 */

/** @private */
var Piwik = require('library/Piwik');
/** @private */
var _     = require('library/underscore');

/**
 * @class     Displays a 'Give us feedback' window containing information about the users device and platform.
 *
 * @exports   window as WindowHelpFeedback
 * @this      Piwik.UI.Window
 * @augments  Piwik.UI.Window
 */
function window () {

    /**
     * @see  Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: _('General_GiveUsYourFeedback')};

    /**
     * @see  Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {};
    
    var rows     = [];
    var platform = String.format('%s %s %s (%s)', '' + Ti.Platform.name, '' + Ti.Platform.version, '' + Ti.Platform.model, '' + Ti.Platform.locale);
    var version  = String.format("%s - %s %s", '' + Ti.App.version, '' + Ti.version, '' + Ti.buildHash);

    rows.push(this.create('TableViewRow', {title: 'Email us', 
                                           description: 'Send us fedback, report a bug or a feature wish.', 
                                           command: this.createCommand('SendFeedbackCommand')}));

    if (Piwik.require('App/Rating').canRate()) {
        rows.push(this.create('TableViewRow', {title: 'Rate us on the App Store', 
                                               description: 'Piwik Mobile App is a Free Software, we would really appreciate if you took 1 minute to rate us.', 
                                               command: this.createCommand('RateAppCommand')}));
    }

    rows.push(this.create('TableViewRow', {title: 'Learn how you can participate', 
                                           description: 'Piwik is a project made by the community, you can participate in the Piwik Mobile App or Piwik.',
                                           command: this.createCommand('OpenLinkCommand', {link: 'http://piwik.org/contribute/'})}));
                                                     
    rows.push(this.create('TableViewSection', {title: 'About', style: 'native'}));
    rows.push(this.create('TableViewRow', {title: 'Version', description: version}));
    rows.push(this.create('TableViewRow', {title: 'Platform', description: platform}));

    var tableView = this.create('TableView', {id: 'giveFeedbackTableView', data: rows});

    this.add(tableView.get());

    this.open = function () {

    };
    
    this.cleanup = function () {

        if (tableView && tableView.get()) {
            this.remove(tableView.get());
        }

        tableView        = null;

        this.menuOptions  = null;
        this.titleOptions = null;
    };
}

module.exports = window;