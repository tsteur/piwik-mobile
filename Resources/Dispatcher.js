/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   The dispatcher dispatches a new request/window. Therefore, it extracts the controller name, 
 *          action name and optional parameters and maps them to a specific controller / action. Then it 
 *          instantiates this controller and calls an action of that controller. If any of the controller, or 
 *          action are not defined, it will use default values for them. The default value for both controller and
 *          action is index.
 *          All available controllers are located in the "/controller" directory. The name of the controller 
 *          has to be upper case first. For example the controller name 'visitor' requires a file 
 *          'VisitorController.js' which includes a class named 'VisitorController'. The 'action' value is 
 *          mapped to a method of the controller class. The word 'Action' is appended automatically and the action 
 *          is lower case first. For example the Action 'overview' results in a final method
 *          called 'overviewAction'.
 *
 * @static
 */
var Dispatcher = {};

/**
 * Dispatches a new request.
 * 
 * @param   {View}    win                       An instance of the View class. Everything will be rendered into this 
 *                                              view while dispatching the request.
 * @param   {Object}  win.params                Parameters which defines what should be dispatched
 * @param   {string}  [win.params.jsController='index']   The name of the controller
 * @param   {string}  [win.params.jsAction='index']       The name of the action
 * 
 * @type null
 */
Dispatcher.dispatch = function (win) {
    Log.debug('start', 'Dispatcher');

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
    
    if (isAndroid) { 
        var dispatchView = params.view;
        var tempview     = new View(params);
        for (viewProperty in tempview) {
            dispatchView[viewProperty] = tempview[viewProperty];
        }
    } else {
        View.prototype   = params.view;

        var dispatchView = new View(params);
    }
    
    dispatchView.init();

    // Ensure upper case first for controller name
    var firstUpperChar       = params.jsController.charAt(0).toUpperCase();
    var controllerUpperFirst = firstUpperChar + params.jsController.substr(1);

    try {

        var jsController = null;
        
        loadFile('/controller/' + controllerUpperFirst + 'Controller.js');
            
        // eval is not vulnerable here because all controller names are specified by us
        jsController     = eval('new '  + controllerUpperFirst + 'Controller()');
        
    } catch (e) {

        Log.debug(e.name + ': ' + e.message, 'Dispatcher');
    }

    if (jsController) {

        jsController.setView(dispatchView);
        jsController.setParams(params);

        Log.debug('dispatch', 'dispatcher');
        
        if (jsController.init) {
            jsController.init();
        }
        
        if (jsController[params.jsAction + 'Action']) {
        
            try {

                jsController[params.jsAction + 'Action']();

            } catch (e) {
            
                Log.warn('An error occured in action ' + params.jsAction + ': ' + e.message, 'Dispatcher');
                
                showErrorMessageToUser(e);
            }
            
        } else {
        
            Log.warn('the required action ' + params.jsAction + ' is not available', 'dispatcher');
        }
    }

    Log.debug('end', 'dispatcher');
}
