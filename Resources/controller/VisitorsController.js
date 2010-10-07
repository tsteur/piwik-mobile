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
    
        var mySession     = new Session();
        
        var periodSession = mySession.get('piwik_parameter_period');
        var dateSession   = mySession.get('piwik_parameter_date');
    
        this.period   = this.getParam('period', periodSession);
        this.date     = this.getParam('date', dateSession);

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

        piwik.registerCall('VisitsSummary.get', parameter, account, function (response) { 
            if(response && (response instanceof Object)) {
                this.view.visits           = response.nb_visits;
                this.view.uniqueVisitors   = response.nb_uniq_visitors;
                this.view.actions          = response.nb_actions;
                this.view.maxActions       = response.max_actions;
                this.view.visitsConverted  = response.nb_visits_converted;
            }
        });
        
        piwik.registerCall('VisitFrequency.get', parameter, account, function (response) { 
            if(response && (response instanceof Object)) {
                this.view.visitsReturning            = response.nb_visits_returning;
                this.view.actionsReturning           = response.nb_actions_returning;
                this.view.maxActionsReturning        = response.max_actions_returning;
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
                         
            piwik.registerCall('VisitsSummary.getVisits', parameter, account, function (response) { 
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
        
        this.view.accountUrl = account.accessUrl;
        
        if (this.graphsEnabled) {
            piwik.registerCall('UserSettings.getBrowserType', parameter, account, function (response) { 
                if(response) {
                    this.view.browserTypes = response;
                }
            });
        }
        
        piwik.registerCall('UserSettings.getBrowser', parameter, account, function (response) { 
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
        
        this.view.accountUrl = account.accessUrl;
        
        piwik.registerCall('UserSettings.getOS', parameter, account, function (response) { 
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
        
        piwik.registerCall('UserSettings.getResolution', parameter, account, function (response) { 
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
        
        this.view.accountUrl = account.accessUrl;
        
        piwik.registerCall('UserSettings.getWideScreen', parameter, account, function (response) { 
            if(response) {
                this.view.screentype = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('screentype');
        });
    };
    
    /**
     * Displays browser plugin related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.pluginAction = function () {
        
        var site         = this.getParam('site');
        var allowedSites = Cache.get('piwik_sites_allowed');
        
        if (Cache.KEY_NOT_FOUND === allowedSites) {
            allowedSites = [site];
        }
        
        this.view.allowedSites = allowedSites;
        
        this.view.site = site;
        
        var parameter  = {idSite: this.view.site.idsite, 
                          date: 'today', 
                          filter_sort_column: 'nb_visits_percentage',
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
        
        this.view.accountUrl = account.accessUrl;
        
        piwik.registerCall('UserSettings.getPlugin', parameter, account, function (response) { 
            if(response) {
                this.view.plugin = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('plugin');
        });
    };

    /**
     * Displays user country related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.countryAction = function () {
        
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
        
        this.view.accountUrl = account.accessUrl;
        
        piwik.registerCall('UserCountry.getCountry', parameter, account, function (response) { 
            if(response) {
                this.view.countries = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('country');
        });
    };
    
    /**
     * Displays user continent related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.continentAction = function () {
        
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
        
        piwik.registerCall('UserCountry.getContinent', parameter, account, function (response) { 
            if(response) {
                this.view.continents = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('continent');
        });
    };
}

VisitorsController.prototype = new ActionController();
