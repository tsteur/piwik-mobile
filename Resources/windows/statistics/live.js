/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'statistics/live.js' .
 */

/**
 * @class Displays an overview of visitors in real time. It currently displays the latest 10 visitors on window open.
 *        If auto refresh is enabled, it will automatically request new visitors. The list does not display more than
 *        30 visitors cause of performance/memory impacts (especially on older/slower devices).
 *
 * @param    {Object}      params
 * @param    {Object}      params.site           The current selected site.
 * @param    {boolean}     params.autoRefresh    True if the window shall refresh the visitors in real time.
 *
 * @this     {Piwik.UI.Window}
 * @augments {Piwik.UI.Window}
 */
function window (params) {

    /**
     * @see Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: _('Live_VisitorsInRealTime')};

    /**
     * @see Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {};

    this.refreshTimer = null;

    var that                     = this;
    var refreshIntervalInMs      = 45000;
    var latestRequestedTimestamp = 0;

    var request   = Piwik.require('Network/LiveRequest');
    var tableView = Ti.UI.createTableView({id: 'liveTableView'});
    var refresh   = Piwik.UI.createRefresh({tableView: tableView});

    this.add(tableView);

    var site      = params.site;

    if (!site || !site.accountId) {
        //@todo shall we close the window?
        Piwik.Log.warn('Missing site parameter, can not display window', 'statistics/live::window');

        return;
    }
    
    var accountManager   = Piwik.require('App/Accounts');
    var account          = accountManager.getAccountById(site.accountId);

    if (!account) {
        //@todo shall we close the window?
        Piwik.Log.warn('Account not exists, can not display window', 'statistics/live::window');

        return;
    }

    var accessUrl        = ('' + account.accessUrl).formatAccessUrl();

    this.addEventListener('close', function () {
        if (that.refreshTimer) {
            // do no longer execute autoRefresh if user closed the window
            clearTimeout(that.refreshTimer);
        }
    });

    this.addEventListener('blurWindow', function () {
        if (that.refreshTimer) {
            // do no longer execute autoRefresh if user opened a new window and this window is no longer visible
            clearTimeout(that.refreshTimer);
        }
    });

    this.addEventListener('focusWindow', function () {
        if (params.autoRefresh && tableView.data && tableView.data.length) {
            // start auto refresh again if user returns to this window from a previous displayed window
            refresh.refresh();
        }
    });

    Ti.App.addEventListener('pause', function () {
        if (that && that.refreshTimer) {
            // do no longer execute autoRefresh if user opens another app or returns the home screen (only for iOS)
            clearTimeout(that.refreshTimer);
        }

        // start auto refresh again on resume event?
    });

    if (Ti.UI.currentWindow && Ti.UI.currentWindow.activity) {
        Ti.UI.currentWindow && Ti.UI.currentWindow.activity.addEventListener('pause', function () {
            if (that && that.refreshTimer) {
                // do no longer execute autoRefresh if user opens another app or returns the home screen (only for iOS)
                clearTimeout(that.refreshTimer);
            }

            // start auto refresh again on resume event?
        });
    }

    refresh.addEventListener('onRefresh', function () {

        if (that.refreshTimer) {
            // user possibly requested refresh manually. Stop a previous timer. Makes sure we won't send the same
            // request in a few seconds again
            clearTimeout(that.refreshTimer);
        }
        
        // set the latest requested timestamp to make sure we don't fetch the same users again which are already
        // displayed
        if (latestRequestedTimestamp) {
            params.minTimestamp = latestRequestedTimestamp;
        }
        
        params.fetchLiveOverview = true;

        request.send(params);
    });

    tableView.addEventListener('click', function (event) {
        if (!event || !event.rowData || !event.rowData.visitor) {

            return;
        }

        // open a new window to displayed detailed information about the visitor
        Piwik.UI.createWindow({url: 'statistics/visitor.js',
                               accessUrl: accessUrl,
                               visitor: event.rowData.visitor});
    });

    this.lastMinutes = Piwik.UI.createLiveOverview({title: String.format(_('Live_LastMinutes'), '30')});
    this.lastHours   = Piwik.UI.createLiveOverview({title: String.format(_('Live_LastHours'), '24')});

    var visitorDefaultRows = [this.lastMinutes.getRow(),
                              this.lastHours.getRow(),
                              Piwik.UI.createTableViewSection({title: _('General_Visitors')})];

    var visitorRows = [];

    request.addEventListener('onload', function (event) {

        refresh.refreshDone();

        if (event.lastMinutes) {
            that.lastMinutes.refresh({actions: event.lastMinutes.actions,
                                      visits: event.lastMinutes.visits});
        }

        if (event.lastHours) {
            that.lastHours.refresh({actions: event.lastHours.actions,
                                    visits: event.lastHours.visits});
        }

        if (!event.details || !event.details.length) {

            return;
        }
        
        tableView.setData([]);

        // insert new rows
        var visitorOverview = null;
        var visitorRow      = null;
        var visitor         = null;
        for (var index = event.details.length; 0 <= index; index--) {

           visitor = event.details[index];

            if (!visitor) {
                continue;
            }

            visitorOverview = Piwik.UI.createVisitorOverview({visitor: visitor, accessUrl: accessUrl});
            visitorRow      = visitorOverview.getRow();

            // add visitor information to the row. This makes it possibly to access this value when
            // the user clicks on a row within the tableview (click event).
            // we do not do this in VisitorOverview UI widget cause it's a window specific thing.
            visitorRow.visitor   = visitor;
            
            visitorRows.unshift(visitorRow);
        }

        if (visitor && visitor.serverTimestamp) {
            // store the timestamp of the first visitor as the latest requested timestamp
            latestRequestedTimestamp = visitor.serverTimestamp;
        }

        // remove all old rows if tableView contains more rows than 30...
        // otherwise there are possibly memory/scrolling issues
        while (visitorRows && visitorRows.length && 30 <= visitorRows.length) {
            visitorRows.pop();
        }

        tableView.setData(visitorDefaultRows.concat(visitorRows));

        if (params.autoRefresh) {
            that.refreshTimer = setTimeout(function () {
                refresh.refresh();
            }, refreshIntervalInMs);
        }
    });

    /**
     * Request real time visitors async.
     *
     * @param  {object} params
     */
    this.open = function (params) {
        params.fetchLiveOverview = true;
        request.send(params);
    };
}