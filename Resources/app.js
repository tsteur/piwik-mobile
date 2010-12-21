/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
// this sets the background color of the master UIView
Titanium.UI.setBackgroundColor('#ffffff');

var win = Titanium.UI.createWindow({url:          'master.js', 
                                    navBarHidden: true, 
                                    exitOnClose:  true, 
                                    backgroundColor: '#ffffff'});
win.open();
win.show();
