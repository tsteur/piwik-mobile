/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'settings/manageaccounts.js' .
 */

/**
 * @class Provides the ability to manage all existing accounts. The user has the ability to delete or to select an
 *        existing account on iOS. On Android the user is able to delete, activate, deactivate or to select an existing
 *        account by pressing the row for at least about a second (onShowOptionMenu).
 *
 * @this     {Piwik.UI.Window}
 * @augments {Piwik.UI.Window}
 */
function window () {

    /**
     * @see Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: _('UsersManager_ManageAccess')};

    /**
     * @see Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {addAccountChooser: true};

    var that          = this;
    
    var onUpdateAccount = function () {
        // will be executed in row context, therefore this == Piwik.UI.TableViewRow
        Piwik.UI.createWindow({url: 'settings/editaccount.js',
                               accountId: this.accountId});
    };
    
    var onShowOptionMenu = function (event) {

        if (this.optionMenuOpened) {
            // make sure the option menu will not be opened more than once at the same time. Value will be set to false
            // somewhere further below on option menu close
            
            return;
        }
        
        this.optionMenuOpened = true;
        var menuItems         = [];
        
        if (this.hasCheck) {
            menuItems.push(_('CorePluginsAdmin_Deactivate'));
        } else {
            menuItems.push(_('CorePluginsAdmin_Activate'));
        }
        
        menuItems.push(_('General_Edit'));
        menuItems.push(_('General_Delete'));
        menuItems.push(_('SitesManager_Cancel_js'));
        
        var dialog = Ti.UI.createOptionDialog({
            title: '' + this.accountName,
            options: menuItems,
            destructive: 2,
            cancel: 3
        });
        
        var row    = this;
        
        dialog.addEventListener('click', function (event) {
            // close option menu

            // reset menu opened status so that it is possibly to open option menu again
            row.optionMenuOpened = false;

            if (!event || event.cancel === event.index || true === event.cancel) {
                
                return;
            }
            
            if (!row.accountId) {
            
                return;
            }
            
            switch (event.index) {
                case 0:
                    var success        = false;
                    var accountManager = Piwik.require('App/Accounts');
                    
                    if (row.hasCheck) {
                        success      = accountManager.deactivateAccount(row.accountId);
                    } else {
                        success      = accountManager.activateAccount(row.accountId);
                    }

                    if (success) {
                        row.hasCheck = !row.hasCheck;
                    }
                        
                    break;
                    
                case 1:
                    onUpdateAccount.apply(row, [row.accountId]);
                
                    break;
                    
                case 2:
                    tableview.fireEvent('delete', {detail: false, row: row});

                    return;
            }
            
            // @todo throw a notification as soon as supported by titanium
            
            row = null;
        });

        dialog.show();
    };

    var tableview = Ti.UI.createTableView({id: 'manageAccountsTableView',
                                           editable: true});

    // user has selected an account
    tableview.addEventListener('click', function (event) {

        if (!event || !event.rowData || !event.rowData.onClick) {
            return;
        }

        event.rowData.onClick.apply(event.row, [event]);
    });

    // delete an account
    tableview.addEventListener('delete', function (event) {

        if (!event || !event.row || !event.row.accountId) {}

        var accountManager = Piwik.require('App/Accounts');
        accountManager.deleteAccount(event.row.accountId);

        if (Piwik.isAndroid) {
            // row will be automatically removed from tableview on iOS, not on android. therefore make a simple reload
            that.open();
        }
    });

    this.add(tableview);

    this.addEventListener('onopen', function (event) {

        if (!event || !event.accounts || !event.accounts.length) {
            return;
        }

        var tableData  = [];

        var account    = null;
        for (var index = 0; index < event.accounts.length; index++) {
            account    = event.accounts[index];

            tableData.push(Piwik.UI.createTableViewRow({className: 'manageAccountsRow',
                                                        title: '' + account.name,
                                                        description: account.accessUrl,
                                                        accountId: account.id,
                                                        accountName: '' + account.name,
                                                        onClick: onUpdateAccount,
                                                        rowIndex: index,
                                                        onShowOptionMenu: onShowOptionMenu,
                                                        hasCheck: Boolean(account.active)}));
        }

        tableview.setData(tableData);
    
        if (Piwik.isIos) {
            var editButton = Ti.UI.createButton({systemButton: Ti.UI.iPhone.SystemButton.EDIT});
            Ti.UI.currentWindow.leftNavButton = editButton;

            editButton.addEventListener('click', function () {
                tableview.editing = !tableview.editing;
            });
        }

        if (Piwik.isIos && tableview.scrollToTop) {
            // make sure the first row is visible on iPad
            tableview.scrollToTop(1);
        }
    });

    this.addEventListener('focusWindow', function () {
        // update account list whenever window gets the focus (for example after saving an account). Makes sure an
        // previously added account is directly visible.
        tableview.setData([]);
        
        that.open();
    });

    /**
     * Get current settings and fire the onopen event. Since there is no network request to get the current settings
     * we could also get these values right on top of the window method and use them directly. But by querying the data
     * set in the open method, we have the opportunity to call the open method again and can therefore easily reload
     * the view. For example after deleting an account.
     */
    this.open = function () {
        var eventResult      = {type: 'onopen'};
        var accountManager   = Piwik.require('App/Accounts');

        eventResult.accounts = accountManager.getAccounts();

        this.fireEvent('onopen', eventResult);
    };
}