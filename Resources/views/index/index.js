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

    var rows = [Ui_TableViewRow({title:     _('General_Settings'),
                                 id:        'settings',
                                 leftImage: {url: 'images/icon/settings.png', height: 25, width: 33}})];
    
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
    
    var tableview = Titanium.UI.createTableView({data: rows, 
                                                 separatorColor: '#eeedeb'});
    
    tableview.addEventListener('click', function (event) {
    
        if (0 == event.index) {
    
            Window.createMvcWindow({jsController: 'settings',
                                    jsAction: 'index'});
    
        } else {
    
            var site        = event.rowData.site;
    
            Window.createMvcWindow({jsController: 'site',
                                    jsAction: 'index',
                                    site: site
            });
        }
    
    });
    
    this.add(tableview);
    
    tableview.show();
}
