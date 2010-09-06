/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview View template settings/index.
 */

/**
 * View template. 
 *
 * @this {View}
 */
function template () {

    var _this = this;
    
    var availableLanguageOptions = [];
    var currentLanguage          = '';
    var name;
    for(var langCode in this.availableLanguages) {
        
        name = this.availableLanguages[langCode];
        
        availableLanguageOptions.push(name);
        
        if((this.piwikLanguage && this.piwikLanguage == langCode) || 
          (!this.piwikLanguage && Translation.getPlatformLocale() == langCode)) {
            currentLanguage = name;
        }
        
    }
    
    availableLanguageOptions.sort();
    
    var box             = this.helper('borderedContainer', {});
    var headline        = this.helper('headline', {headline: _('General_Settings'),
                                                  settingsButtonHidden: true});
    
    box.subView.add(headline.subView);
    box.subView.top     = 5;
    box.subView.height  = parseInt(this.size.height, 10) - 10;
    
    this.add(box.subView);

    var onChangeSparkline = function (event) {
    
        if (this.hasCheck) {
            this.hasCheck = false; 
        } else {
            this.hasCheck = true;
        }
        
        Settings.setPiwikMultiChart(this.hasCheck);
    };
    
    var onChangeGraphs = function (event) {
    
        if (this.hasCheck) {
            this.hasCheck = false; 
        } else {
            this.hasCheck = true;
        }
        
        Settings.setGraphsEnabled(this.hasCheck);
    };
    
    var onChangeLanguage = function (event) {
        
        var langDialog = Titanium.UI.createOptionDialog({
            title: _('General_ChooseLanguage'),
            options: availableLanguageOptions
        });
        
        var row = this;
        
        langDialog.addEventListener('click', function (event) {
            
            if (event.cancel && -1 !== event.cancel) {
                return;
            }
            
            row.changeValue(availableLanguageOptions[event.index]);

            for(var langCode in _this.availableLanguages) {
                if(availableLanguageOptions[event.index] == _this.availableLanguages[langCode]) {
                    Settings.setLanguage(langCode);
        
                    Translation.fetchTranslations();
                    break;
                }
            }
        });
        
        langDialog.show();
    };
    
    var onManageAccess = function () {
        Window.createMvcWindow({jsController: 'settings',
                                jsAction:     'access'});
    };

    var tableData = [Ui_TableViewRow({className: 'settingsSection1',
                                      title: _('UsersManager_ManageAccess'),
                                      onClick: onManageAccess,
                                      hasChild: true}),
                     Ui_TableViewRow({className: 'settingsSection1',
                                       title: _('General_Language'),
                                       onClick: onChangeLanguage,
                                       value: currentLanguage,
                                       hasChild: true}),
                     Ui_TableViewRow({className: 'settingsSection2',
                                      title: _('Mobile_MultiChartLabel'),
                                      onClick: onChangeSparkline,
                                      hasCheck: this.piwikMultiCharts}),
                     Ui_TableViewRow({className: 'settingsSection2',
                                      title: _('Mobile_EnableGraphsLabel'),
                                      onClick: onChangeGraphs,
                                      hasCheck: this.graphsEnabled})];
    
    var top       = headline.subView.height;
    var height    = box.subView.height - headline.subView.height;
    var tableview = Titanium.UI.createTableView({data: tableData,
                                                 left: 1,
                                                 right: 1,
                                                 top: top,
                                                 height: height,
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
