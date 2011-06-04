/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    Fetches statistics using the 'metadata' api. See <a href="http://piwik.org/docs/analytics-api/metadata/#toc-listing-all-the-metadata-api-functions">Metadata API</a>
 */
Piwik.Network.StatisticsRequest = function () {

    /**
     * Fired as soon as all statistic values are fetched.
     *
     * @name    Piwik.Network.StatisticsRequest#event:onload
     * @event
     *
     * @param   {Object}    event
     * @param   {string}    event.type              The name of the event.
     * @param   {string}    event.accessUrl         See {@link Piwik.Network.StatisticsRequest#accessUrl}
     * @param   {string}    event.columns           See {@link Piwik.Network.StatisticsRequest#columns}
     * @param   {string}    event.date              See {@link Piwik.Network.StatisticsRequest#date}
     * @param   {string}    event.graphData         See {@link Piwik.Network.StatisticsRequest#graphData}
     * @param   {string}    event.graphsEnabled     See {@link Piwik.Network.StatisticsRequest#graphsEnabled}
     * @param   {string}    event.metadata          See {@link Piwik.Network.StatisticsRequest#metadata}
     * @param   {string}    event.period            See {@link Piwik.Network.StatisticsRequest#period}
     * @param   {string}    event.report            See {@link Piwik.Network.StatisticsRequest#report}
     * @param   {string}    event.reportWebsite     See {@link Piwik.Network.StatisticsRequest#reportWebsite}
     * @param   {string}    event.reportDate        See {@link Piwik.Network.StatisticsRequest#reportDate}
     * @param   {string}    event.reportData        See {@link Piwik.Network.StatisticsRequest#reportData}
     * @param   {string}    event.site              See {@link Piwik.Network.StatisticsRequest#site}
     * @param   {string}    event.showAll           See {@link Piwik.Network.StatisticsRequest#showAll}
     * @param   {string}    event.sortOrderColumn   See {@link Piwik.Network.StatisticsRequest#sortOrderColumn}
     */

    /**
     * The url of the Piwik installation we used to query the data.
     *
     * @type string|null
     */
    this.accessUrl        = null;

    /**
     * An object containing all available columns for the given statistics as returned by the Piwik method
     * 'API.getProcessedReport'. See <a href="http://piwik.org/docs/analytics-api/reference/#API">Module API</a>.
     *
     * Object looks for example as follows:
     * {"label":"Country",
     *  "nb_visits":"Visits",
     *  "nb_uniq_visitors":"Unique visitors",
     *  "nb_actions":"Actions",
     *  "nb_actions_per_visit":"Actions per Visit",
     *  "avg_time_on_site":"Avg. Time on Website",
     *  "bounce_rate":"Bounce Rate",
     *  "revenue":"Revenue"}
     *
     * @type Object|null
     */
    this.columns          = null;

    /**
     * The date you request the statistics for. Either a date object or a string in the format 'YYYY-MM-DD'.
     *
     * @type Date|string|null
     */
    this.date             = null;

    /**
     * Graph data which can be used to display pie or bar charts in the following style:
     * Object (
     *    [label] => [value]
     * )
     *
     * @type Object|null
     */
    this.graphData        = null;

    /**
     * True if the display of graphs is enabled, false or null otherwise.
     *
     * @type boolean|null
     */
    this.graphsEnabled    = null;

    /**
     * An object containing all available metadata for the given statistics as returned by the Piwik method
     * 'API.getProcessedReport'. See <a href="http://piwik.org/docs/analytics-api/reference/#API">Module API</a>.
     *
     * Object looks for example as follows:
     * {"category":"Visitors",
     *  "name":"Country",
     *  "module":"UserCountry",
     *  "action":"getCountry",
     *  "dimension":"Country",
     *  "metrics":{"nb_visits":"Visits","nb_uniq_visitors":"Unique visitors","nb_actions":"Actions"},
     *  "processedMetrics":{"nb_actions_per_visit":"Actions per Visit","avg_time_on_site":"Avg. Time on Website","bounce_rate":"Bounce Rate"},
     *  "metricsGoal":{"nb_conversions":"Conversions","revenue":"Revenue"},
     *  "processedMetricsGoal":{"revenue_per_visit":"Value per Visit"},
     *  "uniqueId":"UserCountry_getCountry"}
     *
     * @type Object|null
     */
    this.metadata         = null;

    /**
     * The period you request the statistics for. Can be any of: day, week, month or year.
     *
     * @type string|null
     */
    this.period           = null;

    /**
     * A report object that defines which report shall be fetched.
     * Report looks like
     * {"category":"Actions",
     *  "name":"Downloads",
     *  "module":"Actions",
     *  "action":"getDownloads",
     *  "dimension":"Download URL",
     *  "metrics":{"nb_hits":"Pageviews","nb_visits":"Visits"},
     *  "uniqueId":"Actions_getDownloads"}
     *
     *  @type Object|null
     */
    this.report           = null;

    /**
     * The name of the website yu request the statistics for. For example 'Piwik Forums'.
     *
     * @type string|null
     */
    this.reportWebsite    = null;

    /**
     * The date (or date range) as returned by the Piwik api that was used to fetch the statistics (prettyDate).
     * For example "Saturday 21 May 2011".
     *
     * @type string|null
     */
    this.reportDate       = null;

    /**
     * The report data as returned by the method {@link Piwik.Network.StatisticsRequest#_formatReportData}
     *
     * @type Array|null
     */
    this.reportData       = null;

    /**
     * The site from which the statistics are retrieved.
     *
     * @type Object|null
     */
    this.site             = null;

    /**
     * Whether all statistics shall be fetched or just the top most.
     *
     * @defaults false
     *
     * @type boolean
     */
    this.showAll          = false;

    /**
     * The name of the column to be sorted by. For example 'nb_visits'.
     *
     * @type string|null
     */
    this.sortOrderColumn  = null;

    /**
     * Initialize / reset all previous defined or fetched values. We have to do this cause it is possible to call the
     * 'send' method multiple times.
     */
    this.init = function () {
        var settings          = Piwik.require('App/Settings');

        this.accessUrl        = '';
        this.columns          = null;
        this.date             = null;
        this.graphData        = null;
        this.graphsEnabled    = settings.getGraphsEnabled();
        this.metadata         = null;
        this.period           = null;
        this.report           = null;
        this.reportWebsite    = null;
        this.reportDate       = null;
        this.reportData       = null;
        this.site             = null;
        this.showAll          = false;
        this.sortOrderColumn  = null;
    };

    /**
     * Add an event listener to receive triggered events. The callback will be executed in the
     * Piwik.UI.Window context.
     *
     * @param   {string}     name       Name of the event you want to listen to.
     * @param   {Function}   callback   Callback function to invoke when the event is fired
     */
    this.addEventListener = function (name, callback) {
        Piwik.UI.currentWindow.addEventListener(name, callback);
    };

    /**
     * Fires an event to all listeners. The event will be fired in Piwik.UI.Window context.
     *
     * @param   {string}     name       Name of the event you want to fire.
     * @param   {Function}   event      An event object that will be passed to the callback function which was added
     *                                  via addEventListener.
     */
    this.fireEvent = function (name, event) {
        Piwik.UI.currentWindow.fireEvent(name, event);
    };
    
    /**
     * Fetch statistic values depending on the given report, site, date and period.
     *
     * @param   {Object}        params
     * @param   {Object}        params.site                 A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param   {Object}        params.report               A report object, see
     *                                                      {@link Piwik.Network.StatisticsRequest#report}
     * @param   {string|Date}   [params.date="today"]       Optional. The current selected date.
     * @param   {string}        [params.period]             Optional. The current selected period.
     */
    this.send = function (params) {
        this.init();

        var session       = Piwik.require('App/Session');

        var periodSession = session.get('piwik_parameter_period');
        var dateSession   = session.get('piwik_parameter_date');

        var requestPool   = Piwik.require('Network/RequestPool');
        requestPool.setContext(this);

        this.period       = params.period || periodSession;
        this.date         = params.date || dateSession;
        this.showAll      = params.showAll || this.showAll;

        this.deactivateChart = {VisitFrequency_get: true,
                                UserSettings_getPlugin: true,
                                VisitsSummary_get: true,
                                Goals_get: true,
                                'Goals_get_idGoal--X': true};

        this.site            = params.site;

        var accountManager   = Piwik.require('App/Accounts');
        var account          = accountManager.getAccountById(this.site.accountId);

        this.report          = params.report;
        this.sortOrderColumn = this._getSortOrder(this.report);

        var parameter  = {idSite: this.site.idsite,
                          date: 'today', 
                          filter_sort_order: this.sortOrderColumn,
                          apiModule: this.report.module,
                          apiAction: this.report.action};

        if(this.report.parameters) {
            for(var index in this.report.parameters) {
                parameter[index]   = this.report.parameters[index];
            }
            // Small hack for graphs to be disabled correctly
            this.report.uniqueId   = this.report.uniqueId.replace(/--[^_]/, '--X');
        }
                          
        if (!this.showAll) {
            parameter.filter_limit = config.piwik.filterLimit;
        }  else {
            // -1 means request really all results
            parameter.filter_limit = -1;
        }
        
        if (this.date) {
            parameter.date  = this.date;
        } else {
            this.date       = null;
        }
        
        if ('string' === (typeof parameter.date).toLowerCase()) {
            // I think we can optimize this... we want to convert 'yesterday' to a date in the format 'YYYY-MM-DD'
            parameter.date  = parameter.date.toPiwikDate().toPiwikQueryString();
        }

        parameter.period    = this.period;
        this.accessUrl      = account.accessUrl;

        var statsRequest    = Piwik.require('Network/PiwikApiRequest');
        statsRequest.setMethod('API.getProcessedReport');
        statsRequest.setParameter(parameter);
        statsRequest.setAccount(account);
        statsRequest.setCallback(this, function (response) {
            if (!response) {
                return;
            }

            this.reportWebsite  = response.website;
            this.reportDate     = response.prettyDate;
            this.metadata       = response.metadata;
            this.columns        = response.columns;
            this.reportData     = this._formatReportData(response, account);
        });

        requestPool.attach(statsRequest);

        if (this.graphsEnabled && (!this.deactivateChart || !this.deactivateChart[this.report.uniqueId])) {

            var targetDate   = new Date();
            
            if (this.date) {
                targetDate   = this.date;
            }
            
            if ('string' === (typeof targetDate).toLowerCase()) {
                targetDate   = targetDate.toPiwikDate();
            }
            
            var parameter    = {idSite: this.site.idsite,
                                period: this.period,
                                filter_truncate: 4,
                                filter_sort_order: this.sortOrderColumn,
                                apiModule: this.report.module,
                                apiAction: this.report.action,
                                date: targetDate.toPiwikQueryString()};

            var graphRequest = Piwik.require('Network/PiwikApiRequest');
            graphRequest.setMethod('API.getProcessedReport');
            graphRequest.setParameter(parameter);
            graphRequest.setAccount(account);
            graphRequest.setCallback(this, function (response) {
                if (!response) {
                    return;
                }

                this.graphData = this._formatGraphData(response);
            });

            requestPool.attach(graphRequest);
        }
        
        requestPool.send(this.loaded);
    };

    /**
     * Will be called as soon as all requests are finished and processed their result/callbacks. We can now fire the
     * 'onload' containing the combined result.
     *
     * @fires Piwik.Network.StatisticsRequest#event:onload
     */
    this.loaded = function () {
        var eventResult = {type: 'onload',
                           accessUrl: this.accessUrl,
                           columns: this.columns,
                           date: this.date,
                           graphData: this.graphData,
                           graphsEnabled: this.graphsEnabled,
                           metadata: this.metadata,
                           report: this.report,
                           reportData: this.reportData,
                           reportDate: this.reportDate,
                           reportMetadata: this.reportMetadata,
                           reportWebsite: this.reportWebsite,
                           period: this.period,
                           site: this.site,
                           showAll: this.showAll,
                           sortOrderColumn: this.sortOrderColumn};

        this.fireEvent('onload', eventResult);
    };

    /**
     * Finds the best possible sort order column.
     *
     * @param   {Object}    report    The current selected report containing metrics information.
     * 
     * @returns {string}   The name of the default sort order column depending on the given report.
     */
    this._getSortOrder = function (report) {
    
        var sortOrder  = config.piwik.usedRow;
        
        if (report && report.metrics) {
            if (!report.metrics[sortOrder]) {
                // define another sortOrder if our prefered sortOrder is not available
                for (var metricName in report.metrics) {
                    sortOrder = metricName;
                }
            }
        }
        
        return sortOrder;
    };

    /**
     * Formats the response of the getProcessedReport as required by the Graph API.
     *
     * @param   {Object}   response    Response of the getProcessedReport request.
     * 
     * @returns {Object}   Graph data which can be used to display pie or bar charts in the following style:
     *                     Object (
     *                         [label] => [value]
     *                     )
     */
    this._formatGraphData = function (response) {
    
        var graphRows = {};
        if (response && response.reportData && (response.reportData instanceof Array) && 0 < response.reportData.length) {
            for (var index = 0; index < response.reportData.length; index++) {
                
                if (!response.reportData[index]) {
                    continue;    
                }
                
                var report = response.reportData[index];
                var label  = report.label;
                
                if (response.reportMetadata 
                    && response.reportMetadata[index] 
                    && response.reportMetadata[index].shortLabel) {
                    // always prefer the sortLabel
                    label  = response.reportMetadata[index].shortLabel;
                }
                
                if (22 < label.length ) {
                    label  = label.substr(0, 10) + '...' + label.substr(label.length - 10, 10);
                }

                graphRows[label] = report[this.sortOrderColumn] ? report[this.sortOrderColumn] : report.value;
            }
        }    
        
        return graphRows;
    };

    /**
     * Formats the response of the getProcessedReport as required by the StatisticsList API.
     *
     * @param   {Object}   response    Response of the getProcessedReport request.
     * @param   {Object}   account     The current used piwik account.
     * 
     * @returns {Array}    All existing statistics data returned by getProcessedReport. The array contains an object for
     *                     each single statistics row/entry.
     *                     Array (
     *                         [int] => Object (
     *                                      [title]      => [The title of this entry]
     *                                      [value]      => [The value of this entry]
     *                                      [logo]       => [An absolute path to the logo if one is defined in reportMetadata]
     *                                      [logoWidth]  => [Width of the logo if one is defined in reportMetadata]
     *                                      [logoHeight] => [Height of the logo if one is defined in reportMetadata]
     *                                  )
     *                     )
     */
    this._formatReportData = function (response, account) {
            
        var reportRow = [];
      
        if (response && response.reportData && (response.reportData instanceof Array) && 0 < response.reportData.length) {
            for (var index = 0; index < response.reportData.length; index++) {
                
                if (!response.reportData[index]) {
                    continue;    
                }
                
                var label = response.reportData[index].label;
                
                if (response.reportMetadata && response.reportMetadata[index] && response.reportMetadata[index].shortLabel) {
                    // always prefer the sortLabel
                    label = response.reportMetadata[index].shortLabel;
                }
                
                var value = response.reportData[index].value;
                
                if (response.reportData[index][this.sortOrderColumn]) {
                    value = response.reportData[index][this.sortOrderColumn];
                }
                
                var row = {title: label, value: value};
                
                if (response.reportMetadata && response.reportMetadata[index] && response.reportMetadata[index].logo) {
                    
                    row.logo = ('' + account.accessUrl).formatAccessUrl() + response.reportMetadata[index].logo;
                    
                    if (response.reportMetadata[index].logoWidth) {
                        row.logoWidth  = response.reportMetadata[index].logoWidth;
                    }
                    if (response.reportMetadata[index].logoHeight) {
                        row.logoHeight = response.reportMetadata[index].logoHeight;
                    }
                }
            
                reportRow.push(row);
            }
        }
        
        return reportRow;
    };
};