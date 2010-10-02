/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview View template visitors/plugin.
 */

/**
 * View template. 
 *
 * @this {View}
 */
function template () {
        
    var site       = this.site;
    var top        = 0;
    
    this.addEventListener('dateChanged', function (event) {
    
        var params                = this.params;
        params.date               = event.date;
        params.closeCurrentWindow = true;
    
        Window.createMvcWindow(params);    
    });
    
    this.addEventListener('periodChanged', function (event) {
    
        var params                = this.params;
        params.period             = event.period;
        params.closeCurrentWindow = true;
    
        Window.createMvcWindow(params);    
    });
    
    this.addEventListener('siteChanged', function (event) {
    
        var params                = this.params;
        params.site               = event.site;
        params.closeCurrentWindow = true;
    
        Window.createMvcWindow(params);    
    });
    
    var scrollView = Titanium.UI.createScrollView({
        contentWidth: 'auto',
        contentHeight: 'auto',
        top: 0,
        showVerticalScrollIndicator: false,
        showHorizontalScrollIndicator: false
    });
    
    this.add(scrollView);
    
    var dateChooser  = this.helper('parameterChooser', {date: this.date, 
                                                        period: this.period,
                                                        currentSite: site,
                                                        allowedSites: this.allowedSites});
    
    scrollView.add(dateChooser.subView);
    
    top              = dateChooser.subView.top + dateChooser.subView.height;
    
    var plugin = [];
    
    if (this.plugin && (this.plugin instanceof Array) && 0 < this.plugin.length) {
        for(var index = 0; index < this.plugin.length; index++) {
            plugin.push({
                title: this.plugin[index].label,
                value: this.plugin[index]['nb_visits_percentage'],
                logo: this.accountUrl+'/'+this.plugin[index].logo
            });
        }
    }
    
    var box           = this.helper('borderedContainer', {top: top});
    
    var headline      = this.helper('headline', {headline: _('UserSettings_Plugins')});
    
    box.subView.add(headline.subView);
    
    top               = headline.subView.height;
        
    box.subView.height = top;
    
    scrollView.add(box.subView);
    
    top                = box.subView.top + box.subView.height;
    
    var statsBox       = this.helper('borderedContainer', {top: top});
    
    var headlineStats  = {title: _('UserSettings_ColumnPlugin'), 
                          value: _('General_ColumnPercentageVisits')};
                         
    var visitorStats   = this.helper('statisticList', {values: plugin, 
                                                       headline: headlineStats});
    
    statsBox.subView.height   = visitorStats.subView.height + 2;
    
    statsBox.subView.add(visitorStats.subView);
    
    scrollView.add(statsBox.subView);
    
    scrollView.contentHeight = statsBox.subView.height + statsBox.subView.top + 5;
}
