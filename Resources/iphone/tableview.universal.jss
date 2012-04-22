/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

tableview {
    visible: true;
}

tableviewrow {
    color: '#333333';
    font-size: 18;
    font-weight: 'bold';
    height: 'SIZE';
    selectionStyle: 2;
}

.tableViewSection {
    height: 'SIZE';
    backgroundColor: '#B2AEA5';
    selectedBackgroundColor: '#B2AEA5';
    opacity: 0.95;
}

.tableViewRowSelectable {
    backgroundColor: '#f5f5f5';
}

#tableViewSectionHeaderLabel {
    height: 'SIZE';
    top: 3;
    bottom: 4;
    width: 'SIZE';
    textAlign: 'left';
    color: '#ffffff';
    left: 10;
    font-size: 15;
    font-weight:'bold';
}

#tableViewRowTitleLabelWithDescription {
    textAlign: 'left';
    width: 'SIZE';
    height: 'SIZE';
    left: 10;
    color: '#333333';
    ellipsize: true;
    wordWrap: false;
    font-size: 18;
    top: 11;
    font-weight: 'bold';
    touchEnabled: false;
}

#tableViewRowTitleLabel {
    textAlign: 'left';
    width: 'SIZE';
    height: 'SIZE';
    left: 10;
    color: '#333333';
    ellipsize: true;
    wordWrap: false;
    font-size: 18;
    top: 11;
    bottom: 11;
    font-weight: 'bold';
    touchEnabled: false;
}

#tableViewRowDescriptionLabel {
    font-size: 13;
    textAlign: 'left';
    width: 'SIZE';
    height: 'SIZE';
    left: 10;
    top: 34;
    bottom: 11;
    color: '#808080';
    ellipsize: true;
    wordWrap: false;
    touchEnabled: false;
}

#tableViewRowDescriptionLabelvertical {
    font-size: 13;
    textAlign: 'left';
    width: 'SIZE';
    height: 'SIZE';
    left: 10;
    top: 4;
    bottom: 11;
    color: '#808080';
    ellipsize: true;
    wordWrap: false;
    touchEnabled: false;
}

#tableViewRowValueLabel {
    right: 10;
    font-size: 18;
    textAlign: 'right';
    width: 'SIZE';
    height: 'SIZE';
    color: '#385487';
    touchEnabled: false;
}

#tableViewRowRightImage {
    right: 5;
}