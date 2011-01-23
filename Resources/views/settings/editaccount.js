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
        top: top,
        left: 0,
        right: 0,
        showVerticalScrollIndicator: false,
        showHorizontalScrollIndicator: false
    });
    
    this.add(scrollView);
    
    top = 10;
    var labelUrl    = Titanium.UI.createLabel({
        text: _('Mobile_AccessUrlLabel'),
        height: 20,
        left: left,
        top: top,
        width: labelWidth,
        color: config.theme.titleColor,
        font: {fontSize: config.theme.fontSizeNormal}
    });
    
    top = top + 25;
    var piwikUrl    = Titanium.UI.createTextField({
        color: config.theme.textColor,
        height: 35,
        top: top,
        left: left,
        right: left,
        value: '',
        hintText: _('General_ForExampleShort') + ' http(s)://demo.piwik.org/',
        keyboardType: Titanium.UI.KEYBOARD_URL,
        returnKeyType: Titanium.UI.RETURNKEY_NEXT,
        autocorrect: false,
        focusable: true,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        font: {fontSize: config.theme.fontSizeNormal}
    });
    
    // There's a bug in Titanium 1.4 and previous versions when using autocapitalizations UrlKeyboard will not work. But
    // autocapitalization is deactivated on url keyboards on android by default.
    if ('android' !== Titanium.Platform.osname) {
        piwikUrl.autocapitalization = Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE;
    }
    
    top = top + 40;
    var labelAnonymous  = Titanium.UI.createLabel({
        text: _('Mobile_AnonymousAccess'),
        height: 20,
        left: left,
        top: top,
        width: labelWidth,
        color: config.theme.titleColor,
        font: {fontSize:config.theme.fontSizeNormal}
    });
    
    top = top + 28;
    var piwikAnonymous = Titanium.UI.createSwitch({
        top:  top,
        height: 25,
        left: left,
        value: false,
        focusable: true
    });
    
    top = top + 32;
    var labelUser  = Titanium.UI.createLabel({
        text: _('Login_Login'),
        height: 20,
        left: left,
        top: top,
        width: labelWidth,
        color: config.theme.titleColor,
        font: {fontSize: config.theme.fontSizeNormal}
    });
    
    top = top + 25;
    var piwikUser = Titanium.UI.createTextField({
        color: config.theme.textColor,
        height: 35,
        value: '',
        top: top,
        left: left,
        right: left,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_NEXT,
        autocorrect: false,
        focusable: true,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
        font: {fontSize: config.theme.fontSizeNormal}
    });
    
    if ('android' !== Titanium.Platform.osname) {
        // it seems that Titanium ignores 'autocapitalization' paramater on textfield creation and iOS devices
        piwikUser.autocapitalization = Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE;
    }
    
    top = top + 40;
    var labelPassword  = Titanium.UI.createLabel({
        text: _('Login_Password'),
        height: 20,
        left: left,
        top: top,
        width: labelWidth,
        color: config.theme.titleColor,
        font: {fontSize: config.theme.fontSizeNormal}
    });
    
    top = top + 25;
    var piwikPassword = Titanium.UI.createTextField({
        value: '',
        color: config.theme.textColor,
        height: 35,
        top: top,
        left: left,
        right: left,
        passwordMask: true,
        clearOnEdit: true,
        focusable: true,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
        font: {fontSize: config.theme.fontSizeNormal}
    });
    
    piwikAnonymous.addEventListener('change', function (event) {

        if (event.value) {
            // anonymous is activated
        
            piwikUser.value       = '';
            piwikUser.enabled     = false;
            piwikPassword.value   = '';
            piwikPassword.enabled = false;
        
        } else {
            // anonymous is deactivated
            
            piwikUser.enabled     = true;
            piwikPassword.enabled = true;
        
        }
    });
    
    // @todo set keyboard: Titanium.UI.KEYBOARD_PASSWORD should be supported in Titanium Mobile 1.5.0

    var win = this.view;

    top = top + 45;
    var separator = Titanium.UI.createView({
        height: 1,
        left: 0,
        right: 0,
        top: top,
        borderWidth: 0,
        backgroundColor: '#908A7C',
        zIndex: 3
    });
    
    top = top + 10;
    var save  = Titanium.UI.createButton({
        title:  _('General_Save'),
        height: 35,
        width:  205,
        left:   left,
        top:    top,
        color: '#D17D2A',
        backgroundColor: '#F6F6F6',
        borderRadius: config.theme.borderRadius,
        selectedColor: config.theme.titleColor,
        focusable: true,
        borderColor: '#ECEDEC',
        borderWidth: 1,
        font: {fontSize:config.theme.fontSizeNormal, fontWeight: 'bold'}
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
                message: _('SitesManager_ExceptionInvalidUrl').replace('%s', url),
                buttonNames: [_('General_Ok')]
            });
            
            alertDialog.show();
            
            return;
        }
        
        if ((!piwikUser.value || '' == piwikUser.value) && !piwikAnonymous.value) {

            var alertDialog = Titanium.UI.createAlertDialog({
                title: _('General_Error'),
                message: _('General_Required').replace('%s', _('Login_Login')),
                buttonNames: [_('General_Ok')]
            });

            alertDialog.show();
            
            return;
        }
        
        if ((!piwikPassword.value || '' == piwikPassword.value) && !piwikAnonymous.value) {

            var alertDialog = Titanium.UI.createAlertDialog({
                title: _('General_Error'),
                message: _('General_Required').replace('%s', _('Login_Password')),
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
                            message: _('General_ExceptionPrivilegeAtLeastOneWebsite').replace('%s', _('UsersManager_PrivView')),
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
    scrollView.add(separator);
    scrollView.add(save);
    
    if ('android' == Ti.Platform.osname) {
        // this ensures the user can scroll and the textfield is visilbe while entering something via keyboard
        // otherwise the keyboard maybe hides the text field(s)
        scrollView.contentHeight = (save.top + save.height) * 2;
        
        piwikPassword.addEventListener('focus', function (event) {
            scrollView.scrollTo(0, labelPassword.top);
        });
        
        piwikUser.addEventListener('focus', function (event) {
            scrollView.scrollTo(0, labelUser.top);
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
