/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
@import "android/header.android.jss";
@import "android/menu.android.jss";
@import "android/tableview.android.jss";
@import "android/graph.android.jss";
@import "android/statisticlist.android.jss";
@import "android/datepicker.android.jss";
@import "android/liveoverview.android.jss";
@import "android/visitoroverview.android.jss";
@import "android/visitor.android.jss";
@import "android/modalwindow.android.jss";

#activityWaitIndicator {
    height: '40dp';
    width: '40dp';
}

#loadingActivityIndicatorLabel {
    color: '#000000';
    zIndex: 999;
    font-weight: 'bold';
    font-size: '14sp';
}

.piwikWindow {
    backgroundColor: '#ffffff';
    top: '48dp';
}

/**
 * window index/index.js
 */
#websitesTableView
{
    separatorColor: '#eeedeb';
}

.websiteTableViewRow {

}

.searchHintLabel {
    font-size: 13;
    color: '#888888';
    width: 'size';
    left: '16dp';
    right: '16dp';
}
.searchHintTableViewRow {
}

#websiteSearchBar {
    showCancel: false;
    barColor: '#B2AEA5';
    height: '43dp';
    top: 0;
    autocorrect: false;
    autocapitalization: 0;
}

/**
 * window site/index.js
 */
#reportsTableView {
    zIndex: 2;
    separatorColor: '#eeedeb';
}

.reportTableViewRow {

}

/**
 * window graph/fulldetail.js
 */
.fullgraphImage {
    defaultImage: '/images/graphDefault.png';
}

/**
 * window help/faq.js
 */
#faqPageWebView {
    scalesPageToFit: false;
}

/**
 * window help/about.js
 */
#aboutPiwikView {
    layout: 'vertical';
}

#aboutPiwikLinkToPiwiwkLabel {
     focusable: true;
     top: '5dp';
     left: '16dp';
     right: '5dp';
     text-align: 'left';
     height: 'size';
     color: '#336699';
}

#aboutPiwikLinkToSvnLabel {
    focusable: true;
    top: '5dp';
    left: '16dp';
    right: '5dp';
    text-align: 'left';
    height: 'size';
    color: '#336699';
}

#aboutPiwikLicenseWebView {
    scalesPageToFit: false;
    touchEnabled: true;
    top: '8dp';
    left: '10dp';
    right: '16dp';
}

/**
 * window help/feedback.js
 */
#giveFeedbackScrollView {
    contentWidth: 'auto';
    contentHeight: 'auto';
    layout: 'vertical';
    showVerticalScrollIndicator: true;
    showHorizontalScrollIndicator: false;
}

#giveFeedbackBugOrFeatureLabel {
    color: '#333333';
    top: '5dp';
    left: '16dp';
    right: '16dp';
    text-align: 'left';
    height: 'size';
    font-weight: 'bold';
    font-size: '14sp';
}

#giveFeedbackReportBugInfoLabel {
    color: '#333333';
    top: '5dp';
    left: '16dp';
    right: '16dp';
    bottom: '12dp';
    height: 'size';
    text-align: 'left';
    font-weight: 'normal';
    font-size: '14sp';
}

.giveFeedbackDeviceInfoLabel {
    color: '#333333';
    top: '3dp';
    left: '16dp';
    right: '16dp';
    height: 'size';
    text-align: 'left';
    font-size: '14sp';
}

#giveFeedbackMadeByCommunityLabel {
    color: '#333333';
    top: '15dp';
    left: '16dp';
    right: '16dp';
    text-align: 'left';
    height: 'size';
    font-weight: 'bold';
    font-size: '14sp';
}

#giveFeedbackLinkParticipateLabel {
    color: '#336699';
    top: '5dp';
    left: '16dp';
    right: '16dp';
    text-align: 'left';
    height: 'size';
    font-weight: 'bold';
    font-size: '14sp';
}

/**
 * window settings/index.js
 */
#settingsTableView {
    separatorColor: '#eeedeb';
}

.settingsTableViewRowHasChild {
    hasChild: true;
}
.settingsTableViewRowHasDetail {
    hasChild: true;
}

.settingsTableViewRowHasCheck{

}

.settingsTableViewRow {

}

/**
 * window settings/manageaccount.js
 */
#manageAccountsTableView {
    touchEnabled: false;
    separatorColor: '#eeedeb';
}

.manageAccountsRow {

    
}

/**
 * window settings/editaccount.js
 */
#editAccountTableView {
    separatorColor: '#eeedeb';
}

.editAccountTableFooterView {
    height: 'size';
    width: 'fill';
    left: 0;
}

#editAccountControlRow {
    /* 0 == Ti.UI.iPhone.TableViewCellSelectionStyle.NONE*/
    selectionStyle: 0;
    focusable: false;
}

.editAccountSaveButton {
    height: '45dp';
    left: '16dp';
    right: '16dp';
    focusable: true;
    top: '8dp';
}

.editAccountTextField {
    focusable: true;
    color: '#333333';
    height: 'size';
    top: '8dp';
    bottom: '5dp';
    left: '16dp';
    right: '16dp';
}

.editAccountSwitch {
    top: '8dp';
    bottom: '5dp';
    height: 'size';
    left: '16dp';
    focusable: true;
}

/**
 * window statistics/show.js
 */
#statisticsTableView {
    maxRowHeight: '300dp';
    separatorColor: '#B8B4AB';
}

/**
 * window statistics/live.js
 */
#liveTableView {
    separatorColor: '#eeedeb';
}

/**
 * window statistics/visitorlog.js
 */
#visitorLogTableView {
    separatorColor: '#eeedeb';
}

.visitorlogPagerTableViewRow {
    color: '#336699';
    left: '16dp';
}
