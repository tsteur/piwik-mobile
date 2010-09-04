/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
Titanium.include('/config.js');
Titanium.include('/library/Session.js');
Titanium.include('/library/Window.js');

// this sets the background color of the master UIView
Titanium.UI.setBackgroundColor(config.theme.backgroundColor);

var session = new Session(true);

// create root window
Window.createMvcWindow({jsController: 'index',
                        jsAction:     'index',
                        exitOnClose:  true});
