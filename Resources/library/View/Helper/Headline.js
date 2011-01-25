/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class  View helper which displays a headline. The helper includes icons which allows to navigate to the 
 *         setting tab and to close the current window (go back).
 *
 * @param    {Object}       [options]                     See {@link View_Helper#setOptions}
 * @property {string}       [options.headline=""]         Optional - The headline.
 * @property {string}       [options.showTools="false"]   Optional - Whether the tools shall be displayed or not.
 * @property {string}       [options.period="day"]        Optional - The current active period.
 * @property {Object}       [options.currentSite]         Optional - The current active site as an object.
 * @property {Array}        [options.allowedSites]        Optional - An array of sites where the user has at least 
 *                                                                   view access. The format has to be similar to 
 *                                                                   {@link http://piwik.org/demo/?module=API&method=SitesManager.getSitesWithAtLeastViewAccess&format=JSON&token_auth=anonymous}
 * @property {Date|string}  [options.date]                Optional - The current selected date. Can be either a Date
 *                                                                   object or string in the following Format
 *                                                                   "YYYY-MM-DD". Defaults to the current date (now).
 * 
 * @augments View_Helper
 */
function View_Helper_Headline () {

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
     * Creates the 'subView' container and arranges the addition of the headline and icons.
     *
     * @returns {View_Helper_Headline} An instance of the current state.
     */
    this.direct  = function () {
        
        /**
         * @todo replace bgImage by gradient as soon as Titanium supports it in Android
         * backgroundGradient: {
         *    type:'linear',
         *    colors:[{color:'#C8C5BC',position:0.0},{color:'#BEBAB1',position:0.50},{color:'#B2AEA6',position:1.0}]
         * } 
         */
        var view = Titanium.UI.createView({
            height: 40,
            top: 0,
            left: 0,
            right: 0,
            backgroundImage: 'images/bgheadline.png'
        });

        this.addHeadline(view);
        this.addTools(view);

        this.subView = view;
        
        return this;
    };

    /**
     * Adds the headline.
     *
     * @param   {Titanium.UI.View}   See {@link View_Helper#subView}
     *
     * @type null
     */
    this.addHeadline = function (view) {
    
        var labelWidth = 'auto';
        var top        = 6;
        
        if (100 < parseInt(this.view.width, 10)) {
            // there is a bug since Titanium Mobile SDK 1.4 which forces labels to wrap even if there is enough space
            // left. setting a width is a workaround to fix this bug.
            // @todo set this to auto as soon as this bug is completely fixed #wrapbug
            labelWidth = parseInt(this.view.width, 10) - 10 - 47 - 47 - 10;
        }
        
        if ('android' === Titanium.Platform.osname) {
            top        = 5;
        }

        this.headline = Titanium.UI.createLabel({
            text: this.getOption('headline', ''),
            height: 30,
            left: 10,
            top: top,
            ellipsize: true,
            wordWrap: false,
            width: labelWidth,
            shadowColor: config.theme.borderColor,
            shadowOffset: {x: 0, y: 1},
            color: config.theme.backgroundColor,
            minimumFontSize: config.theme.fontSizeNormal,
            font: {fontSize: config.theme.fontSizeHeadline, fontFamily: config.theme.fontFamily}
        });
        
        view.add(this.headline);
    };
    
    /**
     * Refreshes the display of the headline view helper. Especially refreshes the text of the headline.
     *
     * @type null
     */
    this.refresh = function () {
    
        if (this.headline && 'undefined' !== (typeof this.headline.text)) {
            this.headline.text = this.getOption('headline', '');
        }
    };

    /**
     * Adds the functional icons beside the headline.
     *
     * @param   {Titanium.UI.View}   See {@link View_Helper#subView}
     *
     * @type null
     */
    this.addTools = function (view) {
        if (!this.getOption('showTools', false)) {
        
            return;
        }
        
        this.period    = this.getOption('period', this.period);
        var optionDate = this.getOption('date', new Date());
        
        if ('string' === (typeof optionDate).toLowerCase()) {

            this.date  = optionDate.toPiwikDate();
            
        } else {
            
            this.date  = optionDate;
        }

        this.addDayChooser(view);
        this.addSiteChooser(view);
    };
    
    /**
     * Adds an icon to the header and menu which allows the user to add an piwik account.
     *
     * @type null
     */
    this.addManageAccountChooser = function () {

        var onAddAccount = function () {
            Window.createMvcWindow({jsController: 'settings',
                                    jsAction:     'createaccount'});
        };
    
        var addAccountIcon  = Ti.UI.createImageView({image: 'images/icon/header_add.png', 
                                                     backgroundSelectedColor: '#FFC700',
                                                     backgroundFocusedColor: '#FFC700',
                                                     focusable: true,
                                                     top: 0, 
                                                     right: 0, 
                                                     width: 47, 
                                                     height: 40});
                                                   
        addAccountIcon.addEventListener('click', onAddAccount);
        Ui_Menu.addItem({title: _('Mobile_AddAccount'), icon: 'images/icon/menu_add.png'}, onAddAccount);
        
        if (this.subView) {
            this.subView.add(addAccountIcon);
        }
    };

    /**
     * Adds an icon to the header and menu which allows the user to open the settings screen. Will be displayed only
     * on iOS cause Android users are already able to go to settings view via option menu
     *
     * @type null
     */
    this.addSettingsChooser = function () {
    
        if ('android' == Ti.Platform.osname) {
        
            return;
        }
    
        var settingsIcon  = Ti.UI.createImageView({image: 'images/icon/header_settings.png', 
                                                   backgroundSelectedColor: '#FFC700',
                                                   backgroundFocusedColor: '#FFC700',
                                                   focusable: true,
                                                   top: 0, 
                                                   right: 0, 
                                                   width: 47, 
                                                   height: 40});
                                                   
        settingsIcon.addEventListener('click', function () {
        
            Window.createMvcWindow({jsController: 'settings',
                                    jsAction: 'index'});
        });
        
        if (this.subView) {
            this.subView.add(settingsIcon);
        }
    };

    /**
     * Adds a date and period selector. This allows the user to change the date and period.
     *
     * @param   {Titanium.UI.View}   See {@link View_Helper#subView}
     *
     * @type null
     */
    this.addDayChooser = function (view) {
        
        this.dateView  = Ti.UI.createImageView({image: 'images/icon/header_calendar.png', 
                                                backgroundSelectedColor: '#FFC700',
                                                backgroundFocusedColor: '#FFC700',
                                                focusable: true,
                                                top: 0, 
                                                right: 47, 
                                                width: 47, 
                                                height: 40});
        
        var _this      = this;
        
        // opens the date picker.
        var onShowDatePicker = function () {

            var max    = new Date();
            var min    = new Date(2008, 0, 1);
            var picker = create_Ui_Picker({value: _this.date,
                                           maxDate: max,
                                           period: _this.period,
                                           selectionIndicator: true,
                                           minDate: min,
                                           period: _this.period,
                                           view: _this.view});
            
            picker.addEventListener('set', function (event) {

                _this.changeDate(event.date, event.period);
            });
        };
        
        this.dateView.addEventListener('click', onShowDatePicker);
        Ui_Menu.addItem({title: _('General_ChooseDate'), icon: 'images/icon/menu_choosedate.png'}, onShowDatePicker);

        view.add(this.dateView);
    };
    
    /**
     * Adds a site selector. This allows the user to switch between sites directly.
     *
     * @param   {Titanium.UI.View}   See {@link View_Helper#subView}
     *
     * @type null
     */
    this.addSiteChooser  = function (view) {

        var currentSite  = this.getOption('currentSite', {name: ''});

        this.siteChooser = Ti.UI.createImageView({image: 'images/icon/header_globe.png', 
                                                  backgroundSelectedColor: '#FFC700',
                                                  backgroundFocusedColor: '#FFC700',
                                                  focusable: true,
                                                  top: 0, 
                                                  right: 0, 
                                                  width: 47, 
                                                  height: 40});
        
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
        
        this.siteChooser.addEventListener('click', onShowSiteChooser);
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
            
                // mark as found only if site changes
                if (verifySite 
                    && currentSite
                    && verifySite.name 
                    && selectedSiteName === verifySite.name
                    && currentSite.name !== verifySite.name) {
                    selectedSite = verifySite;
                    
                    break Found;
                }
                
            }
            
            if (selectedSite) {
            
                if (win) {
                    win.fireEvent('siteChanged', {site: selectedSite});
                }
                
                // fire further event so other windows are able to listen to this event, too
                Titanium.App.fireEvent('siteChanged', {site: selectedSite});
            
            }
        });
        
        view.add(this.siteChooser);
    };

    /**
     * Changes the current selected period.
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
        
        Session.set('piwik_parameter_period', period);
    };

    /**
     * Changes the current selected date and fires an event named 'dateChanged' using the {@link View} object. 
     * The passed event contains a property named 'date' which holds the changed value in the format 'YYYY-MM-DD' and a 
     * property named period which holds the selected period, for example 'week'. 
     * You can add an event listener within the view template:
     * this.addEventListener('dateChanged', function (event) { alert(event.date); });
     *
     * @param {Date} changedDate    The selected/changed date.
     *
     * @type null
     */
    this.changeDate   = function (changedDate, period) {
        this.changePeriod(period);
            
        this.date     = changedDate;
        
        var dateQuery = this.date.toPiwikQueryString();
        
        Session.set('piwik_parameter_date', dateQuery);

        if (this.view) {
            this.view.fireEvent('dateChanged', {date: dateQuery, period: this.period});
        }
    };
}

/**
 * Extend View_Helper
 */
View_Helper_Headline.prototype = new View_Helper();
