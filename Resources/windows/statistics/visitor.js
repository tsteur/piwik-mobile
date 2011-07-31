/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'statistics/visitor.js' .
 */

/**
 * @class Displays detailed information about a specific visitor. For example "custom variables", Operating System,
 *        generated actions, ecommerce, referrer and so on.
 *
 * @param {Object}      params
 * @param {Object}      params.visitor         The current selected visitor as returned by the Piwik API method
 *                                             "Live.getLastVisitsDetails"
 * @param {string}      params.accessUrl       The url to the piwik installation (to the piwik installation the visit
 *                                             belongs to) containing a trailing slash. For example
 *                                             'http://demo.piwik.org/'
 *
 * @this     {Piwik.UI.Window}
 * @augments {Piwik.UI.Window}
 */
function window (params) {

    /**
     * @see Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: _('General_Visitor')};

    /**
     * @see Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {};
    var tableView     = Ti.UI.createTableView({id: 'visitorTableView'});

    this.add(tableView);

    var visitor = this.create('Visitor', {visitor: params.visitor, 
                                          accessUrl: params.accessUrl});

    tableView.setData(visitor.getRows());

    /**
     * Nothing to do here.
     */
    this.open = function () {
    
    };
}