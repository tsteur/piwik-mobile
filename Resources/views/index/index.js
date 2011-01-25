/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview View template index/index.
 */

/**
 * View template. 
 *
 * @this {View}
 */
function template () {

    var headline = this.helper('headline', {headline: 'Piwik Mobile'});
    
    headline.addSettingsChooser();
    this.add(headline.subView);

    var rows = [];
    
    if (this.sites && 0 < this.sites.length) {
        for (var siteIndex = 0; siteIndex < this.sites.length; siteIndex++) {
            var site   = this.sites[siteIndex];
            
            if (!site) {
                continue;
            }
            
            rows.push(Ui_TableViewRow({title: site.name,
                                       id:    site.idsite,
                                       name:  'site' + site.idsite,
                                       site:  site,
                                       rightImage: {url: site.sparklineUrl, width: 100, height: 25},
                                       className: 'siteIndex' + siteIndex}));
        }
    }
    
    var top       = headline.subView.height + headline.subView.top;
    var height    = this.height - top;
    
    var tableview = Titanium.UI.createTableView({data: rows, 
                                                 left: 0,
                                                 right: 0,
                                                 width: this.width,
                                                 top: top,
                                                 height: height,
                                                 focusable: true,
                                                 separatorColor: '#eeedeb'});
    
    tableview.addEventListener('click', function (event) {
        if (!event || !event.rowData || !event.rowData.site) {
        
            return;
        }

        Window.createMvcWindow({jsController: 'site',
                                jsAction: 'index',
                                site: event.rowData.site});
    
    });
    
    this.add(tableview);
    
    tableview.show();
}
