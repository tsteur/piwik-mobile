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

    var box             = this.helper('borderedContainer', {});
    var headline        = this.helper('headline', {headline: _('UsersManager_ManageAccess')});
    
    box.subView.add(headline.subView);
    box.subView.top     = 5;
    box.subView.height  = parseInt(this.size.height, 10) - 10;
    
    this.add(box.subView);
    
    var _this = this;

    var onAddAccount = function () {
        Window.createMvcWindow({jsController: 'settings',
                                jsAction:     'createaccount'});
    };

    var onUpdateAccount = function () {
        Window.createMvcWindow({jsController: 'settings',
                                jsAction:     'updateaccount',
                                accountId:    this.accountId});
    };
    
    var onShowOptionMenu = function () {
        
        if (this.optionMenuOpened) {
            return;
        }
        
        this.optionMenuOpened = true;
        
        var menuItems = [_('General_Delete')];
        
        if (this.hasCheck) {
            menuItems.push(_('CorePluginsAdmin_Deactivate'));
        } else {
            menuItems.push(_('CorePluginsAdmin_Activate'));
        }
        
        menuItems.push(_('General_Edit'));
        
        var dialog = Titanium.UI.createOptionDialog({
            title: '' + this.accountName,
            options: menuItems,
            cancel:-1
        });
        
        var row = this;
        
        dialog.addEventListener('click', function (event) {
            row.optionMenuOpened = false;

            // android sets cancel = true whereas iPhone sets it to -1 if cancel was pressed
            if (event.cancel && -1 !== event.cancel) {
                
                return;
            }
            
            if (!row.accountId) {
            
                return;
            }
            
            switch (event.index) {
                case 0:
                    _this.accountManager.deleteAccount(row.accountId);
                    
                    Window.createMvcWindow({jsController:       'settings',
                                            jsAction:           'manageaccounts',
                                            closeCurrentWindow: true});
                                            
                    return;
                    
                case 1:
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
                    
                case 2:
                    onUpdateAccount.apply(row, []);
                
                    break;
            }
            
            // @todo throw a notification as soon as supported by titanium
            
            delete row;
        });
        
        dialog.show();
    };

    var tableData = [Ui_TableViewRow({className: 'settingsSection1',
                                      title: _('Mobile_AddAccount'),
                                      onClick: onAddAccount,
                                      hasChild: true})];
                                      
    var account = null;
    for (var index = 0; index < this.accounts.length; index++) {
        account = this.accounts[index];
        
        tableData.push(Ui_TableViewRow({className: 'settingsSection1',
                                        title: '' + account.name,
                                        description: account.accessUrl,
                                        accountId: account.id,
                                        accountName: '' + account.name,
                                        onClick: onUpdateAccount,
                                        onShowOptionMenu: onShowOptionMenu,
                                        hasCheck: Boolean(account.active)}));
    }
    
    var top       = headline.subView.height;
    var height    = box.subView.height - headline.subView.height;
    var tableview = Titanium.UI.createTableView({data: tableData,
                                                 left: 1,
                                                 right: 1,
                                                 top: top,
                                                 height: height,
                                                 touchEnabled: false,
                                                 separatorColor: '#eeedeb'});
    
    tableview.addEventListener('click', function (event) {

        if (!event || !event.rowData.onClick) {
            return;
        }
        
        event.rowData.onClick.apply(event.row, [event]);
    });
    
    box.subView.add(tableview);
    
    tableview.show();
    
    if (tableview.scrollToTop) {
        tableview.scrollToTop(1);
    }
}
