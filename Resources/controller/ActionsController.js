/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class    Displays 'actions' related statistics using the 'actions' module.
 *              
 * @augments ActionController
 */
function ActionsController () {

    /**
     * Init actionscontroller
     * 
     * @type null
     */
    this.init = function () {
    
        var mySession     = new Session();
        
        var periodSession = mySession.get('piwik_parameter_period');
        var dateSession   = mySession.get('piwik_parameter_date');
    
        this.period   = this.getParam('period', periodSession);
        this.date     = this.getParam('date', dateSession);
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
    this.pageAction = function () {
        
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
        
        piwik.registerCall('Actions.getPageUrls', parameter, account, function (response) { 
            if(response) {
                this.view.page = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('page');
        });
    };
    
    /**
     * Displays page title related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.pagetitleAction = function () {
        
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
        
        piwik.registerCall('Actions.getPageTitles', parameter, account, function (response) { 
            if(response) {
                this.view.pagetitle = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('pagetitle');
        });
    };

    /**
     * Displays outlink related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.outlinkAction = function () {
        
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
        
        piwik.registerCall('Actions.getOutlinks', parameter, account, function (response) { 
            if(response) {
                this.view.outlink = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('outlink');
        });
    };
    
    /**
     * Displays download related statistics.
     *
     * @param {Object}        site       A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * @param {string|Date}   [date]     Optional - The current selected date. {@link View_Helper_ParameterChooser}
     * @param {string}        [period]   Optional - The current selected period. {@link View_Helper_ParameterChooser}
     * 
     * @type null
     */
    this.downloadAction = function () {
        
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
        
        piwik.registerCall('Actions.getDownloads', parameter, account, function (response) { 
            if(response) {
                this.view.download = response;
            }
        });
        
        piwik.sendRegisteredCalls(function () {
            
            this.render('download');
        });
    };
}

ActionsController.prototype = new ActionController();
