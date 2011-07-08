/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$

 * @fileOverview File that will be executed on app start
 */
 
// set the background color of the master UIView
Ti.UI.setBackgroundColor('#ffffff');

var options = {url: 'bootstrap.js',
               exitOnClose:  true,
               softInputMode: Ti.UI.Android ? Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE : '',
               className: 'mainwindow'};

var win     = Ti.UI.createWindow(options);

if (Ti.Platform.name == 'android') {
    
    win.open();

} else {

    var tabGroup = Ti.UI.createTabGroup();
    var tab1     = Ti.UI.createTab({
        title: ' ',
        window: win
    });

    tabGroup.addTab(tab1);
    tabGroup.open();
}