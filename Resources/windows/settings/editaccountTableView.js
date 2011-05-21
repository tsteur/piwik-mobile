/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview View template settings/editaccount.
 */

/**
 * View template. 
 *
 * @this {View}
 */
function window () {

    this.titleOptions = {title: _('UsersManager_ManageAccess')};
    this.menuOptions  = {};
    
    var activityIndicator = Piwik.UI.createActivityIndicator();
    var request           = Piwik.require('Network/AccountRequest');
    var scrollView        = Ti.UI.createTableView({style: 1});

    this.add(scrollView);
    
    var labelUrl = Ti.UI.createLabel({text: _('Mobile_AccessUrlLabel'), className: 'editAccountLabel'});
    var piwikUrl = Ti.UI.createTextField({
        value: '',
        hintText: _('General_ForExampleShort') + ' http(s)://demo.piwik.org/',
        keyboardType: Ti.UI.KEYBOARD_URL,
        returnKeyType: Ti.UI.RETURNKEY_NEXT,
        autocorrect: false,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        right: 10,
        width: 200
    });
    
    var labelAnonymous = Ti.UI.createLabel({text: _('Mobile_AnonymousAccess'), className: 'editAccountLabel'});
    var piwikAnonymous = Ti.UI.createSwitch({value: false, right: 10});

    var labelUser = Ti.UI.createLabel({text: _('Login_Login'), className: 'editAccountLabel'});
    var piwikUser = Ti.UI.createTextField({
        value: '',
        autocorrect: false,
        keyboardType: Piwik.isAndroid ? Ti.UI.KEYBOARD_URL : Ti.UI.KEYBOARD_DEFAULT,
        returnKeyType: Ti.UI.RETURNKEY_NEXT,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        right: 10,
        width: 200
    });
    // use keyboard url above on android, otherwise it is not possible to deactivate autocorrect, that's a bug in Titanium

    
    var labelPassword = Ti.UI.createLabel({text: _('Login_Password'), className: 'editAccountLabel'});
    var piwikPassword = Ti.UI.createTextField({
        className: 'editAccountTextField',
        value: '',
        passwordMask: true,
        clearOnEdit: true,
        autocorrect: false,
        keyboardType: Ti.UI.KEYBOARD_DEFAULT,
        returnKeyType: Ti.UI.RETURNKEY_DONE,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        right: 10,
        width: 200
    });
    
    piwikAnonymous.addEventListener('change', function (event) {

        // forces hide keyboard
        piwikUser.blur();
        piwikUrl.blur();
        piwikPassword.blur();
        
        if (event.value) {
            // anonymous was activated
            piwikUser.value        = '';
            piwikUser.enabled      = false;
            piwikUser.editable     = false;
            piwikPassword.value    = '';
            piwikPassword.enabled  = false;
            piwikPassword.editable = false;
        
        } else {
            // anonymous was deactivated
            piwikUser.enabled      = true;
            piwikUser.editable     = true;
            piwikPassword.enabled  = true;
            piwikPassword.editable = true;
        }
    });

    var saveAccount = function () {
        activityIndicator.show(_('Mobile_VerifyAccount'));

        var account = {accessUrl: piwikUrl.value,
                       username:  piwikUser.value,
                       anonymous: piwikAnonymous.value,
                       password:  piwikPassword.value,
                       name:      piwikAnonymous.value ? _('Mobile_AnonymousAccess') : piwikUser.value};

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
                message: _("Your Piwik authToken is sent in clear text if you use 'HTTP'. For this reason we recommend HTTPS for secure transport of data over the internet. Do you want to proceed?"),
                buttonNames: [_('SitesManager_Cancel_js'), _('General_Ok')],
                cancel: 0
            });

            alertDialog.show();

            alertDialog.addEventListener('click', function (event) {

                if (event && event.index) {
                    saveAccount();
                }
            });

            return;
        }

        saveAccount();
    });
    var v = Ti.UI.createTableViewRow({title: 'Piwik Url'});
    v.add(piwikUrl);
    var w = Ti.UI.createTableViewRow({title: 'Anonymous'});
    w.add(piwikAnonymous);
    var x = Ti.UI.createTableViewRow({title: 'Username'});
    x.add(piwikUser);
    var y = Ti.UI.createTableViewRow({title: 'Password'});
    y.add(piwikPassword);
    var z = Ti.UI.createTableViewRow();
    z.add(save);
 //   scrollView.add(labelUrl);
//    scrollView.appendRow(v);
  //  scrollView.add(labelAnonymous);
  //  scrollView.appendRow(w);
 //   scrollView.add(labelUser);
  //  scrollView.appendRow(x);
  //  scrollView.add(labelPassword);
 //   scrollView.appendRow(y);
 //   scrollView.appendRow(save);
    var se1 = Ti.UI.createTableViewSection({headerTitle: 'Account', footerTitle: 'BliBla Blubber'});

    scrollView.setData([se1, v, w, x, y , z]);

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

            // forces hide keyboard
            piwikUrl.blur();

            var myEvent = {};
            save.fireEvent('click', myEvent);

            return;
        }

        piwikUser.focus();
    });

    piwikUser.addEventListener('return', function(event) {
        piwikPassword.focus();
    });

    piwikPassword.addEventListener('return', function(event) {
        // forces hide keyboard
        piwikPassword.blur();

        var myEvent = {};
        save.fireEvent('click', myEvent);
    });

    request.addEventListener('onInvalidUrl', function (event) {
        activityIndicator.hide();

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

        if (event && !event.errorMessageSent) {
            var alertDialog = Ti.UI.createAlertDialog({
                title: _('General_Error'),
                message: String.format(_('General_ExceptionPrivilegeAtLeastOneWebsite'), _('UsersManager_PrivView')),
                buttonNames: [_('General_Ok')]
            });

            alertDialog.show();
        }
    });

    request.addEventListener('onload', function () {
        activityIndicator.hide();
        
        var alertDialog = Ti.UI.createAlertDialog({
            title: _('General_Done'),
            message: _('General_YourChangesHaveBeenSaved'),
            buttonNames: [_('General_Ok')]
        });

        alertDialog.addEventListener('click', function (event) {

            if (1 === Piwik.UI.layout.windows.length) {
                // this screen was the first window (in most cases the user started the app the first time),
                // open websites overview instead of closing this window.
                Piwik.UI.createWindow({url: 'index/index.js',
                                       closeCurrentWindow: true});
            } else {
                // close this window, so user has the possiblity to add another account or something else (manageaccounts)
                Piwik.UI.currentWindow.close();
            }
        });

        alertDialog.show();
    });

    this.open = function (params) {

        var accountId = params.accountId;

        if (!accountId) {

            return;
        }

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