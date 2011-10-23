/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

.noDataForGraphTableViewRow {
    height: 40;
    left: 10;
    color: '#333333';
    font-size: 12;
    right: 10;
    /** Ti.UI.iPhone.TableViewCellSelectionStyle.NONE **/
    selectionStyle: 0;
}

.graphTableViewRow {
    height: 181;
    backgroundColor: '#ffffff';
    /** Ti.UI.iPhone.TableViewCellSelectionStyle.NONE **/
    selectionStyle: 0;
}

.graphShowDetailImage {
    image: 'images/chart_detail.png';
    backgroundSelectedColor: '#FFC700';
    backgroundFocusedColor: '#FFC700';
    backgroundColor: '#ffffff';
    focusable: true;
    bottom: 8;
    right: 8;
    width: 29;
    height: 29;
    zIndex: 2;
}

#graphImage {
    top: 12;
    left: 10;
    zIndex: 1;
}