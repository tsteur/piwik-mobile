/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    Contains settings related stuff.
 *              
 * @augments ActionController
 */
function SettingsController () {

    /**
     * Default action. Lets the user set up settings like language.
     * 
     * @type null
     */
    this.indexAction = function () {
        
        this.view.piwikMultiCharts    = Settings.getPiwikMultiChart();
        this.view.piwikLanguage       = Settings.getLanguage();
        this.view.graphsEnabled       = Settings.getGraphsEnabled();
        this.view.availableLanguages  = Translation.getAvailableLanguages();
        
        this.render('index');
    };

    /**
     * Access action. Lets the user manage access like the domain, username and password.
     * 
     * @type null
     */
    this.manageaccountsAction = function () {
        
        var accountManager       = this.getModel('Account');
        
        this.view.accounts       = accountManager.getAccounts();
        this.view.accountManager = accountManager;
        
        this.render('manageaccounts');
    };

    /**
     * Create a new account.
     * 
     * @type null
     */
    this.createaccountAction = function () {

        this.view.piwikUrl          = '';
        this.view.piwikUser         = '';
        this.view.piwikPassword     = '';
        this.view.piwikAuthToken    = '';
        this.view.accountId         = null;

        this.view.piwik               = this.getModel('Piwik');
        // create another piwikModel instance cause we want to disable sendErrors
        this.view.piwikApiCheck       = this.getModel('Piwik');
        this.view.accountManager      = this.getModel('Account');
        this.view.comparePiwikVersion = this.requestVersion;

        /**
         * prefetching latest version number. execute request in background and do not wait. we need this value later 
         * as soon as the user fires the  save button. we are fetching this already here to have a better performance 
         * while requesting the users piwik version.
         */
        this.requestLatestVersion();
        
        this.render('editaccount');
    };

    /**
     * Update an existing account.
     * 
     * @type null
     */
    this.updateaccountAction = function () {
        
        var accountId = this.getParam('accountId');
        
        if (!accountId) {

            var alertDialog = Titanium.UI.createAlertDialog({
                title: _('General_Error'),
                message: _('General_ErrorRequest'),
                buttonNames: [_('General_Ok')]
            });

            alertDialog.show();
            
            this.view.close();
            
            return;
        } 

        var accountManager       = this.getModel('Account');
        var account              = accountManager.getAccountById(accountId);
        this.view.piwikUrl       = account.accessUrl;
        this.view.piwikUser      = account.username;
        this.view.piwikAuthToken = account.tokenAuth;
        this.view.accountId      = accountId;
        
        this.view.piwik               = this.getModel('Piwik');
        // create another piwikModel instance cause we want to disable sendErrors
        this.view.piwikApiCheck       = this.getModel('Piwik');
        this.view.accountManager      = this.getModel('Account');
        this.view.comparePiwikVersion = this.requestVersion;

        /**
         * prefetching latest version number. execute request in background and do not wait. we need this value later 
         * as soon as the user fires the  save button. we are fetching this already here to have a better performance 
         * while requesting the users piwik version.
         */
        this.requestLatestVersion();
        
        this.render('editaccount');
    };
    
    /**
     * Requests the version number of the user's piwik installation and compares it with the latest version
     * number. Informs the user if there is a newer version is available. It does not always work. It is possible
     * that eg. the user has deactivated ExampleApi. Another possible reason is that the request to fetch the 
     * latest version number is running - or an error occurred - while this request is already finished. 
     * We could wait in such a case but we prefer a simpler version at the moment.
     * It must be pointed out that this method will be executed within the view. Therefore we are in 'View' context.
     * 
     * @type null
     */
    this.requestVersion = function () {

        /**
         * disable the display of error messages in this case. the worst case will be the user does not get informed 
         * if the latest version of piwik is not installed
         */
        this.piwikApiCheck.sendErrors = false;
        
        var _this          = this;
        var account        = this.accountManager.getAccountById(this.accountId);
        
        this.piwikApiCheck.send('ExampleAPI.getPiwikVersion', {}, account, function (response) {

            if (!response) {
            
                return;
            }
            
            if (response && response.result && 'error' == response.result) {
                // in most cases the ExampleApi is deactivated or token_auth is not valid
            
                Log.debug('Compare Version error, message: ' + response.message, 'Piwik');
                
                return;
            }

            if (response && response.value && _this.latestVersion) {
            
                // response.value is for example "0.6.4-rc1" or "0.6.3"
                var version       = response.value + '';
                var latestVersion = _this.latestVersion + '';
                
                // compare only first six chars and ignore all dots -> from 0.6.4-rc1 to 064
                version           = version.substr(0, 5).replace(/\./g, '');
                latestVersion     = latestVersion.substr(0, 5).replace(/\./g, '');
                
                // radix is very important in this case, otherwise eg. 064 octal is 52 decimal
                version           = parseInt(version, 10);
                latestVersion     = parseInt(latestVersion, 10);
                
                if (10 > version) {
                    // version number is smaller than 10 if version is e.g. 0.7 instead of 0.7.0 and instead of 70 it is
                    // only 7. Otherwise we run into a bug where 0.6.4 (64) is greather than 0.7 (7).
                    version = version * 10;
                }
                
                if (10 > latestVersion) {
                    latestVersion = latestVersion * 10;
                }

                if (version && latestVersion && latestVersion > version) {
                    Log.debug('Version is out of date: ' + version, 'SettingsController');

                    // @todo create translation key
                    var alertDialog = Titanium.UI.createAlertDialog({
                        title: _('General_PleaseUpdatePiwik'),
                        message: _('General_PiwikXIsAvailablePleaseNotifyPiwikAdmin').replace('%s', _this.latestVersion),
                        buttonNames: [_('General_Ok')]
                    });

                    alertDialog.show();
                }
            }
            
        });
    };
    
    /**
     * Requests the latest version number of piwik. This value is needed to be able to compare it with the version
     * number of the user's piwik installation.
     * 
     * @type null
     */
    this.requestLatestVersion = function () {
        
        var _this   = this;

        var request = new HttpRequest();
        
        /**
         * disable the display of error messages in this case. the worst case will be the user does not get informed 
         * if the latest version of piwik is not installed
         */
        request.sendErrors = false;
        
        request.setBaseUrl('http://api.piwik.org/1.0/getLatestVersion/');
        request.handle({trigger: 'MobileClient-' + Titanium.Platform.osname,
                        mobile_version: Titanium.Platform.version}, function (response) {
                        
            if (!response) {
                return;
            }
       
            _this.view.latestVersion = response;
       
        });
    };
    
}

SettingsController.prototype = new ActionController();
