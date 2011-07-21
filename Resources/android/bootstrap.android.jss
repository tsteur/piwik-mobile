/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
@import "android/tableview.android.jss";
@import "android/graph.android.jss";
@import "android/parameterinfo.android.jss";
@import "android/statisticlist.android.jss";
@import "android/datepicker.android.jss";
@import "android/liveoverview.android.jss";
@import "android/visitoroverview.android.jss";
@import "android/visitor.android.jss";

#activityWaitIndicator {
    height: '40dp';
    width: '40dp';
}

#loadingActivityIndicatorLabel {
    color: '#000000';
    zIndex: 999;
    font-weight: 'bold';
    font-size: '14dp';
}

.piwikWindow {
    backgroundColor: '#ffffff';
    top: '40dp';
}

/**
 * window index/index.js
 */
#websitesTableView
{
}

.websiteTableViewRow {

}

#websiteSearchBar {
    showCancel: true;
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
}

.reportTableViewRow {

}

/**
 * window help/about.js
 */
#aboutPiwkScrollView {
    contentWidth: 'auto';
    contentHeight: 'auto';
    layout: 'vertical';
    showVerticalScrollIndicator: true;
    showHorizontalScrollIndicator: false;
}

#aboutPiwikLinkToPiwiwkLabel {
     focusable: true;
     top: '5dp';
     left: '5dp';
     right: '5dp';
     text-align: 'left';
     height: 'auto';
     color: '#336699';
}

#aboutPiwikLinkToSvnLabel {
    focusable: true;
    top: '5dp';
    left: '5dp';
    right: '5dp';
    text-align: 'left';
    height: 'auto';
    color: '#336699';
}

#aboutPiwikLicenseWebView {
    height: 'auto';
    top: '8dp';
    left: 0;
    right: 0;
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
    left: '5dp';
    right: '5dp';
    text-align: 'left';
    height: 'auto';
    font-weight: 'bold';
    font-size: '14dp';
}

#giveFeedbackReportBugInfoLabel {
    color: '#333333';
    top: '5dp';
    left: '5dp';
    right: '5dp';
    bottom: '12dp';
    height: 'auto';
    text-align: 'left';
    font-weight: 'normal';
    font-size: '14dp';
}

.giveFeedbackDeviceInfoLabel {
    color: '#333333';
    top: '3dp';
    left: '5dp';
    right: '5dp';
    height: 'auto';
    text-align: 'left';
    font-size: '14dp';
}

#giveFeedbackMadeByCommunityLabel {
    color: '#333333';
    top: '15dp';
    left: '5dp';
    right: '5dp';
    text-align: 'left';
    height: 'auto';
    font-weight: 'bold';
    font-size: '14dp';
}

/**
 * window settings/index.js
 */
#settingsTableView {

}

.settingsTableViewRowHasChild {
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
}

.manageAccountsRow {

    
}

/**
 * window settings/editaccount.js
 */
#editAccountScrollView {
    contentWidth: 'auto';
    contentHeight: 'auto';
    layout: 'vertical';
    showVerticalScrollIndicator: false;
    showHorizontalScrollIndicator: false;
}

.editAccountLabel {
    height: 'auto';
    font-size: '16dp';
    left: '10dp';
    top: '10dp';
    right: '10dp';
    color: '#336699';
    font-family: 'Arial';
}

.editAccountSaveButton {
    height: 'auto';
    width: '205dp';
    left: '10dp';
    right: '10dp';
    top: '13dp';
    focusable: true;
}

.editAccountTextField {
    focusable: true;
    color: '#333333';
    height: 'auto';
    top: '4dp';
    left: '10dp';
    right: '10dp';
}

.editAccountSwitch {
    top: '6dp';
    height: 'auto';
    left: '10dp';
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
}

/**
 * window statistics/visitor.js
 */
#visitorTableView {

}

/**
 * window statistics/visitorlog.js
 */
#visitorLogTableView {

}

.visitorlogPagerTableViewRow {
    color: '#336699';
    left: 10;
}