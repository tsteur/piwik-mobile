/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    Contains a single site related stuff.
 *              
 * @augments ActionController
 */
function SiteController () {
    
    /**
     * Default action. Lets the user choose between different types of statistics.
     *
     * @param {Object}   site   A site object, see {@link http://piwik.org/demo/?module=API&method=SitesManager.getSiteFromId&idSite=1&format=JSON&token_auth=anonymous}
     * 
     * @type null
     */
    this.indexAction = function () {
    
        var site       = this.getParam('site');
        this.view.site = site;
        
        var language   = Settings.getLanguage();
        
        var cachedReportData = Cache.get('piwik_report_metadata_' + site.accountId + '_' + language);
        
        if (cachedReportData 
            && Cache.KEY_NOT_FOUND != cachedReportData 
            && (cachedReportData instanceof Array) 
            && 0 < cachedReportData.length) {
            
            this.view.availableReports = cachedReportData;
            
            this.render('index');
            return;
        }
        
        var piwik          = this.getModel('Piwik');
        
        var accountManager = this.getModel('Account');
        var account        = accountManager.getAccountById(site.accountId);
               
        piwik.registerCall('API.getReportMetadata', {}, account, function (reportMetaData) {
        
            if (!reportMetaData) {
                reportMetaData = [];
            }

            this.view.availableReports = reportMetaData;
            
            // do not cache an empty result
            if (reportMetaData && (reportMetaData instanceof Array) && 0 < reportMetaData.length) {
                Cache.set('piwik_report_metadata_' + site.accountId + '_' + language, reportMetaData, null);
            }
        });

        piwik.sendRegisteredCalls(function () {

            this.render('index');
        });
        
    };
}

SiteController.prototype = new ActionController();
