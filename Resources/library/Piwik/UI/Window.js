/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Adds some further utilities like 'close' to a Titanium.UI.View.
 *
 * @augments Titanium.UI.View
 */
Piwik.UI.Window = function (params) {

    /**
     * This event will be fired before the window is getting closed.
     *
     * @name Piwik.UI.Window#event:close
     * @event
     *
     * @param   {Object}    event
     * @param   {string}    event.type    The name of the event.
     */

    /**
     * Header options that will be passed to refresh the header each time a window gets the focus. 
     *
     * @see Piwik.UI.Header#refresh
     */
    this.titleOptions = {title: 'Piwik Mobile'};

    /**
     * Menu options that will be passed to refresh the menu each time a window gets the focus.
     *
     * @see Piwik.UI.Menu#refresh
     */
    this.menuOptions  = {};

    /**
     * Counts how many items are removed within the cleanup method. Just for logging.
     *
     * @default "0"
     *
     * @type Number
     */
    this.removedItems = 0;

    /**
     * Prevents that the cleanup does not end in a never ending loop, cause the cleanup method will be called
     * recursive. The cleanup method will stop as soon as the max depth number has been reached. Just to be safe...
     *
     * @default "6"
     *
     * @type Number
     */
    this.maxDepth     = 6;

    /**
     * This method will be called each time a window will be opened. The method can also be used to reopen an already
     * opened window (refresh the window). When this method will be called, the UI widgets are already initialized.
     * The method is intended to request all required data (always asynchronous if possible) the window needs.
     */
    this.open = function () {
        // overwrite this within your window if needed.
    };

    var that = this;

    this.addEventListener('focusWindow', function () {

        var urlParams  = ('' + that.url).split('/');
        var controller = urlParams[0];
        var action     = ('' + urlParams[1]).split('.js')[0];
        var title      = controller + ' ' + action;
        var url        = '/window/' + controller + '/' + action;

        // track a page view
        Piwik.getTracker().setDocumentTitle(title).setCurrentUrl(url).trackPageView();

        // refresh the headline as well as the menu each time a window gets the focus.
        Piwik.UI.layout.header.refresh(that.titleOptions);
        Piwik.UI.layout.menu.refresh(that.menuOptions);
    });

    /**
     * Closes the window in a safe way.
     *
     * @param {boolean}     newWindowWillFollow    True if a new window will be opened afterwards. We do not close
     *                                             the app in such a case if no other views/windows are available.
     *
     * @fires Piwik.UI.Window#event:close
     */
    this.close = function (newWindowWillFollow) {
        if ('undefined' == (typeof newWindowWillFollow) || !newWindowWillFollow) {
            newWindowWillFollow = false;
        }

        if (Piwik.isIos && 1 == Piwik.UI.layout.windows.length && !newWindowWillFollow) {
            // If only 1 view is available do never close the first screen on iOS, otherwise a blank window will appear

            return;
        }

        this.fireEvent('close', {type: 'close'});
    
        try {
            // hide view so we make sure the view will no longer be visible, even if the later removeWindow does
            // not work
            this.hide();

            // free some memory
            Piwik.UI.OptionMenu.cleanupMenu(this);
            this.cleanup(this, 0);

        } catch (e) {
            Piwik.Log.warn('failed to remove view from window: ' + e.message, 'Piwik.UI.Window::close');
        }

        Piwik.UI.layout.removeWindow(this, newWindowWillFollow);
    };

    /**
     * We want to clean up the window at least. This shall free some memory. 
     * 
     * @type null
     */
    this.cleanup = function (view, depth) {
        depth++;

        if (depth > this.maxDepth) {
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

                    this.cleanup(childView, depth);

                    if (view && view.remove && childView) { 
                    
                        this.removedItems++;
                        view.remove(childView);
                    }
                }
            
                childView            = null;
                view.children[index] = null;
            
                delete view.children[index];
            }
        
            if (1 === depth && Piwik.Log) {
            
                Piwik.Log.debug('numRemovedItems: ' + this.removedItems, 'Piwik.UI.Window::cleanup');
            }
        
        } catch (e) {}
    };
};