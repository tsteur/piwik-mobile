/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Creates an Android specific menu accessible on each screen. You can add items to the menu from any context
 *          by using the addItem method. The item will only be added if the current OS is android.
 *
 * @see <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.Android.OptionMenu-module">Option Menu Module API description</a>
 *
 * @static
 */
var Ui_Menu = {

    /**
     * Defines whether the current system supports option menus. False if it is not supported, true otherwise.
     * 
     * @default false
     *
     * @type boolean
     */
    hasMenu: false,

    /**
     * Builds the menu depending on the current displayed window. Call this method everytime a window will be closed
     * or opened to ensure the correct menu will be displayed.
     *
     * @type null
     */
    build: function () {
        if (!Ui_Menu.hasMenu) {
            return;
        }
        
        var menu = Titanium.UI.Android.OptionMenu.createMenu();
        var item = Titanium.UI.Android.OptionMenu.createMenuItem({title: _('General_Settings'), 
                                                                  icon:  'images/icon/menu_settings.png'});
        item.addEventListener('click', function () {
            Window.createMvcWindow({jsController: 'settings',
                                    jsAction:     'index'});
        });
        
        menu.add(item);
        
        var view = Window.getCurrentWindow();
        
        if (!view || !view.zIndex) {
            Titanium.UI.Android.OptionMenu.setMenu(menu);
        
            return;
        }
        
        var menuItems = Session.get('menuItems' + view.zIndex, []);
        
        if (!menuItems || !menuItems.length) {
            Titanium.UI.Android.OptionMenu.setMenu(menu);
        
            return;
        }
        
        for (var index = 0; index < menuItems.length; index++) {
            item = Titanium.UI.Android.OptionMenu.createMenuItem(menuItems[index].options);
            item.addEventListener('click', menuItems[index].onClick);
        
            menu.add(item);
        }
        
        Titanium.UI.Android.OptionMenu.setMenu(menu);
    },

    /**
     * Adds an item to the current menu. Adds the item only if the current OS is Android.
     *
     * @param   {Object}    options  Options which shall be used to create the menu item, like title, icon, and so on.
     *                               Have a look here for a list of all available options: {@link http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.Android.OptionMenu.MenuItem-object.html}
     * @param   {Function}  onClick  An onclick callback function which will be executed as soon as the user clicks 
     *                               this menu item.
     *
     * @type null
     */
    addItem: function (options, onClick) {
        if (!Ui_Menu.hasMenu) {
            return;
        }
        
        var view = Window.getCurrentWindow();
        
        if (!view || !view.zIndex) {
            Log.warn('Can not add menu item cause there is no view', 'Ui_Menu');
            
            return;
        }
        
        var menuItems = Session.get('menuItems' + view.zIndex, []);
        
        menuItems.push({options: options, onClick: onClick});
        
        Session.set('menuItems' + view.zIndex, menuItems);
    },

    /**
     * Cleanup a previous stored menu as soon as the view will be closed.
     *
     * @param   {View}    view  An instance of the window which will be currently closed.
     *
     * @type null
     */
    cleanupMenu: function (view) {
        if (!Ui_Menu.hasMenu) {
            return;
        }
        
        if (!view || !view.zIndex) {
            return;
        }
        
        Session.remove('menuItems' + view.zIndex);
    }
};

if ('android' === Titanium.Platform.osname) {
    // enable menu for android
    Ui_Menu.hasMenu = true;
}
