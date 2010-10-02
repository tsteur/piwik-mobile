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
    var currentLanguage          = 'English';
    var name;
    for(var langCode in this.availableLanguages) {
        
        name = this.availableLanguages[langCode];
        
        availableLanguageOptions.push(name);
        
        if(this.piwikLanguage && this.piwikLanguage == langCode) {
            currentLanguage = name;
        }
        
    }
    
    availableLanguageOptions.sort();
    availableLanguageOptions.push(_('SitesManager_Cancel_js'));
    
    var box             = this.helper('borderedContainer', {});
    var headline        = this.helper('headline', {headline: _('General_Settings')});
    
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
            options: availableLanguageOptions,
            cancel: (availableLanguageOptions.length - 1)
        });
        
        var row = this;
        
        langDialog.addEventListener('click', function (event) {

            // android reports cancel = true whereas iOS returns the previous defined cancel index
            if (!event || event.cancel === event.index || true === event.cancel) {

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
    
    var defaultReportDateLabel = '';
    switch (Settings.getPiwikDefaultPeriod() + Settings.getPiwikDefaultDate()) {
        case 'daytoday':
            defaultReportDateLabel = _('General_Today');
            break;
        case 'dayyesterday':
            defaultReportDateLabel = _('General_Yesterday');
            break;
        case 'weektoday':
            defaultReportDateLabel = _('General_CurrentWeek');
            break;
        case 'monthtoday':
            defaultReportDateLabel = _('General_CurrentMonth');
            break;
        case 'yeartoday':
            defaultReportDateLabel = _('General_CurrentYear');
            break;
    }
    
    var onChangeDefaultReportDate = function () {
                                
        var periodOptions    = [_('General_Today'), 
                                _('General_Yesterday'), 
                                _('General_CurrentWeek'), 
                                _('General_CurrentMonth'), 
                                _('General_CurrentYear'),
                                _('SitesManager_Cancel_js')];

        var periodDialog = Titanium.UI.createOptionDialog({
            title: _('Mobile_DefaultReportDate'),
            options: periodOptions,
            cancel: 5
        });
        
        var row = this;
        
        periodDialog.addEventListener('click', function (event) {
            
            // android reports cancel = true whereas iOS returns the previous defined cancel index
            if (!event || event.cancel === event.index || true === event.cancel) {
                return;
            }
            
            row.changeValue(periodOptions[event.index]);
            
            switch (event.index) {
                case 0:
                    Settings.setPiwikDefaultPeriod('day');
                    Settings.setPiwikDefaultDate('today');
                    break;
                case 1:
                    Settings.setPiwikDefaultPeriod('day');
                    Settings.setPiwikDefaultDate('yesterday');
                    break;
                case 2:
                    Settings.setPiwikDefaultPeriod('week');
                    Settings.setPiwikDefaultDate('today');
                    break;
                case 3:
                    Settings.setPiwikDefaultPeriod('month');
                    Settings.setPiwikDefaultDate('today');
                    break;
                case 4:
                    Settings.setPiwikDefaultPeriod('year');
                    Settings.setPiwikDefaultDate('today');
                    break;
            }
            
            var mySession = new Session();
            mySession.set('piwik_parameter_period', Settings.getPiwikDefaultPeriod());
            mySession.set('piwik_parameter_date', Settings.getPiwikDefaultDate());
        });
        
        periodDialog.show();
    };
    
    var onManageAccess = function () {
        Window.createMvcWindow({jsController: 'settings',
                                jsAction:     'manageaccounts'});
    };
    
    var onChangeHttpTimeout = function () {
    
        var timeoutValues = ['15s', '30s', '45s', '60s', '90s', '120s', '150s', '180s', '300s', '450s', '600s', '1000s', _('SitesManager_Cancel_js')];
        
        var timeoutDialog = Titanium.UI.createOptionDialog({
            title: _('Mobile_ChooseHttpTimeout'),
            options: timeoutValues,
            cancel: (timeoutValues.length - 1)
        });
        
        var row = this;
        
        timeoutDialog.addEventListener('click', function (event) {
            
            // android reports cancel = true whereas iOS returns the previous defined cancel index
            if (!event || event.cancel === event.index || true === event.cancel) {
                return;
            }
            
            var timeoutValue = timeoutValues[event.index];
            
            row.changeValue(timeoutValue);
            
            timeoutValue = parseInt(timeoutValue.replace('s', '')) * 1000;
            
            Settings.setHttpTimeout(timeoutValue);
        });
        
        timeoutDialog.show();
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
                     Ui_TableViewRow({className: 'settingsSection1',
                                      title: _('Mobile_DefaultReportDate'),
                                      onClick: onChangeDefaultReportDate,
                                      value: defaultReportDateLabel, 
                                      hasChild: true}),
                     Ui_TableViewRow({className: 'settingsSection1',
                                      title: _('Mobile_HttpTimeout'),
                                      description: _('Mobile_HttpTimeoutInfo'),
                                      onClick: onChangeHttpTimeout,
                                      value: Math.round(Settings.getHttpTimeout() / 1000) + 's',
                                      hasChild: true}),
                     Ui_TableViewRow({className: 'settingsSection2',
                                      title: _('Mobile_MultiChartLabel'),
                                      description: _('Mobile_MultiChartInfo'),
                                      onClick: onChangeSparkline,
                                      hasCheck: Boolean(this.piwikMultiCharts)}),
                     Ui_TableViewRow({className: 'settingsSection2',
                                      title: _('Mobile_EnableGraphsLabel'),
                                      onClick: onChangeGraphs,
                                      hasCheck: Boolean(this.graphsEnabled)})];
    
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
