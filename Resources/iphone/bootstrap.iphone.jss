/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

@import "iphone/tableview.universal.jss";
@import "iphone/graph.universal.jss";
@import "iphone/parameterinfo.universal.jss";
@import "iphone/statisticlist.universal.jss";
@import "iphone/refresh.universal.jss";
@import "iphone/datepicker.universal.jss";
@import "iphone/menu.universal.jss";
@import "iphone/liveoverview.universal.jss";
@import "iphone/visitoroverview.universal.jss";
@import "iphone/visitor.universal.jss";

#activityWaitIndicator {
    height: 40;
    width: 40;
}

#loadingActivityIndicatorLabel {
    color: '#000000';
    zIndex: 999;
}

.piwikWindow {
    background-color: '#ffffff';
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
 * window help/about.js
 */
#aboutPiwkScrollView {
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    contentWidth: 'auto';
    contentHeight: 'auto';
    layout: 'vertical';
    showVerticalScrollIndicator: true;
    showHorizontalScrollIndicator: false;
}

#aboutPiwikLinkToPiwiwkLabel {
     focusable: true;
     top: 5;
     left: 5;
     right: 5;
     text-align: 'left';
     height: 'auto';
     color: '#336699';
}

#aboutPiwikLinkToSvnLabel {
    focusable: true;
    top: 5;
    left: 5;
    right: 5;
    text-align: 'left';
    height: 'auto';
    color: '#336699';
}

#aboutPiwikLicenseWebView {
    height: 'auto';
    top: 8;
    left: 0;
    right: 0;
}

/**
 * window help/feedback.js
 */
#giveFeedbackScrollView {
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    contentWidth: 'auto';
    contentHeight: 'auto';
    layout: 'vertical';
    showVerticalScrollIndicator: true;
    showHorizontalScrollIndicator: false;
}

#giveFeedbackBugOrFeatureLabel {
    color: '#333333';
    top: 5;
    left: 5;
    right: 5;
    text-align: 'left';
    height: 'auto';
    font-weight: 'bold';
}

#giveFeedbackReportBugInfoLabel {
    color: '#333333';
    top: 5;
    left: 5;
    right: 5;
    bottom: 12;
    height: 'auto';
    text-align: 'left';
    font-weight: 'normal';
}

.giveFeedbackDeviceInfoLabel {
    color: '#333333';
    top: 3;
    left: 5;
    right: 5;
    height: 'auto';
    text-align: 'left';
}

#giveFeedbackMadeByCommunityLabel {
    color: '#333333';
    top: 15;
    left: 5;
    right: 5;
    text-align: 'left';
    height: 'auto';
    font-weight: 'bold';
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

.settingsTableViewRowHasCheck{

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
#editAccountScrollView {
    contentWidth: 'auto';
    contentHeight: 'auto';
    layout: 'vertical';
    top: 0;
    left: 0;
    showVerticalScrollIndicator: false;
    showHorizontalScrollIndicator: false;
}

.editAccountLabel {
    height: 22;
    left: 10;
    top: 10;
    right: 10;
    color: '#336699';
    font-size: 16;
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
    top: 4;
    left: 10;
    right: 10;
    clearButtonMode: 1;
    /** 1 === Titanium.UI.INPUT_BUTTONMODE_ONFOCUS */
}

.editAccountSwitch {
    top:  6;
    height: 30;
    left: 10;
    focusable: true;
}

/**
 * window statistics/show.js
 */
#statisticsTableView {
    maxRowHeight: 300;
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
}