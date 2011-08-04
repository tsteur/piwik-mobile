/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class  A menu is created by the method Piwik.UI.createMenu. Therefore, the menu adds buttons, icons, option menus
 *         to the current displayed window which allows to execute several actions. Like choosing another website.
 *         Each time another window gets the focus (by closing an existing window or opening a new window) it is
 *         possible to reset and rebuild the menu by calling the 'refresh' method.
 *
 * @param {Object}     [params]                                     See {@link Piwik.UI.View#setParams}
 * @param {string}     [params.optionMenuAddAccountChooser="false"] Optional. Only for Android. Adds an entry to the
 *                                                                  Android Option Menu Item which opens the "add a
 *                                                                  new account" window.
 * @param {string}     [params.optionMenuSettingsChooser="false"]   Optional. Only for Android. Adds an entry to the
 *                                                                  Android Option Menu Item which opens the
 *                                                                  "Settings" window.
 * @param {string}     [params.dayChooser="false"]                  Optional. Adds an Android Option Menu Item and a
 *                                                                  button to the window where the user has the
 *                                                                  ability to choose another date and period.
 *                                                                  Requires the optional 'period' and 'date'
 *                                                                  parameters.
 * @param {string}     [params.addAccountChooser="false"]           Optional. Adds an Android Option Menu Item and a
 *                                                                  button to the window where the user has the
 *                                                                  ability to open the "add a new account" window.
 * @param {string}     [params.siteChooser="false"]                 Optional. Adds an Android Option Menu Item and a
 *                                                                  button to the window where the user has the
 *                                                                  ability to select another website.
 * @param {string}     [params.settingsChooser="false"]             Optional. Adds an Android Option Menu and a
 *                                                                  button to the window where the user has the
 *                                                                  ability to open the "Settings" window.
 * @param {string}     [params.period="day"]        Optional. The current active period.
 * @param {Date|string}  [options.date]             Optional. The current selected date. Can be either a Date
 *                                                  object or string in the following Format
 *                                                  "YYYY-MM-DD". Defaults to the current date (now).
 * 
 * @augments Piwik.UI.View
 *
 * @example
 * var menu = Piwik.UI.createMenu();
 * menu.refresh({settingsChooser: true});  // add only the settings button to the window.
 *
 * @todo create files for each actions? for example accountChooser... siteChooser...?
 */
Piwik.UI.Menu = function () {

    /**
     * The event will be fired as soon as the user changes the selected site.
     *
     * @name    Piwik.UI.Menu#event:onSiteChanged
     * @event
     *
     * @context {Ti.App}
     * @context {Piwik.UI.Menu}
     *
     * @param   {Object}    event
     * @param   {string}    event.type       The name of the event.
     * @param   {Object}    event.site       The changed site. See params.currentSite {@link Piwik.UI.Menu}
     */

    /**
     * The event will be fired as soon as the user changes the daterange (date or period).
     * The event will be fired in multiple contexts.
     *
     * @name    Piwik.UI.Menu#event:onDateChanged
     * @event
     *
     * @param   {Object}    event
     * @param   {string}    event.type       The name of the event.
     * @param   {string}    event.date       The current active, possibly changed, date value in the format
     *                                       'YYYY-MM-DD'.
     * @param   {string}    event.period     The current active, possibly changed, period value. For example
     *                                       'day' or 'week'.
     */

    /**
     * Holds the current date which the chooser internally works with.
     * 
     * @defaults null
     * 
     * @type Date
     */
    this.date    = null;

    /**
     * Holds the current period which the chooser internally works with.
     * 
     * @defaults "day"
     *
     * @type String
     */
    this.period  = 'day';

    /**
     * Currently only used on non iOS platforms. On iOS we use the native header as the menu view.
     * A view where all menu items like buttons or icons shall be added. For example the header.
     *
     * @type Titanium.UI.View|null
     */
    this.menuView        = null;

    /**
     * Only used if a menuView is given. An image view which displays a settings icon.
     *
     * @type Titanium.UI.ImageView|null
     */
    this.settingsIcon    = null;

    /**
     * Only used if a menuView is given. An image view which displays a 'chooser another site' icon.
     *
     * @type Titanium.UI.ImageView|null
     */
    this.siteChooserIcon = null;

    /**
     * Only used if a menuView is given. An image view which displays a 'choose another day' icon.
     *
     * @type Titanium.UI.ImageView|null
     */
    this.dayChooserIcon  = null;

    /**
     * Only used if a menuView is given. An image view which displays an 'add account' icon.
     *
     * @type Titanium.UI.ImageView|null
     */
    this.addAccountIcon  = null;

    /**
     * Initializes and already builds the menu the first time depending on the previous set parameters.
     *
     * @returns {Piwik.UI.Menu} An instance of the current state.
     */
    this.init = function () {

        this.menuView = this.getParam('menuView');
        var that      = this;

        if (this.menuView) {

            // android
            this.settingsIcon    = Ti.UI.createImageView({id: 'menuSettingsIcon'});
            this.settingsIcon.addEventListener('click', function () {
                
                var menuEvent = {title: 'Menu Click - Open Settings',
                                 url: '/menu-click/open-settings'};
                Piwik.getTracker().trackEvent(menuEvent);

                that.onChooseSettings();
            });
            this.menuView.add(this.settingsIcon);

            this.siteChooserIcon = Ti.UI.createImageView({id: 'menuSiteChooserIcon'});
            this.siteChooserIcon.addEventListener('click', function () {

                var menuEvent = {title: 'Menu Click - Choose Site',
                                 url: '/menu-click/choose-site'};
                Piwik.getTracker().trackEvent(menuEvent);

                that.onChooseSite();
            });
            this.menuView.add(this.siteChooserIcon);

            this.dayChooserIcon  = Ti.UI.createImageView({id: 'menuDayChooserIcon'});
            this.dayChooserIcon.addEventListener('click', function () {

                var menuEvent = {title: 'Menu Click - Choose Date',
                                 url: '/menu-click/choose-date'};
                Piwik.getTracker().trackEvent(menuEvent);
                
                that.onChooseDate();
            });
            this.menuView.add(this.dayChooserIcon);
            
            this.addAccountIcon  = Ti.UI.createImageView({id: 'menuAddAccountIcon'});
            this.addAccountIcon.addEventListener('click', function () {

                var menuEvent = {title: 'Menu Click - Add Account',
                                 url: '/menu-click/add-account'};
                Piwik.getTracker().trackEvent(menuEvent);
                
                that.onAddAccount();
            });
            this.menuView.add(this.addAccountIcon);
        }
        
        
        return this;
    };

    /**
     * Returns a list of all available labels that can be used on iOS within a buttonBar or toolBar.
     *
     * ARRAY (
     *    [int] => Object (
     *         [image]   => [The image that shall be displayed / icon]
     *         [onClick] => [The name of the method that shall be executed as soon as the user presses the button]
     *         [width]   => [The width of the image/button]
     *    )
     * )
     *
     * @type Array
     */
    this.getButtonLabels = function () {

        var buttons = [{image: 'images/header_calendar.png',
                        onClick: 'onChooseDate',
                        width: 37},
                       {image: 'images/header_globe.png',
                        onClick: 'onChooseSite',
                        width: 37},
                       {image: 'images/header_add.png',
                        onClick: 'onAddAccount',
                        width: 37},
                       {image: 'images/header_settings.png',
                        onClick: 'onChooseSettings',
                        width: 37}];

        return buttons;
    };

    /**
     * Opens the 'add a new account' window
     */
    this.onAddAccount = function () {
        this.create('Window', {url: 'settings/editaccount.js', target: 'modal'});
    };

    /**
     * Opens the 'Settings' window
     */
    this.onChooseSettings = function () {
        this.create('Window', {url: 'settings/index.js'}); 
    };

    /**
     * Opens a dialog where the user can choose another date/period. The date and the period parameter has to be
     * set in order to execute this action.
     */
    this.onChooseDate = function () {
        
        var max    = new Date();
        var min    = new Date(2008, 0, 1);
        var picker = this.create('DatePicker', {value: this.date,
                                                maxDate: max,
                                                period: this.period,
                                                selectionIndicator: true,
                                                source: this.toolBar ? this.toolBar : this.dayChooserIcon,
                                                minDate: min});

        var that   = this;
        picker.addEventListener('onSet', function (event) {
            that.changeDate(event.date, event.period);
        });
    };
    
    /**
     * Opens a dialog where the user can choose another website. 
     *
     * @fires Piwik.UI.Menu#event:onSiteChanged
     */
    this.onChooseSite = function () {

        var that = this;

        var win  = null;

        if (Piwik.isIpad) {
            win = this.create('Popover', {width: 320, 
                                          height: 460, 
                                          title: _('General_ChooseWebsite')});
                                            
        } else if (Piwik.isIos) {

            win  = Ti.UI.createWindow({className: 'menuWinChooserWebsite',
                                       modal: true,
                                       barColor: '#B2AEA5',
                                       title: _('General_ChooseWebsite')});

            var cancelButton = Ti.UI.createButton({title: _('SitesManager_Cancel_js'),
                                                   style: Ti.UI.iPhone.SystemButtonStyle.CANCEL});

            cancelButton.addEventListener('click', function () {

                try {
                    if (win && win.close) {
                        win.close();
                    }
                } catch (e) {
                    Piwik.Log.warn('Failed to close site chooser window', 'Piwik.UI.Menu::onChooseSite');
                }

            });

            win.leftNavButton = cancelButton;
            
            win.open();
            
        } else if (Piwik.isAndroid) {

            var crt  = Ti.UI.currentWindow;
            win      = Ti.UI.createWindow({className: 'menuWinChooserWebsite',
                                           title: _('General_ChooseWebsite')});
            var view = Ti.UI.createView({backgroundColor: '#fff'});

            win.add(view);
            
            win.addEventListener('close', function () {
                // don't know why but we have to restore the currentWindow reference on modal window close
                // @todo check whether we still have to do this.
                Ti.UI.currentWindow = crt;
            });
        }

        var websitesList = this.create('WebsitesList', {view: Piwik.isAndroid ? view : win,
                                                        displaySparklines: false});

        var onChooseSite = function (event) {
            if (!event || !event.site) {

                return;
            }

            that.fireEvent('onSiteChanged', {site: event.site, type: 'onSiteChanged'});

            // fire further event so other windows are able to listen to this event, too
            Ti.App.fireEvent('onSiteChanged', {site: event.site, type: 'onSiteChanged'});

            try {
                if (win && (Piwik.isAndroid || Piwik.isIphone)) {
                    // window
                    win.close();
                } else if (win && win.hide) {
                    // popover
                    win.hide();
                }
            } catch (e) {
                Piwik.Log.warn('Failed to close site chooser window', 'Piwik.UI.Menu::onChooseSite');
            }
            
            websitesList = null;
        };

        websitesList.addEventListener('onChooseSite', onChooseSite);
        
        websitesList.request();

        if (Piwik.isIpad) {
            win.show({view: this.toolBar});
        } else {
            win.open({modal: true});
        }
    };
    
    /**
     * Rebuild menu. Removes all previous displayed menu buttons and option menus. Adds the activated buttons and
     * Android Option Menu Items afterwards.
     *
     * @param    {Object}    params             See {@link Piwik.UI.Menu}
     *
     * @type null
     */
    this.refresh = function (params) {

        if (params) {
            this.setParams(params);
        }

        var win        = this.getParam('window', {});

        var rootWindow = win.rootWindow;

        var that       = this;
        
        this.period    = this.getParam('period', this.period);
        var optionDate = this.getParam('date', new Date());

        if ('string' === (typeof optionDate).toLowerCase()) {
            this.date  = optionDate.toPiwikDate();
        } else {
            this.date  = optionDate;
        }

        if (Piwik.isIos) {
            var labels          = [];
            var availableLabels = this.getButtonLabels();

            if (this.getParam('dayChooser', false)) {
                labels.push(availableLabels[0]);
            }

            if (this.getParam('siteChooser', false)) {
                labels.push(availableLabels[1]);
            }
    
            if (this.getParam('addAccountChooser', false)) {
                labels.push(availableLabels[2]);
            }

            if (this.getParam('settingsChooser', false)) {
                labels.push(availableLabels[3]);
            }

            if (this.toolBar) {
                this.toolBar.hide();
                
                if (rootWindow) {
                    rootWindow.rightNavButton = null;
                }
            }

            // always reset left nav button, but not in iPad devices
            if (!Piwik.isIpad && rootWindow) {
                rootWindow.leftNavButton = null;
            }

            if (labels.length && rootWindow) {
                this.toolBar = Ti.UI.createButtonBar({labels: labels,
                                                      id: 'menuButtonBar'});

                rootWindow.rightNavButton = this.toolBar;

                this.toolBar.addEventListener('click', function (event) {
                    if (!event || !event.source) {

                        return;
                    }

                    var buttons = event.source.labels;
                    var button  = buttons[event.index];

                    if (button && button.onClick) {

                        that[button.onClick]();
                    }
                });
            } 

        } else if (this.menuView) {
            
            // android
            var right = 0;

            if (this.getParam('addAccountChooser', false)) {
                this.addAccountIcon.right = ('' + right).toSizeUnit();
                right                     = right + parseInt(this.addAccountIcon.width, 10);
                this.addAccountIcon.show();
            } else {
                this.addAccountIcon.hide();
            }

            if (this.getParam('siteChooser', false)) {
                this.siteChooserIcon.right = ('' + right).toSizeUnit();
                right                      = right + parseInt(this.siteChooserIcon.width, 10);
                this.siteChooserIcon.show();
            } else {
                this.siteChooserIcon.hide();
            }

            if (this.getParam('dayChooser', false)) {
                this.dayChooserIcon.right = ('' + right).toSizeUnit();
                right                     = right + parseInt(this.dayChooserIcon.width, 10);
                this.dayChooserIcon.show();
            } else {
                this.dayChooserIcon.hide();
            }
            
            if (this.getParam('settingsChooser', false)) {
                this.settingsIcon.right = ('' + right).toSizeUnit();
                right                   = right + parseInt(this.settingsIcon.width, 10);
                this.settingsIcon.show();
            } else {
                this.settingsIcon.hide();
            }

            // hack. prevent header title from overlapping menu icons.
            // @todo find a better solution for this.
            var layout = Piwik.UI.layout;
            if (layout && layout.header && layout.header.titleLabel) {
                layout.header.titleLabel.right = ('' + right).toSizeUnit();
            }
        }

        if (this.getParam('addAccountChooser', false) || this.getParam('optionMenuAddAccountChooser', false)) {
            Piwik.UI.OptionMenu.addItem({title: _('Mobile_AddAccount'),
                                         icon: 'images/menu_add.png'},
                                        function () {

                                            var menuEvent = {title: 'Option Menu Add Account',
                                                             url: '/android-option-menu/add-account'};
                                            Piwik.getTracker().trackEvent(menuEvent);

                                            that.onAddAccount();
                                        });
        }

        if (this.getParam('dayChooser', false)) {

            Piwik.UI.OptionMenu.addItem({title: _('General_ChooseDate'),
                                         icon: 'images/menu_choosedate.png'},
                                        function () {

                                            var menuEvent = {title: 'Option Menu Choose Date',
                                                             url: '/android-option-menu/choose-date'};
                                            Piwik.getTracker().trackEvent(menuEvent);
                                            
                                            that.onChooseDate();
                                        });

        }

        if (this.getParam('siteChooser', false)) {
            Piwik.UI.OptionMenu.addItem({title : _('General_ChooseWebsite'),
                                         icon: 'images/menu_chooseDown.png'},
                                         function () {

                                            var menuEvent = {title: 'Option Menu Choose Site',
                                                             url: '/android-option-menu/choose-site'};
                                            Piwik.getTracker().trackEvent(menuEvent);
                                             
                                            that.onChooseSite();
                                        });
        }

        if (this.getParam('settingsChooser', false) || this.getParam('optionMenuSettingsChooser', false)) {
            Piwik.UI.OptionMenu.addItem({title :  _('General_Settings'),
                                         icon: 'images/menu_settings.png'},
                                         function () {

                                            var menuEvent = {title: 'Option Menu Open Settings',
                                                             url: '/android-option-menu/open-settings'};
                                            Piwik.getTracker().trackEvent(menuEvent);
                                             
                                             that.onChooseSettings();
                                         });
        }
    };

    /**
     * Changes the current selected period.
     *
     * @param {string} period   The selected period, for example 'week', 'year', ...
     */
    this.changePeriod = function (period) {
    
        if (!period || this.period == period) {
        
            return;
        }
    
        this.period = period;

        var session = Piwik.require('App/Session');
        session.set('piwik_parameter_period', period);
    };

    /**
     * Changes the current selected date and fires an event named 'onDateChanged' using the object.
     * The passed event contains a property named 'date' which holds the changed value in the format 'YYYY-MM-DD' and a 
     * property named period which holds the selected period, for example 'week'. 
     *
     * @param   {Date}   changedDate    The selected/changed date.
     * @param   {string} period         The selected/changed period.
     *
     * @fires   Piwik.UI.Menu#event:onDateChanged
     */
    this.changeDate   = function (changedDate, period) {
        this.changePeriod(period);
            
        this.date     = changedDate;
        
        var dateQuery = this.date.toPiwikQueryString();

        var session   = Piwik.require('App/Session');
        session.set('piwik_parameter_date', dateQuery);

        this.fireEvent('onDateChanged', {date: dateQuery, period: this.period, type: 'onDateChanged'});
    };
};

/**
 * Extend Piwik.UI.View
 */
Piwik.UI.Menu.prototype = Piwik.require('UI/View');