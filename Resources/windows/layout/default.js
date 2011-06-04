/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 *
 * @fileOverview layout 'layout/default.js' .
 */

/**
 * @class Piwik Mobile layout. Handles how header, menu and the content will be displayed. How new windows will be
 *        removed or added and so on.
 *
 * @this {Piwik.UI.Window}
 */
function window () {

    /**
     * An array holding all current opened windows. Each new created window will be pushed to this array.
     * On the contrary we have to pop a window from this array as soon as we close/remove it.
     *
     * @type Array
     */
    this.windows  = [];
    
    /**
     * zIndex counter. Will be increased by one for each new created window. This ensures a new created window will be
     * displayed in front of another window.
     *
     * @default "0"
     *
     * @type Number
     */
    this.zIndex   = 0;

    /**
     * A reference to the layout header.
     *
     * @default null
     *
     * @type Piwik.UI.Header
     */
    this.header   = null;

    /**
     * A reference to the layout menu.
     *
     * @default null
     *
     * @type Piwik.UI.Menu
     */
    this.menu     = null;

    var layout    = this;
    
    /**
     * Retrieve the current displayed window.
     *
     * @returns {void|Piwik.UI.Window}  The current displayed window or void if no window is opened.
     */
    this.getCurrentWindow = function () {
        if (this.windows && this.windows.length) {

            return this.windows[this.windows.length - 1];
        }
    };

    /**
     * Add a new window to the layout so that it will be visible afterwards.
     *
     * @param    {Piwik.UI.Window}    newWin   The window that shall be added to the layout.
     *                                         The window will be visible afterwards.
     */
    this.addWindow = function (newWin) {

        var currentWindow = this.getCurrentWindow();
        if (currentWindow) {
            currentWindow.fireEvent('blurWindow', {});
        }

        newWin.fireEvent('focusWindow', {});

        Piwik.UI.currentWindow = newWin;

        this.windows.push(newWin);

        if ('undefined' != (typeof this.scrollView) && this.scrollView) {
            this.scrollView.addView(newWin);
            this.scrollView.scrollToView(newWin);
        } else {
            Ti.UI.currentWindow.add(newWin);
        }
    };

    /**
     * Remove a window from the layout so that it will be no longer visible. If no new window follows and the
     * window that shall be removed is the only displayed window, we'll not remove the window on iOS and we exit the
     * application on Android respectively in such a case.
     *
     * @param    {Piwik.UI.Window}  window                The window that shall be removed from the layout. The
     *                                                    current implementation requires that the given window,
     *                                                    which shall be removed, is the current displayed window.
     * @param    {boolean}          newWindowWillFollow   True if a new window will follow afterwards (via addWindow),
     *                                                    false otherwise. This is important cause it has an impact on
     *                                                    how to remove the window.
     */
    this.removeWindow = function (window, newWindowWillFollow) {
        // window should be equal to current displayed window
        var oldWindow = this.windows.pop();

        if (Piwik.isAndroid
            && (!this.windows || !this.windows.length)
            && !newWindowWillFollow
            && Ti.UI.currentWindow) {
            // close window only on Android to exit the app. Closing the app is not allowed on iOS and we would end in a
            // blank window if we close the only opened window
            Ti.UI.currentWindow.close();

            return;
        }

        // remove window from main window so that it will be no longer visible
        if (oldWindow && 'undefined' != (typeof this.scrollView) && this.scrollView) {
            this.scrollView.removeView(oldWindow);
        } else {
            Ti.UI.currentWindow.remove(oldWindow);
        }

        window    = null;
        oldWindow = null;

        var newActiveWindow = this.getCurrentWindow();

        if (!newActiveWindow) {

            return;
        }
        
        Piwik.UI.currentWindow = newActiveWindow;
        newActiveWindow.fireEvent('focusWindow', {});

        // bring previous displayed window to front if no new window follows
        if (!newWindowWillFollow) {

            // scroll to new window so this view will be visible
            if ('undefined' != (typeof this.scrollView) && this.scrollView) {
                this.scrollView.scrollToView(Piwik.UI.currentWindow);
            }

            /**
             * we have to update zIndex cause otherwise we can not detect a swipe (in globalScrollableView) to a
             * previous view. we do not reset zIndex if a new window will follow cause zIndex is already correct
             * in such a case
             */
            this.zIndex = Piwik.UI.currentWindow.zIndex;

            if (Piwik.UI.currentWindow.focus) {
                // focus window so user can navigate via D-Pad within this view
                Piwik.UI.currentWindow.focus();
            }
        }
    };

    /**
     * Initialize the layout.
     *
     * Renders the basic layout like header and menu. This method should be executed only once during app session.
     */
    this.init = function () {

        Ti.Gesture.addEventListener('orientationchange', function (event) {

            return;
        });

        this.header = Piwik.UI.createHeader({title: 'Piwik Mobile'});
        this.menu   = Piwik.UI.createMenu({menuView: this.header.getHeaderView()});

        if (Piwik.isIos) {
            // we can not use the scrollableView on Android cause it is a bit buggy currently. As soon as one swipes
            // to another view the tableview will loose all it's rows on Android

            this.scrollView = Ti.UI.createScrollableView({
                views: [],
                showPagingControl: false
            });

            Ti.UI.currentWindow.add(this.scrollView);

            this.scrollView.addEventListener('scroll', function (event) {

                if (!event || !event.view) {
                    // not the scrollview is scrolled

                    return;
                }

                if (!event.view.zIndex || parseInt(event.view.zIndex, 10) >= parseInt(layout.zIndex, 10)) {
                    // this is a scroll to a new opened view, not a close view

                    return;
                }

                if (!event.view.deleteOnScroll) {
                    // delete on scroll is disabled cause view will be currently created

                    return;
                }

                if (Piwik.UI.currentWindow.close) {
                    Piwik.UI.currentWindow.close();
                }
            });
        }
    };
}