/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'site/index.js' .
 */

/** @private */
var Piwik  = require('library/Piwik');
/** @private */
var _      = require('library/underscore');
/** @private */
var config = require('config');

/**
 * @class     Display a list of all available reports depending on the given site. The list of all available reports 
 *            for the  given site will be fetched via metadata api.
 *
 * @param     {Object}  params
 * @param     {Object}  params.site  The current selected website. The object looks for example like follows:
 *                                   {"idsite":"3",
 *                                    "name":"virtual-drums.com",
 *                                    "main_url":"http:\/\/www.virtual-drums.com",
 *                                    "ts_created":"2008-01-27 01:41:53",
 *                                    "timezone":"UTC",
 *                                    "currency":"USD",
 *                                    "excluded_ips":"",
 *                                    "excluded_parameters":"",
 *                                    "feedburnerName":"Piwik",
 *                                    "group":""}
 *
 * @exports   window as WindowSiteIndex
 * @this      Piwik.UI.Window
 * @augments  Piwik.UI.Window
 */
function window (params) {

    var site          = params.site ? params.site : null;
    
    var currentRequestedSite = site;
    
    /**
     * @see  Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: '' + (site ? site.name : '')};

    var menuOptions   = {commands: [this.createCommand('RefreshCommand')]};

    if (1 == Piwik.getUI().layout.windows.length) {
        // show settingschooser only if this is the first window. ensures user can open settings screen if this
        // is the first screen. It is the first window if the user has configured has access to only one website.
        menuOptions.commands.push(this.createCommand('OpenSettingsCommand'));
    }

    /**
     * @see  Piwik.UI.Window#menuOptions
     */
    this.menuOptions = menuOptions;

    var request   = Piwik.require('Network/ReportsRequest');
    var that      = this;

    var tableview = Ti.UI.createTableView({id: 'reportsTableView'});
    var refresh   = this.create('Refresh', {tableView: tableview});
    var tableData = [];
    
    this.add(tableview);

    tableview.addEventListener('click', function (event) {

        if (event && event.row && event.row.action) {

            switch (event.row.action) {
                case 'live':
                        
                    that.create('Window', {url: 'statistics/live',
                                           site: site,
                                           autoRefresh: true});
                    break;
                
                case 'visitorlog':

                    that.create('Window', {url: 'statistics/visitorlog',
                                           site: site});

                break;

            }

            return;
        }

        if (event && event.row && event.row.report) {
            that.create('Window', {url: 'statistics/show',
                                   report: event.row.report,
                                   site: site});
        }

    });

    // we always want to force the reload (do not use a cached result) of the available reports if user presses
    // menu button 'reload', but not if window gets focus again.
    var forceRequestReload = true;
    refresh.addEventListener('onRefresh', function () {

        that.titleOptions  = {title: '' + (site ? site.name : ''), window: that};
        Piwik.getUI().layout.header.refresh(that.titleOptions);

        // remove all tableview rows. This should ensure there are no rendering issues when setting
        // new rows afterwards.
        that.cleanupTableData();
        
        request.send({site: site, reload: forceRequestReload});

        forceRequestReload = true;
    });
    
    var doRefreshIfNeeded = function () {
        forceRequestReload = false;

        var session = Piwik.require('App/Session');
        site        = session.get('current_site', site);
        session     = null;

        // site has changed if the accountId is different or if idsite is different.
        var siteHasChanged = (site && currentRequestedSite &&
                              (currentRequestedSite.idsite != site.idsite ||
                               currentRequestedSite.accountId != site.accountId));

        if (!that || !refresh) {
            
            return;
        }
        
        // update only if site has changed or if we force request reload
        if (site && (siteHasChanged || forceRequestReload)) {
            currentRequestedSite = site;
            
            refresh.refresh();
        }
    }

    // this event is fired from another window, therefore we use Ti.App
    // be cureful using Ti.App events. They will never be released cause they run in a global app context.
    // cause on iPad this window will be always displayed as long as the app is opened, it doesn't matter.
    if (Piwik.getPlatform().isIpad) {
        Ti.App.addEventListener('onSiteChanged', doRefreshIfNeeded);
    }

    this.addEventListener('focusWindow', doRefreshIfNeeded);

    request.addEventListener('onload', function (event) {

        tableData          = [];

        // @type {Piwik.UI.TableViewSection}
        var section        = null;
        var latestSection  = '';
        var currentSection = '';
        var report         = null;

        // we don't fire an async event here cause otherwise we run into race conditions.
        // ScrollToTop would not work correct.
        if (refresh) {
            refresh.refreshDone();
        }

        if (!event || !event.availableReports) {

            // there are no reports, so we simply again set an empty array / remove all rows.
            tableview.setData(tableData);
            event = null;
            
            return;
        }
        
        if (!that) {
            
            return;
        }

        tableData.push(that.create('TableViewRow', {title:       _('Live_VisitorsInRealTime'),
                                                    action:      'live',
                                                    className:   'reportTableViewRow'}));

        tableData.push(that.create('TableViewRow', {title:       _('Live_VisitorLog'),
                                                    action:      'visitorlog',
                                                    className:   'reportTableViewRow'}));

        for (var index = 0; index < event.availableReports.length; index++) {
            report = event.availableReports[index];

            if (!report || !that) {
                continue;
            }

            currentSection = report.category;

            // detect whether the current section is different to the previous section and if so,
            // display the new/changed section
            if (that && currentSection && currentSection !== latestSection) {

                section    = that.create('TableViewSection', {title: String(report.category)});

                tableData.push(section);
                section    = null;
            }

            latestSection  = currentSection;

            tableData.push(that.create('TableViewRow', {title:     report.name,
                                                        report:    report,
                                                        className: 'reportTableViewRow'}));
        }
        
        if (!tableview) {
            
            return;
        }

        tableview.setData(tableData);

        if (Piwik.getPlatform().isIos && tableview.scrollToTop) {
            tableview.scrollToTop(1);
        }
        
        event = null;
    });

    /**
     * Send the async request to fetch a list of all available reports.
     */
    this.open = function () {

        if (site) {
            currentRequestedSite = site;
        }

        request.send({site: site});
    };
    
    this.cleanupTableData = function () {

        if (tableData) {
            for (var index = 0; index < tableData.length; index++) {
                
                if (tableData[index] && tableData[index].cleanup) {
                    tableData[index].cleanup();
                }
                
                tableData[index]            = null;
            }
        }
        
        tableData = null;
        tableData = [];

        if (!tableview) {
            
            return;
        }
        
        tableview.setData([]);
    };
    
    this.cleanup = function () {
        this.cleanupTableData();
        
        this.remove(tableview);
        
        tableData = null;
        tableview = null;
        request   = null;
        refresh   = null;
        site      = null;
        that      = null;
        params    = null;

        this.menuOptions     = null;
        this.titleOptions    = null;
        menuOptions          = null;
        currentRequestedSite = null;
        doRefreshIfNeeded    = null;
    };
}

module.exports = window;