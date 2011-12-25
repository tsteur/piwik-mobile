/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class   Open settings screen command.
 *
 * @augments Piwik.UI.View
 */
Piwik.Command.OpenSettingsCommand = function () {
    
    /**
     * Returns a unique id for this command.
     * 
     * @returns {string}   The id of the command.
     */
    this.getId = function () {
        return 'openSettingsCommand';
    };
        
    /**
     * Get the label/title of the command which is intended to be displayed.
     * 
     * @returns {string}   The label of the command.
     */
    this.getLabel = function () {
        return  _('General_Settings');
    };
    
    /**
     * Get the buttonBar label definition for this command. It is intended for Ti.UI.ButtonBar
     * 
     * @returns {Object}   The button label of the command.
     */
    this.getButtonLabel = function () {
        return {image: 'images/header_settings.png',
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
                icon: 'images/menu_settings.png'};
    };

    /**
     * Defines the url and title that will be tracked as soon as the user chooses the option.
     * 
     * @type Object
     */
    this.getOptionMenuTrackingEvent = function () {
        return {title: 'Option Menu Open Settings',
                url: '/android-option-menu/open-settings'};
    };
    
    /**
     * Get the menu icon definitions for this command.
     * 
     * @type Object
     */
    this.getMenuIcon = function () {
        return {id: 'menuSettingsIcon'};
    };

    /**
     * Defines the url and title that will be tracked as soon as the user taps on the menu icon.
     * 
     * @type Object
     */
    this.getMenuTrackingEvent = function () {
        return {title: 'Menu Click - Open Settings',
                url: '/menu-click/open-settings'};
    };
    
    /**
     * Execute the command.
     */
    this.execute = function () {
        this.create('Window', {url: 'settings/index.js'}); 
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
Piwik.Command.OpenSettingsCommand.prototype = Piwik.require('UI/View');