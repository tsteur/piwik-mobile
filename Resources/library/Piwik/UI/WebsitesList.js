/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/** @private */
var Piwik  = require('library/Piwik');
/** @private */
var _      = require('library/underscore');
/** @private */
var config = require('config');

/**
 * @class     A websites list is created by the method Piwik.UI.createWebsiteList. It displays a list of all available
 *            websites. The user has also the possibility to search for a website.
 *
 * @exports   WebsitesList as Piwik.UI.WebsitesList
 * @augments  Piwik.UI.View
 */
function WebsitesList () {

    /**
     * This event will be fired as soon as the user chooses a website within the websites list.
     *
     * @name   Piwik.UI.WebsitesList#event:onChooseSite
     * @event
     *
     * @param  {Object}  event
     * @param  {string}  event.type  The name of the event.
     * @param  {Array}   event.site  The chosen website.
     */

    /**
     * This event will be fired if the user has access to only one website and only if this event was enabled via
     * the parameter 'handleOnlyOneSiteAvailableEvent'.
     *
     * @name   Piwik.UI.WebsitesList#event:onOnlyOneSiteAvailable
     * @event
     *
     * @param  {Object}  event
     * @param  {string}  event.type  The name of the event.
     * @param  {Array}   event.site  The chosen website.
     */

    this.websitesRequest = Piwik.require('Network/WebsitesRequest');
}

/**
 * Extend Piwik.UI.View
 */
WebsitesList.prototype = Piwik.require('UI/View');

/**
 * Initialize website list
 *
 * @fires  Piwik.UI.WebsitesList#event:onChooseSite
 * @fires  Piwik.UI.WebsitesList#event:onOnlyOneSiteAvailable
 */
WebsitesList.prototype.init = function () {

    var that      = this;
    var win       = this.getParam('view');

    // we always want to force the reload (do not use a cached result) of the available websites if user presses
    // menu button 'reload', but not if for example the user searches for a site.
    var forceRequestReload = true;
    
    var refresh   = null;

    var searchBar = Ti.UI.createSearchBar({id: 'websiteSearchBar',
                                           hintText: _('Mobile_SearchWebsite')});

    searchBar.addEventListener('return', function (event) {

        if (!event) {

            return;
        }

        that.websitesRequest.abort();

        forceRequestReload = false;
        refresh.refresh();

        searchBar.blur();
    });

    searchBar.addEventListener('cancel', function () {

        searchBar.value = '';
        searchBar.blur();

        forceRequestReload = false;
        refresh.refresh();
    });
    
    win.addEventListener('blurWindow', function () {
        searchBar.hide();
        searchBar.blur();
    });

    win.addEventListener('focusWindow', function () {
        searchBar.show();
    });

    win.add(searchBar);

    var tableview = Ti.UI.createTableView({id: 'websitesTableView', top: searchBar.height});

    tableview.addEventListener('click', function (event) {
        if (!event || !event.row || !event.row.site) {

            return;
        }

        that.fireEvent('onChooseSite', {site: event.row.site, name: 'onChooseSite'});
    });

    win.add(tableview);

    refresh = this.create('Refresh', {tableView: tableview});

    refresh.addEventListener('onRefresh', function () {

        // remove all tableview rows. This makes sure there are no rendering issues when setting
        // new rows afterwards.
        tableview.setData([]);

        var params = {reload: forceRequestReload};
        if (searchBar && searchBar.value) {
            params.filterName = searchBar.value;
        }

        that.websitesRequest.send(params);

        forceRequestReload = true;
    });

    this.websitesRequest.addEventListener('onload', function (event) {

        refresh.refreshDone();

        if (!event || !event.sites || !event.sites.length) {

            return;
        }

        if (that.getParam('handleOnlyOneSiteAvailableEvent', false) &&
            !event.filterUsed && 1 == event.sites.length && event.sites[0]) {
            // fire only if this event is enabled.
            // do not fire this event if user has used the filter/searchBar. Maybe that is not the site
            // he was looking for.

            that.fireEvent('onOnlyOneSiteAvailable', {site: event.sites[0], type: 'onOnlyOneSiteAvailable'});
            return;
        }

        var rows = [];

        for (var siteIndex = 0; siteIndex < event.sites.length; siteIndex++) {
            var site = event.sites[siteIndex];

            if (!site) {
                continue;
            }

            if (!that.getParam('displaySparklines', true)) {
                site.sparklineUrl = null;
            }

            rows.push(that.create('TableViewRow', {title: '' + site.name,
                                                   id: site.idsite,
                                                   name: 'site' + site.idsite,
                                                   site: site,
                                                   rightImage: {url: site.sparklineUrl, width: 100, height: 25},
                                                   className: 'websiteTableViewRow'}));
        }
        
        if (event && event.achievedSitesLimit) {
            
            var searchHintRow     = Ti.UI.createTableViewRow({className: 'searchHintTableViewRow'});
            var searchBarHintText = String.format(_('Mobile_UseSearchBarHint'), 
                                                  '' + config.piwik.numDisplayedWebsites);
            
            searchHintRow.add(Ti.UI.createLabel({text: searchBarHintText,
                                                 className: 'searchHintLabel'}));
            rows.push(searchHintRow);
        }
        
        tableview.setData(rows);
    });
};

/**
 * Request the list of all available websites. Sends an async request to the piwik api.
 */
WebsitesList.prototype.request = function () {
    
    this.websitesRequest.send();
};

module.exports = WebsitesList;