/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 
 * @fileOverview This is the main window. We bootstrap our application here.
 *               Every variable defined in this file is a global variable and available in each file and context.
 *               Be careful defining variables therefore.
 */

var Piwik = require('library/Piwik');

// do not close a Ti.UI.Window when user presses the hardware back button, remove our own windows. only android
Ti.UI.currentWindow.addEventListener('android:back', function () {
    Piwik.getLog().debug('android:back event', 'bootstrap.js');

    if (Piwik.getUI().currentWindow) {
        Piwik.getUI().currentWindow.close();
    }
});

// save default period and date in session on app start. so we only have to work with session when we want to access
// chosen period/date values.
(function () {
    var session  = Piwik.require('App/Session');
    var settings = Piwik.require('App/Settings');
    session.set('piwik_parameter_period', settings.getPiwikDefaultPeriod());
    session.set('piwik_parameter_date', settings.getPiwikDefaultDate());
    session      = null;
    settings     = null;
})();

// bootstrap layout
if (Piwik.getPlatform().isIpad) {
    Piwik.getUI().bootstrap({layoutUrl: 'layout/ipad'});
} else if (Piwik.getPlatform().isIphone) {
    Piwik.getUI().bootstrap({layoutUrl: 'layout/iphone'});
} else {
    Piwik.getUI().bootstrap({layoutUrl: 'layout/android'});
}

var hasActivatedAccount = Piwik.require('App/Accounts').hasActivedAccount();

if (hasActivatedAccount) {
    // open our welcome window
    Piwik.getUI().createWindow({url: 'index/index'});

} else {
    // user has not already created an (active) account. directly show create account window. user has to create at
    // least one account
    Piwik.getUI().createWindow({url: 'settings/editaccount'});
}

// initialization available since Piwik Mobile 1.6.0. Execute if property not exists (fresh install or if initialization
// wasn't done since 1.6.0)
if (!Ti.App.Properties.hasProperty('app_last_initialized') ||
    Ti.App.Properties.getInt('app_last_initialized', 100) < 160) {
    Piwik.getTracker().askForPermission();

    Ti.App.Properties.setInt('app_last_initialized', parseInt(Ti.App.version.replace(/\./g, ''), 10));
} 

Piwik.require('App/Rating').countLaunch();