/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    A modal window is created by the method Piwik.UI.createModalWindow. The modal window UI widget
 *           opens a new window. On Android as well as on iPhone it will open a modal window, on the iPad it'll open
 *           a PopOver.
 *
 * @param {Object}   params            See {@link Piwik.UI.View#setParams}
 * @param {Object}   params.title      The title of the window
 * @param {string}   params.openView   An instance of a Titanium UI Widget, for example a view, button, etc. This is 
 *                                     needed to open the PopOver. The arrow of the PopOver (iPad) will point to 
 *                                     this UI widget. If this view is not  given, the PopOver will not be opened on 
 *                                     iPad or the app will crash.
 *
 * @example
 * var win = Piwik.UI.createModalWindow({title: 'MyWindow', openView: toolBar});
 * win.add(something);
 * win.open();
 * win.close();
 *
 * @augments Piwik.UI.View
 */
Piwik.UI.ModalWindow = function () {
    
    /**
     * A simple count var. Is used to count how often the window open method was executed. It should prevent
     * that we end in a never ending loop.
     * 
     * @defaults 0
     * 
     * @type int
     */
    this.counter = 0;

    /**
     * @private
     */
    var win                 = null;
    
    /**
     * Defines into which view other views shall be added
     * 
     * @private
     */
    var viewToAddOtherViews = null;

    /**
     * Initializes the UI widget. Creates the window depending on the current platform.
     */
    this.init = function () {
        
        var that  = this;
        var title = this.getParam('title', '');

        if (Piwik.isIpad) {
            win                 = this.create('Popover', {width: 320, 
                                                          height: 460, 
                                                          title: title});
            viewToAddOtherViews = win;
                                            
        } else if (Piwik.isIos) {

            win                 = Ti.UI.createWindow({className: 'modalWindow',
                                                      modal: true,
                                                      barColor: '#B2AEA5',
                                                      title: title});
                                       
            viewToAddOtherViews = win;

            var cancelButton    = Ti.UI.createButton({title: _('SitesManager_Cancel_js'),
                                                      style: Ti.UI.iPhone.SystemButtonStyle.CANCEL});

            cancelButton.addEventListener('click', function () {

                that.close();
            });

            win.leftNavButton = cancelButton;
            
            win.addEventListener('close', function () {
                that.modalWindowIsNowClosed();
            });

        } else if (Piwik.isAndroid) {

            var crt  = Ti.UI.currentWindow;
            win      = Ti.UI.createWindow({className: 'modalWindow',
                                           title: title});
            var view = Ti.UI.createView({backgroundColor: '#fff'});
            
            viewToAddOtherViews = view;

            win.add(view);
            
            win.addEventListener('close', function () {
                // don't know why but we have to restore the currentWindow reference on modal window close
                // @todo check whether we still have to do this.
                Ti.UI.currentWindow = crt;
            });
        }
    };
    
    /**
     * Add a child to the view hierarchy
     * 
     * @param {Ti.UI.View}   view     The view to add to this views hiearchy
     */
    this.add = function (view) {
        this.getView().add(view);
    };

    /**
     * View to show in the right nav bar area. Only available in iPhone.
     * 
     * @param {Ti.UI.View}   view     The view that shall be displayed in the right nav bar area.
     */
    this.setRightNavButton = function (view) {
        
        if (!Piwik.isIos) {
            
            return;
        }
        
        win.setRightNavButton(view);
    };
    
    /**
     * Get the view where everything shall be rendered into. For example on Android, the content should not directly
     * rendered into the modal window.
     * 
     * @returns {Ti.UI.View|Ti.UI.Window}   An instance of the opened window or view.
     */
    this.getView = function () {
        return viewToAddOtherViews;
    };
    
    /**
     * Open the modal window or popover. You have to call this. Otherwise the content will not be visible.
     */
    this.open = function () {
        
        if (!win) {
            
            return;
        }
       
        if (this.isAModalWindowOpened() && this.counter < 7) {
            this.counter++;
            // the app will crash if we open a modal window while another modal window is opened or not completely 
            // closed. So wait another 300 ms. Execute the timeout max 7 times.
            
            var that = this;
            setTimeout(function () {
                that.open();
            }, 300);
            
            return;
        }
        
        this.counter = 0;
        
        this.modalWindowIsNowOpened();
        
        if (Piwik.isIpad) {
            
            if (!this.getParam('openView')) {
                
                Piwik.Log.warn('No view given to open iPad PopOver', 'Piwik.UI.ModalWindow::open');
                return;
            }
            
            win.show({view: this.getParam('openView')});
        } else {
            win.open({modal: true});
        }
    };
    
    /**
     * Detects whether there is currently a modal window opened. Unless a modal window is opened, we should not 
     * open another modal window on iPhone. Otherwise the app crashes.
     * 
     * @returns {bool} true if there is already a modal window opened, false otherwise.
     */
    this.isAModalWindowOpened = function () {
        
        if (!Piwik.isIphone) {
            // we only have to handle this on iPhone
            return false;
        }
        
        return Piwik.require('App/Session').get('modal_window_opened', false);
    };
    
    /**
     * Mark that the modal window is no longer opened.
     */
    this.modalWindowIsNowClosed = function () {
        if (Piwik.isIphone) {
            
            Piwik.require('App/Session').set('modal_window_opened', false);
        }
    };

    /**
     * Mark that a modal window is now opened.
     */
    this.modalWindowIsNowOpened = function () {
        if (Piwik.isIphone) {
            
            Piwik.require('App/Session').set('modal_window_opened', true);
        }
    };
    
    /**
     * Close an already opened window/popover.
     */
    this.close = function () {

        try {
            if (win && (Piwik.isAndroid || Piwik.isIphone)) {
                // window
                win.close();
            } else if (win && Piwik.isIpad) {
                // popover
                win.hide();
            }
        } catch (e) {
            Piwik.Log.warn('Failed to close site chooser window', 'Piwik.UI.ModalWindow::onChooseSite');
        }
    };
};

/**
 * Extend Piwik.UI.View
 */
Piwik.UI.ModalWindow.prototype = Piwik.require('UI/View');