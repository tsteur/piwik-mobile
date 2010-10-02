/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview View template referers/searchengine.
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
    
    var searchengine = [];

    if (this.searchengine && (this.searchengine instanceof Array) && 0 < this.searchengine.length) {
        for(var index = 0; index < this.searchengine.length; index++) {
            searchengine.push({
                title: this.searchengine[index].label,
                value: this.searchengine[index][config.getUsedRow(this.period)],
                logo:  this.accountUrl+'/'+this.searchengine[index].logo
            });
        }
    }
    
    var box            = this.helper('borderedContainer', {top: top});
    
    var headline       = this.helper('headline', {headline: _('Referers_SearchEngines')});
    
    box.subView.add(headline.subView);
    
    top                = headline.subView.height;
    
    if (this.graphsEnabled) {
    
        var searchenginePie = {};
    
        if (this.searchengine && (this.searchengine instanceof Array) && 0 < this.searchengine.length) {
            for(var index = 0; index < this.searchengine.length; index++) {
                searchenginePie[this.searchengine[index].label] = this.searchengine[index][config.getUsedRow(this.period)];
            }
        }
        
        var graphUrl   = Graph.getPieChartUrl(searchenginePie);
    
        var graph      = this.helper('graph', {title: _('Referers_SearchEngines'),
                                                  graphUrl: graphUrl,
                                                  top: top});
    
        box.subView.add(graph.subView);
        top            = graph.subView.top + graph.subView.height + graph.subView.paddingBottom;
    
    }
    
    box.subView.height = top;
    
    scrollView.add(box.subView);
    
    top                = box.subView.top + box.subView.height;
    
    var statsBox       = this.helper('borderedContainer', {top: top});
    
    var headlineStats  = {title: _('Referers_ColumnSearchEngine'), 
                          value: config.getUsedRowTranslation()};
    
    var visitorStats   = this.helper('statisticList', {values: searchengine, 
                                                       headline: headlineStats});
    
    statsBox.subView.height   = visitorStats.subView.height + 2;
    
    statsBox.subView.add(visitorStats.subView);
    
    scrollView.add(statsBox.subView);
    
    scrollView.contentHeight = statsBox.subView.height + statsBox.subView.top + 5;
}
