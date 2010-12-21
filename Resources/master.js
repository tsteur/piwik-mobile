/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 
 * @fileOverview This is the main window. Every variable defined in this file is a global variable and available in each
 *               file and context. Be careful defining variables therefore.
 */
Titanium.include('/config.js');
Titanium.include('/library/all.js');
Titanium.include('/Dispatcher.js');

/**
 * Includes a file by using Titanium.include. The difference is that this method works like an include_once.
 * 
 * @param {string}  file   The path and name of the file
 * 
 * @example
 * loadFile('/library/Session.js')
 * 
 * @type null
 */
function loadFile(file) {
    if (!this.loadedFiles) {
        this.loadedFiles = {};
    }
    
    if (this.loadedFiles[file]) {
        return;
    }
    
    Titanium.include(file);
    this.loadedFiles[file] = true;
}

/**
 * Loads a view template by using Titanium.include. The difference is that this method works like an include_once.
 * The difference to loadFile is that this method will cache the complete function. Cause each view template includes
 * a function named template() we have to cache the function, otherwise we would overwrite a previous loaded template.
 * 
 * @param {string}  file   The path and name of the view file
 * 
 * @example
 * loadFile('/views/chart/show.js')
 * 
 * @returns {Function} The requested template
 */
function loadView (file) {
    if (!this.loadedFiles) {
        this.loadedFiles = {};
    }
    
    if (this.loadedFiles[file]) {
        return this.loadedFiles[file];
    }

    Titanium.include(file);

    if ('undefined' !== typeof template && template) {
        this.loadedFiles[file] = template;
    }
    
    return template;
}

loadFile('/model/AccountModel.js');

// variable globalWin will be available in each file and each context
var globalWin = Titanium.UI.currentWindow;

// do not close a Titanium.UI.Window when user presses the hardware back button, remove our own windows (view).
globalWin.addEventListener('android:back', function (event) {
    Log.debug('androidBack', 'master.js');

    // hack. we have to reset orientation if user presses back button while chart/fulldetail view is displayed
    Titanium.UI.currentWindow.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT]; 
    Titanium.UI.orientation                    = Titanium.UI.PORTRAIT;
    
    Window.close();
});

// save default period and date in session on app start. so we only have to work with session when we want to access 
// chosen period/date.
Session.set('piwik_parameter_period', Settings.getPiwikDefaultPeriod());
Session.set('piwik_parameter_date', Settings.getPiwikDefaultDate());

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

var hasActivatedAccount = accountManager.hasActivedAccount();
accountManager = null;

if (hasActivatedAccount) {
    // create root window    
    Window.createMvcWindow({jsController: 'index',
                            jsAction:     'index'});
                        
} else {
    // directly show manage accounts if user has not already setup an account
    Window.createMvcWindow({jsController: 'settings',
                            jsAction:     'manageaccounts'});
}
