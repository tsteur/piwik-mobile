/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'settings/editaccount.js' .
 */

/**
 * @class Provides the ability to add a new account or edit an already existing Piwik account. The user has to enter
 *        the website url of the Piwik server installation as well as the credentials in order to add or edit an
 *        account.
 *
 * @this     {Piwik.UI.Window}
 * @augments {Piwik.UI.Window}
 */
function window (params) {

    /**
     * @see Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: _('UsersManager_ManageAccess')};

    /**
     * @see Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {};
    
    var that          = this;

    // we'll display an activity indicator while verifying the entered account url+credentials.
    var activityIndicator = this.create('ActivityIndicator');
    var request           = Piwik.require('Network/AccountRequest');
    var scrollView        = Ti.UI.createScrollView({id: 'editAccountScrollView'});

    this.add(scrollView);
    
    var labelUrl = Ti.UI.createLabel({text: _('Mobile_AccessUrlLabel'), className: 'editAccountLabel'});
    var piwikUrl = Ti.UI.createTextField({
        className: 'editAccountTextField',
        value: '',
        hintText: _('General_ForExampleShort') + ' http(s)://demo.piwik.org/',
        keyboardType: Ti.UI.KEYBOARD_URL,
        returnKeyType: Ti.UI.RETURNKEY_NEXT,
        autocorrect: false,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
    });

    var labelAnonymous = Ti.UI.createLabel({text: _('Mobile_AnonymousAccess'), className: 'editAccountLabel'});
    var piwikAnonymous = Ti.UI.createSwitch({value: false, className: 'editAccountSwitch'});

    var labelUser = Ti.UI.createLabel({text: _('Login_Login'), className: 'editAccountLabel'});
    var piwikUser = Ti.UI.createTextField({
        className: 'editAccountTextField',
        value: '',
        autocorrect: false,
        keyboardType: Piwik.isAndroid ? Ti.UI.KEYBOARD_URL : Ti.UI.KEYBOARD_DEFAULT,
        returnKeyType: Ti.UI.RETURNKEY_NEXT,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
    });
    // use keyboard url above on android, otherwise it is not possible to deactivate autocorrect,
    // that's a bug in Titanium

    var labelPassword = Ti.UI.createLabel({text: _('Login_Password'), className: 'editAccountLabel'});
    var piwikPassword = Ti.UI.createTextField({
        className: 'editAccountTextField',
        value: '',
        passwordMask: true,
        autocorrect: false,
        keyboardType: Ti.UI.KEYBOARD_DEFAULT,
        returnKeyType: Ti.UI.RETURNKEY_DONE,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
    });

    piwikAnonymous.addEventListener('change', function (event) {

        if (!event) {
            Piwik.Log.warn('Missing piwikAnonymous change event', 'settings/editaccount::change');

            return;
        }

        // forces hide keyboard
        piwikUser.blur();
        piwikUrl.blur();
        piwikPassword.blur();

        if (event.value) {
            // anonymous was activated and is deactivated now
            piwikUser.value        = '';
            piwikPassword.value    = '';
        }

        // turn textfields on/off
        piwikUser.enabled      = !event.value;
        piwikUser.editable     = !event.value;
        piwikPassword.enabled  = !event.value;
        piwikPassword.editable = !event.value;
    });

    /**
     * Tries to save the account using the previous entered values. Triggers the activityIndicator show method.
     * We have to make sure the activityIndicator hide method will be triggered later.
     */
    var saveAccount = function () {
        activityIndicator.show(_('Mobile_VerifyAccount'));

        var account = {accessUrl: piwikUrl.value,
                       username:  piwikUser.value,
                       anonymous: piwikAnonymous.value,
                       password:  piwikPassword.value,
                       name:      piwikAnonymous.value ? _('Mobile_AnonymousAccess') : piwikUser.value};

        if (params && params.accountId) {
            account.id = params.accountId;
        }

        // send the request to verify the entered account values.
        request.send({account: account});
    };

    var save = Ti.UI.createButton({title:  _('General_Save'), className: 'editAccountSaveButton'});

    save.addEventListener('click', function ()
    {
        // forces hide keyboard
        piwikUser.blur();
        piwikUrl.blur();
        piwikPassword.blur();

        if (piwikUrl.value && 'http://' === piwikUrl.value.substr(0, 7)) {

            var alertDialog = Ti.UI.createAlertDialog({
                message: _("Mobile_HttpIsNotSecureWarning"),
                buttonNames: [_('SitesManager_Cancel_js'), _('General_Ok')],
                cancel: 0
            });

            alertDialog.show();

            alertDialog.addEventListener('click', function (event) {

                // has the user clicked the OK button?
                if (event && event.index) {
                    
                    saveAccount();

                    return;
                }

                // do not save account if user clicked the cancel button
            });

            return;
        }

        // save directly without confirmation if user entered a https address
        saveAccount();
    });

    scrollView.add(labelUrl);
    scrollView.add(piwikUrl);
    scrollView.add(labelAnonymous);
    scrollView.add(piwikAnonymous);
    scrollView.add(labelUser);
    scrollView.add(piwikUser);
    scrollView.add(labelPassword);
    scrollView.add(piwikPassword);
    scrollView.add(save);

    if (Piwik.isIos) {
        // on Android the user removes/hides the keyboard by pressing the hardware return button.
        // on iOS we have to handle that ourselves when the user presses outside of the current keyboard
        scrollView.addEventListener('singletap', function () {
            piwikUrl.blur();
            piwikUser.blur();
            piwikPassword.blur();
        });
    }

    piwikUrl.addEventListener('return', function(event) {
        if (piwikAnonymous.value) {

            // forces hide keyboard. Anonymous is enabled, user does not have to enter credentials. we can save the
            // account now
            piwikUrl.blur();

            // simulate save button click
            var myEvent = {};
            save.fireEvent('click', myEvent);

            return;
        }

        // automatically focus next text field
        piwikUser.focus();
    });

    piwikUser.addEventListener('return', function(event) {
        // automatically focus next text field
        piwikPassword.focus();
    });

    piwikPassword.addEventListener('return', function(event) {
        // forces hide keyboard
        piwikPassword.blur();

        // simulate a click on the save button.
        var myEvent = {};
        save.fireEvent('click', myEvent);
    });

    request.addEventListener('onInvalidUrl', function (event) {
        activityIndicator.hide();

        Piwik.getTracker().trackEvent({title: 'Account Invalid Url', url: '/account/edit/invalid-url'});

        var url = '';
        if (event && event.url) {
            url = '' + event.url;
        }

        var alertDialog = Ti.UI.createAlertDialog({
            title: _('General_Error'),
            message: String.format(_('SitesManager_ExceptionInvalidUrl'), '' + url),
            buttonNames: [_('General_Ok')]
        });

        alertDialog.show();
    });

    request.addEventListener('onMissingUsername', function () {
        activityIndicator.hide();

        Piwik.getTracker().trackEvent({title: 'Account Missing Username', url: '/account/edit/missing-username'});

        var alertDialog = Ti.UI.createAlertDialog({
            title: _('General_Error'),
            message: String.format(_('General_Required'), _('Login_Login')),
            buttonNames: [_('General_Ok')]
        });

        alertDialog.show();

        return;
    });

    request.addEventListener('onMissingPassword', function () {
        activityIndicator.hide();

        Piwik.getTracker().trackEvent({title: 'Account Missing Password', url: '/account/edit/missing-password'});

        var alertDialog = Ti.UI.createAlertDialog({
            title: _('General_Error'),
            message: String.format(_('General_Required'), _('Login_Password')),
            buttonNames: [_('General_Ok')]
        });

        alertDialog.show();

        return;
    });

    request.addEventListener('onReceiveAuthTokenError', function (event) {
        activityIndicator.hide();

        Piwik.getTracker().trackEvent({title: 'Account Receive Token Error', url: '/account/edit/receive-token-error'});

        if (event && !event.errorMessageSent) {

            var alertDialog = Ti.UI.createAlertDialog({
                title: _('General_Error'),
                message: _('Mobile_SaveSuccessError'),
                buttonNames: [_('General_Ok')]
            });

            alertDialog.show();
        }
    });

    request.addEventListener('onNoViewAccess', function (event) {
        activityIndicator.hide();

        Piwik.getTracker().trackEvent({title: 'Account No View Access', url: '/account/edit/no-view-access'});

        if (event && !event.errorMessageSent) {
            var alertDialog = Ti.UI.createAlertDialog({
                title: _('General_Error'),
                message: String.format(_('General_ExceptionPrivilegeAtLeastOneWebsite'), _('UsersManager_PrivView')),
                buttonNames: [_('General_Ok')]
            });

            alertDialog.show();
        }
    });

    request.addEventListener('onload', function (event) {
        activityIndicator.hide();

        if (event) {
            var trackingUrl = '/account/' + event.action + '/' + (event.success ? 'success' : 'error');
            Piwik.getTracker().trackEvent({title: 'Account ' + event.action, url: trackingUrl});
        }
        
        Piwik.getTracker().prepareVisitCustomVariables();

        // save and verify account was successful
        var alertDialog = Ti.UI.createAlertDialog({
            title: _('General_Done'),
            message: _('General_YourChangesHaveBeenSaved'),
            buttonNames: [_('General_Ok')]
        });

        // @todo display a notification instead of an alert dialog on Android (if supported by titanium)

        alertDialog.addEventListener('click', function () {

            if (Piwik.isIpad) {
                
                // update list of available websites and close currentwindow
                that.create('Window', {url: 'index/index.js',
                                       closeWindow: that});
                                       
            } else if (1 === Piwik.UI.layout.windows.length) {
                // this screen is the first Piwik window (in most cases the user started the app the first time),
                // open websites overview instead of closing this window.
                that.create('Window', {url: 'index/index.js',
                                       closeWindow: that});
            } else {

                // close this window, so user has the possibility to add another account or
                // something else. settings/manageaccounts will be visible afterwards.
                that.close();
            }
        });

        alertDialog.show();
    });

    /**
     * Pre fill previous created text fields with values if accountId is given and if this account exists.
     *
     * @param {Object}    params
     * @param {string}    [params.accountId]     Optional accountId in case of edit an account.
     */
    this.open = function (params) {

        if (!params || !params.accountId) {

            return;
        }

        var accountId      = params.accountId;
        
        var accountManager = Piwik.require('App/Accounts');
        var account        = accountManager.getAccountById(accountId);

        if (!account) {
            // @todo error alert message: the selected account is currently not editable or already deleted

            return;
        }

        // restore values
        if (account.tokenAuth && 'anonymous' == account.tokenAuth) {
            piwikAnonymous.fireEvent('change', {value: true});
            piwikAnonymous.value = true;
        }

        if (account.accessUrl) {
            piwikUrl.value  = account.accessUrl;
        }

        if (account.username) {
            piwikUser.value = account.username;
        }
    };
}