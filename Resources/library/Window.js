/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Provides utilities to handle windows.
 *
 * @static
 */
var Window = {};

/**
 * zIndex counter. Will be increased by one for each new created window. This ensures a new created window will be 
 * displayed in front of another window.
 *  
 * @default "0"
 * 
 * @type Number
 */
Window.zIndex = 0;

/**
 * An array holding all currently opened views. Each new created window will be pushed to this array. We have to pop
 * a window from this array as soon as we close it.
 * 
 * @type Array
 */
Window.views = [];

/**
 * Creates a new window and displays it in front of the currently displayed window. Therefore it creates a new
 * Titanium.UI.View. The specified controller and action defines which content is displayed within the 
 * window {@link Dispatcher}.
 * Titanium differences between lightweight and heavyweight windows. We don't use heavyweight windows cause heavyweight
 * windows has there own JavaScript subcontext. It is much faster to just work with one context. 
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
    
    /** 
     * make sure no view is set. Otherwise the dispatcher uses this view and everything is rendered into this view
     * instead of a new, clean window. The dispatcher sets this property automatically if the param view is not set.
     * If you want to render something into a another view (not a window), you should provide a new method like 
     * createMvcWebView(params);
     */ 
    if (params.view) {
        delete params.view;
    }
        
    // increase the zIndex, ensures the next window will be displayed in front of the current window
    Window.zIndex = Window.zIndex + 1;
    
    params.zIndex          = Window.zIndex;
    // .width is defined in iOS .size.width is defined in Android
    params.width           = globalWin.width ? globalWin.width : globalWin.size.width;
    params.height          = globalWin.height ? globalWin.height : globalWin.size.height;
    params.top             = 0;
    params.left            = 0;
    params.backgroundColor = config.theme.backgroundColor;

    var newWin             = Titanium.UI.createView(params);
    
    newWin.params = params;
    
    if (params.closeAllPreviousOpenedWindows) {
        while (Window.views && Window.views.length) {
            Window.close(Window.views.pop(), true);
        }
    }
        
    if (params.closeCurrentWindow && Window.views && Window.views.length) {
        Window.close(Window.views.pop(), true);
    } 

    if ('android' === Titanium.Platform.osname) {
        globalWin.add(newWin);
    } else {
        globalScrollView.addView(newWin);
        globalScrollView.scrollToView(newWin);
    }
    
    Window.views.push(newWin);
    Dispatcher.dispatch(newWin);
};

/**
 * Closes a window in a safe way.
 *
 * @param {View}        [win]                  The window you want to close. If parameter is not given or empty the
 *                                             current displayed window will be closed. If you specify the view you
 *                                             want to close ensure that you remove the view from the stack Window.views
 * @param {boolean}     newWindowWillFollow    True if a new window will be opened afterwards. We do not close
 *                                             the app in such a case if no other views/windows are available.
 *
 * @type null
 */
Window.close = function (win, newWindowWillFollow) {
    /* TODO in case of iOS do not remove view if it is the last one!
    if (Window.views && Window.views.length && 1 == Window.views.length && 'android' !== Titanium.Platform.osname) {
        // If only 1 view is available
        return;
    } */
    
    if ('undefined' == (typeof newWindowWillFollow) || !newWindowWillFollow) {
        newWindowWillFollow = false;
    }

    if (('undefined' == (typeof win) || !win) && Window.views && Window.views.length) {
        win = Window.views.pop();
    }
    
    if (win) {
        win.hide();
        Window.removedItems = 0;
        
        try {
            // free some memory
            Ui_Menu.cleanupMenu(win);
            Window.cleanup(win, 0);
            
            if ('android' !== Titanium.Platform.osname && globalScrollView && globalScrollView.remove) {
                globalScrollView.removeView(win);
                // TODO do we have to remove the view afterwards manually?
                // globalScrollView.remove(win);
            } else if ('android' === Titanium.Platform.osname && globalWin && globalWin.remove) {
                globalWin.remove(win);
            } else {
                Log.debug('can not remove view', 'Window');
            }
            
        } catch (e){
            Log.warn('failed to remove view from window: ' + e.message, 'Window');    
        }
        
        win = null;
    }
    
    if ((!Window.views || !Window.views.length) 
        && !newWindowWillFollow 
        && globalWin && globalWin.close 
        && 'android' === Titanium.Platform.osname){
        // close window only in android to close the app, close the app is not allowed in iOS and we end in a
        // blank window if we close the only opened window
        globalWin.close();
        
    } else {
        
        if (Window.getCurrentWindow()) {
            if ('android' !== Titanium.Platform.osname) {
                globalScrollView.scrollToView(Window.getCurrentWindow());
            }
            
            if (Window.getCurrentWindow().focus) {
                Window.getCurrentWindow().focus();
            }
        }

        // restore the menu of the previous displayed window
        Ui_Menu.build();
    }
};

/**
 * Retrieve the current displayed window.
 * 
 * @returns {View|null}  The current displayed window or null if no window is opened.
 */
Window.getCurrentWindow = function () {
    if (Window.views && Window.views.length) {
    
        return Window.views[Window.views.length - 1];
    }
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
 * We want to clean up the window at least. This shall free some memory. 
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

            if ('object' === (typeof childView).toLowerCase() && 
                -1 !== ('' + childView).search('View')) {

                Window.cleanup(childView, depth);

                if (view && view.remove && childView) { 
                    
                    Window.removedItems++;
                    view.remove(childView);
                }
            }
            
            childView            = null;
            view.children[index] = null;
            
            delete view.children[index];
        }
        
        if (1 === depth && Log) {
            
            Log.debug(Window.removedItems, 'numRemovedItems');
        }
        
    } catch (e) {}
};
