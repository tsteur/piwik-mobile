/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
Titanium.include('/config.js');
Titanium.include('/library/Log.js');
Titanium.include('/library/Session.js');
Titanium.include('/library/Settings.js');
Titanium.include('/library/Window.js');

// this sets the background color of the master UIView
Titanium.UI.setBackgroundColor(config.theme.backgroundColor);

var mySession = new Session(true);

// save default period and date in session on app start. so we only have to work with session when we want to access 
// chosen period/date.
mySession.set('piwik_parameter_period', Settings.getPiwikDefaultPeriod());
mySession.set('piwik_parameter_date', Settings.getPiwikDefaultDate());

// create root window
Window.createMvcWindow({jsController: 'index',
                        jsAction:     'index',
                        exitOnClose:  true});
