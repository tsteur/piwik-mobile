/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   This graph object provides some useful methods to assemble chart urls which can be displayed using
 *          Titanium.UI.ImageView. To accomplish this, it prepares and calculates the given data and generates
 *          the url. Currently, in most cases the Google Chart API is used cause most mobile devices does not support
 *          flash. Therefore we can not use the original 'piwik flash graphs'.
 *              
 * @static
 */
var Graph = {};

/**
 * The pie/bar/line colours used in charts. These are the colors of the piwik logo.
 * 
 * @type string
 * 
 * @see <a href="http://code.google.com/intl/de-DE/apis/chart/docs/chart_params.html#gcharts_series_color">Series Colors</a>
 * 
 * @todo move this into config
 */
Graph.colors = '684222,eede78,dfad6f,8d693f,d57474';

/**
 * Domain to the Google Chart API.
 * 
 * @type string
 */
Graph.domain = 'http://chart.apis.google.com/chart';

/**
 * Appends the size string to a given graphUrl. This defines how height the chart will be rendered. Do not append
 * the string by yourself because this method does further checks.
 *
 * @see <a href="http://code.google.com/apis/chart/docs/chart_params.html#gcharts_chs">Chart sizes</a>
 *
 * @param {string}      graphUrl  A google chart api url.
 * @param {string|Int}  width     The width of the chart in pixel.
 * @param {string|Int}  height    The height of the chart in pixel.
 * 
 * @returns {string}    Url to the graph including the needed size information.
 */
Graph.appendSize = function (graphUrl, width, height) {

    // google chart doesn't allow more than 300000 pixel
    if((width * height) > 300000) {
        var ratio = width / height;
        height    = Math.floor(Math.sqrt(300000 / ratio));
        width     = Math.floor(height * ratio);
    }
    
    return graphUrl + '&chs=' + width + 'x' + height;
};

/**
 * Creates a sorted array from the given data. The array is sorted depending on the key which has to be a date.
 * This is important if you want to display those values within a chart in a sorted order.  
 * 
 * Example:
 * obj input = { '2010-06-01': 1, '2010-06-03': 12, '2010-06-02': 50, '2010-06-04': 59 }
 * return    = [ 1, 50, 12, 59 ]
 * 
 * @param {Object}  obj    An Object containing multiple date/value pairs in following format:
 *                         Object ( [date] => [value] )
 *                         'date' has to be in the following format 'YYYY-MM-DD'
 * 
 * @returns Array    A sorted array. Starting with the value of the earliest date.
 *                   ARRAY ( [int] => [Value] )
 * 
 * @private
 */
Graph.sortObjectByDateAsKey = function (obj) {

   if ('undefined' == (typeof obj) || !obj) {
   
       return {};
   }

   var arr         = [];

   /**
    * there is an issue in rhino when parsing json. if the json string contains an object having a key that
    * only contains numbers, the value will not be accessible. For example, '{"2010": 499}'. The value 499
    * is not accessible and therefore undefined. We workaround this issue by adding a "-" to each key:
    * '{"2010-": 499}'
    */
   var objAsString = JSON.stringify(obj);
   if (objAsString && objAsString.search && 1 === objAsString.search(/\"(\d)*\"/)) {

       objAsString = objAsString.replace(/\"(\d*)\"/g, '"$1-"');
       
       obj = JSON.parse(objAsString);
       
       objAsString = null;
   }
   
   for(var idx in obj) {
       // extract year -> if period year is selected, idx will just be - for example - '2010'
       var newidx = String(idx.substr(0,4));
   
       // extract month -> if period month is selected, idx will just be - for example - '2010-10'
       if (5 < idx.length) {
           newidx += String(idx.substr(5,2));
       } 
       
       // extract day -> if period day is selected, idx will just be - for example - '2010-10-22'. If period week
       // is selected, idx will be - for example - '2010-10-22 to 2010-10-29'
       if (8 < idx.length) {
           newidx += String(idx.substr(8,2));
       }
       
       arr.push(newidx);
   }
   
   arr.sort();
   
   var resultArray = [];
   
   for (var idx in arr) {
       var timeStamp = arr[idx];
       
       for (var index in obj) {
           var time = String(index.substr(0,4));
           
           if (5 < index.length) {
               time += String(index.substr(5,2));
           } 
           
           if (8 < index.length) {
               time += String(index.substr(8,2));
           } 
           
           if (timeStamp != time) {
               continue;
           }
           
           resultArray.push(obj[index]);
       }
   }
   
   arr = null;
   
   return resultArray;
};

/**
 * Prepares the given values into a suitable format to use them in a graph url.
 * 
 * @param {Object}  lineValues    An Object containing multiple rows. Each property represents a 
 *                                single row and contains multiple columns. 
 *                                Object (
 *                                   [key] => Object (
 *                                           [date] => [value]
 *                                   )
 *                                )
 *
 * @see <a href="http://code.google.com/intl/de-DE/apis/chart/docs/data_formats.html">Format min/max values</a>
 * @see <a href="http://code.google.com/intl/de-DE/apis/chart/docs/chart_params.html#gcharts_legend">Format of legend</a>
 * @see <a href="http://code.google.com/intl/de-DE/apis/chart/docs/data_formats.html#text">Format of data points</a>
 *
 * @returns Object    An object containing the following values:
 *                    Object (
 *                       [min]              => [The lowest value]
 *                       [max]              => [The highest value]
 *                       [dataPoints]       => [Uses the values to generate a string containing all data points]
 *                       [labels]           => [Uses the keys to generate labels, can be used eg. in a legend]
 *                       [numValues]        => [A number how many key/value pairs are given]
 *                    )
 * 
 * @private
 */
Graph.parseMultipleRowsValues = function (lineValues) {
    var valueString = '';
    var labelString = '';
    var min         = null;
    var max         = null;
    var count       = 0;
    
    if (lineValues) {
        for(var rowIndex in lineValues) {
            
            var row          = lineValues[rowIndex];
            var values       = '';

            row = Graph.sortObjectByDateAsKey(row);

            for(var columnIndex in row) {
                var columnValue = row[columnIndex];

                if (!columnValue) {
                    columnValue = 0;
                }
                
                columnValue     = parseInt(columnValue, 10);

                if(null == min || columnValue < min) {
                    min = columnValue;
                }
                
                if(null == max || columnValue > max) {
                    max = columnValue;
                }

                values += ','+columnValue;
                count++;
            }
            
            valueString += '|' + values.substring(1);
            
            if ('android' === Titanium.Platform.osname) {
                // if we do not encode the uri on android, the image will not be displayed
                labelString += '|' + encodeURI(rowIndex);
            } else {
                // if we encode the uri on iOs it will eg. display 'Windows%20XP' instead of 'Windows XP'
                labelString += '|' + rowIndex;
            }
            
        }
    }
    
    valueString = valueString.substring(1);
    labelString = labelString.substring(1);
    
    var result  = {min: min, 
                   max: max, 
                   dataPoints: valueString, 
                   labels: labelString, 
                   numValues: count};
    
    return result;
};

/**
 * Prepares the given values into a suitable format to use them in a graph url.
 * 
 * @param {Object}  values    An Object containing multiple key/value pairs in following format:
 *                            Object ( [key] => [value] )
 *
 * @see <a href="http://code.google.com/intl/de-DE/apis/chart/docs/data_formats.html">Format min/max values</a>
 * @see <a href="http://code.google.com/intl/de-DE/apis/chart/docs/chart_params.html#gcharts_legend">Format of legend</a>
 * @see <a href="http://code.google.com/intl/de-DE/apis/chart/docs/data_formats.html#text">Format of data points</a>
 *
 * @returns Object    An object containing the following values:
 *                    Object (
 *                       [min]              => [The lowest value]
 *                       [max]              => [The highest value]
 *                       [dataPoints]       => [Uses the values to generate a string containing all data points]
 *                       [labels]           => [Uses the keys to generate labels, can be used eg. in a legend]
 *                       [percentageLabels] => []
 *                       [percentageValues] => [Calculated percentage for each key/value pair]
 *                       [numValues]        => [A number how many key/value pairs are given]
 *                    )
 * 
 * @private
 */
Graph.parseMultipleColumnsValues = function (values) {
    var valueString      = '';
    var labelString      = '';
    var sumValues        = 0;
    var percentageString = '';
    var percentageValues = '';
    var max              = 0;
    var min              = 0;
    var count            = 0;
    var column;

    if (values) {
        for (var columnIndex in values) {
            column         = parseInt(values[columnIndex], 10);
            
            if(('undefined' !== typeof column) && null !== column) {
                count++;
                sumValues += column;
            }
        }
    }  
    
    if (count > 5) {
        values = this.aggregateValues(values);
    }
    
    if (values) {
        for (var columnIndex in values) {
            column = parseInt(values[columnIndex], 10);
            
            if(('undefined' !== (typeof column)) && null !== column) {              
                
                if(null == max || column > max) {
                    max = column;
                }
                
                if(null == min || column < min) {
                    min = column;
                }
                
                valueString += ',' + column;

                if ('android' === Titanium.Platform.osname) {
                    // if we do not encode the uri on android, the image will not be displayed
                    labelString += '|' + encodeURI(columnIndex);  
                } else {
                    // if we encode the uri on iOs it will eg. display 'Windows%20XP' instead of 'Windows XP'
                    labelString += '|' + columnIndex;
                }
                
                if (sumValues !== 0) {
                    var percentage    = Math.round(((column / sumValues) * 100));
                    
                    percentageValues += ',' + percentage;
                    
                    if(0 == percentage) {
                        percentage = '<1';
                    }
                    
                    percentageString += '|' + percentage + '%';
                }
                
                count++;
            }
        }
         
        valueString      = valueString.substring(1);
        labelString      = labelString.substring(1);
        percentageString = percentageString.substring(1);
        percentageValues = percentageValues.substring(1);
    }
    
    var result  = {min: min, 
                   max: max, 
                   dataPoints: valueString, 
                   labels: labelString, 
                   percentageLabels: percentageString,
                   percentageValues: percentageValues,
                   numValues: count};
    
    return result;
};

/**
 * The highest four key/value pairs remain unchanged. If more than five key/value pairs are given it merges all 
 * lower key/value pairs together to a fifth key/value pair named 'other'.
 * 
 * @param {Object}  values      Data points in the following style: Object ( [key] => [value] ).
 * 
 * @returns Object    Data points in the following style: Object ( [key] => [value] ) but containing max five
 *                    key/value pairs.
 *                    
 * @private
 */
Graph.aggregateValues = function (values) {

    var sortedValues = [];
    
    // sort
    for (var columnIndex in values) {
        sortedValues.push(parseInt(values[columnIndex], 10));
    }
    
    function compareNumbers(a, b) {
        return (b-a);
    }

    sortedValues.sort(compareNumbers);

    sortedValues = sortedValues.slice(0, 4);
    sortedValues = '|' + sortedValues.join('||') + '|';
    
    // now we have the highest 4 values, group each other values to a group 'other'
    
    var resultValues = {};
    resultValues[_('General_Others')] = 0;
    
    for (var columnIndex in values) {
        var column     =  parseInt(values[columnIndex], 10);
        var searchKey  = '|' + column + '|';
        var inArrayPos = sortedValues.indexOf(searchKey);
        
        if (-1 === inArrayPos) {
            
            resultValues[_('General_Others')] += column;
            
        } else {
            
            // value is used now. remove it from sortedValues, but only one because it possible contains same value multiple times
            sortedValues = sortedValues.substr(0, inArrayPos) + sortedValues.substr(inArrayPos + searchKey.length);
            
            resultValues[columnIndex] = column;
            
        }
    }
    
    values       = null;
    sortedValues = null;
    
    return resultValues;
};

/**
 * Creates a line chart. You can display as much as lines as one pleases. In opposite to the LineChartUrl it does
 * not display a legend.
 * 
 * @param {Object}  lineValues    An Object containing multiple lines. Each property represents a 
 *                                single line within the chart. 
 *                                Object (
 *                                   [key] => Object (
 *                                           [date] => [value]
 *                                   )
 *                                )
 *                                
 *                                The key is used in the legend and holds an object with multiple data points.
 *                                'date' has to be in the following format 'YYYY-MM-DD'. This is important because 
 *                                the method sorts the dataPoints depending on the date. Each date/value pair 
 *                                represents a data point within a line.
 * 
 * @see <a href="http://code.google.com/intl/de-DE/apis/chart/docs/gallery/line_charts.html">Line Chart</a>
 * 
 * @returns String    The generated graph url without a size declaration. You can append the size using the method
 *                    'appendSize()'. Returns an empty string if no values are given.
 */
Graph.getOverviewLineChartUrl = function (lineValues) {

    var content       = this.parseMultipleRowsValues(lineValues);
    
    if (!content || 0 == content.numValues) {
        
        return '';
    }
    
    var numXAxisGrids = 100 / content.numValues;
    
    var url = Graph.domain + '?cht=ls&chco=' + Graph.colors + '&chd=t:' + content.dataPoints;
    
    url    += '&chds=' + content.min + ',' + content.max;
    url    += '&chf=c,s,ffffff|bg,s,ffffff&chxt=y&chxl=0:|' + content.min + '|' + content.max + '&chxs=0,333333';
    url    += '&chg=' + numXAxisGrids + ',20,' + Math.floor(numXAxisGrids) + ',' + Math.floor(numXAxisGrids) + ',0,0';
    
    content    = null;
    lineValues = null;
    
    return url;
};

/**
 * Creates a line chart. Additionally displays a legend. You can display as much as lines as one pleases.
 * 
 * @param {Object}  lineValues    An Object containing multiple lines. Each property represents a 
 *                                single line within the chart. 
 *                                Object (
 *                                   [key] => Object (
 *                                           [date] => [value]
 *                                   )
 *                                )
 *                                
 *                                The key is used in the legend and holds an object with multiple data points.
 *                                'date' has to be in the following format 'YYYY-MM-DD'. This is important because 
 *                                the method sorts the dataPoints depending on the date. Each date/value pair 
 *                                represents a data point within a line.
 * 
 * @see <a href="http://code.google.com/intl/de-DE/apis/chart/docs/gallery/line_charts.html">Line Chart</a>
 * 
 * @returns String    The generated graph url without a size declaration. You can append the size using the method
 *                    'appendSize()'. Returns an empty string if no values are given.
 */
Graph.getLineChartUrl = function (lineValues) {

    var content       = this.parseMultipleRowsValues(lineValues);

    if (!content || 0 == content.numValues) {
        
        return '';
    }
    
    var numXAxisGrids = 100 / content.numValues;
    
    var url = Graph.domain + '?cht=ls&chco=' + Graph.colors;
    
    url    += '&chd=t:' + content.dataPoints + '&chds=0,' + content.max + '&chdl=' + content.labels;
    url    += '&chf=c,s,ffffff|bg,s,ffffff';
    url    += '&chg=' + numXAxisGrids + ',20,' + Math.floor(numXAxisGrids) + ',' + Math.floor(numXAxisGrids) + ',0,0';
    url    += '&chdlp=b&chxt=y&chxl=0:|0|' + content.max + '&chxs=0,333333';
    
    content    = null;
    lineValues = null;
    
    return url;
};

/**
 * Creates a pie chart. Additionally displays a legend and calculated percent values. Displays max five pieces.
 * 
 * @param {Object}  values      Data points in the following style: Object ( [key] => [value] ).
 *                              The key is displayed in the legend. If more than five key/value pairs are given it 
 *                              only displays the highest four values and merges all other values to a fith bar 
 *                              named 'Other'. 
 * 
 * @see <a href="http://code.google.com/intl/de-DE/apis/chart/docs/gallery/pie_charts.html">Pie Chart</a>
 * 
 * @returns String    The generated graph url without a size declaration. You can append the size using the method
 *                    'appendSize()'. Returns an empty string if no values are given.
 */
Graph.getPieChartUrl = function (values) {
    
    var content       = this.parseMultipleColumnsValues(values);

    if (!content || 0 == content.numValues) {
        
        return '';
    }
    
    var url = Graph.domain + '?chco=' + Graph.colors;
    url    += '&cht=p&chd=t:' + content.percentageValues + '&chdl=' + content.labels + '&chdlp=r';
    url    += '&chf=c,s,ffffff|bg,s,ffffff&chl=' + content.percentageLabels;
    
    content = null;
    values  = null;
    
    return url;
};

/**
 * Creates a bar chart. Additionally displays a legend. Displays max five bars.
 * 
 * @param {Object}  values      Data points in the following style: Object ( [key] => [value] ).
 *                              The key is displayed in the legend. If more than five key/value pairs are given it 
 *                              only displays the highest four values and merges all other values to a fith bar 
 *                              named 'Other'.
 * 
 * @see <a href="http://code.google.com/intl/de-DE/apis/visualization/documentation/gallery/barchart.html">Bar Chart</a>
 * 
 * @returns String    The generated graph url without a size declaration. You can append the size using the method
 *                    'appendSize()'. Returns an empty string if no values are given.
 */
Graph.getBarChartUrl = function (values) {
    
    var content       = this.parseMultipleColumnsValues(values);

    if (!content || 0 == content.numValues) {
        
        return '';
    }

    var url = Graph.domain + '?chco=' + Graph.colors;
    url    += '&cht=bvs&chd=t:' + content.dataPoints + '&chds=0,' + content.max;
    url    += '&chdl=' + content.labels + '&chdlp=b' + '&chf=c,s,ffffff|bg,s,ffffff';
    
    content = null;
    values  = null;
    
    return url;
};

/**
 * Exceptionally, the piwik api can be used to display sparklines. It automatically displays sparklines of the 
 * last30 days from now on.
 * 
 * @param {Int}      siteId      The id of a piwik site.
 * @param {string}   accessUrl   The access URL of a piwik site.
 * @param {string}   tokenAuth   The regarding auth_token of a piwik site.
 * 
 * @returns String    The generated url to display a sparkline url.
 */
Graph.getSparklineUrl = function (siteId, accessUrl, tokenAuth) {

    return accessUrl + '?module=MultiSites&action=getEvolutionGraph&period=day&date=last30&evolutionBy=visits&columns[]=nb_visits&idSite=' + siteId + '&idsite=' + siteId + '&viewDataTable=sparkline&token_auth=' + tokenAuth;
};
