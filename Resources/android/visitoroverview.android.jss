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
    height: 'auto';
    focusable: true;
}

.visitorOverviewAchievedGoalTableViewRow {
    layout: 'vertical';
    hasChild: true;
    height: 'auto';
    focusable: true;
    backgroundColor: '#FFFFC4';
}

#visitorOverviewDateView {
    top: '8dp';
    layout: 'horizontal';
    height: 'auto';
    width: 'auto';
    left: '0dp';
}

#visitorOverviewReferrerLabel {
    font-size: '13sp';
    top: '3dp';
    width: 'auto';
    left: '5dp';
    text-align: 'left';
    height: 'auto';
    color: '#333333';
}

#visitorOverviewPageviewsLabel {
    font-size: '13sp';
    top: '4dp';
    width: 'auto';
    left: '5dp';
    text-align: 'left';
    height: 'auto';
    color: '#333333';
}

#visitorOverviewConvertedGoalsLabel {
    font-size: '13sp';
    top: '4dp';
    width:'auto';
    left: '5dp';
    textAlign: 'left';
    height: 'auto';
    color: '#333333';
}

#visitorOverviewDateTimeLabel {
    font-size: '14sp';
    font-weight: 'bold';
    left: '5dp';
    textAlign: 'left';
    color: '#333';
    width:'auto';
    height: 'auto';
    color: '#333333';
}

.visitorOverviewFirstIcon {
    left: '12dp';
    canScale: true;
    enableZoomControls: false;
}

.visitorOverviewFollowingIcon {
    left: '6dp';
    canScale: true;
    enableZoomControls: false;
}

#visitorOverviewCountryFlagImageView {
    top: '4dp';
    bottom: '3dp';
    width: '18dp';
    height: '12dp';
    borderWidth: 0;
}

#visitorOverviewBrowserIconImageView {
    top: '3dp';
    bottom: '3dp';
    width: '14dp';
    height: '14dp';
    borderWidth: 0;
}

#visitorOverviewOperatingSystemIconImageView {
    top: '3dp';
    bottom: '3dp';
    width: '14dp';
    height: '14dp';
    borderWidth: 0;
}