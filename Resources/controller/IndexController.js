/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    The default controller. Provides the possibilty to choose between multiple sites.
 *              
 * @augments ActionController
 */
function IndexController () {

    /**
     * Holds each available site.
     * 
     * @type Array
     */
    this.sites = [];

    /**
     * Default action. This action is displayed by default. Displays a list of all available sites. If no site is 
     * available it is only possible to set up the app. The user needs at least view access to see a site in this list.
     *
     * @type null 
     */
    this.indexAction = function () {

        this.view.showMultiChart = Settings.getPiwikMultiChart();
        
        var piwik          = this.getModel('Piwik');
        var accountManager = this.getModel('Account');
        var accounts       = accountManager.getAccounts();

        var onReceiveSitesWithAtLeastViewAccess = function (response, parameter) {

            var allowedSites    = response;

            if (!allowedSites || !(allowedSites instanceof Array) || 0 == allowedSites.length) {

                return;
            }
            
            var account = {};
            if (this.view.showMultiChart) {
                for (var index = 0; index < accounts.length; index++) {
                    if (accounts[index] && accounts[index].id == parameter.accountId) {
                        account = accounts[index];
                        
                        break;
                    }
                }
            }

            for (var index = 0; index < allowedSites.length; index++) {

                var site = allowedSites[index];
                
                if (!site) {
                    continue;
                }
                    
                site.sparklineUrl     = '';
                if (this.view.showMultiChart) {

                    site.sparklineUrl = Graph.getSparklineUrl(site.idsite, account.accessUrl, account.tokenAuth);
                }
                
                site.accountId = parameter.accountId;

                this.sites.push(site);
            }

            return;
        };
        
        for (var index = 0; index < accounts.length; index++) {
        
            if (!accounts[index] || !Boolean(accounts[index].active)) {
                continue;
            }
        
            piwik.registerCall('SitesManager.getSitesWithAtLeastViewAccess', 
                               {accountId: accounts[index].id}, 
                               accounts[index], 
                               onReceiveSitesWithAtLeastViewAccess);
        }

        piwik.sendRegisteredCalls(function () {

            if (this.sites && 1 == this.sites.length && this.sites[0]) {
                // jump directly to site view
                // @see http://dev.piwik.org/trac/ticket/2120
                Window.createMvcWindow({jsController: 'site',
                                        jsAction: 'index',
                                        closeCurrentWindow: true,
                                        site: this.sites[0]});
                return;
            }

            this.view.sites = this.sites;
            
            Cache.set('piwik_sites_allowed', this.sites, null);

            this.render('index');
        });
    };
}

IndexController.prototype = new ActionController();
