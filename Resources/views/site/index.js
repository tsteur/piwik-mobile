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
            section = Titanium.UI.createTableViewRow({height: 24,
                                                      focusable: false,
                                                      className: 'siteSection' + index,
                                                      selectedBackgroundColor: '#B2AEA5',
                                                      backgroundColor: '#B2AEA5'});

            // @todo create a factory or something similar for this, eg Ui.tableViewRow.create();
            if (!isAndroid) {
                section.selectionStyle = Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE;
            }
            
            var labelWidth  = 'auto';
            var left        = 10;
            if (isAndroid && 100 < parseInt(this.width, 10)) {
                // @todo set this to auto as soon as this bug is completely fixed #wrapbug
                labelWidth  = parseInt(this.width, 10) - 50;
                
                // android does the positioning relative within the tableview row, not absolute
                left        = 0;
            }

            headerLabel = Titanium.UI.createLabel({
                text: String(report.category),
                height: 24,
                width: labelWidth,
                textAlign: 'left',
                color: '#ffffff',
                left: left,
                font: {fontSize: 14, fontFamily: config.theme.fontFamily}
            });

            section.add(headerLabel);
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
