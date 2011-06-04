/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview window 'site/index.js' .
 */

/**
 * @class Display a list of all available reports depending on the given site. The list of all available reports for the
 *        given site will be fetched via metadata api.
 *
 * @param {Object}    params
 * @param {Object}    params.site    The current selected website. The object looks for example like follows:
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
 * @this     {Piwik.UI.Window}
 * @augments {Piwik.UI.Window}
 */
function window (params) {

    var site          = params.site ? params.site : null;
    
    /**
     * @see Piwik.UI.Window#titleOptions
     */
    this.titleOptions = {title: '' + (site ? site.name : '')};

    /**
     * @see Piwik.UI.Window#menuOptions
     */
    this.menuOptions  = {optionMenuSettingsChooser: true};

    if (1 == Piwik.UI.layout.windows.length) {
        // show settingschooser only if this is the first window. ensures user can open settings screen if this
        // is the first screen. It is the first window if the user has configured has access to only one website.
        this.menuOptions.settingsChooser = true;
    }

    var request   = Piwik.require('Network/ReportsRequest');
    var that      = this;

    var tableview = Ti.UI.createTableView({id: 'reportsTableView'});
    var refresh   = Piwik.UI.createRefresh({tableView: tableview});
    var tableData = [];
    
    this.add(tableview);

    tableview.addEventListener('click', function (event) {

        if (event && event.rowData && event.rowData.action) {

            switch (event.rowData.action) {
                case 'live':
                        
                    Piwik.UI.createWindow({url: 'statistics/live.js',
                                           site: site,
                                           autoRefresh: true});
                    break;
                
                case 'visitorlog':

                    Piwik.UI.createWindow({url: 'statistics/visitorlog.js',
                                           site: site});

                break;

            }

            return;
        }

        if (event && event.rowData && event.rowData.report) {
            Piwik.UI.createWindow({url: 'statistics/show.js',
                                   report: event.rowData.report,
                                   site: site});
        }

    });

    refresh.addEventListener('onRefresh', function () {

        if (site) {
            // remove all tableview rows. This should ensure there are no rendering issues when setting
            // new rows afterwards.
            tableview.setData([]);
            
            request.send({site: site, reload: true});
        }
    });

    // this event is fired from another window, therefore we use Ti.App
    Ti.App.addEventListener('onSiteChanged', function (event) {

        if (!event || !event.site || !tableData) {
            
            return;
        }

        site              = event.site;
        that.titleOptions = {title: '' + event.site.name};
    });

    request.addEventListener('onload', function (event) {

        tableData          = [];

        // @type {Piwik.UI.TableViewSection}
        var section        = null;
        var latestSection  = '';
        var currentSection = '';
        var report         = null;

        if (!event.availableReports) {

            // there are no reports, so we simply again set an empty array / remove all rows.
            tableview.setData(tableData);
            
            return;
        }

        tableData.push(Piwik.UI.createTableViewRow({title:       _('Live_VisitorsInRealTime'),
                                                    action:      'live',
                                                    className:   'reportTableViewRow'}));

        tableData.push(Piwik.UI.createTableViewRow({title:       _('Live_VisitorLog'),
                                                    action:      'visitorlog',
                                                    className:   'reportTableViewRow'}));

        for (var index = 0; index < event.availableReports.length; index++) {
            report = event.availableReports[index];

            if (!report) {
                continue;
            }

            currentSection = report.category;

            // detect whether the current section is different to the previous section and if so,
            // display the new/changed section
            if (currentSection && currentSection !== latestSection) {

                section    = Piwik.UI.createTableViewSection({title: String(report.category)});

                tableData.push(section);
            }

            latestSection  = currentSection;

            tableData.push(Piwik.UI.createTableViewRow({title:     report.name,
                                                        report:    report,
                                                        className: 'reportTableViewRow'}));
        }

        // we don't fire an async event here cause otherwise we run into race conditions.
        // ScrollToTop would not work correct.
        refresh.refreshDone();

        tableview.setData(tableData);

        if (Piwik.isIos && tableview.scrollToTop) {
            tableview.scrollToTop(1);
        }
    });

    /**
     * Send the async request to fetch a list of all available reports.
     */
    this.open = function () {

        request.send({site: site});
    };
};