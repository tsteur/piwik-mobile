/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   Choose another metric command.
 *
 * @augments Piwik.UI.View
 */
Piwik.Command.ChooseMetricCommand = function () {
    
    /**
     * The event will be fired as soon as the user changes the metric.
     *
     * @name    Piwik.Command.ChooseMetricCommand#event:onMetricChanged
     * @event
     *
     * @param   {Object}    event
     * @param   {string}    event.type       The name of the event.
     * @param   {string}    event.metric     The selected metric.
     */
    
    /**
     * Returns a unique id for this command.
     * 
     * @returns {string}   The id of the command.
     */
    this.getId = function () {
        return 'chooseMetricCommand';
    };
        
    /**
     * Get the label/title of the command which is intended to be displayed.
     * 
     * @returns {string}   The label of the command.
     */
    this.getLabel = function () {
        return  _('Mobile_ChooseMetric');
    };
    
    /**
     * Get the buttonBar label definition for this command. It is intended for Ti.UI.ButtonBar
     * 
     * @returns {Object}   The button label of the command.
     */
    this.getButtonLabel = function () {};
    
    /**
     * Get the Android OptionMenu item definition for this command.
     * 
     * @type Object
     */
    this.getOptionMenuItem = function () {};

    /**
     * Defines the url and title that will be tracked as soon as the user chooses the option.
     * 
     * @type Object
     */
    this.getOptionMenuTrackingEvent = function () {};
    
    /**
     * Get the menu icon definitions for this command.
     * 
     * @type Object
     */
    this.getMenuIcon = function () {};

    /**
     * Defines the url and title that will be tracked as soon as the user taps on the menu icon.
     * 
     * @type Object
     */
    this.getMenuTrackingEvent = function () {};
    
    /**
     * Execute the command.
     */
    this.execute = function () {
        
        var metrics = this.getParam('metrics');

        if (!metrics) {
            return;
        }
        
        var options           = [];
        var internalNames     = [];
        var metricDisplayName = null;
        
        for (var metricInternalName in metrics) {
            if ('label' == metricInternalName) {
                continue;
            }
            
            metricDisplayName = metrics[metricInternalName];
            
            options.push(String(metricDisplayName));
            internalNames.push(String(metricInternalName));
        }
        
        options.push(_('SitesManager_Cancel_js'));
        
        var dialog = Titanium.UI.createOptionDialog({
            title: this.getLabel(),
            options: options,
            cancel:options.length - 1
        });
        
        var that = this;
        dialog.addEventListener('click', function (event) {
            if (!event || event.cancel === event.index || true === event.cancel) {

                return;
            }
            
            that.changeMetric(internalNames[event.index]);
        });
        
        dialog.show();
    };
    
    /**
     * Undo the executed command.
     */
    this.undo = function () {
        
    };
    
    /**
     * Changes the current selected metric and fires an event named 'onMetricChanged'.
     * The passed event contains a property named 'metric' which holds the changed value.
     *
     * @param   {string} metric         The changed metric.
     *
     * @fires   Piwik.Command.ChooseMetricCommand#event:onMetricChanged
     */
    this.changeMetric = function (metric) {
            
        this.metric = metric;
        
        this.fireEvent('onMetricChanged', {metric: metric, type: 'onMetricChanged'});
    };
};

/**
 * Extend Piwik.UI.View
 */
Piwik.Command.ChooseMetricCommand.prototype = Piwik.require('UI/View');