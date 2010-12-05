/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   View helper which offers the possiblity to change standard parameters as described at 
 *          {@link http://dev.piwik.org/trac/wiki/API/Reference#Standardparameters}
 * 
 * @property {Object}       [options]                 See {@link View_Helper#setOptions}
 * @property {string}       [options.period="day"]    Optional - The current active period.
 * @property {Object}       [options.currentSite]     Optional - The current active site as an object.
 * @property {Array}        [options.allowedSites]    Optional - An array of sites where the user has at least view access.
 *                                                               The format has to be similar to {@link http://piwik.org/demo/?module=API&method=SitesManager.getSitesWithAtLeastViewAccess&format=JSON&token_auth=anonymous}
 * @property {Date|string}  [options.date]            Optional - The current selected date. Can be either a Date object
 *                                                               or string in the following Format "YYYY-MM-DD". 
 *                                                               Defaults to the current date (now).
 * @property {string}       [options.dateDescription] Optional - A localized string of the current selected date. If
 *                                                               description is not given a localized string will be 
 *                                                               generated.
 * 
 * @augments View_Helper
 */
function View_Helper_ParameterChooser () {

    /**
     * Holds the current date the chooser internally works with.
     * 
     * @defaults null
     * 
     * @type Date
     */
    this.date    = null;

    /**
     * Holds the current period the chooser internally works with.
     * 
     * @defaults "day"
     *
     * @type String
     */
    this.period  = 'day';

    /**
     * Creates the 'subView' container and arranges the addition of each selector.
     *
     * @returns {View_Helper_ParameterChooser} An instance of the current state.
     */
    this.direct  = function () {

        var view = Titanium.UI.createView({
            width: this.view.size.width - 10,
            height: 82,
            top: this.getOption('top', 5),
            left: 0,
            right: 0,
            zIndex: 2,
            backgroundColor: '#f6f6f6',
            borderWidth: 1,
            borderColor: '#B8B4AB'
        });
        
        this.addDayChooser(view);
        this.addSiteChooser(view);

        this.subView = view;

        this.initDate();
        
        var _this = this;
        this.view.addEventListener('close', function () {
            _this.cleanup();
        });

        return this;
    };
    
    /**
     * Does some cleanup stuff to be sure that the memory of these objects will be freed.
     *
     * @type null
     */
    this.cleanup = function () {

        if (this.chooseDateIcon && this.subView) {
            this.subView.remove(this.chooseDateIcon);
            this.chooseDateIcon = null;
        }
        
        if (this.choosePeriodIcon && this.subView) {
            this.subView.remove(this.choosePeriodIcon);
            this.choosePeriodIcon = null;
        }
        
        if (this.chooseSiteIcon && this.subView) {
            this.subView.remove(this.chooseSiteIcon);
            this.chooseSiteIcon = null;
        }
        
        if (this.dateView && this.subView) {
            this.subView.remove(this.dateView);
            this.dateView = null;
        }
        
        if (this.periodView && this.subView) {
            this.subView.remove(this.periodView);
            this.periodView = null;
        }
        
        if (this.siteView && this.subView) {
            this.subView.remove(this.siteView);
            this.siteView = null;
        }

        this.view    = null;
        this.subView = null;
    };

    /**
     * Adds a date and period selector. This allows the user to change the date and period.
     *
     * @param   {Titanium.UI.View}   See {@link View_Helper#subView}
     *
     * @type null
     */
    this.addDayChooser = function (view) {
        
        var labelWidth = 'auto';
        
        if (100 < parseInt(this.view.size.width, 10)) {
            // there is a bug since Titanium Mobile SDK 1.4 which forces labels to wrap even if there is enough space left.
            // setting a width is a workaround to fix this bug.
            // @todo set this to auto as soon as this bug is completely fixed #wrapbug  
            
            labelWidth = parseInt(this.view.size.width, 10) - 120 - 10;
        }

        this.chooseDateIcon = Titanium.UI.createButton({
            image: 'images/icon/choosedate.png',
            width: 13,
            height:15,
            top: 14,
            left: 10,
            zIndex: 5
        });
        
        if ('android' !== Titanium.Platform.osname) {
            this.chooseDateIcon.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
        }

        this.dateValue =  Titanium.UI.createLabel({
            text: ' - ',
            height: 'auto',
            width: parseInt(labelWidth, 10) - 26,
            left: 26,
            color: '#996600',
            font: {fontSize: config.theme.fontSizeNormal, fontWeight: 'bold', fontFamily: config.theme.fontFamily},
            zIndex: 6
        });
        
        // we do not need this view, but it allows the user to easier hit the date picker
        this.dateView = Titanium.UI.createView({height: 39,
                                                top: 2,
                                                left: 4,
                                                width: labelWidth,
                                                zIndex: 4});

        this.period       = this.getOption('period', this.period);
        
        this.periodValue  = Titanium.UI.createLabel({
            text: Translation.getPeriod(this.period, false),
            height: 'auto',
            right: 26,
            width: 90,
            textAlign: 'right',
            color: '#996600',
            font: {fontSize: config.theme.fontSizeNormal, fontWeight: 'bold', fontFamily: config.theme.fontFamily},
            zIndex: 3
        });
        
        this.choosePeriodIcon = Titanium.UI.createButton({
            image: 'images/icon/chooseDown.png',
            width: 13,
            height: 15,
            top: 14,
            right: 10,
            zIndex: 2
        });
        
        if ('android' !== Titanium.Platform.osname) {
            this.choosePeriodIcon.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
        }
        
        // we do not need this view, but it allows the user to easier hit the period picker
        this.periodView = Titanium.UI.createView({height: 39,
                                                  top: 2,
                                                  right: 4,
                                                  width: 80,
                                                  zIndex: 1});
                
        var _this = this;
        
        // opens the date picker.
        var onShowDatePicker = function () {

            var max    = new Date();
            var min    = new Date(2008, 0, 1);
            var picker = create_Ui_Picker({value: _this.date,
                                           maxDate: max,
                                           period: _this.period,
                                           selectionIndicator: true,
                                           minDate: min});
            
            picker.addEventListener('set', function (event) {

                _this.changeDate(event.value);
            });
        };

        this.chooseDateIcon.addEventListener('click', onShowDatePicker);
        this.dateView.addEventListener('click', onShowDatePicker);
        Ui_Menu.addItem({title: _('General_ChooseDate'), icon: 'images/icon/menu_choosedate.png'}, onShowDatePicker);
        
        var dialog = Titanium.UI.createOptionDialog({
            title: _('General_ChoosePeriod'),
            options: [Translation.getPeriod('day', false), 
                      Translation.getPeriod('week', false), 
                      Translation.getPeriod('month', false), 
                      Translation.getPeriod('year', false),
                      _('SitesManager_Cancel_js')],
            cancel: 4
        });
        
        var onShowPeriodChooser = function () {
            dialog.show();
        };
        
        this.choosePeriodIcon.addEventListener('click', onShowPeriodChooser);
        this.periodView.addEventListener('click', onShowPeriodChooser);
        Ui_Menu.addItem({title: _('General_ChoosePeriod'), icon: 'images/icon/menu_chooseDown.png'}, onShowPeriodChooser);
        
        dialog.addEventListener('click', function (event) {
            
            // android reports cancel = true whereas iOS returns the previous defined cancel index
            if (!event || event.cancel === event.index || true === event.cancel) {
                
                return;
            }
            
            switch (event.index) {
            
                case 1:
                    _this.changePeriod('week');
                    break;
                    
                case 2:
                    _this.changePeriod('month');
                    break;
                    
                case 3:
                    _this.changePeriod('year');
                    break;
                    
                default:
                    _this.changePeriod('day');
            }
        });

        view.add(this.chooseDateIcon);
        this.dateView.add(this.dateValue);
        view.add(this.dateView);
        this.periodView.add(this.periodValue);
        view.add(this.choosePeriodIcon);
        view.add(this.periodView);
        this.dateView.show();
        this.periodView.show();
    };
    
    /**
     * Adds a site selector. This allows the user to switch between sites directly.
     *
     * @param   {Titanium.UI.View}   See {@link View_Helper#subView}
     *
     * @type null
     */
    this.addSiteChooser = function (view) {

        var labelWidth = 'auto';
        if ('android' === Titanium.Platform.osname && 100 < parseInt(this.view.size.width, 10)) {
            // there is a bug since Titanium Mobile SDK 1.3.2 which forces labels to wrap even if there is enough
            // space left. Setting a width is a workaround to fix this bug.
            // @todo set this to auto as soon as this bug is completely fixed #wrapbug  
            
            labelWidth = parseInt(this.view.size.width, 10) - 50;
        }
    
        var currentSite  = this.getOption('currentSite', {name: ''});

        this.siteChooser =  Titanium.UI.createLabel({
            text: currentSite.name,
            height: 'auto',
            left: 26,
            color: '#996600',
            width: labelWidth,
            font: {fontSize: config.theme.fontSizeNormal, fontWeight: 'bold', fontFamily: config.theme.fontFamily},
            zIndex: 10
        });

        var separator = Titanium.UI.createView({
            height: 1,
            left: 10,
            right: 10,
            top: 41,
            borderWidth: 0,
            backgroundColor: '#333333',
            zIndex: 7
        });
        
        this.chooseSiteIcon = Titanium.UI.createButton({
            image:'images/icon/chooseDown.png',
            width: 13,
            height: 15,
            top: 54,
            left: 10
        });
        
        if ('android' !== Titanium.Platform.osname) {
            this.chooseSiteIcon.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
        }
        
        // we do not need this view, but it allows the user to easier hit the site picker
        this.siteView = Titanium.UI.createView({height: 37,
                                                top: 43,
                                                left: 4,
                                                width: 220,
                                                zIndex: 8});
        
        var allowedSiteNames = [];
        var allowedSites     = this.getOption('allowedSites', []);
        
        // extract the names of each site to display them within an options dialog
        for (var index = 0; index < allowedSites.length; index++) {
        
            var site = allowedSites[index];
        
            if (site && site.name) {
                allowedSiteNames.push('' + site.name);
            }
            
        }
        
        allowedSiteNames.push(_('SitesManager_Cancel_js'));
        
        var dialog = Titanium.UI.createOptionDialog({
            title: _('General_ChooseWebsite'),
            options: allowedSiteNames,
            cancel: (allowedSiteNames.length - 1)
        });
        
        var onShowSiteChooser = function () {
            dialog.show();
        };
        
        this.chooseSiteIcon.addEventListener('click', onShowSiteChooser);
        this.siteView.addEventListener('click', onShowSiteChooser);
        Ui_Menu.addItem({title : _('General_ChooseWebsite'), icon: 'images/icon/menu_chooseDown.png'}, onShowSiteChooser);
        
        var win = this.view;
        
        dialog.addEventListener('click', function (event) {
            
            // android reports cancel = true whereas iOS returns the previous defined cancel index
            if (!event || event.cancel === event.index || true === event.cancel) {
                
                return;
            }
            
            var selectedSiteName = allowedSiteNames[event.index];
            var selectedSite     = null;

            // try to find the selected site object because we only get the name of the selected site.
            Found: for (var index = 0; index < allowedSites.length; index++) {
            
                var verifySite = allowedSites[index];
            
                if (verifySite && verifySite.name && selectedSiteName === verifySite.name) {
                    selectedSite = verifySite;
                    
                    break Found;
                }
                
            }
            
            // fire event only if site changes
            if (selectedSite.idsite !== currentSite.idsite) {
            
                if (win) {
                    win.fireEvent('siteChanged', {site: selectedSite});
                }
                
                // fire further event so other windows are able to listen to this event, too
                Titanium.App.fireEvent('siteChanged', {site: selectedSite});
            
            }
        });
        
        this.siteView.add(this.siteChooser);
        view.add(this.chooseSiteIcon);
        view.add(this.siteView);
        view.add(separator);
        this.siteView.show();
    };

    /**
     * Builds a local date value and displays it within the date selector.
     *
     * @type null
     */
    this.initDate = function () {

        var optionDate = this.getOption('date', new Date());
        
        if ('string' === (typeof optionDate).toLowerCase()) {

            this.date  = optionDate.toPiwikDate();
            
        } else {
            
            this.date  = optionDate;
        }
        
        this.dateValue.text = this.getOption('dateDescription', this.date.toPiwikDateRangeString(this.period));
    };

    /**
     * Changes the current selected period and fires an event named 'periodChanged' using the {@link View} object. 
     * The passed event contains a property named 'period' which holds the changed value. You can add an event
     * listener within the view template:
     * this.addEventListener('periodChanged', function (event) { alert(event.period); });
     *
     * @param {string} period   The selected period, for example 'week', 'year', ...
     *
     * @type null
     */
    this.changePeriod = function (period) {
    
        if (!period || this.period == period) {
        
            return;
        }
    
        this.period   = period;
        
        var mySession = new Session();
        
        mySession.set('piwik_parameter_period', period);
        
        if (this.view) {
            this.view.fireEvent('periodChanged', {period: period});
        }
    };

    /**
     * Changes the current selected date and fires an event named 'dateChanged' using the {@link View} object. 
     * The passed event contains a property named 'date' which holds the changed value in the format 'YYYY-MM-DD'. 
     * You can add an event listener within the view template:
     * this.addEventListener('dateChanged', function (event) { alert(event.date); });
     *
     * @param {Date} changedDate    The selected/changed date.
     *
     * @type null
     */
    this.changeDate   = function (changedDate) {
            
        this.date     = changedDate;
        
        var dateQuery = this.date.toPiwikQueryString();
        
        var mySession = new Session();
        
        mySession.set('piwik_parameter_date', dateQuery);

        if (this.view) {
            this.view.fireEvent('dateChanged', {date: dateQuery});
        }
    };
}

/**
 * Extend View_Helper
 */
View_Helper_ParameterChooser.prototype = new View_Helper();
