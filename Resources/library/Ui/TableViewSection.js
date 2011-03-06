/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/** 
 * Creates and returns an instance of a Titanium TableViewRow. It does automatically set theme related settings and 
 * handles os specific differences. Extends the default row to set a value. Always use this function if you need a 
 * table row section. This ensures the same look and feel in each table view without the need of handling os differences.
 *
 * @param  {Object}   [params]  See <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.TableViewRow-object.html">Titanium API</a> for a list of all available parameters.
 *
 * @example
 * var sectionRow = Ui_TableViewRow({title: 'Manage Accounts'}); // creates an instance of the row
 *
 * @returns {Titanium.UI.TableViewRow} A table view row instance.Please, do not set row.title directly as we use a 
 *                                     custom title label to display the title.
 */
function Ui_TableViewSection (params) {

    if (!params) {
        params = {};
    }    
    
    var title  = params.title || null;
    delete params.title;
    
    params.height                  = 24;
    params.focusable               = false;
    params.selectedBackgroundColor = '#B2AEA5';
    params.backgroundColor         = '#B2AEA5';
    
    var section = Titanium.UI.createTableViewRow(params);

    if (!isAndroid) {
        section.selectionStyle = Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE;
    }
    
    var left = 10;
    if (isAndroid ) {
        // android does the positioning relative within the tableview row, not absolute
        left = 0;
    }

    headerLabel = Titanium.UI.createLabel({
        text: String(title),
        height: 24,
        width: 'auto',
        textAlign: 'left',
        color: '#ffffff',
        left: left,
        font: {fontSize: 14, fontFamily: config.theme.fontFamily}
    });

    section.add(headerLabel);
    
    return section;
};

