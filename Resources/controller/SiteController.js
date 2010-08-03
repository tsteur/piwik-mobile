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

        this.view.site = this.getParam('site');

        this.render('index');
    };
}

SiteController.prototype = new ActionController();
