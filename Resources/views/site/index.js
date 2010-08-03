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
     
    var box            = this.helper('borderedContainer', {});
    var headline       = this.helper('headline', {headline: '' + this.site.name});
    
    box.subView.add(headline.subView);
    box.subView.top    = 5;
    
    this.add(box.subView);
    
    box.subView.height = parseInt(this.size.height, 10) - 10;
    
    var visitorRows = [{title:        _('VisitsSummary_SubmenuOverview'),
                        jsController: 'visitors',
                        jsAction:     'overview'}];
    
    var visitorSettingRows = [{title:        _('UserSettings_Browsers'),
                               jsController: 'visitors',
                               jsAction:     'browser'},
                              {title:        _('UserSettings_OperatingSystems'),
                               jsController: 'visitors',
                               jsAction:     'os'},
                              {title:        _('UserSettings_Resolutions'),
                               jsController: 'visitors',
                               jsAction:     'resolution'},
                              {title:        _('UserSettings_WideScreen'),
                               jsController: 'visitors',
                               jsAction:     'screentype'}];
    
    var actionsRows = [{title:        _('Actions_SubmenuPages'),
                        jsController: 'actions',
                        jsAction:     'page'},
                       {title:        _('Actions_SubmenuPageTitles'),
                        jsController: 'actions',
                        jsAction:     'pagetitle'},
                       {title:        _('Actions_SubmenuOutlinks'),
                        jsController: 'actions',
                        jsAction:     'outlink'},
                       {title:         _('Actions_SubmenuDownloads'),
                        jsController: 'actions',
                        jsAction:     'download'}];
    
    var refererRows = [{title:        _('VisitsSummary_SubmenuOverview'),
                        jsController: 'referers',
                        jsAction:     'overview'},
                       {title:        _('Referers_SearchEngines'),
                        jsController: 'referers',
                        jsAction:     'searchengine'},
                       {title:        _('Referers_Keywords'),
                        jsController: 'referers',
                        jsAction:     'keyword'},
                       {title:        _('Referers_Websites'),
                        jsController: 'referers',
                        jsAction:     'website'}];
                        
    var sections    = [{title: _('General_Visitors'),
                        rows:  visitorRows},
                       {title: _('General_Visitors') + ' - ' + _('UserSettings_SubmenuSettings'),
                        rows:  visitorSettingRows},
                       {title: _('Actions_Actions'),
                        rows:  actionsRows},
                       {title: _('Referers_Referers'),
                        rows:  refererRows}];

    var tableData   = [];
    var section     = null;   
    var header      = null;
    var headerLabel = null;            
    var rows        = [];
    
    for (var sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {

        section = Titanium.UI.createTableViewRow({height: 20,
                                                  className: 'siteSection' + sectionIndex,
                                                  selectedBackgroundColor: '#B2AEA5',
                                                  backgroundColor: '#B2AEA5'});

            
        // @todo create a factory or something similar for this, eg Ui.tableViewRow.create();
        if ('android' !== Titanium.Platform.osname) {
            section.selectionStyle = Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE;
        }

        var labelWidth  = 'auto';
        var left        = 10;
        if ('android' === Titanium.Platform.osname && 100 < parseInt(this.size.width, 10)) {
            // @todo set this to auto as soon as this bug is completely fixed #wrapbug
            labelWidth  = parseInt(this.size.width, 10) - 50;
            
            // android does the positioning relative within the tableview row, not absolute
            left        = 0;
        }

        var headerLabel = Titanium.UI.createLabel({
            text: String(sections[sectionIndex].title),
            height: 20,
            width: labelWidth,
            textAlign: 'left',
            color: '#ffffff',
            left: left,
            font: {fontSize: 12, fontFamily: config.theme.fontFamily}
        });

        section.add(headerLabel);
        tableData.push(section);

        rows = sections[sectionIndex].rows;

        for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            
            rows[rowIndex].site           = this.site;
            rows[rowIndex].color          = config.theme.textColor;
            rows[rowIndex].className      = 'siterow';
            
            // @todo create a factory or something similar for this, eg Ui.tableViewRow.create();
            if ('android' !== Titanium.Platform.osname) {
                rows[rowIndex].selectionStyle = Titanium.UI.iPhone.TableViewCellSelectionStyle.GRAY;
            }
            
            tableData.push(rows[rowIndex]);
        }    
    }
   
    var tableview   = Titanium.UI.createTableView({data: tableData,
                                                   left: 1,
                                                   right: 1,
                                                   separatorColor: '#eeedeb'});
    
    tableview.addEventListener('click', function (event) {
    
        if (!event.rowData.site || !event.rowData.jsController || !event.rowData.jsAction) {
            return;
        }
    
        Window.createMvcWindow({
            jsController: event.rowData.jsController,
            jsAction: event.rowData.jsAction,
            site: event.rowData.site
        });
    });
    
    tableview.top      = headline.subView.top + headline.subView.height;
    tableview.height   = box.subView.height - headline.subView.height;
    
    box.subView.add(tableview);
    tableview.show();
    
    if (tableview.scrollToTop) {
        tableview.scrollToTop(1);
    }

    Titanium.App.addEventListener('siteChanged', function (event) {
    
        if (!event || !event.site) {
            return;
        }
    
        var row = null;
        
        for (var rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
            row = tableData[rowIndex];
            
            if (row && row.site) {
                row.site = event.site;
                tableview.updateRow(rowIndex, row);
            }
        }
        
        headline.setOptions({headline: '' + event.site.name});
        headline.refresh();
    });
}
