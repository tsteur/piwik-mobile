/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Provides utilities to handle windows. Actually it does only provide a method to create a new
 *          window.
 *
 * @static
 */
var Window = {};

/**
 * Creates a new window and displays it in front of the currently displayed window. Therefore it creates a new
 * Titanium.UI.Window. The specified controller and action defines which content is displayed within the 
 * window {@link Dispatcher}.
 * Titanium differences between lightweight and heavyweight windows. We always use heavyweight windows. Heavyweight
 * windows has there own JavaScript subcontext. That means a heavyweight window has its own thread and by closing a 
 * heavyweight window, the complete subcontext will be freed by the garbage collector. A window is heavyweight as 
 * soon as you pass a parameter 'modal', 'fullscreen' or 'navBarHidden' upon window creation.
 * 
 * @param {Object}    params                             All needed params to display the window and process the request.
 * @param {string}    [params.jsController="index"]      Controller name.
 * @param {string}    [params.jsAction="index"]          Action name.
 * @param {string}    [params.exitOnClose=false]         if true, it makes sure android exits the app when this
 *                                                       window is closed and no other activity (window) is running
 * @param {boolean}   [params.closeCurrentWindow=false]  If true, it closes the currently displayed window.
 * @param {boolean}   [params.closeAllPreviousOpenedWindows=false]  If true, it closes all previous opened windows.
 * @param {*}         params.*                           You can pass other parameters as you need it. The created
 *                                                       controller and view can access those values. You can use 
 *                                                       this for example if you want to pass a site, date, period 
 *                                                       parameter or something else. Acts like GET parameter in a 
 *                                                       HTTP request. 
 * 
 * @see <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.Window-object">Titanium.UI.Window</a>
 *  
 * @type null
 */
Window.createMvcWindow = function (params) {

    if (!params) {
        params = {};
    }

    var zIndexWindow = 1;

    /** 
     * make sure no view is set. Otherwise the dispatcher uses this view and everything is rendered into this view
     * instead of a new, clean window. The dispatcher sets this property automatically if the param view is not set.
     * If you want to render something into a another view (not a window), you should provide a new method like 
     * createMvcWebView(params);
     */ 
    if (params.view) {
        delete params.view;
    }
    
    // there are some issues in titanium 1.3.* / iphone if title is set -> app crashes 
    // @todo verify whether it works since 1.4
    if (params.title) {
        delete params.title;
    }

    // There are some issues if modal is set to true. In some cases the window will freeze in iPhone or end in a 
    // blank window. Never pass a modal parameter, therefore.
    if (params.modal) {
        delete params.modal;
    }
    
    var currentWindow = null;
    
    if (Titanium.UI.currentWindow) {
        currentWindow = Titanium.UI.currentWindow;
        
        zIndexWindow  = parseInt(currentWindow.zIndex, 10) + 1;
    }
    
    // zIndex is needed cause otherwise new opened window is not displayed in front of other windows in iOS 3 &4
    params.zIndex          = zIndexWindow;
    params.url             = 'Dispatcher.js';
    params.backgroundColor = config.theme.backgroundColor;
    params.navBarHidden    = true;

    var newWin             = Titanium.UI.createWindow(params);
    
    newWin.addEventListener('close', function (event) {

        this.isWindowClosed = true;
    });
    
    newWin.params = params;

    newWin.open();
    
    if (params.closeAllPreviousOpenedWindows) {
        Titanium.App.fireEvent('close_window', {});
    }
    
    if (currentWindow && params.closeCurrentWindow) {
    
        currentWindow.closedByApp = true;
        
        jsController     = null;
        view             = null;
        View             = null;
        View_Helper      = null;
        Cache            = null;
        Settings         = null;
        Translation      = null;
        Ui_Picker        = null;
        HttpRequest      = null;
        ActionController = null;
        
        Window.close(currentWindow);
        
        currentWindow    = null;
        win              = null;
        config           = null;
    } 
    
    Titanium.App.addEventListener('close_window', function () {
    
        if (newWin && Window && Window.close) {
            Window.close(newWin);
        }
    });
};

/**
 * Closes a window in a safe way.
 *
 * @param {Titanium.UI.Window}  win    The window you want to close.
 *
 * @type null
 */
Window.close = function (win) {

    if ('android' === Titanium.Platform.osname) {

        win.close();

    } else {
    
        // if we call .close() in iOS we end up in a blank (white) screen. We already reported this bug
        // @todo replace this by .close() as in android as soon as the bug is fixed
        // {@link https://appcelerator.lighthouseapp.com/projects/32238/tickets/1336-closing-window-1-also-closes-window-2#ticket-1336-2}
        win.hide();
        
        // this should free some memory. maybe we should do this in android too. Sadly, this does not work
        // in androd because the property '.children' is not available currently. But in android the garbage
        // collector should free memory automatically (more or less?!?). Bug (missing children property) is 
        // reported
        // @todo use this in android too.
        Window.cleanup(win, 0);
    }
    
    win = null;
};

/**
 * Counts how many items are removed within the cleanup method. Just for logging.
 *  
 * @default "0"
 * 
 * @type Number
 */
Window.removedItems = 0;

/**
 * Prevents that the cleanup does not end in a never ending loop, cause the cleanup method will be called
 * recursive. The cleanup method will stop as soon as the max depth number has been reached. Just to be safe...
 * 
 * @default "6"
 * 
 * @type Number
 */
Window.maxDepth = 6;

/**
 * Cause the win.close() method ends up in a blank window on iOS we want to clean up the window at least. This
 * shall free some memory. The children property is not supported by Android / Titanium therefore this just works
 * on iOS.
 * 
 * @type null
 */
Window.cleanup = function (view, depth) {

    depth++;

    if (depth > Window.maxDepth) {
        return;
    }

    if (!view || !view.children  || !view.children.length) {
        return;
    } 
   
    try { 
        
        for (var index = 0; index < view.children.length; index++) {

            var childView = view.children[index];

            if ('object' === (typeof childView).toLowerCase() && -1 === ('' + childView).search('TiUIImageView')) {

                Window.cleanup(childView, depth);

                if (view && view.remove) { 
                    
                    Window.removedItems++;
                    view.remove(childView);
                    
                }

            }
            
            childView            = null;
            view.children[index] = null;
            
            delete childView; 
            delete view.children[index];
        }
        
        Window.depth++;
        
        if (1 === depth && Log) {
            
            Log.debug(Window.removedItems, 'numRemovedItems');
        }
        
    } catch (e) {}
};
