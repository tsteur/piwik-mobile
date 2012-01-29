/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 *
 * @fileOverview layout 'layout/ipad.js' .
 */

/** @private */
var Piwik = require('library/Piwik');
/** @private */
var _     = require('library/underscore');

/**
 * @class    iPad specific Piwik Mobile layout. Handles how header, menu and the content will be displayed. 
 *           How new windows will be removed or added and so on.
 * 
 * @exports  layout as LayoutIpad
 */
function layout () {

    /**
     * An array holding all current opened windows within the detail view. Each new created window will be pushed to 
     * this array. On the contrary we have to pop a window from this array as soon as we close/remove it.
     *
     * @type  Array
     */
    this.windows  = [];
    
    /**
     * An array holding all current opened modal windows. Each new created modal window will be pushed to this array.
     * On the contrary we have to pop a window from this array as soon as we close/remove it.
     *
     * @type  Array
     */
    this._modalWindows  = [];
    
    /**
     * zIndex counter. Will be increased by one for each new created window. This ensures a new created window will be
     * displayed in front of another window.
     *
     * @default  "0"
     *
     * @type     Number
     */
    this.zIndex   = 0;

    /**
     * A reference to the layout header.
     *
     * @default  null
     *
     * @type     Piwik.UI.Header
     */
    this.header   = null;

    /**
     * A reference to the layout menu.
     *
     * @default  null
     *
     * @type     Piwik.UI.Menu
     */
    this.menu     = null;

    /**
     * An instance of the master window which is displayed within the split window - master view.
     *
     * @default  null
     *
     * @type     null|Ti.UI.Window
     * 
     * @private
     */
    this._masterWin = null;

    /**
     * An instance of the modal window. Is only set if at least one modal window is currently displayed.
     *
     * @default  null
     *
     * @type     null|Ti.UI.Window
     * 
     * @private
     */
    this._modalWindow = null;

    /**
     * An instance of the modal navigation group. Is only set if at least one modal window is currently displayed.
     *
     * @default  null
     *
     * @type     null|Ti.UI.iPhone.NavigationGroup
     * 
     * @private
     */
    this._modalNav = null;

    /**
     * @private
     */
    var layout    = this;
    
    /**
     * Retrieve the current displayed window.
     *
     * @returns  {void|Piwik.UI.Window}  The current displayed window or void if no window is opened.
     * 
     * @private
     */
    this._getCurrentWindow = function () {

        return Piwik.getUI().currentWindow;
    };
    
    /**
     * Adds a new window to the master view of the split window. The master view is the left view of the split window.
     *
     * @param  {Piwik.UI.Window}  newWin  The window that shall be added.
     * 
     * @private
     */
    this._addWindowToMasterView = function (newWin) {
    
        newWin.rootWindow = this._masterWin;
        this._masterWin.add(newWin);
        
        newWin.fireEvent('focusWindow', {});
    };
        
    /**
     * Creates the modal root window. Creates the window only if it already exists.
     * 
     * @private
     */
    this._createModalRootWindow = function () {
        if (layout._modalWindow) {
            
            return;
        }
         
        layout._modalWindow = Ti.UI.createWindow({navBarHidden: true});
        
        layout._modalWindow.open({
            modal:true,
            modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL,
            modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        });
    };
        
    /**
     * Displays the newWin within a modal window. If no modal window exists, it creates one.
     * 
     * @param  {Piwik.UI.Window}  newWin  The window that shall be added.
     * 
     * @private
     */
    this._addWindowToModal = function (newWin) {

        this._createModalRootWindow();

        var modalWin = Ti.UI.createWindow();
        modalWin.open();
        modalWin.add(newWin);
        
        newWin.rootWindow = modalWin;
        
        if (!layout._modalNav) {
            // create modal navigation group
            var doneButton = Ti.UI.createButton({title: _('General_Close'),
                                                 style: Ti.UI.iPhone.SystemButtonStyle.CANCEL});
                     
            doneButton.addEventListener('click', function () {
    
                try {
                    modalWin.close();
                    layout._modalWindow.close();
                    layout._modalWindow = null;
                    modalWin            = null;
                    layout._modalNav    = null;
                } catch (e) {
                    Piwik.getLog().warn('Failed to close site chooser window', 'Piwik.UI.Menu::onChooseSite');
                }
            });
            
            modalWin.leftNavButton = doneButton;
                            
            layout._modalNav       = Ti.UI.iPhone.createNavigationGroup({
               window: modalWin
            });
            
            layout._modalWindow.add(layout._modalNav);
            
        } else {
            // modalNav does already exist, just display the new window within the modalNav.
            layout._modalNav.open(modalWin);
        }
        
        this._modalWindows.push(newWin);
        
        modalWin.addEventListener('close', function () {
            // window was closed via navigation group
            if (this.url) {
                // this == newWin
                
                return;
            }
            // this == modalWin
            newWin.close();
        });
        
        newWin.addEventListener('close', function () {
            // if newWin closes, do also remove the window from the modal navigation.
            if (layout && layout._modalNav && this && this.rootWindow) {
                try {
                    layout._modalNav.close(this.rootWindow);
                } catch (e) {
                    Piwik.getLog().warn('Failed to remove rootWin from Navigation', 'iPadLayout::_addWindowToModal');
                }
            }
        });

        newWin.fireEvent('focusWindow', {type: 'focusWindow'});
    };
    
    /**
     * Adds a new window to the detail view of the split window. The detail view is the right view of the split window.
     *
     * @param  {Piwik.UI.Window}  newWin  The window that shall be added.
     * 
     * @private
     */
    this._addWindowToDetailView = function (newWin) {
        var currentWindow = this._getCurrentWindow();
        if (currentWindow) {
            
            try {
                currentWindow.fireEvent('blurWindow', {});
                currentWindow.close();
            } catch (e) {
                Piwik.getLog().warn('Failed to close current window: ' + e, 'iPadLayout::addWindowToDetailView');
            }
        }

        newWin.fireEvent('focusWindow', {});

        Piwik.getUI().currentWindow = newWin;

        this.windows.push(newWin);

        newWin.rootWindow = Ti.UI.currentWindow;
        
        Ti.UI.currentWindow.add(newWin);
    };
    
    /**
     * Add a new window to the layout so that it will be visible afterwards. Does also add a property named
     * "rootWindow" to the newWin object which references to the root window (Ti.UI.Window) of the view.
     *
     * @param  {Piwik.UI.Window}  newWin           The window that shall be added to the layout.
     *                                             The window will be visible afterwards.
     * @param  {string}           [newWin.target]  Either 'masterView', 'modal' or 'detailView'.
     */
    this.addWindow = function (newWin) {

        if (newWin && newWin.target && 'masterView' == newWin.target) {

            this._addWindowToMasterView(newWin);
            
            return;
            
        } else if (newWin && newWin.target && 'modal' == newWin.target) {
            
            this._addWindowToModal(newWin);
            
            return;
        }

        // target == 'detailView'
        this._addWindowToDetailView(newWin);
    };

    /**
     * Remove a window from the layout so that it will be no longer visible.
     *
     * @param  {Piwik.UI.Window}  piwikWindow          The window that shall be removed from the layout. The
     *                                                 current implementation requires that the given window,
     *                                                 which shall be removed, is the current displayed window.
     * @param  {boolean}          newWindowWillFollow  True if a new window will follow afterwards (via addWindow),
     *                                                 false otherwise. 
     */
    this.removeWindow = function (piwikWindow, newWindowWillFollow) {

        try {
            
            if (!piwikWindow || !piwikWindow.rootWindow) {
                Piwik.getLog().warn('No window or rootWindow given', 'iPadLayout::removeWindow');
                
                return;
            }

            if (Ti.UI.currentWindow === piwikWindow.rootWindow) {
                
                this.windows.pop();
                
            } else if ('modal' == piwikWindow.target && this._modalWindows && this._modalWindows.length) {
                this._modalWindows.pop();
                
                // focus previous window. makes sure they can set their navigation buttons and so on
                if (this._modalWindows.length && this._modalWindows[this._modalWindows.length - 1]) {
                    this._modalWindows[this._modalWindows.length - 1].fireEvent('focusWindow', {type: 'focusWindow'});
                }
            }
            
            // remove window from main window so that it will be no longer visible
            piwikWindow.rootWindow.remove(piwikWindow);
            
        } catch (e) {
            Piwik.getLog().warn('Failed to remove PiwikWin from rootWindow: ' + e, 'iPadLayout::removeWindow');
        }

        piwikWindow = null;
    };

    /**
     * Initialize the layout.
     *
     * Renders the basic layout like header and menu. This method should be executed only once during app session.
     */
    this.init = function () {

        this._masterWin     = Ti.UI.createWindow({barColor: '#B2AEA5', title: _('General_Reports')});
        this._masterWin.open();

        var settingsButton = Ti.UI.createButton({image: 'images/ic_action_settings.png',
                                                 width: 37});

        settingsButton.addEventListener('click', function () {
            Piwik.getUI().createWindow({url: 'settings/index', target: 'modal'});
        });
        
        this._masterWin.leftNavButton = settingsButton;

        var navDetail   = Ti.UI.iPhone.createNavigationGroup({
            window: Ti.UI.currentWindow
        });
        
        this.header     = Piwik.getUI().createHeader({title: 'Piwik Mobile'});
        this.menu       = Piwik.getUI().createMenu({menuView: this.header.getHeaderView()});
        
        var navMaster   = Ti.UI.iPhone.createNavigationGroup({
            window: this._masterWin
        });

        var splitwin    = Titanium.UI.iPad.createSplitWindow({
            detailView: navDetail,
            masterView: navMaster,
            showMasterInPortrait: true
        });

        splitwin.open();
    };
}

module.exports = layout;