/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/** @private */
var Piwik = require('library/Piwik');
 
/**
 * @class    Creates an Android specific option menu which is accessible on each screen via the hardware menu button.
 *           You can add items to the menu from any context by using the addItem method.
 *           The item will only be added if the current platform is Android at the moment. There is no equivalent on
 *           iOS.
 *
 * @see      <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.Android.Menu-object">Option Menu Module API description</a>
 *
 * @exports  OptionMenu as Piwik.UI.OptionMenu
 * @static
 */
function OptionMenu () {

    /**
     * Holds an instance of the Android Option Menu. See <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.Android.Menu-object">Option Menu Module API description</a>
     * 
     * @type  Titanium.Android.Menu
     */
    this.menu    = null;

    /**
     * Defines whether the current platform supports option menus. False if it is not supported, true otherwise.
     * 
     * @default false
     *
     * @type  boolean
     */
    this.hasMenu = false;

    /**
     * Builds the menu depending on the current displayed window.
     */
    this.build = function () {
        if (!this.hasMenu || !this.menu) {
            
            return;
        }

        var menu = this.menu;

        // remove all previous added menu items cause we are going to rebuild the menu.
        menu.clear();

        var view = Piwik.getUI().currentWindow;
        
        if (!view || !view.menuItems) {
            Piwik.getLog().warn('cant build menu, no zIndex', 'Piwik.UI.OptionMenu::build');

            return;
        }

        var menuItems = view.menuItems;

        if (!menuItems || !menuItems.length) {
            Piwik.getLog().warn('cant build menu, no menu items', 'Piwik.UI.OptionMenu::build');

            return;
        }

        var alreadyAddedMenuItems = {};
        var options               = null;
        var item                  = null;
        
        for (var index = 0; index < menuItems.length; index++) {
            options = menuItems[index].options;

            if (alreadyAddedMenuItems[options.title]) {
                // make sure the same menu entry will not be added twice
                continue;
            }

            alreadyAddedMenuItems[options.title] = true;

            item = menu.add(options);
            item.addEventListener('click',  menuItems[index].onClick);
            
            if (options.icon) {
                item.setIcon(options.icon);
            }
        }

        options = null;
        item    = null;
    };

    /**
     * Adds an item to the current menu. 
     *
     * @param  {Object}    options  Options which shall be used to create the menu item, like title, icon, and so on.
     *                              Have a look here for a list of all available options: <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.Android.OptionMenu.MenuItem-object.html">Menu Item Module API Description</a>
     * @param  {Function}  onClick  An onclick callback function which will be executed as soon as the user selects
     *                              the menu item.
     */
    this.addItem = function (options, onClick) {
        if (!this.hasMenu) {
            return;
        }

        var view = Piwik.getUI().currentWindow;

        if (!view) {
            Piwik.getLog().warn("Can't add item, no window exists", 'Piwik.UI.OptionMenu::addItem');
            // no window exists at this moment
            
            return;
        }

        var menuItems  = view.menuItems;
        // Titanium has issues with view.menuItems.push(); on Android
        // but menuItems = view.menuItems;menuItems.push();view.menuItems = menuItems works

        if (!view.menuItems) {
            menuItems  = [];
        }

        menuItems.push({options: options, onClick: onClick});
        view.menuItems = menuItems;
    };

    /**
     * Cleanup a previous stored menu as soon as the view will be closed.
     *
     * @param  {Piwik.UI.Window}  view  An instance of the window which will be currently closed.
     */
    this.cleanupMenu = function (view) {
        if (!this.hasMenu) {
            
            return;
        }
        
        if (!view) {

            return;
        }

        view.menuItems = [];
    };
    
    /**
     * Activates the usage of the option menu and initializes the menu.
     */
    this.init = function () {

        // activate option menu
        this.hasMenu = true;
        
        var activity = null;
            
        if (Ti.UI.currentWindow && Ti.UI.currentWindow.activity) {
            activity = Ti.UI.currentWindow.activity;
        } else if (Ti.Android && Ti.Android.currentActivity) {
            activity = Ti.Android.currentActivity;
        }
        
        if (!activity) {

            return;
        }

        var that = this;
        
        activity.onPrepareOptionsMenu = function(event) {
            // this event is fired each time a user presses the hardware menu key

            if (that.menu) {

                that.build();
                
                return;
            }

            if (!event || !event.menu) {
                Piwik.getLog().debug('No event given in OnCreateOptionsMenu', 'Piwik.UI.OptionMenu::onPrepareOptionsMenu');
                
                return;
            }

            that.menu = event.menu;
            that.build();
        };
    };
}

module.exports = new OptionMenu();

if (Piwik.getPlatform().isAndroid) {
    // enable option menu for android
    module.exports.init();
}