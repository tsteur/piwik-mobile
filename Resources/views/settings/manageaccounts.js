/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview View template settings/manageaccess.
 */

/**
 * View template. 
 *
 * @this {View}
 */
function template () {

    var _this        = this;
    var headline     = this.helper('headline', {headline: _('UsersManager_ManageAccess')});
    
    headline.addManageAccountChooser();
 
    this.add(headline.subView);    
    
    if ('android' != Ti.Platform.osname) {
        var removeIcon = Ti.UI.createImageView({image: 'images/icon/header_remove.png', 
                                                backgroundSelectedColor: '#FFC700',
                                                backgroundFocusedColor: '#FFC700',
                                                focusable: true,
                                                top: 0, 
                                                right: 47, 
                                                width: 47, 
                                                height: 40});
        
        removeIcon.addEventListener('click', function () {
            tableview.editing = !tableview.editing;
        });
        
        headline.subView.add(removeIcon);
    }

    var onUpdateAccount = function () {
        Window.createMvcWindow({jsController: 'settings',
                                jsAction:     'updateaccount',
                                accountId:    this.accountId});
    };
    
    var onShowOptionMenu = function (event) {

        if (this.optionMenuOpened) {
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
        
        var dialog = Titanium.UI.createOptionDialog({
            title: '' + this.accountName,
            options: menuItems,
            destructive: 2,
            cancel: 3
        });
        
        var row = this;
        
        dialog.addEventListener('click', function (event) {
            row.optionMenuOpened = false;

            // android sets cancel = true whereas iPhone sets it to -1 if cancel was pressed
            if (!event || event.cancel === event.index || true === event.cancel) {
                
                return;
            }
            
            if (!row.accountId) {
            
                return;
            }
            
            switch (event.index) {
                case 0:
                    var success = false;
                    
                    if (row.hasCheck) {
                        success = _this.accountManager.deactivateAccount(row.accountId);
                        
                        if (success) {
                            row.hasCheck = false;
                        }
                        
                    } else {
                        success = _this.accountManager.activateAccount(row.accountId);
                        
                        if (success) {
                            row.hasCheck = true;
                        }
                    }

                    break;
                    
                case 1:
                    onUpdateAccount.apply(row, []);
                
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

    var tableData  = [];

    var account    = null;
    for (var index = 0; index < this.accounts.length; index++) {
        account    = this.accounts[index];
        
        tableData.push(Ui_TableViewRow({className: 'settingsSection1',
                                        title: '' + account.name,
                                        description: account.accessUrl,
                                        accountId: account.id,
                                        accountName: '' + account.name,
                                        onClick: onUpdateAccount,
                                        rowIndex: index,
                                        onShowOptionMenu: onShowOptionMenu,
                                        hasCheck: Boolean(account.active)}));
    }
    
    var top       = headline.subView.height + headline.subView.top;
    var height    = this.height - top;
    
    var tableview = Titanium.UI.createTableView({data: tableData,
                                                 left: 0,
                                                 top: top,
                                                 height: height,
                                                 width: this.width,
                                                 focusable: true,
                                                 touchEnabled: false,
                                                 separatorColor: '#eeedeb'});
    
    tableview.addEventListener('click', function (event) {

        if (!event || !event.rowData || !event.rowData.onClick) {
            return;
        }
        
        event.rowData.onClick.apply(event.row, [event]);
    });
    
    tableview.addEventListener('delete', function (event) {

        if (!event || !event.row || !event.row.accountId) {}

        _this.accountManager.deleteAccount(event.row.accountId);
        
        if ('android' === Ti.Platform.osname) {
            // row will be automatically removed from tableview on iOS
            Window.createMvcWindow({jsController:       'settings',
                                    jsAction:           'manageaccounts',
                                    closeCurrentWindow: true});
        }
                                
        return;
    });
    
    this.add(tableview);
   
    tableview.show();
    
    if (tableview.scrollToTop) {
        tableview.scrollToTop(1);
    }
}
