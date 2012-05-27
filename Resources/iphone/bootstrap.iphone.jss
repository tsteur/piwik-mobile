/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

@import "iphone/tableview.universal.jss";
@import "iphone/graph.universal.jss";
@import "iphone/statisticlist.universal.jss";
@import "iphone/refresh.universal.jss";
@import "iphone/datepicker.universal.jss";
@import "iphone/menu.universal.jss";
@import "iphone/liveoverview.universal.jss";
@import "iphone/visitoroverview.universal.jss";
@import "iphone/visitor.universal.jss";
@import "iphone/modalwindow.universal.jss";

#activityWaitIndicator {
    height: 40;
    width: 40;
}

#loadingActivityIndicatorLabel {
    color: '#000000';
    zIndex: 999;
}

.piwikWindow {
}

.piwikRootWindow {
    barColor: '#B2AEA5';
}

/**
 * window index/index.js
 */
#websitesTableView
{
}

.websiteTableViewRow {
    hasChild: true;
}

.searchHintLabel {
    font-size: 13;
    color: '#888888';
    width: 'SIZE';
    left: 10;
}
.searchHintTableViewRow {
    height: 'SIZE';
}

#websiteSearchBar {
    showCancel: true;
    barColor: '#bbbbbb';
    height: 43;
    top: 0;
    autocorrect: false;
    autocapitalization: 0;
}

/**
 * window site/index.js
 */
#reportsTableView {
    z-index: 2;
}

.reportTableViewRow {
    hasChild: true;
}

/**
 * window help/faq.js
 */
#faqPageWebView {
}

/**
 * window help/about.js
 */
#aboutPiwikView {
    layout: 'vertical';
}

.aboutPiwikLinkButton {
    top: 8;
    left: 16;
    right: 16;
    height: 'SIZE';
    color: '#336699';
}

#aboutPiwikLogo {
    image: 'images/logo_piwik_mobile.png';
    width: 288;
    height: 102;
    top: 16;
    bottom: 8;
}

/**
 * window help/feedback.js
 */
#giveFeedbackTableView {
    /** style 1 == Titanium.UI.iPhone.TableViewStyle.GROUPED; **/
    style: 1
}

/**
 * window settings/index.js
 */
#settingsTableView {
    /** style 1 == Titanium.UI.iPhone.TableViewStyle.GROUPED; **/
    style: 1;
}

.settingsTableViewRowHasChild {

}

.settingsTableViewRowHasDetail {

}

.settingsTableViewRowHasCheck {

}

.settingsTableViewRow {

}

/**
 * window settings/manageaccount.js
 */
#manageAccountsTableView {
   /** style 1 == Titanium.UI.iPhone.TableViewStyle.GROUPED; **/
    style: 1;
}

.manageAccountsRow {
    hasChild: true;
}

/**
 * window settings/editaccount.js
 */
#editAccountTableView {
    style: 1;
}

.editAccountTableFooterView {
    width: 'FILL';
    left: 0;
}

#editAccountControlRow {
    /* 0 == Ti.UI.iPhone.TableViewCellSelectionStyle.NONE*/
    selectionStyle: 0;
}

.editAccountSaveButton {
    height: 40;
    right: 10;
    left: 10;
    top: 13;
    focusable: true;
}

.editAccountTextField {
    focusable: true;
    color: '#333333';
    height: 40;
    top: 2;
    left: 10;
    right: 10;
    clearButtonMode: 1;
    /** 1 === Titanium.UI.INPUT_BUTTONMODE_ONFOCUS */
}

.editAccountSwitch {
    height: 30;
    left: 10;
    top: 7;
    bottom: 7;
    focusable: true;
}

/**
 * window statistics/show.js
 */
#statisticsTableView {
    maxRowHeight: 300;
}

/**
 * window statistics/live.js
 */
#liveTableView {
}

/**
 * window statistics/visitorlog.js
 */
#visitorLogTableView {

}

.visitorlogPagerTableViewRow {
    color: '#336699';
}