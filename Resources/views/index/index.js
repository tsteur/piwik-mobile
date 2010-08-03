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

    var rows = [{title:     _('General_Settings'),
                 id:        'settings',
                 leftImage: 'images/icon/settings.png',
                 color:     config.theme.textColor}];
    
    // @todo create a factory or something similar for this case
    if ('android' !== Titanium.Platform.osname) {
        rows[0].selectionStyle = Titanium.UI.iPhone.TableViewCellSelectionStyle.GRAY;
    }
    
    var row;
    
    if (this.sites && 0 < this.sites.length) {
        for (var siteIndex = 0; siteIndex < this.sites.length; siteIndex++) {
            var site   = this.sites[siteIndex];
            
            if (!site) {
                continue;
            }
            
            row = Titanium.UI.createTableViewRow({title: site.name,
                                                  id:    site.idsite,
                                                  name:  'site' + site.idsite,
                                                  site:  site,
                                                  className: 'siteIndex' + siteIndex,
                                                  color: config.theme.textColor});
                                                  
            // @todo create a factory or something similar for this case
            if ('android' !== Titanium.Platform.osname) {
                row.selectionStyle = Titanium.UI.iPhone.TableViewCellSelectionStyle.GRAY;
            }
                            
            if (site.sparklineUrl && 'android' === Titanium.Platform.osname) {
                
                row.rightImage = site.sparklineUrl;
                
            } else if (site.sparklineUrl) {

                var sparklineImage = Titanium.UI.createImageView({width: 100,
                                                                  height: 25,
                                                                  image: site.sparklineUrl,
                                                                  right: 5});
                row.add(sparklineImage);
            }
            
            rows.push(row);
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
