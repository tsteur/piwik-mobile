/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    A refresh UI widget is created by the method Piwik.UI.createRefresh. The refresh widget adds the
 *           possibility to refresh an already opened window. On iOS it does currently only support to add a
 *           PullToRefresh view to a tableView. It uses the Android Option Menu on Android.
 *
 * @property {Object}   [params]             See {@link Piwik.UI.View#setParams}
 * @property {string}   [params.tableView]   Optional. Only required on iOS. The tableView where the PullToRefresh
 *                                           view shall be added.
 * 
 * @augments Piwik.UI.View
 *
 * @example
 * var tableview = Ti.Ui.createTableView();
 * var refresh   = Piwikk.Ui.createRefresh({tableView: tableview});
 * requestSomeData();
 * refresh.refreshDone();
 */
Piwik.UI.Refresh = function () {

    /**
     * This event will be fired as soon as the user triggers a window refresh. For example via PullToRefresh or via
     * OptionMenu. This means we have to reload the complete data.
     *
     * @name    Piwik.UI.Refresh#event:onRefresh
     * @event
     *
     * @param   {Object}    event
     * @param   {string}    event.type       The name of the event.
     */

    /**
     * The current reloading state. If true, a refresh is already in progress and we should not do a further refresh.
     *
     * @defaults false
     *
     * @type boolean
     */
    this.reloading = false;

    /**
     * Only for iOS. The current pulling state. If true, the user is currently pulling the tableView.
     *
     * @defaults false
     *
     * @type boolean
     */
    this.pulling   = false;

    /**
     * Only for Android. Holds an instance of the activity indicator while the window is reloading. 
     *
     * @defaults false
     *
     * @type Piwik.UI.ActivityIndicator
     */
    this.activityIndicator = null;

    /**
     * Initialize the refresh UI widget. Adds an Android Option Menu Item and triggers the addition of the PullToRefresh
     * view.
     */
    this.init = function () {

        var that = this;
        Piwik.UI.OptionMenu.addItem({title: _('Mobile_Refresh'),
                                     icon: 'images/menu_refresh.png'}, function () {

            if (!that.reloading) {
                that.refresh();
            }
        });

        this.attachHeaderView();

        if (!Piwik.isIos) {
            this.refresh();
        }

        return this;
    };

    /**
     * Triggers the refresh state. Displays an activity indicator and a message that the window is currently reloading
     * the data.
     *
     * @fires Piwik.UI.Refresh#event:onRefresh
     */
    this.refresh = function () {
        if (!Piwik.isIos) {

            this.reloading = true;
            
            this.fireEvent('onRefresh', {type: 'onRefresh'});

            if (!this.activityIndicator) {
                // create the activity indicator if not already created
                this.activityIndicator = Piwik.require('UI/ActivityIndicator');
            }

            this.activityIndicator.style = 'loading';
            this.activityIndicator.show();

            return;
        }

        this.reloading = true;

        var tableView  = this.getParam('tableView');
        tableView.setContentInsets({top: 60});

        var now                      = new Date();
        this.lastUpdatedLabel.text   = String.format(_('Mobile_LastUpdated'), now.toLocaleTime());
        this.statusLabel.text        = _('Mobile_Reloading');
        
        this.pullViewArrow.hide();
        this.pullViewArrow.transform = Ti.UI.create2DMatrix();
        
        this.actInd.show();

        this.fireEvent('onRefresh', {type: 'onRefresh'});
    };

    /**
     * Call this method as soon as all requested data has been loaded. The method will reset/hide all previous
     * activity indicators and loading messages. Normally, we would solve this via an refresh.fireEvent('done') but
     * we have to execute this synchronous. The event would be executed async and some features would not work like
     * tableview.scrollToTop while setContentInsets is running in parallel.
     */
    this.refreshDone = function () {
        this.reloading = false;
        
        if (!Piwik.isIos) {

            if (this.activityIndicator) {
                this.activityIndicator.hide();
            }

            return;
        }

        var tableView = this.getParam('tableView');
        tableView.setContentInsets({top: 0});
        
        this.statusLabel.text = _('Mobile_PullDownToRefresh');
        this.pullViewArrow.show();
        this.actInd.hide();
    };

    /**
     * Only for iOS. Builds the "PullToRefresh" view and adds it to the given tableView.
     */
    this.attachHeaderView = function () {

        if (!Piwik.isIos) {
            // this feature is only supported on iOS.

            return;
        }
        
        var tableView = this.getParam('tableView');

        if (!tableView) {

            return;
        }

        var that           = this;

        // pull to refresh, not supported by android
        var pullViewHeader = Ti.UI.createView({id: 'pullToRefreshHeader'});

        this.pullViewArrow = Ti.UI.createView({id: 'pullToRefreshArrowImage'});

        this.statusLabel   = Ti.UI.createLabel({
            text: _('Mobile_PullDownToRefresh'),
            id: 'pullToRefreshStatusLabel',
            shadowOffset: {x: 0, y: 1}
        });
        
        this.lastUpdatedLabel = Ti.UI.createLabel({
            text: '',
            id: 'pullToRefreshUpdateLabel',
            shadowOffset: {x: 0, y: 1}
        });

        this.actInd = Ti.UI.createActivityIndicator({
            left: 20,
            bottom: 13,
            width: 30,
            height: 30,
            style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK
        });

        pullViewHeader.add(this.pullViewArrow);
        pullViewHeader.add(this.statusLabel);
        pullViewHeader.add(this.lastUpdatedLabel);
        pullViewHeader.add(this.actInd);

        tableView.headerPullView = pullViewHeader;

        tableView.addEventListener('scroll', function(event) {
            // fired each time the user scrolls within the tableview

            var offset = (event && event.contentOffset) ? event.contentOffset.y : 0;

            var transform;
            if (offset <= -65.0 && !that.pulling) {
                transform = Ti.UI.create2DMatrix();
                transform     = transform.rotate(-180);
                that.pulling  = true;

                that.pullViewArrow.animate({transform: transform, duration: 180});
                that.statusLabel.text = _('Mobile_ReleaseToRefresh');

            } else if (that.pulling && offset > -65.0 && offset < 0) {
                that.pulling     = false;
                transform    = Ti.UI.create2DMatrix();

                that.pullViewArrow.animate({transform: transform, duration: 180});
                that.statusLabel.text = _('Mobile_PullDownToRefresh');
            }
        });

        tableView.addEventListener('scrollEnd', function(event) {
            if (that.pulling && !that.reloading && event && event.contentOffset && event.contentOffset.y <= -65.0) {

                // the user was pulling, no reloading is currently running, the user scrolled to the correct section
                that.refresh();
            }
        });

        // do the initial refresh
        this.refresh();
    };
};

/**
 * Extend Piwik.UI.View
 */
Piwik.UI.Refresh.prototype = Piwik.require('UI/View');