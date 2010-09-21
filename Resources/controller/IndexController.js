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
     * Default action. This action is displayed by default. Displays a list of all available sites. If no site is 
     * available it is only possible to set up the app. The user needs at least view access to see a site in this list.
     *
     * @type null 
     */
    this.indexAction = function () {

        this.view.showMultiChart = Settings.getPiwikMultiChart();
        
        var piwik = this.getModel('Piwik');

        var onReceiveSitesWithAtLeastViewAccess = function (response) {

            var allowedSites    = response;

            if (!allowedSites || !(allowedSites instanceof Array) || 0 == allowedSites.length) {

                this.view.sites = sites;

                this.render('index');

                return;
            }
            
            var sites = [];

            for (var index = 0; index < allowedSites.length; index++) {

                var site = allowedSites[index];
                
                if (!site) {
                    continue;
                }
                    
                site.sparklineUrl     = '';
                if (this.view.showMultiChart) {

                    site.sparklineUrl = Graph.getSparklineUrl(site.idsite);
                }

                sites.push(site);
            }

            this.view.sites   = sites;
            
            Cache.set('piwik_sites_allowed', this.view.sites, null);

            this.render('index');

            return;
        };
        
        piwik.send('SitesManager.getSitesWithAtLeastViewAccess', {}, onReceiveSitesWithAtLeastViewAccess);
    };
}

IndexController.prototype = new ActionController();
