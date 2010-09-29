/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    Displays 'referer' related statistics using the 'referers' module.
 *              
 * @augments ActionController
 */
function ReferersController () {

    /**
     * Init refererscontroller
     * 
     * @type null
     */
    this.init = function () {
    
        var mySession     = new Session();
        
        var periodSession = mySession.get('piwik_parameter_period');
        var dateSession   = mySession.get('piwik_parameter_date');
    
        this.period   = this.getParam('period', periodSession);
        this.date     = this.getParam('date', dateSession);

        this.graphsEnabled      = Settings.getGraphsEnabled();
        this.view.graphsEnabled = this.graphsEnabled;
    };
    
    /**
     * Displays an overview of the referers statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.overviewAction = function () {
        
        var site         = this.getParam('site');
        var allowedSites = Cache.get('piwik_sites_allowed');
        
        if (Cache.KEY_NOT_FOUND === allowedSites) {
            allowedSites = [site];
        }
        
        this.view.allowedSites  = allowedSites;
        
        this.view.site = site;

        var parameter  = {idSite: this.view.site.idsite, 
                          date: 'today'};

        if (this.date) {
            parameter.date = this.date;

            this.view.date = this.date;
        } else {
            this.view.date = null;
        }
        
        this.view.period   = this.period;
        
        parameter.period   = this.period;

        var piwik          = this.getModel('Piwik');
        
        var accountManager = this.getModel('Account');
        var account        = accountManager.getAccountById(site.accountId);

        piwik.registerCall('Referers.getRefererType', parameter, account, function (response) { 
            if(response) {
                this.view.referer = response;
            }
        });
        
        if (this.graphsEnabled) {
            var targetDate = new Date();
            
            if (this.date) {
                targetDate = this.date;
            }
            
            if('string' === (typeof targetDate).toLowerCase()) {
                
                targetDate = targetDate.toPiwikDate();
            }
            
            parameter = {idSite: this.view.site.idsite,
                         period: this.view.period,
                         date: targetDate.toPiwikQueryStringLastDays(this.view.period)};
    
            piwik.registerCall('Referers.getRefererType', parameter, function (response, parameter) { 
                if(response && (response instanceof Object)) {
                    var referersByType = {};
                    var labels         = {};
                    var dates          = {};
                    
                    for(var indexDate in response) {
                        
                        var row = response[indexDate];
    
                        if(!dates[indexDate]) {
                            dates[indexDate] = 1;
                        }
                        
                        for(var rowIndex in row) {
                            
                            var label = row[rowIndex].label + " ";
                            
                            if(!labels[label]) {
                                labels[label] = 1;
                            }
                            
                            var value = row[rowIndex][config.getUsedRow(parameter.period)];
                            
                            if(!referersByType[label]) {
                                referersByType[label] = {};
                            }
                            
                            referersByType[label][indexDate] = value;
                        }
                    }
                    
                    // fill in missing 0 values
                    for(var type in labels) {
                        for(var indexDate in dates) {
                            if(!referersByType[type][indexDate]) {
                                referersByType[type][indexDate] = 0;
                            }
                        }
                    }
                    
                    this.view.referersByType = referersByType;
                }
            });
        }
        
        piwik.sendRegisteredCalls(function () {

            this.render('overview');
        });
    };

    /**
     * Displays search engine related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.searchengineAction = function () {
        
        var site         = this.getParam('site');
        var allowedSites = Cache.get('piwik_sites_allowed');
        
        if (Cache.KEY_NOT_FOUND === allowedSites) {
            allowedSites = [site];
        }
        
        this.view.allowedSites = allowedSites;
        
        this.view.site = site;
        
        var parameter  = {idSite: this.view.site.idsite, 
                          date: 'today', 
                          filter_sort_column: config.getUsedRow(this.period),
                          filter_sort_order: 'desc'};
        
        if (this.date) {
            parameter.date = this.date;
            
            this.view.date = this.date;
        } else {
            this.view.date = null;
        }
        
        this.view.period   = this.period;
        
        parameter.period   = this.period;
        
        var piwik          = this.getModel('Piwik');
        
        var accountManager = this.getModel('Account');
        var account        = accountManager.getAccountById(site.accountId);
        
        piwik.registerCall('Referers.getSearchEngines', parameter, account, function (response) { 
            if(response) {
                this.view.searchengine = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('searchengine');
        });
    };

    /**
     * Displays keyword related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.keywordAction = function () {
        
        var site         = this.getParam('site');
        var allowedSites = Cache.get('piwik_sites_allowed');
        
        if (Cache.KEY_NOT_FOUND === allowedSites) {
            allowedSites = [site];
        }
        
        this.view.allowedSites = allowedSites;
        
        this.view.site = site;
        
        var parameter  = {idSite: this.view.site.idsite, 
                          date: 'today', 
                          filter_sort_column: config.getUsedRow(this.period),
                          filter_sort_order: 'desc'};
        
        // limit to 25
        parameter.filter_limit = 25;
        
        if (this.date) {
            parameter.date = this.date;
            
            this.view.date = this.date;
        } else {
            this.view.date = null;
        }
        
        this.view.period   = this.period;
        
        parameter.period   = this.period;
        
        var piwik          = this.getModel('Piwik');
        
        var accountManager = this.getModel('Account');
        var account        = accountManager.getAccountById(site.accountId);
        
        piwik.registerCall('Referers.getKeywords', parameter, account, function (response) { 
            if(response) {
                this.view.keyword = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('keyword');
        });
    };

    /**
     * Displays website related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.websiteAction = function () {
        
        var site         = this.getParam('site');
        var allowedSites = Cache.get('piwik_sites_allowed');
        
        if (Cache.KEY_NOT_FOUND === allowedSites) {
            allowedSites = [site];
        }
        
        this.view.allowedSites = allowedSites;
        
        this.view.site = site;
        
        var parameter  = {idSite: this.view.site.idsite, 
                          date: 'today', 
                          filter_sort_column: config.getUsedRow(this.period),
                          filter_sort_order: 'desc'};
        
        // limit to 25
        parameter.filter_limit = 25;
        
        if (this.date) {
            parameter.date = this.date;
            
            this.view.date = this.date;
        } else {
            this.view.date = null;
        }
        
        this.view.period   = this.period;
        
        parameter.period   = this.period;
        
        var piwik          = this.getModel('Piwik');
        
        var accountManager = this.getModel('Account');
        var account        = accountManager.getAccountById(site.accountId);
        
        piwik.registerCall('Referers.getWebsites', parameter, account, function (response) { 
            if(response) {
                this.view.website = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('website');
        });
    };
    
}

ReferersController.prototype = new ActionController();
