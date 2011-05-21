/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   This graph object provides some useful methods to assemble graph urls which can be displayed using
 *          Titanium.UI.ImageView. To accomplish this, it prepares and calculates the given data and generates
 *          the url. Currently, in most cases the Google Chart API is used cause most mobile devices does not support
 *          flash. Therefore we can not use the original 'piwik flash graphs'.
 *              
 * @static
 */
Piwik.Graph = new function () {

    /**
     * The pie/bar/line colours used in charts. These are the colors of the piwik logo.
     *
     * @type string
     *
     * @see <a href="http://code.google.com/intl/de-DE/apis/chart/docs/chart_params.html#gcharts_series_color">Series Colors</a>
     *
     * @todo move this into config
     */
    this.colors = 'FFCC00,670001,FF6600,CC0001,FE9900';

    /**
     * Domain of the Google Chart API.
     *
     * @type string
     */
    this.domain = 'http://chart.apis.google.com/chart';

    /**
     * Appends the size string to a given graphUrl. This defines how height the chart will be rendered. Do not append
     * the size string by yourself because this method does further checks.
     *
     * @see <a href="http://code.google.com/apis/chart/docs/chart_params.html#gcharts_chs">Chart sizes</a>
     *
     * @param {string}      graphUrl  A google chart api url.
     * @param {string|Int}  width     The width of the chart in pixel.
     * @param {string|Int}  height    The height of the chart in pixel.
     *
     * @returns {string}    Url to the graph including the needed size information.
     */
    this.appendSize = function (graphUrl, width, height) {

        // google chart doesn't allow more than 300000 pixel
        if ((width * height) > 300000) {
            var ratio = width / height;
            height    = Math.floor(Math.sqrt(300000 / ratio));
            width     = Math.floor(height * ratio);
        }

        return graphUrl + '&chs=' + width + 'x' + height;
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
     *                       [percentageLabels] => [The percentage labels which shall be displayed]
     *                       [percentageValues] => [Calculated percentage for each key/value pair]
     *                       [numValues]        => [A number of how many key/value pairs are given]
     *                    )
     *
     * @private
     */
    this.parseMultipleColumnsValues = function (values) {
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

                if (('undefined' !== typeof column) && null !== column) {
                    count++;
                    sumValues += column;
                }
            }
        }

        if (values) {
            for (var columnIndex in values) {
                column = parseInt(values[columnIndex], 10);

                if (('undefined' !== (typeof column)) && null !== column) {

                    if (null == max || column > max) {
                        max = column;
                    }

                    if (null == min || column < min) {
                        min = column;
                    }

                    valueString += ',' + column;

                    labelString += '|' + columnIndex;

                    if (sumValues !== 0) {
                        var percentage    = Math.round(((column / sumValues) * 100));

                        percentageValues += ',' + percentage;

                        if (0 == percentage) {
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
     * Creates a pie chart. Additionally displays a legend and calculated percent values.
     *
     * @param {Object}  values      Data points in the following style: Object ( [key] => [value] ).
     *                              The keys will be displayed in the legend.
     *
     * @see <a href="http://code.google.com/intl/de-DE/apis/chart/docs/gallery/pie_charts.html">Pie Chart</a>
     *
     * @returns String    The generated graph url without a size declaration. You can append the size using the method
     *                    'appendSize()'. Returns an empty string if no values are given.
     */
    this.getPieChartUrl = function (values) {

        var content = this.parseMultipleColumnsValues(values);

        if (!content || 0 == content.numValues) {

            return '';
        }

        var url = '?chco=' + this.colors;
        url    += '&cht=p&chd=t:' + content.percentageValues + '&chdl=' + content.labels + '&chdlp=b';
        url    += '&chf=c,s,ffffff' + '|' + 'bg,s,ffffff&chl=' + content.percentageLabels;
        url    += '&chdls=000000';

        content = null;
        values  = null;

        return this.domain + url.encodeUrlParams();
    };

    /**
     * Exceptionally, the piwik api can be used to display sparklines. It automatically displays sparklines of the
     * last30 days from now on.
     *
     * @param {Int}      siteId      The id of a piwik site.
     * @param {string}   accessUrl   The access URL of a piwik site.
     * @param {string}   tokenAuth   The regarding auth_token of a piwik site.
     *
     * @returns String   The generated url to display a sparkline url.
     */
    this.getSparklineUrl = function (siteId, accessUrl, tokenAuth) {

        var url = '?module=MultiSites&action=getEvolutionGraph&period=day&date=last30&evolutionBy=visits&columns[]=nb_visits&idSite=' + siteId + '&idsite=' + siteId + '&viewDataTable=sparkline&token_auth=' + tokenAuth;

        return accessUrl + url.encodeUrlParams();
    };
};