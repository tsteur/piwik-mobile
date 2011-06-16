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
 *                                                                  Requires the otherwise optional 'currentSite'
 *                                                                  and 'allowedSites' parameters.
 * @param {string}     [params.settingsChooser="false"]             Optional. Adds an Android Option Menu and a
 *                                                                  button to the window where the user has the
 *                                                                  ability to open the "Settings" window.
 * @param {string}     [params.closeWindow="false"]                 Optional. Adds an Android Option Menu Item where
 *                                                                  the user has the possibility to close the current
 *                                                                  window.
 * @param {string}     [params.period="day"]        Optional. The current active period.
 * @param {Object}     [params.currentSite]         Optional. The current active site as an object.
 * @param {Array}      [params.allowedSites]        Optional. An array of sites where the user has at least
 *                                                  view access. The format has to be similar to
 *                                                  {@link http://piwik.org/demo/?module=API&method=SitesManager.getSitesWithAtLeastViewAccess&format=JSON&token_auth=anonymous}
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
            this.settingsIcon.addEventListener('click', function () { that.onChooseSettings(); });
            this.menuView.add(this.settingsIcon);

            this.siteChooserIcon = Ti.UI.createImageView({id: 'menuSiteChooserIcon'});
            this.siteChooserIcon.addEventListener('click', function () { that.onChooseSite(); });
            this.menuView.add(this.siteChooserIcon);

            this.dayChooserIcon  = Ti.UI.createImageView({id: 'menuDayChooserIcon'});
            this.dayChooserIcon.addEventListener('click', function () { that.onChooseDate(); });
            this.menuView.add(this.dayChooserIcon);
            
            this.addAccountIcon  = Ti.UI.createImageView({id: 'menuAddAccountIcon'});
            this.addAccountIcon.addEventListener('click', function () { that.onAddAccount(); });
            this.menuView.add(this.addAccountIcon);
        }

        this.refresh();
        
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
        Piwik.UI.createWindow({url: 'settings/editaccount.js'});
    };

    /**
     * Opens the 'Settings' window
     */
    this.onChooseSettings = function () {
        Piwik.UI.createWindow({url: 'settings/index.js'}); 
    };

    /**
     * Opens a dialog where the user can choose another date/period. The date and the period parameter has to be
     * set in order to execute this action.
     */
    this.onChooseDate = function () {
        var max    = new Date();
        var min    = new Date(2008, 0, 1);
        var picker = Piwik.UI.createDatePicker({value: this.date,
                                                maxDate: max,
                                                period: this.period,
                                                selectionIndicator: true,
                                                minDate: min});

        var that   = this;
        picker.addEventListener('onSet', function (event) {
            that.changeDate(event.date, event.period);
        });
    };
    
    /**
     * Opens a dialog where the user can choose another website. The currentSite and the allowedSites parameter has to
     * be set in order to execute this action.
     *
     * @fires Piwik.UI.Menu#event:onSiteChanged
     */
    this.onChooseSite = function () {
        
        var currentSite      = this.getParam('currentSite', {name: '', accountId: null, idsite: null});
        // allowedSiteNames  = an array of all available site names ['demo.piwik.org', 'Piwik Forums', '...']
        var allowedSiteNames = [];
        var allowedSites     = this.getParam('allowedSites', []);
        var currentSiteIndex = null;

        // extract the names of each site to display them within an options dialog
        for (var index = 0; index < allowedSites.length; index++) {
        
            var site = allowedSites[index];

            if (site && site.name) {
                allowedSiteNames.push('' + site.name);
            } else {
                allowedSiteNames.push('');
            }

            // detect current selected site index so we are able to preselect it later
            if (site
                && currentSite
                && currentSite.accountId == site.accountId
                && currentSite.idsite == site.idsite
                && currentSite.name == site.name) {
                currentSiteIndex = index;
            }
        }

        allowedSiteNames.push(_('SitesManager_Cancel_js'));

        var dialog = Ti.UI.createOptionDialog({
            title: _('General_ChooseWebsite'),
            options: allowedSiteNames,
            cancel: (allowedSiteNames.length - 1)
        });

        if (null !== currentSiteIndex) {
            dialog.selectedIndex = currentSiteIndex;
        }

        var that = this;
        dialog.addEventListener('click', function (event) {

            // android reports cancel = true whereas iOS returns the previous defined cancel index
            if (!event || event.cancel === event.index || true === event.cancel) {

                return;
            }

            if (event.index == currentSiteIndex) {
                // user selected same value as already selected, we don't have to fire a change event therefore.

                return;
            }

            var selectedSite = allowedSites[event.index];
            currentSiteIndex = event.index;

            if (selectedSite) {

                that.fireEvent('onSiteChanged', {site: selectedSite, type: 'onSiteChanged'});

                // fire further event so other windows are able to listen to this event, too
                Ti.App.fireEvent('onSiteChanged', {site: selectedSite, type: 'onSiteChanged'});
            }
        });

        dialog.show();
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
                Ti.UI.currentWindow.rightNavButton = null;
            }

            // always reset left nav button
            Ti.UI.currentWindow.leftNavButton = null;

            if (labels.length) {
                this.toolBar = Ti.UI.createButtonBar({labels: labels,
                                                      id: 'menuButtonBar'});

                Ti.UI.currentWindow.rightNavButton = this.toolBar;

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
            if (layout && layout.header && layout.header.titleLabel.right) {
                layout.header.titleLabel.right = right + 'dp';
            }
        }

        if (this.getParam('addAccountChooser', false) || this.getParam('optionMenuAddAccountChooser', false)) {
            Piwik.UI.OptionMenu.addItem({title: _('Mobile_AddAccount'),
                                         icon: 'images/menu_add.png'},
                                        function () {
                                            that.onAddAccount();
                                        });
        }

        if (this.getParam('dayChooser', false)) {

            Piwik.UI.OptionMenu.addItem({title: _('General_ChooseDate'),
                                         icon: 'images/menu_choosedate.png'},
                                        function () {
                                            that.onChooseDate();
                                        });

        }

        if (this.getParam('siteChooser', false)) {
            Piwik.UI.OptionMenu.addItem({title : _('General_ChooseWebsite'),
                                         icon: 'images/menu_chooseDown.png'},
                                         function () {
                                            that.onChooseSite();
                                        });
        }

        if (this.getParam('settingsChooser', false) || this.getParam('optionMenuSettingsChooser', false)) {
            Piwik.UI.OptionMenu.addItem({title :  _('General_Settings'),
                                         icon: 'images/menu_settings.png'},
                                         function () {
                                             that.onChooseSettings();
                                         });
        }

        if (this.getParam('closeWindow', false)) {

            Piwik.UI.OptionMenu.addItem({title: _('General_Close')}, function (event) {
                Piwik.UI.currentWindow.close();
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