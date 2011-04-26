/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class    Displays statistics using the 'metadata' api.
 *              
 * @augments ActionController
 */
function StatisticsController () {

    /**
     * Init statisticController
     * 
     * @type null
     */
    this.init = function () {
    
        var periodSession = Session.get('piwik_parameter_period');
        var dateSession   = Session.get('piwik_parameter_date');
    
        this.period       = this.getParam('period', periodSession);
        this.date         = this.getParam('date', dateSession);
        this.showAll      = this.getParam('showAll', false);
        this.view.showAll = this.showAll;
        
        this.graphsEnabled      = Settings.getGraphsEnabled();
        this.view.graphsEnabled = this.graphsEnabled;
        
        this.deactivateChart    = {VisitFrequency_get: true,
                                   UserSettings_getPlugin: true,
                                   VisitsSummary_get: true,
                                   Goals_get: true,
                                   'Goals_get_idGoal--X': true};
    };

    /**
     * Displays page related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.showAction = function () {
        
        var site         = this.getParam('site');
        
        /**
         * Report looks like
         *  {"category":"Actions","name":"Downloads","module":"Actions","action":"getDownloads",
         *   "dimension":"Download URL","metrics":{"nb_hits":"Pageviews","nb_visits":"Visits"},
         * "uniqueId":"Actions_getDownloads"},
         * @var Object
         */
        var report       = this.getParam('report');
        var allowedSites = Cache.get('piwik_sites_allowed');
        var sortOrder    = this._getSortOrder(report);
        
        if (Cache.KEY_NOT_FOUND === allowedSites) {
            allowedSites = [site];
        }
        
        this.view.allowedSites    = allowedSites;
        this.view.site            = site;
        this.view.dimension       = null;
        this.view.sortOrderColumn = sortOrder;
        this.view.report          = report;
        
        if (report.dimension) {
            this.view.dimension   = report.dimension;
        }
        
        var parameter  = {idSite: this.view.site.idsite, 
                          date: 'today', 
                          filter_sort_order: sortOrder,
                          apiModule: report.module,
                          apiAction: report.action};
                          
        
        if(report.parameters) {
            for(var index in report.parameters) {
                parameter[index] = report.parameters[index];
            }
            // Small hack for graphs to be disabled correctly
            report.uniqueId = report.uniqueId.replace(/--[^_]/, '--X');
        }
        
        if (!this.showAll) {
            parameter.filter_limit = config.piwik.filterLimit;
        }  else {
            parameter.filter_limit = -1;	
        }
        
        if (this.date) {
            parameter.date  = this.date;
            
            this.view.date  = this.date;
        } else {
            this.view.date  = null;
        }
        
        if('string' === (typeof parameter.date).toLowerCase()) {
            // I think we can optimize this... we want to convert 'yesterday' to a date in the format 'YYYY-MM-DD'
            parameter.date  = parameter.date.toPiwikDate().toPiwikQueryString();
        }
        
        this.view.period    = this.period;
        parameter.period    = this.period;
        
        var piwik           = this.getModel('Piwik');
        var accountManager  = this.getModel('Account');
        var account         = accountManager.getAccountById(site.accountId);
        
        this.view.accessUrl = account.accessUrl;
        
        piwik.registerCall('API.getProcessedReport', parameter, account, function (response) { 
            if(!response) {
                return;
            }
            
            this.view.reportWebsite  = response.website;
            this.view.reportDate     = response.prettyDate;
            this.view.metadata       = response.metadata;
            this.view.columns        = response.columns;
            this.view.reportData     = this._formatReportData(response, account);
            this.view.reportMetadata = response.reportMetadata;
        });
        
        if (this.graphsEnabled && (!this.deactivateChart || !this.deactivateChart[report.uniqueId])) {
            
            var graphReport = {chartType: 'pie'};
            if (config.graph[report.module] && config.graph[report.module][report.action]) {
                graphReport = config.graph[report.module][report.action];
            }
            
            var targetDate  = new Date();
            
            if (this.date) {
                targetDate  = this.date;
            }
            
            if('string' === (typeof targetDate).toLowerCase()) {
                targetDate  = targetDate.toPiwikDate();
            }
            
            parameter = {idSite: this.view.site.idsite,
                         period: this.view.period,
                         filter_truncate: 4, 
                         filter_sort_order: sortOrder,
                         apiModule: report.module,
                         apiAction: report.action,
                         date: targetDate.toPiwikQueryString()};

            piwik.registerCall('API.getProcessedReport', parameter, account, function (response) { 
                if(!response) {
                    return;
                }
                
                this.view.graphData   = this._formatGraphData(response);
                this.view.graphReport = graphReport;
            });
        }
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('show');
        });
    };

    /**
     * Finds the best possible sort order column.
     *
     * @param   {Object}    report    The current selected report containing metrics information.
     * 
     * @returns {string}   The name of the default sort order column depending on the given report.
     */
    this._getSortOrder = function (report) {
    
        var sortOrder  = config.getUsedRow(this.period);
        
        if (report && report.metrics) {
            if (!report.metrics[sortOrder]) {
                // define another sortOrder if our prefered sortOrder is not available
                for (var metricName in report.metrics) {
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
                
                var label = report.label;
                
                if (response.reportMetadata 
                    && response.reportMetadata[index] 
                    && response.reportMetadata[index].shortLabel) {
                    // always prefer the sortLabel
                    label = response.reportMetadata[index].shortLabel;
                }
                
                if (22 < label.length ) {
                    label = label.substr(0, 10) + '...' + label.substr(label.length - 10, 10);
                }

                graphRows[label] = report[this.view.sortOrderColumn] ? report[this.view.sortOrderColumn] : report.value;
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
                
                if (response.reportData[index][this.view.sortOrderColumn]) {
                    value = response.reportData[index][this.view.sortOrderColumn];
                }
                
                var row = {title: label, value: value};
                
                if (response.reportMetadata && response.reportMetadata[index] && response.reportMetadata[index].logo) {
                    
                    row.logo = this._formatAccessUrl(account.accessUrl) + response.reportMetadata[index].logo;
                    
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
    
    /**
     * We need an url like http://demo.piwik.org/ or http://demo.piwik.org/foo/bar/
     * Therefore we have to add a trailing / if it doesn't exist already or remove for example index.php if url is 
     * http://demo.piwik.org/index.php 
     *
     * @param   {string}   accessUrl    A piwik access url.
     *
     * @returns {string}   The formatted access url.
     */
    this._formatAccessUrl = function (accessUrl) {
    
        if (!accessUrl) {
            Log.debug('missing Accessurl in formatAccessUrl', 'StatisticsController');
            
            return '';
        }
        
        if ('/' == accessUrl.substr(accessUrl.length - 1, 1)) {
            
            return accessUrl;
        }
        
        if ('.php' == accessUrl.substr(accessUrl.length -4, 4).toLowerCase()) {
            var lastSlash = accessUrl.lastIndexOf('/');
            accessUrl     = accessUrl.substr(0, lastSlash + 1);
            
            return accessUrl;
        }
        
        accessUrl = accessUrl + '/';
        
        return accessUrl;
    };
}

StatisticsController.prototype = new ActionController();
