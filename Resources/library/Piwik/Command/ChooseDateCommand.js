/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/** @private */
var Piwik       = require('library/Piwik');

/**
 * @class     Choose a date and a period command.
 * 
 * @param     {Object}       [params]               See {@link Piwik.UI.View#setParams} 
 * @param     {string}       [params.period="day"]  Optional. The current active period. 
 * @param     {Date|string}  [params.date]          Optional. The current selected date. Can be either a Date 
 *                                                  object or string in the following Format 
 *                                                  "YYYY-MM-DD". Defaults to the current date (now). 
 *
 * @exports   ChooseDateCommand as Piwik.Command.ChooseDateCommand
 * @augments  Piwik.UI.View
 */
function ChooseDateCommand () {
    
    /**
     * The event will be fired as soon as the user changes the daterange (date or period).
     * The event will be fired in multiple contexts.
     *
     * @name   Piwik.Command.ChooseDateCommand#event:onDateChanged
     * @event
     *
     * @param  {Object}  event
     * @param  {string}  event.type    The name of the event.
     * @param  {string}  event.date    The current active, possibly changed, date value in the format
     *                                 'YYYY-MM-DD'.
     * @param  {string}  event.period  The current active, possibly changed, period value. For example
     *                                 'day' or 'week'.
     */

    /**
     * Holds the current date which the chooser internally works with.
     * 
     * @defaults  null
     * 
     * @type     Date
     */
    this.date   = null;
    
    /**
     * Holds the current period which the chooser internally works with.
     * 
     * @defaults  "day"
     *
     * @type      string
     */
    this.period = 'day';
}

/**
 * Extend Piwik.UI.View
 */
ChooseDateCommand.prototype = Piwik.require('UI/View');

/**
 * Returns a unique id for this command.
 * 
 * @returns  {string}  The id of the command.
 */
ChooseDateCommand.prototype.getId = function () {
    return 'chooseDateCommand';
};
    
/**
 * Get the label/title of the command which is intended to be displayed.
 * 
 * @returns  {string}  The label of the command.
 */
ChooseDateCommand.prototype.getLabel = function () {

    var _  = require('library/underscore');
    
    return _('General_ChooseDate');
};

/**
 * Get the buttonBar label definition for this command. It is intended for Ti.UI.ButtonBar
 * 
 * @returns {Object}   The button label of the command.
 */
ChooseDateCommand.prototype.getButtonLabel = function () {};

/**
 * Get the menu icon definitions for this command.
 * 
 * @type  Object
 */
ChooseDateCommand.prototype.getMenuIcon = function () {};

/**
 * Defines the url and title that will be tracked as soon as the user taps on the menu icon.
 * 
 * @type  Object
 */
ChooseDateCommand.prototype.getMenuTrackingEvent = function () {
    return {title: 'Menu Click - Choose Date',
            url: '/menu-click/choose-date'};
};

/**
 * Execute the command. Opens a dialog where the user can choose another date/period. The date and the period 
 * parameter has to be set in order to execute this action. 
 */
ChooseDateCommand.prototype.execute = function (params) {
    
    if (!params) {
        params = {};
    }
    
    this.period    = this.getParam('period', this.period);
    var optionDate = this.getParam('date', new Date());
 
    if ('string' === (typeof optionDate).toLowerCase()) {
        var stringUtils = Piwik.require('Utils/String');
        this.date       = stringUtils.toPiwikDate(optionDate);
        stringUtils     = null;
    } else {
        this.date       = optionDate;
    }
    
    var max     = new Date();
    var min     = new Date(2008, 0, 1);
    var picker  = this.create('DatePicker', {value: this.date,
                                             maxDate: max,
                                             period: this.period,
                                             selectionIndicator: true,
                                             source: params.source ? params.source : null,
                                             minDate: min});

    var that    = this;
    picker.addEventListener('onSet', function (event) {
        that.changeDate(event.date, event.period);
    });
    
    params = null;
    picker = null;
};

/**
 * Undo the executed command.
 */
ChooseDateCommand.prototype.undo = function () {
    
};

/**
 * Changes the current selected period.
 *
 * @param  {string}  period  The selected period, for example 'week', 'year', ...
 */
ChooseDateCommand.prototype.changePeriod = function (period) {

    if (!period || this.period == period) {
    
        return;
    }

    this.period = period;

    var session = Piwik.require('App/Session');
    session.set('piwik_parameter_period', period);
    session     = null;
};

/**
 * Changes the current selected date and fires an event named 'onDateChanged' using the object.
 * The passed event contains a property named 'date' which holds the changed value in the format 'YYYY-MM-DD' and a 
 * property named period which holds the selected period, for example 'week'. 
 *
 * @param  {Date}    changedDate  The selected/changed date.
 * @param  {string}  period       The selected/changed period.
 *
 * @fires  Piwik.Command.ChooseDateCommand#event:onDateChanged
 */
ChooseDateCommand.prototype.changeDate   = function (changedDate, period) {
    this.changePeriod(period);
        
    this.date     = changedDate;

    var dateUtils = Piwik.require('Utils/Date');
    var dateQuery = dateUtils.toPiwikQueryString(this.date);
    dateUtils     = null;

    var session   = Piwik.require('App/Session');
    session.set('piwik_parameter_date', dateQuery);
    session       = null;

    this.fireEvent('onDateChanged', {date: dateQuery, period: this.period, type: 'onDateChanged'});
};

module.exports = ChooseDateCommand;