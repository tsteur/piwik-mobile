/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'statistics/show.js' .
 */

/**
 * @class Display statistics depending on the given site and period. The user is able to change period, date and site.
 *
 * @param {Object}      params
 * @param {Object}      params.site         The current selected site.
 * @param {Object}      params.report       Report information. Object looks like:
 *                                          {"category":"Actions",
 *                                           "name":"Downloads",
 *                                           "module":"Actions",
 *                                           "action":"getDownloads",
 *                                           "dimension":"Download URL",
 *                                           "metrics":{"nb_hits":"Pageviews","nb_visits":"Visits"},
 *                                           "uniqueId":"Actions_getDownloads"},
 * @param {string|Date} [params.date]       Optional. The current selected date. Can be either a Date object
 *                                          or string in the following format "YYYY-MM-DD". Defaults to now.
 * @param {string}      [params.period]     Optional. The current selected period. For example 'day' or 'week'.
 * @param {boolean}     [params.showAll]    Optional. True if all (is slow), false if only the top most (paging)
 *                                          statistics shall be fetched.
 *
 * @this     {Piwik.UI.Window}
 * @augments {Piwik.UI.Window}
 */
function window (params) {

    /**
     * @see Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: params.report ? params.report.name : ''};

    /**
     * @see Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {};
    
    var that          = this;

    if (params.report) {
        Piwik.Tracker.setCustomVariable(1, 'reportModule', params.report.module, 'page');
        Piwik.Tracker.setCustomVariable(2, 'reportAction', params.report.action, 'page');
        Piwik.Tracker.setCustomVariable(3, 'reportUniqueId', params.report.uniqueId, 'page');
    }

    var request      = Piwik.require('Network/StatisticsRequest');
    var tableView    = Ti.UI.createTableView({id: 'statisticsTableView'});
    var refresh      = this.create('Refresh', {tableView: tableView});

    this.add(tableView);

    this.addEventListener('onDateChanged', function (event) {
        // user has changed the date and/or period -> reload statistics using the updated date/period

        var period = '';
        if (event && event.period) {
            period        = event.period;
            params.period = period;
        }

        Piwik.getTracker().trackEvent({title: 'Date/Period changed', 
                                       url: '/statistic-change/date-period/' + period});

        if (event && event.date) {
            params.date   = event.date;
        }

        params.showAll    = false;

        refresh.refresh();
    });

    this.addEventListener('onSiteChanged', function (event) {
        // user has changed the site -> load statistics of the new site

        Piwik.getTracker().trackEvent({title: 'Site changed', url: '/statistic-change/site'});

        params.site    = event.site;
        params.showAll = false;

        refresh.refresh();
    });

    this.addEventListener('onPaginatorChanged', function (event) {

        if (event.showAll) {
            Piwik.getTracker().trackEvent({title: 'Show all changed', url: '/statistic-change/show-all/enabled'});
        } else {
            Piwik.getTracker().trackEvent({title: 'Show all changed', url: '/statistic-change/show-all/disabled'});
        }

        params.showAll = event.showAll;

        refresh.refresh();
    });

    refresh.addEventListener('onRefresh', function () {
        // simple refresh using the same params

        tableView.setData([]);

        request.send(params);
    });

    request.addEventListener('onload', function (event) {
        
        var site = event.site;

        that.menuOptions  = {dayChooser: true,
                             siteChooser: true,
                             optionMenuSettingsChooser: true,
                             date: event.date,
                             period: event.period,
                             window: that};

        // update menu after each request cause of a possibly period and/or date change.
        Piwik.UI.layout.menu.refresh(that.menuOptions);

        var tableViewRows = [];

        if (Piwik.isIpad) {
            tableViewRows.push(that.create('TableViewSection', {title:  event.reportDate}));
        } else {
            tableViewRows.push(that.create('TableViewSection', {title: site ? site.name : ''}));
        }

        var graph    = null;
        var graphUrl = null;

        if (event.graphsEnabled && event.metadata && event.metadata.imageGraphUrl) {
            // Piwik 1.6 or higher

            graph               = Piwik.require('PiwikGraph');
            var accountManager  = Piwik.require('App/Accounts');
            var account         = accountManager.getAccountById(event.site.accountId);
            graphUrl            = event.metadata.imageGraphUrl;
            
            if (event.sortOrderColumn) {
                graphUrl       += '&filter_sort_column=' + event.sortOrderColumn;
            }
            
            graphUrl            = graph.generateUrl(graphUrl, account, event.site, event.report);
            graph               = that.create('Graph', {graphUrl: graphUrl, graph: graph});
            
            tableViewRows.push(graph.getRow());
            
        } else if (event.graphsEnabled && (!event.metadata || 'undefined' == typeof(event.metadata.imageGraphUrl))) {
            // Piwik 1.5 or older
                      
            graph     = Piwik.require('Graph');
            graphUrl  = graph.getPieChartUrl(event);
            
            if (graphUrl) {
                
                graph = that.create('Graph', {graphUrl: graphUrl, graph: graph});
                
                tableViewRows.push(graph.getRow());
            }
            
        }

        // we need a Date object. Convert to date object if a string is given
        var optionDate = event.date ? event.date : new Date();
        if ('string' === (typeof optionDate).toLowerCase()) {
            optionDate = optionDate.toPiwikDate();
        }
        
        if (!Piwik.isIpad) {
            tableViewRows.push(that.create('TableViewSection', {title:  event.reportDate}));
        }


        // @see Piwik.Network.StatisticsRequest#report
        var statsticTitleLabel = null;
        if (event.report && event.report.dimension) {
            statsticTitleLabel = event.report.dimension;
        }

        if (event.columns && event.columns.label) {
            // @see Piwik.Network.StatisticsRequest#columns
            statsticTitleLabel = event.columns.label;
        }

        var statsticValueLabel = '';
        if (event.columns && event.columns[event.sortOrderColumn]) {
            statsticValueLabel = event.columns[event.sortOrderColumn];
        } else if (event.columns && event.columns.value) {
            statsticValueLabel = event.columns.value;
        } else {
            statsticValueLabel = _('General_Value');
        }

        var headlineStats = null;
        if (statsticTitleLabel && statsticValueLabel) {
            // do not display headline for reports with no dimensions like 'VisitsSummary.get'
            headlineStats = {title: statsticTitleLabel,
                             value: statsticValueLabel};
        }

        var visitorStats  = that.create('StatisticList', {values:   event.reportData,
                                                          showAll:  event.showAll,
                                                          headline: headlineStats});

        tableViewRows     = tableViewRows.concat(visitorStats.getRows());

        refresh.refreshDone();
        tableView.setData(tableViewRows);
    });

    /**
     * Request statistics async.
     *
     * @param  {object} params 
     */
    this.open = function (params) {
        request.send(params);
    };
}