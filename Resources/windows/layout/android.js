/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 *
 * @fileOverview layout 'layout/android.js' .
 */

/** @private */
var Piwik = require('library/Piwik');

/**
 * @class    Piwik Mobile Android layout. Handles how header, menu and the content will be displayed. How new windows 
 *           will be removed or added and so on.
 *
 * @exports  layout as LayoutAndroid
 */
function layout () {

    /**
     * An array holding all current opened windows. Each new created window will be pushed to this array.
     * On the contrary we have to pop a window from this array as soon as we close/remove it.
     *
     * @type  Array
     */
    this.windows   = [];
    
    /**
     * zIndex counter. Will be increased by one for each new created window. This ensures a new created window will be
     * displayed in front of another window.
     *
     * @default  "0"
     *
     * @type     Number
     */
    this.zIndex    = 0;

    /**
     * A reference to the layout header.
     *
     * @default  null
     *
     * @type     Piwik.UI.Header
     */
    this.header    = null;

    /**
     * A reference to the layout menu.
     *
     * @default  null
     *
     * @type     Piwik.UI.Menu
     */
    this.menu      = null;

    /**
     * @private
     */
    var layout     = this;

    /**
     * @private
     */
    var rootWindow = Ti.UI.currentWindow;
    
    /**
     * Retrieve the current displayed window.
     *
     * @returns  {void|Piwik.UI.Window}  The current displayed window or void if no window is opened.
     * 
     * @private
     */
    this._getCurrentWindow = function () {
        if (this.windows && this.windows.length) {

            return this.windows[this.windows.length - 1];
        }
    };

    /**
     * Add a new window to the layout so that it will be visible afterwards. Does also add a property named
     * "rootWindow" to the newWin object which references to the root window (Ti.UI.Window) of the view.
     *
     * @param  {Piwik.UI.Window}  newWin  The window that shall be added to the layout.
     *                                    The window will be visible afterwards.
     */
    this.addWindow = function (newWin) {

        var currentWindow = this._getCurrentWindow();
        if (currentWindow) {
            currentWindow.fireEvent('blurWindow', {});
        }
        
        // wait till template and menuOptions are initialized, than fire focusWindow event.
        newWin.addEventListener('beforeOpen', function () {
            this.fireEvent('focusWindow', {});
        });
        
        newWin.rootWindow = rootWindow;

        Piwik.getUI().currentWindow = newWin;

        this.windows.push(newWin);

        rootWindow.add(newWin);
    };

    /**
     * Remove a window from the layout so that it will be no longer visible. If no new window follows and the
     * window that shall be removed is the only displayed window, we'll not remove the window on iOS and we exit the
     * application on Android respectively in such a case.
     *
     * @param  {Piwik.UI.Window}  window               The window that shall be removed from the layout. The
     *                                                 current implementation requires that the given window,
     *                                                 which shall be removed, is the current displayed window.
     * @param  {boolean}          newWindowWillFollow  True if a new window will follow afterwards (via addWindow),
     *                                                 false otherwise. This is important cause it has an impact on
     *                                                 how to remove the window.
     */
    this.removeWindow = function (window, newWindowWillFollow) {
        // remove the current opened window from stack
        this.windows.pop();

        if (Piwik.getPlatform().isAndroid
            && (!this.windows || !this.windows.length)
            && !newWindowWillFollow
            && rootWindow) {
            // close window only on Android to exit the app. Closing the app is not allowed on iOS and we would end in a
            // blank window if we close the only opened window
            rootWindow.close();

            return;
        }

        // remove window from main window so that it will be no longer visible
        rootWindow.remove(window);

        var newActiveWindow = this._getCurrentWindow();

        if (!newActiveWindow) {

            return;
        }
        
        Piwik.getUI().currentWindow = newActiveWindow;
        newActiveWindow.fireEvent('focusWindow', {});

        // bring previous displayed window to front if no new window follows
        if (!newWindowWillFollow) {

            /**
             * we do not reset zIndex if a new window will follow cause zIndex is already correct
             * in such a case
             */
            this.zIndex = Piwik.getUI().currentWindow.zIndex;

            if (Piwik.getUI().currentWindow.focus) {
                // focus window so user can navigate via D-Pad within this view
                Piwik.getUI().currentWindow.focus();
            }
        }
    };

    /**
     * Initialize the layout.
     *
     * Renders the basic layout like header and menu. This method should be executed only once during app session.
     */
    this.init = function () {

        this.header = Piwik.getUI().createHeader({title: 'Piwik Mobile'});
        this.menu   = Piwik.getUI().createMenu({menuView: this.header.getHeaderView()});

        Ti.Gesture.addEventListener('orientationchange', function (event) {

            return;
        });
    };
}

module.exports = layout;