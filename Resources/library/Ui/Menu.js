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
     * Is null if current os is not Android. Otherwise it holds the current instance of the menu as described at 
     * {@link http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.Android.OptionMenu.Menu-object.html}
     * 
     * @defaults null
     * 
     * @type null|Titanium.UI.Android.OptionMenu.Menu
     */
    menu: null,

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
        if (!Ui_Menu.menu) {
            return;
        }
        
        var item = Titanium.UI.Android.OptionMenu.createMenuItem(options);
         
        item.addEventListener('click', onClick);

        Ui_Menu.menu.add(item);
        
        Titanium.UI.Android.OptionMenu.setMenu(Ui_Menu.menu);
    }
};

if ('android' === Titanium.Platform.osname) {

    // create initial menu
    Ui_Menu.menu = Titanium.UI.Android.OptionMenu.createMenu();
    
    // display a settings item on every screen
    Ui_Menu.addItem({title: _('General_Settings'), icon: 'images/icon/settings.png'}, function () {
        Window.createMvcWindow({jsController: 'settings',
                                jsAction: 'index'});
    });
}
