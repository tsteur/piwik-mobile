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
            currentLanguage  = name;
        }
    }

    availableLanguageOptions.sort();
    availableLanguageOptions.push(_('SitesManager_Cancel_js'));
    
    // detect current selected language index so we are able to preselect it later
    var currentLangIndex         = null;
    for(var index in availableLanguageOptions) {
        if(currentLanguage && availableLanguageOptions[index] == currentLanguage) {
            currentLangIndex = index;
            break;
        }
    }
    
    var headline        = this.helper('headline', {headline: _('General_Settings')});
    
    this.add(headline.subView);

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
        
        if (null !== currentLangIndex) {
            langDialog.selectedIndex = currentLangIndex;
        }
        
        var row = this;
        
        langDialog.addEventListener('click', function (event) {

            // android reports cancel = true whereas iOS returns the previous defined cancel index
            if (!event || event.cancel === event.index || true === event.cancel) {

                return;
            }
            
            // user selected some value as already selected
            if (event.index == currentLangIndex) {
            
                return;
            }
            
            row.changeValue(availableLanguageOptions[event.index]);
            currentLangIndex = event.index;

            for(var langCode in _this.availableLanguages) {
                if(availableLanguageOptions[event.index] == _this.availableLanguages[langCode]) {
                    Settings.setLanguage(langCode);
        
                    Translation.loadTranslations();
                    break;
                }
            }
        });
        
        langDialog.show();
    };
    
    var defaultReportDateLabel = '';
    var currentReportDateIndex = null;
    switch (Settings.getPiwikDefaultPeriod() + Settings.getPiwikDefaultDate()) {
        case 'daytoday':
            defaultReportDateLabel = _('General_Today');
            currentReportDateIndex = 0;
            break;
        case 'dayyesterday':
            defaultReportDateLabel = _('General_Yesterday');
            currentReportDateIndex = 1;
            break;
        case 'weektoday':
            defaultReportDateLabel = _('General_CurrentWeek');
            currentReportDateIndex = 2;
            break;
        case 'monthtoday':
            defaultReportDateLabel = _('General_CurrentMonth');
            currentReportDateIndex = 3;
            break;
        case 'yeartoday':
            defaultReportDateLabel = _('General_CurrentYear');
            currentReportDateIndex = 4;
            break;
    }
    
    var onChangeDefaultReportDate = function () {
                                
        var periodOptions = [_('General_Today'), 
                             _('General_Yesterday'), 
                             _('General_CurrentWeek'), 
                             _('General_CurrentMonth'), 
                             _('General_CurrentYear'),
                             _('SitesManager_Cancel_js')];

        var periodDialog  = Titanium.UI.createOptionDialog({
            title:  _('Mobile_DefaultReportDate'),
            options: periodOptions,
            cancel: 5
        });
        
        if (null !== currentReportDateIndex) {
            // preselect current selected value
            periodDialog.selectedIndex = currentReportDateIndex;
        }
        
        var row = this;
        
        periodDialog.addEventListener('click', function (event) {
            
            // android reports cancel = true whereas iOS returns the previous defined cancel index
            if (!event || event.cancel === event.index || true === event.cancel) {
                return;
            }
            
            // user selected some value as already selected
            if (event.index == currentReportDateIndex) {
                return;
            }
            
            row.changeValue(periodOptions[event.index]);
            currentReportDateIndex = event.index;
            
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
            
            Session.set('piwik_parameter_period', Settings.getPiwikDefaultPeriod());
            Session.set('piwik_parameter_date', Settings.getPiwikDefaultDate());
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
            
            timeoutValue = parseInt(timeoutValue.replace('s', ''), 10) * 1000;
            
            Settings.setHttpTimeout(timeoutValue);
        });
        
        timeoutDialog.show();
    };
    
    var onShowHelpAbout = function () {
        Window.createMvcWindow({jsController: 'help',
                                jsAction:     'about'});
    };
    
    var onShowHelpFeedback = function () {
        Window.createMvcWindow({jsController: 'help',
                                jsAction:     'feedback'});
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
                     Ui_TableViewRow({className: 'settingsSection2',
                                      title: _('Mobile_MultiChartLabel'),
                                      description: _('Mobile_MultiChartInfo'),
                                      onClick: onChangeSparkline,
                                      hasCheck: Boolean(this.piwikMultiCharts)}),
                     Ui_TableViewRow({className: 'settingsSection2',
                                      title: _('Mobile_EnableGraphsLabel'),
                                      onClick: onChangeGraphs,
                                      hasCheck: Boolean(this.graphsEnabled)}),
                     Ui_TableViewSection({className: 'settingsHeadline1',
                                          title: _('Mobile_Advanced')}),
                     Ui_TableViewRow({className: 'settingsSection1',
                                      title: _('Mobile_HttpTimeout'),
                                      description: _('Mobile_HttpTimeoutInfo'),
                                      onClick: onChangeHttpTimeout,
                                      value: Math.round(Settings.getHttpTimeout() / 1000) + 's',
                                      hasChild: true}),
                     Ui_TableViewSection({className: 'settingsHeadline1',
                                          title: _('Mobile_Help')}),
                     Ui_TableViewRow({className: 'settingsSection1',
                                      title: String.format(_('General_AboutPiwikX'), 'Mobile'),
                                      onClick: onShowHelpAbout}),
                     Ui_TableViewRow({className: 'settingsSection1',
                                      title: _('General_GiveUsYourFeedback'),
                                      onClick: onShowHelpFeedback})];
    
    var top       = headline.subView.height + headline.subView.top;
    var height    = this.height - top;
    var tableview = Titanium.UI.createTableView({data: tableData,
                                                 left: 0,
                                                 width: this.width,
                                                 top: top,
                                                 height: height,
                                                 focusable: true,
                                                 separatorColor: '#eeedeb'});
    
    tableview.addEventListener('click', function (event) {

        if (!event || !event.rowData || !event.rowData.onClick) {
            return;
        }
        
        event.rowData.onClick.apply(event.row, [event]);
    });
    
    this.add(tableview);
    
    tableview.show();
    
    if (tableview.scrollToTop) {
        tableview.scrollToTop(1);
    }
}
