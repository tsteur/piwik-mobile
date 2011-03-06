/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview View template site/index.
 */

/**
 * View template. 
 *
 * @this {View}
 */
function template () {
     
    var headline       = this.helper('headline', {headline: '' + (this.site ? this.site.name : '')});

    if (Window.views && 1 == Window.views.length) {
        /**
         * display SettingsChooser if this window is the first screen... this is the case if the user has access to only
         * one site. In such a case the app does not open the "available websites" view. It opens this view directly. 
         * So the user has not to press his only available site. If we do not add the settings chooser here, a iOS user 
         * will not have the possibilty to change settings
         * @see http://dev.piwik.org/trac/ticket/2120
         */
        headline.addSettingsChooser();
    }
    
    this.add(headline.subView);

    var tableData      = [];
    var section        = null;   
    var header         = null;
    var headerLabel    = null;            
    var rows           = [];
    
    var latestSection  = '';
    var currentSection = '';
    var report         = null;
    
    for (var index = 0; index < this.availableReports.length; index++) {
        report         = this.availableReports[index];
        
        if (!report) {
            continue;
        }
    
        currentSection = report.category;
        
        if (currentSection && currentSection !== latestSection) {
        
            section = Ui_TableViewSection({title: String(report.category), 
                                           className: 'siteSection' + index});
            
            tableData.push(section);
        }
        
        latestSection = currentSection;

        var row       = {title:     report.name,
                         site:      this.site,
                         report:    report,
                         className: 'siterow'};
     
        tableData.push(Ui_TableViewRow(row));
    }
   
    var top       = headline.subView.height + headline.subView.top;
    var height    = this.height - top;
    var tableview = Titanium.UI.createTableView({data: tableData,
                                                 left: 0,
                                                 right: 0,
                                                 top: top,
                                                 height: height,
                                                 width: this.width,
                                                 visible: true,
                                                 zIndex: 2,
                                                 focusable: true,
                                                 separatorColor: '#eeedeb'});
    
    tableview.addEventListener('click', function (event) {

        if (!event.rowData.site) {
            return;
        }
    
        Window.createMvcWindow({jsController: 'statistics',
                                jsAction: 'show',
                                report: event.rowData.report,
                                site: event.rowData.site});
    });
    
    this.add(tableview);
    tableview.show();

    if (tableview.scrollToTop) {
        tableview.scrollToTop(1);
    }

    Titanium.App.addEventListener('siteChanged', function (event) {
    
        if (!event || !event.site || !tableData) {
            return;
        }
        
        var row = null;
  
        for (var rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
            row = tableData[rowIndex];
 
            if (row && row.site) {
                row.site = event.site;
            }
        }
        
        headline.setOptions({headline: '' + event.site.name});
        headline.refresh();
    });
}
