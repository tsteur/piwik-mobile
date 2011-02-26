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
    
    this.addEventListener('dateChanged', function (event) {

        if (event && event.date) {
            params.date           = event.date;
        }
        
        if (event && event.period) {
            params.period         = event.period;
        }
        
        params.closeCurrentWindow = true;
    
        Window.createMvcWindow(params);    
    });
    
    this.addEventListener('siteChanged', function (event) {
    
        params.site               = event.site;
        params.closeCurrentWindow = true;
    
        Window.createMvcWindow(params);    
    });

    var headline  = this.helper('headline', {headline: this.report ? this.report.name : '', 
                                             showTools: true, 
                                             date: this.date, 
                                             period: this.period,
                                             currentSite: site,
                                             allowedSites: this.allowedSites});

    this.add(headline.subView);

    var tableView = Titanium.UI.createTableView({
        width: this.width,
        height: this.height - headline.subView.height,
        top: headline.subView.height,
        left: 0,
        right: 0,
        separatorColor: '#B8B4AB',
        maxRowHeight: 300
    });
    
    var tableViewRows = [];
    
    if (!isAndroid) {
        // pull to refresh, not supported by android
        var pullViewHeader = Ti.UI.createView({
            backgroundColor: config.theme.titleColor,
            width: 320,
            height: 60
        });

        var pullViewArrow = Ti.UI.createView({
            backgroundImage: "images/icon/pull_arrow.png",
            width: 23,
            height: 60,
            bottom: 10,
            left: 20
        });

        var statusLabel = Ti.UI.createLabel({
            text: _('Mobile_PullDownToRefresh'),
            left: 55,
            width: 200,
            bottom: 30,
            height: "auto",
            color: "#ffffff",
            textAlign: "center",
            font: {fontSize: 13, fontWeight: "bold", fontFamily: config.theme.fontFamily},
            shadowColor: "#999",
            shadowOffset: {x: 0, y: 1}
        });
        
        var now = new Date();
        var lastUpdatedLabel = Ti.UI.createLabel({
            text: String.format(_('Mobile_LastUpdated'), now.toLocaleTime()),
            left: 55,
            width: 200,
            bottom: 15,
            height: "auto",
            color: "#ffffff",
            textAlign: "center",
            font: {fontSize: 12, fontFamily: config.theme.fontFamily},
            shadowColor: "#999",
            shadowOffset: {x: 0, y: 1}
        });

        pullViewHeader.add(pullViewArrow);
        pullViewHeader.add(statusLabel);
        pullViewHeader.add(lastUpdatedLabel);

        tableView.headerPullView = pullViewHeader;

        var pulling = false;

        tableView.addEventListener('scroll', function(event) {
            var offset = (event && event.contentOffset) ? event.contentOffset.y : 0;
            
            if (offset <= -65.0 && !pulling) {
                var transform = Ti.UI.create2DMatrix();
                transform     = transform.rotate(-180);
                pulling       = true;
                
                pullViewArrow.animate({transform: transform, duration: 180});
                statusLabel.text = _('Mobile_ReleaseToRefresh');
                
            } else if (pulling && offset > -65.0 && offset < 0) {
                pulling          = false;
                var transform    = Ti.UI.create2DMatrix();
                
                pullViewArrow.animate({transform: transform, duration: 180});
                statusLabel.text = _('Mobile_PullDownToRefresh');
            }
        });

        tableView.addEventListener('scrollEnd', function(event) {
            if (pulling && event && event.contentOffset && event.contentOffset.y <= -65.0) {
                params.closeCurrentWindow = true;

                Window.createMvcWindow(params);
            }
        });
    }
    
    Ui_Menu.addItem({title: _('Mobile_Refresh'), icon: 'images/icon/menu_refresh.png'}, function () {
        params.closeCurrentWindow = true;
        
        Window.createMvcWindow(params);
    });
    
    this.add(tableView);
    
    var dateChooser    = this.helper('parameterChooser', {date: this.date, 
                                                          period: this.period,
                                                          currentSite: site,
                                                          allowedSites: this.allowedSites});
    
    tableViewRows.push(dateChooser.getRow());

    if (this.graphsEnabled && this.graphReport && this.graphData) {
     
        var graphUrl   = null;
         switch (this.graphReport.chartType) {
             case 'bar': 
                 graphUrl   = Graph.getBarChartUrl(this.graphData);
                 break;
                 
             default:
                 graphUrl   = Graph.getPieChartUrl(this.graphData);
         }

        var graph = this.helper('graph', {title:    this.report ? this.report.name : '',
                                          graphUrl: graphUrl});
        
        tableViewRows.push(graph.getRow());
    }

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

    var visitorStats   = this.helper('statisticList', {values:   this.reportData, 
                                                       headline: headlineStats});

    tableViewRows      = tableViewRows.concat(visitorStats.getRows());
    
    if (!isAndroid) {
        for (var index = 0; index < tableViewRows.length; index++) {
            tableViewRows[index].selectionStyle = Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE;
        }
    }
    
    tableView.setData(tableViewRows);
}

