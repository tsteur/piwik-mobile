/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 *
 * @fileOverview layout 'layout/iphone.js' .
 */

/** @private */
var Piwik = require('library/Piwik');
/** @private */
var _     = require('library/underscore');

/**
 * @class    Piwik Mobile iPhone layout. Handles how header, menu and the content will be displayed. How new windows 
 *           will be removed or added and so on.
 *
 * @exports  layout as LayoutIphone
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

        var win = Ti.UI.createWindow({className: 'piwikRootWindow', backButtonTitle: _('Mobile_NavigationBack')});
        win.open();
        
        win.add(newWin);
        win.addEventListener('close', function () {
            newWin.close();
            newWin = null;
        });

        if (!this.navigation) {
                
            this.navigation = Ti.UI.iPhone.createNavigationGroup({window: win});
            rootWindow.add(this.navigation);
            
        } else {
            this.navigation.open(win);
        }

        newWin.rootWindow           = win;
        Piwik.getUI().currentWindow = newWin;
        
        newWin.fireEvent('focusWindow', {});

        this.windows.push(newWin);
        
        win = null;
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
        if (!window || window.alreadyClosed) {
            return;
        }
        
        window.alreadyClosed = true;
        
        // window should be equal to current displayed window
        var oldWindow = this.windows.pop();

        try {

            this.navigation.close(window.rootWindow);

            window.rootWindow = null;
            window            = null;

        } catch (e) {
            Piwik.getLog().warn('Failed to remove window from navigation ' + e, 'iPhoneLayout::removeWindow');
        }

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
    };
}

module.exports = layout;