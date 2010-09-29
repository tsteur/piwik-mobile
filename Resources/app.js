/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
Titanium.include('/config.js');
Titanium.include('/library/Log.js');
Titanium.include('/library/Session.js');
Titanium.include('/library/Settings.js');
Titanium.include('/library/Window.js');
Titanium.include('/library/Cache.js');
Titanium.include('/model/AccountModel.js');

// this sets the background color of the master UIView
Titanium.UI.setBackgroundColor(config.theme.backgroundColor);

var mySession = new Session(true);

// save default period and date in session on app start. so we only have to work with session when we want to access 
// chosen period/date.
mySession.set('piwik_parameter_period', Settings.getPiwikDefaultPeriod());
mySession.set('piwik_parameter_date', Settings.getPiwikDefaultDate());

var accountManager = new AccountModel();

// migration of old settings to new accountmodel. @TODO Remove this in next version.
if (Settings.getPiwikUrl() && Settings.getPiwikUserAuthToken()) {
    var account = {accessUrl: '' + Settings.getPiwikUrl(),
                   tokenAuth: '' + Settings.getPiwikUserAuthToken(),
                   username: '',
                   name: 'Anonymous access',
                   active: 1};

    Titanium.App.Properties.removeProperty('setting_piwikUrl');
    Titanium.App.Properties.removeProperty('setting_piwikUserAuthToken');
                   
    if (Settings.getPiwikUser()) {
        account.username = Settings.getPiwikUser();
        account.name     = account.username;
        Titanium.App.Properties.removeProperty('setting_piwikUser');
    }
    
    if (Settings.getPiwikPassword()) {
        Titanium.App.Properties.removeProperty('setting_piwikPassword');
    }
    
    accountManager.createAccount(account);
}

// create root window
if (accountManager.hasActivedAccount()) {

    Window.createMvcWindow({jsController: 'index',
                            jsAction:     'index',
                            exitOnClose:  true});
                        
} else {
    // directly show manage accounts if user has not already setup an account
    Window.createMvcWindow({jsController: 'settings',
                            jsAction:     'manageaccounts',
                            exitOnClose:  true});
}
