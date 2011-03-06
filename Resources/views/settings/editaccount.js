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
function template () {
    
    var left        = 10;
    var labelWidth  = parseInt(this.width, 10) - left - left - 20;
    
    var headline    = this.helper('headline', {headline: _('UsersManager_ManageAccess')});
    
    this.add(headline.subView);
    
    var top         = headline.subView.height;

    var scrollView  = Titanium.UI.createScrollView({
        width: this.width,
        height: this.height - top,
        contentWidth: 'auto',
        contentHeight: 'auto',
        layout: 'vertical',
        top: top,
        left: 0,
        right: 0,
        showVerticalScrollIndicator: false,
        showHorizontalScrollIndicator: false
    });
    
    this.add(scrollView);
    
    var labelUrl    = Titanium.UI.createLabel({
        text: _('Mobile_AccessUrlLabel'),
        height: 22,
        left: left,
        top: 10,
        width: labelWidth,
        color: config.theme.titleColor,
        font: {fontSize: 16}
    });
    
    var piwikUrl    = Titanium.UI.createTextField({
        color: config.theme.textColor,
        height: isAndroid ? 'auto' : 40,
        top: 4,
        left: left,
        right: left,
        value: '',
        hintText: _('General_ForExampleShort') + ' http(s)://demo.piwik.org/',
        keyboardType: Titanium.UI.KEYBOARD_URL,
        returnKeyType: Titanium.UI.RETURNKEY_NEXT,
        autocorrect: false,
        focusable: true,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED    
    });
    
    // There's a bug in Titanium 1.4 and previous versions when using autocapitalizations UrlKeyboard will not work. But
    // autocapitalization is deactivated on url keyboards on android by default.
    if (!isAndroid) {
        piwikUrl.autocapitalization = Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE;
    }
    
    var labelAnonymous  = Titanium.UI.createLabel({
        text: _('Mobile_AnonymousAccess'),
        height: 22,
        left: left,
        top: 10,
        width: labelWidth,
        color: config.theme.titleColor,
        font: {fontSize: 16}
    });
    
    var piwikAnonymous = Titanium.UI.createSwitch({
        top:  6,
        height: isAndroid ? 'auto' : 30,
        left: left,
        value: false,
        focusable: true
    });
    
    var labelUser  = Titanium.UI.createLabel({
        text: _('Login_Login'),
        height: 22,
        left: left,
        top: 10,
        width: labelWidth,
        color: config.theme.titleColor,
        font: {fontSize: 16}
    });
    
    var piwikUser = Titanium.UI.createTextField({
        color: config.theme.textColor,
        height: isAndroid ? 'auto' : 40,
        value: '',
        top: 4,
        left: left,
        right: left,
        keyboardType: isAndroid ? Titanium.UI.KEYBOARD_URL : Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_NEXT,
        autocorrect: false,
        focusable: true,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    
    if (!isAndroid) {
        // it seems that Titanium ignores 'autocapitalization' paramater on textfield creation and iOS devices
        piwikUser.autocapitalization = Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE;
    }
    
    var labelPassword  = Titanium.UI.createLabel({
        text: _('Login_Password'),
        height: 22,
        left: left,
        top: 10,
        width: labelWidth,
        color: config.theme.titleColor,
        font: {fontSize: 16}
    });
   
    var piwikPassword = Titanium.UI.createTextField({
        value: '',
        color: config.theme.textColor,
        height: isAndroid ? 'auto' : 40,
        top: 4,
        left: left,
        right: left,
        passwordMask: true,
        clearOnEdit: true,
        focusable: true,
        keyboardType: isAndroid ? Titanium.UI.KEYBOARD_URL : Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocorrect: false
    });
    
    if (!isAndroid) {
        // it seems that Titanium ignores 'autocapitalization' paramater on textfield creation and iOS devices
        piwikPassword.autocapitalization = Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE;
    }
    
    piwikAnonymous.addEventListener('change', function (event) {

        // forces hide keyboard
        piwikUser.blur();
        piwikUrl.blur();
        piwikPassword.blur();
        
        if (event.value) {
            // anonymous is activated
        
            piwikUser.value        = '';
            piwikUser.enabled      = false;
            piwikUser.editable     = false;
            piwikPassword.value    = '';
            piwikPassword.enabled  = false;
            piwikPassword.editable = false;
        
        } else {
            // anonymous is deactivated
            
            piwikUser.enabled      = true;
            piwikUser.editable     = true;
            piwikPassword.enabled  = true;
            piwikPassword.editable = true;
        
        }
    });
    
    // @todo set keyboard: Titanium.UI.KEYBOARD_PASSWORD should be supported in Titanium Mobile 1.5.0

    var win = this.view;
    
    var save  = Titanium.UI.createButton({
        title:  _('General_Save'),
        height: isAndroid ? 'auto' : 40,
        width:  205,
        left:   left,
        top:    13,
        focusable: true
    });
    
    // restore values
    if (this.piwikAuthToken && 'anonymous' == this.piwikAuthToken) {
        piwikAnonymous.fireEvent('change', {value: true});
        piwikAnonymous.value = true;
    }
    
    if (this.piwikUrl) {
        piwikUrl.value = this.piwikUrl;
    }
    
    if (this.piwikUser) {
        piwikUser.value = this.piwikUser;
    }
    
    var _this = this;
    
    save.addEventListener('click', function ()
    {
        // forces hide keyboard
        piwikUser.blur();
        piwikUrl.blur();
        piwikPassword.blur();
        
        if (!piwikUrl.value || 'http' !== piwikUrl.value.substr(0, 4).toLowerCase()) {
            
            var url = piwikUrl.value;
            if (!url) {
                url = '';
            }
            
            var alertDialog = Titanium.UI.createAlertDialog({
                title: _('General_Error'),
                message: String.format(_('SitesManager_ExceptionInvalidUrl'), '' + url),
                buttonNames: [_('General_Ok')]
            });
            
            alertDialog.show();
            
            return;
        }
        
        if ((!piwikUser.value || '' == piwikUser.value) && !piwikAnonymous.value) {

            var alertDialog = Titanium.UI.createAlertDialog({
                title: _('General_Error'),
                message: String.format(_('General_Required'), _('Login_Login')),
                buttonNames: [_('General_Ok')]
            });

            alertDialog.show();
            
            return;
        }
        
        if ((!piwikPassword.value || '' == piwikPassword.value) && !piwikAnonymous.value) {

            var alertDialog = Titanium.UI.createAlertDialog({
                title: _('General_Error'),
                message: String.format(_('General_Required'), _('Login_Password')),
                buttonNames: [_('General_Ok')]
            });

            alertDialog.show();
            
            return;
        }
        
        if (piwikUrl.value) {
            var lastUrlChar = piwikUrl.value.substr(piwikUrl.value.length - 1, 1);
            
            if ('/' !== lastUrlChar) {
                piwikUrl.value = piwikUrl.value + '/';
            }
        }
        
        _this.showWaitIndicator();
    
        // is called when auth token is successfully received. -> we do receive an auth_token even if user credentials
        // are not valid. we have to verify the token with another request therefore.
        var onReceiveAuthTokenSuccess = function (token) {
            
            var account = {accessUrl: piwikUrl.value,
                           username:  piwikUser.value,
                           tokenAuth: token,
                           name:      piwikUser.value};

            if (token && 'anonymous' == token) {
                account.name = _('Mobile_AnonymousAccess');
            }
            
            if (!_this.accountId) {
                // account doesn't already exist. we have to create the account and activate the account by default
                account.active  = 1;
            }
            
            /**
             * trigger piwik version compare only if save auth token was successful. it is possible that the window is 
             * already closed or in background till the possible information - alert - is displayed.
             */
            _this.comparePiwikVersion();
            
            // this ensures an error message will be displayed everytime the user presses save.
            // otherwise a possible error message will appear only once.
            _this.piwik.errorMessageSent = false;
            
            // verify token_auth, user should have at least view access
            _this.piwik.send('SitesManager.getSitesIdWithAtLeastViewAccess', {}, account, function (response) {

                _this.hideWaitIndicator();
            
                if (!response || !(response instanceof Array) || 0 == response.length) {
            
                    if (!_this.piwik.errorMessageSent) {
                        var alertDialog = Titanium.UI.createAlertDialog({
                            title: _('General_Error'),
                            message: String.format(_('General_ExceptionPrivilegeAtLeastOneWebsite'), _('UsersManager_PrivView')),
                            buttonNames: [_('General_Ok')]
                        });
            
                        alertDialog.show();
                    }
                    
                    return;
                    
                } 
                
                if (_this.accountId) {
                    _this.accountManager.updateAccount(_this.accountId, account);
                } else {
                    _this.accountId = _this.accountManager.createAccount(account);
                }
            
                var alertDialog = Titanium.UI.createAlertDialog({
                    title: _('General_Done'),
                    message: _('General_YourChangesHaveBeenSaved'),
                    buttonNames: [_('General_Ok')]
                });
                
                alertDialog.addEventListener('click', function (event) {
                    Window.createMvcWindow({jsController: 'index',
                                            jsAction:     'index',
                                            closeAllPreviousOpenedWindows: true,
                                            exitOnClose:  true});
                });
                
                alertDialog.show();
            });
        };
        
        // is called on any error while trying to fetchAuthToken
        var onReceiveAuthTokenError = function () {
        
            _this.hideWaitIndicator();
            
            // we save the default token in such a case.
            Settings.setPiwikUserAuthToken('');
            
            if (!_this.piwik.errorMessageSent) {
    
                var alertDialog = Titanium.UI.createAlertDialog({
                    title: _('General_Error'),
                    message: _('Mobile_SaveSuccessError'),
                    buttonNames: [_('General_Ok')]
                });
    
                alertDialog.show();
            }
        };
        
        if (piwikAnonymous.value) {
            
            onReceiveAuthTokenSuccess('anonymous');
            
            return;
        }
        
        var parameter = {userLogin:   piwikUser.value,
                         md5Password: Titanium.Utils.md5HexDigest(piwikPassword.value)};
        
        _this.piwik.send('UsersManager.getTokenAuth', parameter, {accessUrl: piwikUrl.value}, function (response) {
        
            if (!response || !(response instanceof Object) || !response.value) {
    
                onReceiveAuthTokenError();
                
                return;
            }
            
            onReceiveAuthTokenSuccess(response.value);
        });
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
    
    if (isAndroid) {
        // this ensures the user can scroll and the textfield is visilbe while entering something via keyboard
        // otherwise the keyboard maybe hides the text field(s)
        if (save.center && save.center.y) {
            scrollView.contentHeight = parseInt(save.center.y, 10) * 2;
        } else {
            scrollView.contentHeight = 2000;
        }
        
        piwikPassword.addEventListener('focus', function (event) {
            if (labelPassword.center && labelPassword.center.y) {
                scrollView.scrollTo(0, parseInt(labelPassword.center.y, 10) - 20);
            }
        });
        
        piwikUser.addEventListener('focus', function (event) {
            if (labelUser.center && labelUser.center.y) {
                scrollView.scrollTo(0, parseInt(labelUser.center.y, 10) - 20);
            }
        }); 
    }
    
    piwikUrl.addEventListener('return', function(event){
        if (piwikAnonymous.value) {
        
            // forces hide keyboard
            piwikUrl.blur();
            
            var myEvent = {};
            save.fireEvent('click', myEvent);
            
            return;
        }
        
        piwikUser.focus();
    });
    
    piwikUser.addEventListener('return', function(event){
        piwikPassword.focus();
    });
    
    piwikPassword.addEventListener('return', function(event){
        // forces hide keyboard
        piwikPassword.blur();
        
        var myEvent = {};
        save.fireEvent('click', myEvent);
    });
}

