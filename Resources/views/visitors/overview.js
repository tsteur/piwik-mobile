/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 * 
 * @fileOverview View template visitors/overview.
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
    
    var visitorValues = [{value: this.visits, title: _('General_ColumnNbVisits')},
                         {value: this.uniqueVisitors, title: _('General_ColumnNbUniqVisitors')},
                         {value: this.actions, title: _('General_ColumnNbActions')},
                         {value: this.maxActions, title: _('General_ColumnMaxActions')},
                         {value: this.visitsConverted, title: _('General_ColumnVisitsWithConversions')},
                         {value: this.visitsReturning, title: _('VisitFrequency_ColumnReturningVisits')},
                         {value: this.actionsReturning, title: _('VisitFrequency_ColumnActionsByReturningVisits')},
                         {value: this.maxActionsReturning, title: _('VisitFrequency_ColumnMaximumActionsByAReturningVisit')}];
                      
    var box            = this.helper('borderedContainer', {top: top});
    
    var headline       = this.helper('headline', {headline: _('General_Visitors')});
    
    box.subView.add(headline.subView);
    
    top                = headline.subView.height;
    
    if (this.graphsEnabled) {
    
        var graphUrl   = Graph.getOverviewLineChartUrl([this.vistsPrevious30]);
    
        var graph      = this.helper('graph', {title: _('VisitsSummary_EvolutionOverLastPeriods').replace(/%s/, Translation.getPeriod(this.period, true)),
                                               graphUrl: graphUrl,
                                               top: top});
    
        box.subView.add(graph.subView);
        top            = graph.subView.top + graph.subView.height + graph.subView.paddingBottom;
        
    }
    
    box.subView.height = top;
    
    scrollView.add(box.subView);
    
    top                = box.subView.top + box.subView.height;
    
    var statsBox       = this.helper('borderedContainer', {top: top});
    
    var visitorStats   = this.helper('statisticList', {values: visitorValues});
    
    statsBox.subView.height   = visitorStats.subView.height + 2;
    
    statsBox.subView.add(visitorStats.subView);
    
    scrollView.add(statsBox.subView);
    
    scrollView.contentHeight = statsBox.subView.height + statsBox.subView.top + 5;
}
