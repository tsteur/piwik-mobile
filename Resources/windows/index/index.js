/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'index/index.js' .
 */

/**
 * @class Displays a list of all available websites where the user has at least view access. The user is able to select
 *        a website which opens a new window.
 *
 * @todo sort websites by accountId
 *
 * @this     {Piwik.UI.Window}
 * @augments {Piwik.UI.Window}
 */
function window () {

    /**
     * @see Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: 'Piwik Mobile'};

    /**
     * @see Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {settingsChooser: true};

    var request       = Piwik.require('Network/WebsitesRequest');
    var searchBar     = Ti.UI.createSearchBar({id: 'websiteSearchBar',
                                               hintText: _('Find a site')});
    
    searchBar.addEventListener('return', function (event) {

        if (!event) {

            return;
        }

        request.abort();

        refresh.refresh();
        
        searchBar.blur();
    });

    searchBar.addEventListener('cancel', function () {

        searchBar.value = '';
        searchBar.blur();

        refresh.refresh();
    });

    this.add(searchBar);

    var tableview     = Ti.UI.createTableView({id: 'websitesTableView', top: searchBar.height});

    tableview.addEventListener('click', function (event) {
        if (!event || !event.rowData || !event.rowData.site) {

            return;
        }

        Piwik.UI.createWindow({url: 'site/index.js',
                               site: event.rowData.site});

    });

    this.add(tableview);

    var refresh = Piwik.UI.createRefresh({tableView: tableview});

    refresh.addEventListener('onRefresh', function () {

        // remove all tableview rows. This makes sure there are no rendering issues when setting
        // new rows afterwards.
        tableview.setData([]);

        var params = {};
        if (searchBar && searchBar.value) {
            params.filterName = searchBar.value;
        }

        request.send(params);
    });

    request.addEventListener('onload', function (event) {

        refresh.refreshDone();

        if (!event || !event.sites || !event.sites.length) {
            
            return;
        }

        if (!event.filterUsed && 1 == event.sites.length && event.sites[0]) {
            // user has access to only one site. jump directly to site view
            // @see http://dev.piwik.org/trac/ticket/2120
            // do not jump directly to site view if user has used the filter/searchBar. Maybe that is not the site
            // he was looking for.

            Piwik.UI.createWindow({url: 'site/index.js',
                                   closeCurrentWindow: true,
                                   site: event.sites[0]});
            return;
        }

        var rows = [];

        for (var siteIndex = 0; siteIndex < event.sites.length; siteIndex++) {
            var site = event.sites[siteIndex];

            if (!site) {
                continue;
            }

            rows.push(Piwik.UI.createTableViewRow({title: '' + site.name,
                                                   id: site.idsite,
                                                   name: 'site' + site.idsite,
                                                   site: site,
                                                   rightImage: {url: site.sparklineUrl, width: 100, height: 25},
                                                   className: 'websiteTableViewRow'}));
        }

        tableview.setData(rows);
    });

    /**
     * Send the request async to fetch a list of all available websites.
     */
    this.open = function () {
        request.send();
    };
}