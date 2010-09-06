/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 *
 * @fileOverview Creates an Android specific menu accessible on each screen
 */
if ('android' === Titanium.Platform.osname) {

    var menu = Titanium.UI.Android.OptionMenu.createMenu();
     
    var settingsItem = Titanium.UI.Android.OptionMenu.createMenuItem({
        title : _('General_Settings'),
        icon : 'images/icon/settings.png'
    });
     
    settingsItem.addEventListener('click', function(){
        Window.createMvcWindow({jsController: 'settings',
                                jsAction: 'index'});
    });

    menu.add(settingsItem);
     
    Titanium.UI.Android.OptionMenu.setMenu(menu);
    
}
