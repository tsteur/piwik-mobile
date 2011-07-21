/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   A date picker is created by the method Piwik.UI.createDatePicker. A date picker can be used to select a date
 *          within a given range. The date picker does also allow to select a period like 'day' or 'week'.
 * 
 * @see <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.Picker-object">Titanium.UI.Picker</a>
 *
 * @augments Piwik.UI.View
 *
 * @todo rename to Piwik.UI.DateRangePicker
 */
Piwik.UI.DatePicker = function () {

    /**
     * This event will be fired as soon as the user confirms the selected/changed date. It is not triggered on
     * each change.
     *
     * @name    Piwik.UI.DatePicker#event:onSet
     * @event
     *
     * @param   {Object}    event
     * @param   {string}    event.type       The name of the event.
     * @param   {Date}      event.date       The current selected date.
     * @param   {string}    event.period     The current selected period, for example 'day'.
     */

    /**
     * The current select value. Value is null if no value was previously set or selected.
     *
     * @type null|Date
     */
    this.value      = null;

    /**
     * The current selected period.
     *
     * @defaults "day"
     *
     * @type string
     */
    this.period     = 'day';

    /**
     * An instance of an OptionDialog used on Android to display the date and period chooser.
     *
     * @type Titanium.UI.OptionDialog|null
     */
    this.dateDialog = null;

    /**
     * Initializes and renders the date picker.
     *
     * @param    {Object}    params             See <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.Picker-object.html">Titanium API</a> for a list of all available parameters.
     * @param    {Date}      params.value       The currently active date, preselected value
     * @param    {Date}      params.minDate     The minimum date for value
     * @param    {Date}      params.maxDate     The maximum date for value
     * @param    {String}    params.period      The currently active period
     *
     * @type Piwik.UI.DatePicker|null
     *
     * @returns A date picker instance on android, a Ti.UI.Picker instance on iOS. Returns null if creation was not
     *          successful
     *
     * @todo Open iPad DatePicker in a PopOver as recommended by apple
     */
    this.init = function (params) {

        if (this.getParam('period')) {
            this.period = this.getParam('period');
        }

        if (this.getParam('value')) {
            this.value  = this.getParam('value');
        }

        if (Piwik.isIos) {

            return this.createIos(params);
        }
    
        this.createAndroid();

        return this;
    };

    /**
     * Renders the iOS date picker by adding a toolbar (to select a period) and a date picker to the current opened
     * window, like an overlay.
     *
     * @param    {Object}   params   Parameters as defined in {@link Piwik.UI.DatePicker#init}
     *
     * @type Piwik.UI.DatePicker
     *
     * @fires    Piwik.UI.DatePicker#event:onSet
     */
    this.createIos = function (params) {
        var win;

        if (Piwik.isIpad && Ti.UI.iPad) {
            win = Ti.UI.iPad.createPopover({width: 320, 
                                            height: 430, 
                                            title: _('General_ChooseDate')});
        } else {
            
            win = Ti.UI.createWindow({modal: true,
                                      barColor: '#B2AEA5',
                                      title: _('General_ChooseDate')});
        }
        
        var that  = this;

        params.id = 'datePicker';

        try {
            var datePicker = Ti.UI.createPicker(params);
            datePicker.addEventListener('change', function (event) {
                that.value = event.value;
            });

            win.add(datePicker);

        } catch (e) {
            Piwik.Log.error('Failed to create picker' + e.message, 'Piwik.UI.DatePicker::createIos');

            return;
        }

        var periods   = [Piwik.UI.createTableViewRow({title: _('CoreHome_PeriodDay'),
                                                      period: 'day',
                                                      hasCheck: ('day' == this.period)}),
                         Piwik.UI.createTableViewRow({title: _('CoreHome_PeriodWeek'),
                                                      period: 'week',
                                                      hasCheck: ('week' == this.period)}),
                         Piwik.UI.createTableViewRow({title: _('CoreHome_PeriodMonth'),
                                                      period: 'month',
                                                      hasCheck: ('month' == this.period)}),
                         Piwik.UI.createTableViewRow({title: _('CoreHome_PeriodYear'),
                                                      period: 'year',
                                                      hasCheck: ('year' == this.period)})];

        var tableView = Ti.UI.createTableView({id: 'datePickerPeriodTableView',
                                               bottom: datePicker.height,
                                               data: periods});

        tableView.addEventListener('click', function (event) {
           for (var index = 0; index < 4; index++) {
               periods[index].hasCheck = false;
           }

            that.period        = event.rowData.period;
            event.row.hasCheck = true;
        });

        win.add(tableView);
        
        if (!Piwik.isIpad) {
            
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
        }

        var doneButton    = Ti.UI.createButton({title: _('General_Done'),
                                                style: Ti.UI.iPhone.SystemButtonStyle.DONE});
        doneButton.addEventListener('click', function () {

            try {
                var myEvent = {date: that.value, period: that.period, type: 'onSet'};

                that.fireEvent('onSet', myEvent);
                
                if (win && win.close) {
                    // window
                    win.close();
                } else if (win && win.hide) {
                    // popover
                    win.hide();
                }
            } catch (e) {
                Piwik.Log.warn('Failed to close site chooser window', 'Piwik.UI.Menu::onChooseSite');
            }
        });

        win.rightNavButton = doneButton;

        if (Piwik.isIpad) {
            win.show({view: params.source ? params.source : null});
        } else {
            win.open();
        }

        return this;
    };

    /**
     * Renders the Android date picker by using an OptionDialog.
     */
    this.createAndroid = function () {

        var view        = Ti.UI.createView({id: 'datePickerView'});

        this.dateDialog = Ti.UI.createOptionDialog({
            title: '',
            options: null,
            androidView: view
        });

        this.addDateSelector(view);
        this.addPeriodSelector(view);
        this.addButtons(this.dateDialog);

        this.setValue(this.value);

        this.dateDialog.show();

        return this;
    };

    /**
     * Updates the title of the android option dialog depending on the current selected date and period value. Only for
     * Android.
     *
     * @private
     */
    this._updateDisplayedValues = function () {

        if (!this.dateDialog) {
            Piwik.Log.warn('dateDialog does not exist: ' + Piwik.osName, 'Piwik.UI.DatePicker::updateDisplayedValues');

            return;
        }

        var period     = '';
        switch (this.period) {
            case 'day':
                period = _('CoreHome_PeriodDay');
                break;
            case 'week':
                period = _('CoreHome_PeriodWeek');
                break;
            case 'month':
                period = _('CoreHome_PeriodMonth');
                break;
            case 'year':
                period = _('CoreHome_PeriodYear');
                break;
        }

        this.dateDialog.title = period + ', ' + this.value.toPiwikDateRangeString(this.period);
    };

    /**
     * Sets a new value and refreshes the displayed date value.
     *
     * @param   {Date}    value    The current selected date value.
     */
    this.setValue  = function (value) {

        this.value = value;

        this._updateDisplayedValues();
    };

    /**
     * Adds the date selector to the given view.
     * 
     * @param   {Titanium.UI.View}    view    A view where the date selector will be rendered into.
     */
    this.addDateSelector = function (view) {

        var params = this.getParams();
        params.id  = 'datePickerDatePicker';

        var picker = Ti.UI.createPicker(params);

        var that   = this;
        // the change event is triggered on each date change
        picker.addEventListener('change', function (event) {
            that.setValue(event.value);
        });

        view.add(picker);
    };

    /**
     * Adds the period selector to the given view. Automatically updates the displayed title on each period change.
     *
     * @param   {Titanium.UI.View}    view    A view where the date selector will be rendered into.
     */
    this.addPeriodSelector = function (view) {

        var periodPicker = Ti.UI.createPicker({id: 'datePickerPeriodPicker'});

        var periods      = [];
        periods[0]       = Ti.UI.createPickerRow({title: _('CoreHome_PeriodDay')});
        periods[1]       = Ti.UI.createPickerRow({title: _('CoreHome_PeriodWeek')});
        periods[2]       = Ti.UI.createPickerRow({title: _('CoreHome_PeriodMonth')});
        periods[3]       = Ti.UI.createPickerRow({title: _('CoreHome_PeriodYear')});
        periodPicker.add(periods);

        if ('day' == this.period) {
            periodPicker.setSelectedRow(0, 0, false);
        } else if ('week' == this.period) {
            periodPicker.setSelectedRow(0, 1, false);
        } else if ('month' == this.period) {
            periodPicker.setSelectedRow(0, 2, false);
        } else if ('year' == this.period) {
            periodPicker.setSelectedRow(0, 3, false);
        }

        var that = this;

        periodPicker.addEventListener('change', function (event) {

            switch (event.rowIndex) {
                case 1:
                    that.period = 'week';
                    break;

                case 2:
                    that.period = 'month';
                    break;

                case 3:
                    that.period = 'year';
                    break;

                default:
                    that.period = 'day';
            }

            that._updateDisplayedValues();
        });

        view.add(periodPicker);
    };

    /**
     * Adds an 'Update' and a 'Cancel' button to the Android Date Dialog.
     *
     * @param   {Titanium.UI.OptionDialog}    dateDialog    An option dialog view.
     *
     * @fires   Piwik.UI.DatePicker#event:onSet
     */
    this.addButtons = function (dateDialog) {

        if (!dateDialog) {
            Piwik.Log.warn('dateDialog does not exist: ' + Piwik.osName, 'Piwik.UI.DatePicker::addButtons');

            return;
        }
        
        dateDialog.buttonNames = [_('SitesManager_Cancel_js'), _('CoreUpdater_UpdateTitle')];
        dateDialog.cancel      = 0;

        var that = this;

        dateDialog.addEventListener('click', function (event) {

            if (!event || !event.index) {
                // user pressed cancel button
                
                return;
            }

            if (1 == event.index) {
                // fire event only if user pressed Update button
                var myEvent = {date: that.value, period: that.period, type: 'onSet'};
                that.fireEvent('onSet', myEvent);
            }
        });
    };
};

/**
 * Extend Piwik.UI.View
 */
Piwik.UI.DatePicker.prototype = Piwik.require('UI/View');