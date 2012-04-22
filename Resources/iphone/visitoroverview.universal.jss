/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

.visitorOverviewTableViewRow {
    layout: 'vertical';
    hasChild: true;
    height: 'SIZE';
}

.visitorOverviewAchievedGoalTableViewRow {
    layout: 'vertical';
    hasChild: true;
    height: 'SIZE';
    backgroundColor: '#FFFFC4';
}

#visitorOverviewDateView {
    top: 8;
    layout: 'horizontal';
    height: 'SIZE';
    width: 'FILL';
    left: 0;
}

#visitorOverviewReferrerLabel {
    top: 0;
    font-size: 13;
    width: 'SIZE';
    left: 10;
    text-align: 'left';
    height: 'SIZE';
}

#visitorOverviewPageviewsLabel {
    font-size: 13;
    top: 4;
    width: 'SIZE';
    left: 10;
    text-align: 'left';
    height: 'SIZE';
    bottom: 8;
}

#visitorOverviewConvertedGoalsLabel {
    font-size: 13;
    top: 4;
    width:'SIZE';
    left: 10;
    textAlign: 'left';
    height: 'SIZE';
}

#visitorOverviewDateTimeLabel {
    top: 0;
    font-size: 14;
    font-weight: 'bold';
    left: 10;
    textAlign: 'left';
    color: '#333';
    width:'SIZE';
    height: 'SIZE';
}

.visitorOverviewFirstIcon {
    left: 12;
    canScale: false;
    enableZoomControls: false;
    borderWidth: 0;
}

.visitorOverviewFollowingIcon {
    left: 6;
    canScale: false;
    enableZoomControls: false;
    borderWidth: 0;
}

#visitorOverviewCountryFlagImageView {
    top: 4;
    width: 18;
    height: 12;
    bottom: 0;
}

#visitorOverviewBrowserIconImageView {
    top: 3;
    width: 14;
    height: 14;
    bottom: 0;
}

#visitorOverviewOperatingSystemIconImageView {
    top: 3;
    width: 14;
    height: 14;
    bottom: 0;
}