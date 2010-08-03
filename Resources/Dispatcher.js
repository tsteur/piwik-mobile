/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 *
 * @name         Dispatcher
 * @fileOverview The dispatcher processes a request/inititalize a new window. Therefore, it extracts the controller name, 
 *               action name and optional parameters and maps them to a specify controller / action. Then it 
 *               instantiates this controller and calls an action of that controller. If any of the controller, or 
 *               action are not defined, it will use default values for them. The default value for both controller and
 *               action is index.
 *               All available controllers are located in the "/controller" directory. The name of the controller 
 *               has to be upper case first. For example the controller name 'visitor' requires a file 
 *               'VisitorController.js' which includes a class named 'VisitorController'. The 'action' value is 
 *               mapped to a method of the controller class. The word 'Action' is appended automatically and the action 
 *               is lower case first. For example the Action 'overview' results in a final method
 *               called 'overviewAction'.
 */
 
/**
 * Because each new heavyweight window creates a new JavaScript sub-context that will run in its own thread, we have 
 * to initialize all needed classes again. Otherwise they are not available in this subcontext.
 */
Titanium.include('/config.js');
Titanium.include('/library/all.js');

Log.debug('start', 'Dispatcher');

var win    = Titanium.UI.currentWindow;

var params = win.params;

if (!params) {
    params = {};
}

if (!params.jsAction) {
    params.jsAction     = 'index';
}

if (!params.jsController) {
    params.jsController = 'index';
}

if (!params.view) {
    params.view = win;
}

View.prototype  = params.view;

var view        = new View(params);

// Ensure upper case first for controller name
var firstUpperChar       = params.jsController.charAt(0).toUpperCase();
var controllerUpperFirst = firstUpperChar + params.jsController.substr(1);

try {

    Titanium.include('/controller/' + controllerUpperFirst + 'Controller.js');
    
    // eval is not vulnerable here because all controller names are specified by us
    var jsController = eval('new '  + controllerUpperFirst + 'Controller()');
    
} catch (e) {

    Log.debug(e.name + ': ' + e.message, 'Dispatcher');
}

if (jsController) {

    jsController.setView(view);
    jsController.setParams(params);

    Log.debug('dispatch', 'dispatcher');
    
    if (jsController.init) {
        jsController.init();
    }
    
    if (jsController[params.jsAction + 'Action']) {
    
        try {

            jsController[params.jsAction + 'Action']();

        } catch (e) {
        
            // @todo implement an error controller
            Log.warn('An error occured in action ' + params.jsAction + ': ' + e.message, 'Dispatcher');
        }
        
    } else {
    
        Log.warn('the required action ' + params.jsAction + ' is not available', 'dispatcher');
    }
}

Log.debug('end', 'dispatcher');
