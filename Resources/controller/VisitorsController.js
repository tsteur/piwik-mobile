/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    Displays 'visitors' related statistics using the 'VisitsSummary', 'VisitsFrequence' and 'UserSettings'
 *           module.
 *              
 * @augments ActionController
 */
function VisitorsController () {
    
    /**
     * Init visitorcontroller
     * 
     * @type null
     */
    this.init = function () {

        this.graphsEnabled      = Settings.getGraphsEnabled();
        this.view.graphsEnabled = this.graphsEnabled;
    };
    
    /**
     * Displays an overview of the visitors statistics.
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

        var parameter  = {idSite: this.view.site.idsite, date: 'today'};

        if (this.getParam('date')) {
            parameter.date = this.getParam('date');

            this.view.date = this.getParam('date');
        } else {
            this.view.date = null;
        }
        
        this.view.period   = this.getParam('period', 'day');
        
        parameter.period   = this.view.period;

        var piwik          = this.getModel('Piwik');

        piwik.registerCall('VisitsSummary.get', parameter, function (response) { 
            if(response && (response instanceof Object)) {
                this.view.visits           = response.nb_visits;
                this.view.uniqueVisitors   = response.nb_uniq_visitors;
                this.view.actions          = response.nb_actions;
                this.view.maxActions       = response.max_actions;
                this.view.visitsConverted  = response.nb_visits_converted;
            }
        });
        
        piwik.registerCall('VisitFrequency.get', parameter, function (response) { 
            if(response && (response instanceof Object)) {
                this.view.visitsReturning            = response.nb_visits_returning;
                this.view.actionsReturning           = response.nb_actions_returning;
                this.view.maxActionsReturning        = response.max_actions_returning;
            }
        });
            
        if (this.graphsEnabled) {
            var targetDate = this.getParam('date', new Date());
            
            if('string' === (typeof targetDate).toLowerCase()) {
                
                targetDate = targetDate.toPiwikDate();
            }
            
            parameter = {idSite: this.view.site.idsite,
                         period: this.view.period,
                         date: targetDate.toPiwikQueryStringLastDays(this.view.period)};
                         
            piwik.registerCall('VisitsSummary.getVisits', parameter, function (response) { 
                if(response) {
                    this.view.vistsPrevious30 = response;
                }
            });
        }
        
        piwik.sendRegisteredCalls(function () {

            this.render('overview');
        });
    };

    /**
     * Displays browser related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.browserAction = function () {
        
        var site         = this.getParam('site');
        var allowedSites = Cache.get('piwik_sites_allowed');
        
        if (Cache.KEY_NOT_FOUND === allowedSites) {
            allowedSites = [site];
        }
        
        this.view.allowedSites = allowedSites;
        
        this.view.site = site;

        var parameter  = {idSite: this.view.site.idsite, 
                          date: 'today', 
                          filter_sort_column: config.getUsedRow(this.getParam('period', 'day')),
                          filter_sort_order: 'desc'};

        if (this.getParam('date')) {
            parameter.date = this.getParam('date');

            this.view.date = this.getParam('date');
        } else {
            this.view.date = null;
        }
        
        this.view.period   = this.getParam('period', 'day');
        
        parameter.period   = this.view.period;
        
        var piwik          = this.getModel('Piwik');

        if (this.graphsEnabled) {
            piwik.registerCall('UserSettings.getBrowserType', parameter, function (response) { 
                if(response) {
                    this.view.browserTypes = response;
                }
            });
        }
        
        piwik.registerCall('UserSettings.getBrowser', parameter, function (response) { 
            if(response) {
                this.view.browsers = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {

            this.render('browser');
        });
    };

    /**
     * Displays operating system related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.osAction = function () {
        
        var site         = this.getParam('site');
        var allowedSites = Cache.get('piwik_sites_allowed');
        
        if (Cache.KEY_NOT_FOUND === allowedSites) {
            allowedSites = [site];
        }
        
        this.view.allowedSites = allowedSites;
        
        this.view.site = site;
        
        var parameter  = {idSite: this.view.site.idsite, 
                          date: 'today', 
                          filter_sort_column: config.getUsedRow(this.getParam('period', 'day')),
                          filter_sort_order: 'desc'};
        
        if (this.getParam('date')) {
            parameter.date = this.getParam('date');
            
            this.view.date = this.getParam('date');
        } else {
            this.view.date = null;
        }
        
        this.view.period   = this.getParam('period', 'day');
        
        parameter.period   = this.view.period;
        
        var piwik = this.getModel('Piwik');
        
        piwik.registerCall('UserSettings.getOS', parameter, function (response) { 
            if(response) {
                this.view.os = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('os');
        });
    };

    /**
     * Displays resolution related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.resolutionAction = function () {
        
        var site         = this.getParam('site');
        var allowedSites = Cache.get('piwik_sites_allowed');
        
        if (Cache.KEY_NOT_FOUND === allowedSites) {
            allowedSites = [site];
        }
        
        this.view.allowedSites = allowedSites;
        
        this.view.site = site;
        
        var parameter  = {idSite: this.view.site.idsite, 
                          date: 'today', 
                          filter_sort_column: config.getUsedRow(this.getParam('period', 'day')),
                          filter_sort_order: 'desc'};
        
        if (this.getParam('date')) {
            parameter.date = this.getParam('date');
            
            this.view.date = this.getParam('date');
        } else {
            this.view.date = null;
        }
        
        this.view.period   = this.getParam('period', 'day');
        
        parameter.period   = this.view.period;
        
        var piwik          = this.getModel('Piwik');
        
        piwik.registerCall('UserSettings.getResolution', parameter, function (response) { 
            if(response) {
                this.view.resolution = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('resolution');
        });
    };

    /**
     * Displays screen type related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.screentypeAction = function () {
        
        var site         = this.getParam('site');
        var allowedSites = Cache.get('piwik_sites_allowed');
        
        if (Cache.KEY_NOT_FOUND === allowedSites) {
            allowedSites = [site];
        }
        
        this.view.allowedSites = allowedSites;
        
        this.view.site = site;
        
        var parameter  = {idSite: this.view.site.idsite, 
                date: 'today', 
                filter_sort_column: config.getUsedRow(this.getParam('period', 'day')),
                filter_sort_order: 'desc'};
        
        if (this.getParam('date')) {
            parameter.date = this.getParam('date');
            
            this.view.date = this.getParam('date');
        } else {
            this.view.date = null;
        }
        
        this.view.period   = this.getParam('period', 'day');
        
        parameter.period   = this.view.period;
        
        var piwik          = this.getModel('Piwik');
        
        piwik.registerCall('UserSettings.getWideScreen', parameter, function (response) { 
            if(response) {
                this.view.screentype = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('screentype');
        });
    };
}

VisitorsController.prototype = new ActionController();
