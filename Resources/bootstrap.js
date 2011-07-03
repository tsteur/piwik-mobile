/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 
 * @fileOverview This is the main window. We bootstrap our application here.
 *               Every variable defined in this file is a global variable and available in each file and context.
 *               Be careful defining variables therefore.
 */
Ti.include('/config.js',
           '/library/Piwik.js');

// do not close a Ti.UI.Window when user presses the hardware back button, remove our own windows. only android
Ti.UI.currentWindow.addEventListener('android:back', function () {
    Piwik.Log.debug('android:back event', 'bootstrap.js');

    if (Piwik.UI.currentWindow) {
        Piwik.UI.currentWindow.close();
    }
});

// activate and initialize translations
Piwik.require('Locale/Translation').load();

// save default period and date in session on app start. so we only have to work with session when we want to access
// chosen period/date values.
var bootstrapSession  = Piwik.require('App/Session');
var bootstrapSettings = Piwik.require('App/Settings');
bootstrapSession.set('piwik_parameter_period', bootstrapSettings.getPiwikDefaultPeriod());
bootstrapSession.set('piwik_parameter_date', bootstrapSettings.getPiwikDefaultDate());
// reset vars, otherwise they will be available in global context
bootstrapSession      = undefined;
bootstrapSettings     = undefined;

// bootstrap layout
Piwik.UI.bootstrap({layoutUrl: 'layout/default.js'});

var bootstrapAccounts   = Piwik.require('App/Accounts');
var hasActivatedAccount = bootstrapAccounts.hasActivedAccount();
// reset bootstrapAccounts instance, otherwise it will be available in global context
bootstrapAccounts       = undefined;

Piwik.getTracker().askForPermission();

if (hasActivatedAccount) {
    // open our welcome window
    Piwik.UI.createWindow({url: 'index/index.js'});

} else {
    // user has not already created an (active) account. directly show create account window. user has to create at
    // least one account
    Piwik.UI.createWindow({url: 'settings/editaccount.js'});
}
