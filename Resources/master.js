/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 
 * @fileOverview This is the main window. Every variable defined in this file is a global variable and available in each
 *               file and context. Be careful defining variables therefore.
 */
Titanium.include('/config.js', 
                 '/library/all.js', 
                 '/Dispatcher.js');

/**
 * True if the current platform is Android, false otherwise. This variable is available everywhere / all contexts.
 *
 * @type boolean
 */
var isAndroid = ('android' === Ti.Platform.osname);

/**
 * Displays an error message to the user. Uses an alert dialog to display the error message and contact information.
 * 
 * @param {Error|string|number}  [exception]   An instance of an error object or any string/number. Should identify the
 *                                             error
 * 
 * @example
 * showErrorMessageToUser(Error('push() is not defined in HttpRequest'))
 * showErrorMessageToUser('push() is not defined in HttpRequest')
 * showErrorMessageToUser()
 */
function showErrorMessageToUser (exception) {
    var message = "Please, contact mobile@piwik.org or visit http://piwik.org/mobile\n";
    
    message += "Error: ";
    if ('undefined' !== (typeof exception) && exception) {
        message += exception.toString();
        Log.warn(exception.toString());
    } else {
        message += 'Unknown';
    }
    
    message += "\nPlease, provide the following information:\n";
    message += "System: " + Titanium.Platform.name + ' ' + Titanium.Platform.version + "\n";
    
    message += String.format("Piwik Mobile Version: %s - %s %s\n", 
                             '' + Titanium.App.version, '' + Titanium.version, '' + Titanium.buildHash);
    message += "Available memory " + Titanium.Platform.availableMemory + "\n";
    
    var caps =  Titanium.Platform.displayCaps;
    message += String.format("Resolution: %sx%s %s (%s) \n", 
                             '' + caps.platformWidth, '' + caps.platformHeight, '' + caps.density, '' + caps.dpi);

    var alertDialog = Titanium.UI.createAlertDialog({
        title: "An error occurred",
        message: message,
        buttonNames: ['OK']
    });
    
    alertDialog.show();
};

/**
 * Includes a file by using Titanium.include. The difference is that this method works like an include_once.
 * 
 * @param {string}  file   The path and name of the file
 * 
 * @example
 * loadFile('/library/Session.js')
 * 
 * @type null
 */
function loadFile(file) {
    if (!this.loadedFiles) {
        this.loadedFiles = {};
    }
    
    if (this.loadedFiles[file]) {
        return;
    }
    
    try {
        Titanium.include(file);
    } catch (exception) {
        showErrorMessageToUser(exception);
    }
    
    this.loadedFiles[file] = true;
}

/**
 * Loads a view template by using Titanium.include. The difference is that this method works like an include_once.
 * The difference to loadFile is that this method will cache the complete function. Cause each view template includes
 * a function named template() we have to cache the function, otherwise we would overwrite a previous loaded template.
 * 
 * @param {string}  file   The path and name of the view file
 * 
 * @example
 * loadFile('/views/chart/show.js')
 * 
 * @returns {Function} The requested template
 */
function loadView (file) {
    if (!this.loadedFiles) {
        this.loadedFiles = {};
    }
    
    if (this.loadedFiles[file]) {
        return this.loadedFiles[file];
    }

    try {
        Titanium.include(file);
    } catch (exception) {
        showErrorMessageToUser(exception);
    }

    if ('undefined' !== typeof template && template) {
        this.loadedFiles[file] = template;
    }
    
    return template;
}

loadFile('/model/AccountModel.js');

// allow only portrait mode 
Titanium.UI.currentWindow.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT]; 

// set orientation to portrait -> currently the app does not render properly if the user changes the
// orientation of an already rendered window. all new opened window (even in landscape mode) are rendered 
// good
Titanium.UI.orientation = Titanium.UI.PORTRAIT;

// variable globalWin will be available in each file and each context
var globalWin = Titanium.UI.currentWindow;

// do not close a Titanium.UI.Window when user presses the hardware back button, remove our own windows (view).
globalWin.addEventListener('android:back', function (event) {
    Log.debug('androidBack', 'master.js');
    
    Window.close();
});

if (!isAndroid) {
    // we can not use the scrollableView on Android cause it is a bit buggy currently. As soon as one swipes to another
    // view the tableview will loose all it's rows on Android
    // TODO it will be fixed in Titanium 1.6 -> use scrollableview for android too

    var globalScrollView = Titanium.UI.createScrollableView({
        views: [],
        showPagingControl: false,
        left: 0,
        top: 0,
        width: Window.getWidth(),
        height: Window.getHeight()
    });

    globalWin.add(globalScrollView);

    globalScrollView.addEventListener('scroll', function (event) {

        if (!event || !event.view) {
            // not the scrollview is scrolled
            
            return;
        }
        
        if (!event.view.zIndex || parseInt(event.view.zIndex, 10) >= parseInt(Window.zIndex, 10)) {
            // this is a scroll to a new opened view, not a close view
            
            return;
        }
        
        if (!event.view.deleteOnScroll) {
            // delete on scroll is disabled cause view will be currently created
        
            return;
        }

        Window.close();
    });
}

Translation.loadTranslations();

// save default period and date in session on app start. so we only have to work with session when we want to access 
// chosen period/date.
Session.set('piwik_parameter_period', Settings.getPiwikDefaultPeriod());
Session.set('piwik_parameter_date', Settings.getPiwikDefaultDate());

var accountManager      = new AccountModel();
var hasActivatedAccount = accountManager.hasActivedAccount();
accountManager          = null;

if (hasActivatedAccount) {
    // create root window    
    Window.createMvcWindow({jsController: 'index',
                            jsAction:     'index'});
                        
} else {
    // directly show manage accounts if user has not already setup an account
    Window.createMvcWindow({jsController: 'settings',
                            jsAction:     'manageaccounts'});
}
