/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'statistics/live.js' .
 */

/** @private */
var Piwik = require('library/Piwik');
/** @private */
var _     = require('library/underscore');

/**
 * @class     Displays a log of the visitors. It currently displays the latest 10 visitors on window open (depending
 *            on the current selected date). The list does not display more than 30 visitors cause of performance/memory
 *            impacts (especially on older/slower devices).
 *
 * @param     {Object}  params
 * @param     {Object}  params.site  The current selected site.
 *
 * @exports   window as WindowStatisticsVisitorlog
 * @this      Piwik.UI.Window
 * @augments  Piwik.UI.Window
 */
function window (params) {

    /**
     * @see  Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: _('Live_VisitorLog')};

    /**
     * @see  Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {commands: [this.createCommand('RefreshCommand')]};
        
    if (this.rootWindow) {
        this.rootWindow.backButtonTitle = _('General_Reports');
    }
    
    var that          = this;

    var latestRequestedTimestamp = null;
    var oldestVisitId            = null;
    var usedMaxVisitIds          = [];
    var visitorRows              = [];
    
    // variable to detect whether user has pressed "previous". We want to display the "next" row only if the user 
    // has pressed "previous" before.
    var userPressedPrevious      = false;
    
    this.addEventListener('onDateChanged', function (event) {
        // user has changed the date and/or period -> reload statistics using the updated date/period
        
        if (!event || !event.date) {
            
            return;
        }

        Piwik.getTracker().trackEvent({title: 'Date/Period changed', 
                                       url: '/statistic-change/visitorlog'});

        params.date              = event.date;
        params.minTimestamp      = null;
        params.maxIdVisit        = null;
        oldestVisitId            = null;
        latestRequestedTimestamp = null;
        usedMaxVisitIds          = [];
        userPressedPrevious      = false;
        
        event = null;

        refresh.refresh();
    });

    var request   = Piwik.require('Network/LiveRequest');
    var tableView = Ti.UI.createTableView({id: 'visitorLogTableView'});
    var refresh   = this.create('Refresh', {tableView: tableView});
    var site      = params.site;

    this.add(tableView);

    if (!site || !site.accountId) {
        //@todo shall we close the window?
        Piwik.getLog().warn('Missing site parameter, can not display window', 'statistics/live::window');

        return;
    }

    this.addEventListener('onSiteChanged', function (event) {
        // user has changed the site

        Piwik.getTracker().trackEvent({title: 'Site changed', url: '/statistic-change/site'});

        params.site              = event.site;
        site                     = event.site;
        latestRequestedTimestamp = null;
        oldestVisitId            = null;
        usedMaxVisitIds          = [];
        userPressedPrevious      = false;

        refresh.refresh();
    });
    
    var accountManager   = Piwik.require('App/Accounts');
    var account          = accountManager.getAccountById(site.accountId);

    if (!account) {
        //@todo shall we close the window?
        Piwik.getLog().warn('Account not exists, can not display window', 'statistics/live::window');

        return;
    }

    var accessUrl        = Piwik.getNetwork().getBasePath('' + account.accessUrl);

    refresh.addEventListener('onRefresh', function () {

        request.send(params);
    });

    tableView.addEventListener('click', function (event) {
        if (!event || !event.row || !event.row.visitor) {

            return;
        }
        
        // open a new window to displayed detailed information about the visitor
        that.create('Visitor', {accessUrl: accessUrl,
                                visitor: event.row.visitor,
                                openView: event.row.popoverView});
    });

    var siteCommand = this.createCommand('ChooseSiteCommand');
    request.addEventListener('onload', function (event) {

        if (refresh) {
            refresh.refreshDone();
        }

        if (!that || !event) {
            
            return;
        }
        
        that.cleanupTableData();

        visitorRows         = [];

        // insert new rows
        var visitorOverview = null;
        var visitorRow      = null;
        var visitor         = null;
        
        var websiteRow      = that.create('TableViewRow', {title: site ? site.name : '', 
                                                           hasChild: true, 
                                                           className: 'tableViewRowSelectable',
                                                           command: siteCommand});
        visitorRows.push(websiteRow);
        websiteRow          = null;
        
        var chooseDateTitle = _('General_ChooseDate');
        if (event.details && event.details.length && event.details[0] && event.details[0].serverDatePretty) {
            chooseDateTitle = event.details[0].serverDatePretty;
        }

        var dateCommand     = that.createCommand('ChooseDateCommand', {date: params.date ? params.date : new Date()});
        visitorRows.push(that.create('TableViewRow', {title: chooseDateTitle, 
                                                      hasChild: true,
                                                      className: 'tableViewRowSelectable',
                                                      command: dateCommand}));
        dateCommand = null;

        if (userPressedPrevious) {
            // dispaly NEXT only if user pressed the previous row before

            var nextPagerRow = Ti.UI.createTableViewRow({title: _('General_Next'),
                                                         className: 'visitorlogPagerTableViewRow'});
            nextPagerRow.addEventListener('click', function () {
    
                var previousUsedMaxIdVisit = null;
                if (usedMaxVisitIds && usedMaxVisitIds.length) {
                    // remove the current displayed maxVisitId from stack
                    usedMaxVisitIds.pop();
                    // now we are able to get the previous displayed maxVisitId
                    if (usedMaxVisitIds[usedMaxVisitIds.length - 1]) {
                        previousUsedMaxIdVisit = usedMaxVisitIds[usedMaxVisitIds.length - 1];
                    }
                }
    
                params.maxIdVisit          = previousUsedMaxIdVisit;
    
                // if there is no previousUsedMaxIdVisit given, request by minTimestamp. We always prefer maxIdVisit here
                // cause when maxIdVisit is used, we get the users sorted by VisitId/firstVisitTime
                if (!previousUsedMaxIdVisit) {
                    params.minTimestamp    = latestRequestedTimestamp;
                } else {
                    params.minTimestamp    = null;
                }
    
                params.fetchLiveOverview = false;
    
                refresh.refresh();
            });
    
            visitorRows.push(nextPagerRow);
            nextPagerRow = null;
        }

        if (event.details && event.details.length) {
            for (var index = 0; index < event.details.length; index++) {

               visitor = event.details[index];

                if (!visitor) {
                    continue;
                }

                if (0 == index && visitor.firstActionTimestamp) {
                    // store the timestamp of the first visitor as the latest requested timestamp
                    latestRequestedTimestamp = visitor.firstActionTimestamp;
                }
                
                visitorOverview = that.create('VisitorOverview', {visitor: visitor,
                                                                  accessUrl: accessUrl,
                                                                  useFirstVisit: true});
                visitorRow      = visitorOverview.getRow();

                // add visitor information to the row. This makes it possibly to access this value when
                // the user clicks on a row within the tableview (click event).
                // we do not do this in VisitorOverview UI widget cause it's a window specific thing.
                visitorRow.visitor = visitor;

                visitorRows.push(visitorRow);
                visitorRow         = null;
                visitorOverview    = null;
            }
            
            if (visitor && visitor.idVisit) {
                // store the id of the last visitor
                oldestVisitId = visitor.idVisit;
            }
            
            visitor           = null;
        } else {
            // no visitor found
            visitorRows.push(that.create('TableViewRow', {title: _('Mobile_NoVisitorFound'),
                                                          className: 'visitorlogNoVisitorTableViewRow'}));
        }

        var previousPagerRow  = Ti.UI.createTableViewRow({title: _('General_Previous'),
                                                          className: 'visitorlogPagerTableViewRow'});
        previousPagerRow.addEventListener('click', function () {
            params.minTimestamp      = null;
            params.maxIdVisit        = oldestVisitId;
            params.fetchLiveOverview = false;
            userPressedPrevious      = true;
            
            refresh.refresh();

            if (oldestVisitId) {
                // store the previous used oldestVisitId. This makes sure we can display the same previous users
                usedMaxVisitIds.push(oldestVisitId);
            }
        });

        visitorRows.push(previousPagerRow);
        previousPagerRow = null;
        
        tableView.setData(visitorRows);
        
        event = null;
    });

    /**
     * Request real time visitors async.
     *
     * @param  {object}  params
     */
    this.open = function (params) {
        
        params.fetchLiveOverview = false;

        request.send(params);
        params = null;
    };
    
    this.cleanupTableData = function () {
        
        if (visitorRows) {
            for (var index = 0; index < visitorRows.length; index++) {
                visitorRows[index] = null;
            }
        }
        
        visitorRows = null;
        visitorRows = [];
        
        tableView.setData([]);
    };
    
    this.cleanup = function () {
        this.cleanupTableData();
        
        this.remove(tableView);

        visitorRows    = null;
        tableView      = null;
        request        = null;
        refresh        = null;
        params         = null;
        that           = null;
        accountManager = null;
        account        = null;
        site           = null;
        this.menuOptions  = null;
        this.titleOptions = null;
    };
}

module.exports = window;