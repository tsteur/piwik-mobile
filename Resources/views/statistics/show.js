/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview View template statistics/show.
 */

/**
 * View template. 
 *
 * @this {View}
 */
function template () {
    var params     = this.params;
    var site       = this.site;
    var top        = 0;
    
    this.addEventListener('dateChanged', function (event) {

        params.date               = event.date;
        params.closeCurrentWindow = true;
    
        Window.createMvcWindow(params);    
    });
    
    this.addEventListener('periodChanged', function (event) {

        params.period             = event.period;
        params.closeCurrentWindow = true;
    
        Window.createMvcWindow(params);    
    });
    
    this.addEventListener('siteChanged', function (event) {
    
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
    
    var box            = this.helper('borderedContainer', {top: top});
    scrollView.add(box.subView);
    
    var headline       = this.helper('headline', {headline: this.report ? this.report.name : ''});
    box.subView.add(headline.subView);
    
    top                = headline.subView.height;
    
    var dateChooser    = this.helper('parameterChooser', {date: this.date, 
                                                          dateDescription: this.reportDate,
                                                          period: this.period,
                                                          currentSite: site,
                                                          top: top,
                                                          allowedSites: this.allowedSites});
    
    box.subView.add(dateChooser.subView);
    
    top                = dateChooser.subView.top + dateChooser.subView.height;

    if (this.graphsEnabled && this.graphReport && this.graphData) {
     
        var graphUrl   = null;
         switch (this.graphReport.chartType) {
             case 'bar': 
                 graphUrl   = Graph.getBarChartUrl(this.graphData);
                 break;
                 
             default:
                 graphUrl   = Graph.getPieChartUrl(this.graphData);
         }

        var graph = this.helper('graph', {title: this.report ? this.report.name : '',
                                          graphUrl: graphUrl,
                                          top: top});
        
        box.subView.add(graph.subView);
        top       = graph.subView.top + graph.subView.height;
    }

    box.subView.height = top;

    var statsticTitleLabel = this.dimension;
    if (this.columns && this.columns.label) {
        statsticTitleLabel = this.columns.label;
    }

    var statsticValueLabel = '';
    if (this.columns && this.columns[this.sortOrderColumn]) {
        statsticValueLabel = this.columns[this.sortOrderColumn];
    } else if (this.columns && this.columns.value) {
        statsticValueLabel = this.columns.value;
    } else {
        statsticValueLabel = _('General_Value');
    }
    
    var headlineStats  = {title: statsticTitleLabel, 
                          value: statsticValueLabel};
                         
    var visitorStats   = this.helper('statisticList', {values: this.reportData, 
                                                       top: top,
                                                       headline: headlineStats});
    
    box.subView.height = visitorStats.subView.top + visitorStats.subView.height + 1;
    
    box.subView.add(visitorStats.subView);
    
    scrollView.contentHeight = box.subView.height + box.subView.top + 5;
}
