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
 * @class     Displays an 'About Piwik' window containing links to source coe, Piwik project website, license
 *            and more.
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
    
    var that = this;

    var view = Ti.UI.createScrollView({id: 'aboutPiwikView'});

    this.add(view);
    
    view.add(Ti.UI.createImageView({id: 'aboutPiwikLogo'}));

    var piwikOrgLink  = Ti.UI.createButton({title: 'Visit our Website', className: 'aboutPiwikLinkButton'});
    piwikOrgLink.addEventListener('click', function () {
        that.createCommand('OpenLinkCommand', {link: 'http://piwik.org'}).execute();
    });
    
    var emailUsButton = Ti.UI.createButton({title: 'Email us', className: 'aboutPiwikLinkButton'});
    emailUsButton.addEventListener('click', function () {
        that.createCommand('SendFeedbackCommand').execute();
    });

    var piwikDevLink  = Ti.UI.createButton({title: 'Browse Source Code', className: 'aboutPiwikLinkButton'});
    piwikDevLink.addEventListener('click', function () {
        that.createCommand('OpenLinkCommand', {link: 'http://dev.piwik.org/svn/mobile'}).execute();
    });
    
    var piwikTwitterLink = Ti.UI.createButton({title: 'Follow @piwik', className: 'aboutPiwikLinkButton'});
    piwikTwitterLink.addEventListener('click', function () {
        that.createCommand('OpenLinkCommand', {link: 'https://www.twitter.com/piwik'}).execute();
    });    
    
    var piwikLicenseLink = Ti.UI.createButton({title: 'View License', className: 'aboutPiwikLinkButton'});
    piwikLicenseLink.addEventListener('click', function () {
        that.create('Window', {url: 'help/license', target: 'modal'});
    });

    view.add(piwikOrgLink);
    view.add(emailUsButton);
    view.add(piwikTwitterLink);
    view.add(piwikDevLink);
    view.add(piwikLicenseLink);
    
    piwikOrgLink     = null;
    emailUsButton    = null;
    piwikTwitterLink = null;
    piwikDevLink     = null;
    piwikLicenseLink = null;
    view             = null;

    this.open = function () {

    };
    
    this.cleanup = function () {

        that              = null;
        
        this.menuOptions  = null;
        this.titleOptions = null;
    };
}

module.exports = window;