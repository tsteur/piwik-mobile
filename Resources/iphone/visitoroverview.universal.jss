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
}

#visitorOverviewDateView {
    top: 8;
    layout: 'horizontal';
    height: 'auto';
    width: 'auto';
    left: 0;
}

#visitorOverviewReferrerLabel {
    font-size: 13;
    top: 3;
    width: 'auto';
    left: 10;
    text-align: 'left';
    height: 'auto';
}

#visitorOverviewPageviewsLabel {
    font-size: 13;
    top: 4;
    width: 'auto';
    left: 10;
    text-align: 'left';
    height: 'auto';
    bottom: 8;
}

#visitorOverviewConvertedGoalsLabel {
    font-size: 13;
    top: -4;
    width:'auto';
    left: 10;
    textAlign: 'left';
    height: 'auto';
    bottom: 8;
}

#visitorOverviewDateTimeLabel {
    font-size: 14;
    font-weight: 'bold';
    left: 10;
    textAlign: 'left';
    color: '#333';
    width:'auto';
    height: 'auto';
}

.visitorOverviewFirstIcon {
    left: 12;
    canScale: true;
    enableZoomControls: false;
    borderWidth: 0;
}

.visitorOverviewFollowingIcon {
    left: 6;
    canScale: true;
    enableZoomControls: false;
    borderWidth: 0;
}

#visitorOverviewCountryFlagImageView {
    top: 4;
    bottom: 3;
    width: 18;
    height: 12;
}

#visitorOverviewBrowserIconImageView {
    top: 3;
    bottom: 3;
    width: 14;
    height: 14;
}

#visitorOverviewOperatingSystemIconImageView {
    top: 3;
    bottom: 3;
    width: 14;
    height: 14;
}