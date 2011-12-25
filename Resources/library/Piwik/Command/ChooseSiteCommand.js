/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   Choose another website command.
 *
 * @augments Piwik.UI.View
 */
Piwik.Command.ChooseSiteCommand = function () {
    
    /**
     * The event will be fired as soon as the user changes the selected site.
     *
     * @name    Piwik.Command.ChooseSiteCommand#event:onSiteChanged
     * @event
     *
     * @context {Ti.App}
     * @context {Piwik.UI.Menu}
     *
     * @param   {Object}    event
     * @param   {string}    event.type       The name of the event.
     * @param   {Object}    event.site       The changed site.
     */

    /**
     * Returns a unique id for this command.
     * 
     * @returns {string}   The id of the command.
     */
    this.getId = function () {
        return 'chooseSiteCommand';
    };
        
    /**
     * Get the label/title of the command which is intended to be displayed.
     * 
     * @returns {string}   The label of the command.
     */
    this.getLabel = function () {
        return _('General_ChooseWebsite');
    };
    
    /**
     * Get the buttonBar label definition for this command. It is intended for Ti.UI.ButtonBar
     * 
     * @returns {Object}   The button label of the command.
     */
    this.getButtonLabel = function () {
        return {image: 'images/header_globe.png',
                command: this,
                width: 37};
    };
    
    /**
     * Get the Android OptionMenu item definition for this command.
     * 
     * @type Object
     */
    this.getOptionMenuItem = function () {
        return {title: this.getLabel(),
                icon: 'images/menu_chooseDown.png'};
    };

    /**
     * Defines the url and title that will be tracked as soon as the user chooses the option.
     * 
     * @type Object
     */
    this.getOptionMenuTrackingEvent = function () {
        return {title: 'Option Menu Choose Site',
                url: '/android-option-menu/choose-site'};
    };
    
    /**
     * Get the menu icon definitions for this command.
     * 
     * @type Object
     */
    this.getMenuIcon = function () {
        return {id: 'menuSiteChooserIcon'};
    };

    /**
     * Defines the url and title that will be tracked as soon as the user taps on the menu icon.
     * 
     * @type Object
     */
    this.getMenuTrackingEvent = function () {
        return {title: 'Menu Click - Choose Site',
                url: '/menu-click/choose-site'};
    };
    
    /**
     * Execute the command.
     */
    this.execute = function (params) {
                
        if (!params) {
            params = {};
        }

        var that = this;
        
        var win  = this.create('ModalWindow', {openView: params.source ? params.source : null, 
                                              title: _('General_ChooseWebsite')});

        var websitesList = this.create('WebsitesList', {view: win.getView(),
                                                        displaySparklines: false});

        var onChooseSite = function (event) {
            if (!event || !event.site) {

                return;
            }

            that.fireEvent('onSiteChanged', {site: event.site, type: 'onSiteChanged'});

            // fire further event so other windows are able to listen to this event, too
            Ti.App.fireEvent('onSiteChanged', {site: event.site, type: 'onSiteChanged'});

            try {
                // window
                win.close();
            } catch (e) {
                Piwik.Log.warn('Failed to close site chooser window', 'Piwik.UI.Menu::onChooseSite');
            }
            
            websitesList = null;
        };

        websitesList.addEventListener('onChooseSite', onChooseSite);
        
        websitesList.request();

        win.open();
    };
    
    /**
     * Undo the executed command.
     */
    this.undo = function () {
        
    };
};

/**
 * Extend Piwik.UI.View
 */
Piwik.Command.ChooseSiteCommand.prototype = Piwik.require('UI/View');