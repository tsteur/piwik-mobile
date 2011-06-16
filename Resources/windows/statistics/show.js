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

    var request      = Piwik.require('Network/StatisticsRequest');
    var tableView    = Ti.UI.createTableView({id: 'statisticsTableView'});
    var refresh      = Piwik.UI.createRefresh({tableView: tableView});

    var cache        = Piwik.require('App/Cache');
    var allowedSites = cache.get('piwik_sites_allowed');
    if (cache.KEY_NOT_FOUND === allowedSites) {
        allowedSites = [this.site];
    }

    this.add(tableView);

    this.addEventListener('onDateChanged', function (event) {
        // user has changed the date and/or period -> reload statistics using the updated date/period

        if (event && event.date) {
            params.date   = event.date;
        }

        if (event && event.period) {
            params.period = event.period;
        }

        params.showAll    = false;

        refresh.refresh();
    });

    this.addEventListener('onSiteChanged', function (event) {
        // user has changed the site -> load statistics of the new site

        params.site    = event.site;
        params.showAll = false;

        refresh.refresh();
    });

    this.addEventListener('onPaginatorChanged', function (event) {

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

        this.titleOptions = {title: event.report ? event.report.name : ''};
        this.menuOptions  = {dayChooser: true,
                             siteChooser: true,
                             optionMenuSettingsChooser: true,
                             date: event.date,
                             period: event.period,
                             currentSite: site,
                             allowedSites: allowedSites};

        // update header and menu after each request cause of a possibly period and/or date change.
        Piwik.UI.layout.header.refresh(this.titleOptions);
        Piwik.UI.layout.menu.refresh(this.menuOptions);

        var tableViewRows = [];

        tableViewRows.push(Piwik.UI.createTableViewSection({title: site ? site.name : ''}));

        if (event.graphsEnabled && event.graphData) {

            var graph    = Piwik.require('Graph');
            var graphUrl = graph.getPieChartUrl(event.graphData);
            graph        = Piwik.UI.createGraph({graphUrl: graphUrl});

            tableViewRows.push(graph.getRow());
        }

        // we need a Date object. Convert to date object if a string is given
        var optionDate = event.date ? event.date : new Date();
        if ('string' === (typeof optionDate).toLowerCase()) {
            optionDate = optionDate.toPiwikDate();
        }

        tableViewRows.push(Piwik.UI.createTableViewSection({title:  event.reportDate}));

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

        var visitorStats  = Piwik.UI.createStatisticList({values:   event.reportData,
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