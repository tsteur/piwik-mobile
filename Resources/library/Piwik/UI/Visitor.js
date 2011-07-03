/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    A visitor is created by the method Piwik.UI.createVisitor. The visitor UI widget displays detailed
 *           information of a single visitor. Like visit date/time, referrer, actions, duration, custom
 *           variables, plugins, screen and more. The visitor information will be rendered into a list of
 *           TableViewRow's. Therefore, you need a TableView in order to display the rendered content.
 *           The rendered rows are accessible via getRows().
 *
 * @param {Object}   params             See {@link Piwik.UI.View#setParams}
 * @param {Object}   params.visitor     An object containing all available visitor information. As returned by the
 *                                      method 'Live.getgetLastVisitsDetails'.
 * @param {string}   params.accessUrl   The url to the piwik installation (to the piwik installation the visit
 *                                      belongs to) containing a trailing slash. For example 'http://demo.piwik.org/'
 *
 * @example
 * var visit = Piwik.UI.createVisitor({visitor: visitor, accessUrl: accessUrl});
 * var rows  = visit.getRows();
 *
 * @augments Piwik.UI.View
 */
Piwik.UI.Visitor = function () {

    /**
     * Holds an array of rendered rows. These rows are accessible via {@link Piwik.UI.Visitor#getRows}
     *
     * @type Array
     *
     * Array (
     *    [int] => [Ti.UI.TableViewRow]
     * )
     */
    this.rows = [];

    /**
     * Initializes and triggers several methods to render the content.
     *
     * @returns {Piwik.UI.Visitor} An instance of the current state.
     */
    this.init = function () {

        var visitor   = this.getParam('visitor');

        if (!visitor) {
            Piwik.Log.warn('visitor is not given', 'Piwik.UI.Visitor::init');
            
            return this;
        }

        this.createOverview();
        this.createCustomVariables();
        this.createSystem();
        this.createActionDetails();

        return this;
    };

    /**
     * Get the list of rendered content/rows. See {@link Piwik.UI.Visitor#rows}
     *
     * @type Array
     */
    this.getRows = function () {

        return this.rows;
    };

    /**
     * Creates an overview of the visitor.
     * Output looks like:
     *
     * $VISITDATE
     * Visitor IP        $IP
     * Visitor Type      $TYPE
     * From              $REFERRER
     * $REFERRERURL
     * Number of Visits  $VISITCOUNT
     * Visit converted   $VISITCONVERTEDVALUE
     * Goals converted   $GOALCONVERSIONS
     * Country           $COUNTRY $COUNTRYFLAGICON
     */
    this.createOverview = function () {
        var visitor   = this.getParam('visitor', {});
        var accessUrl = this.getParam('accessUrl', '');

        var visitDateLabel = String.format('%s - %s (%s)', '' + visitor.serverDatePretty,
                                                           '' + visitor.serverTimePretty,
                                                           '' + visitor.visitDurationPretty);

        this.rows.push(Piwik.UI.createTableViewRow({title: visitDateLabel,
                                                    className: 'visitorTableViewRow'}));

        if (visitor.visitIp) {
            this.rows.push(Piwik.UI.createTableViewRow({title: _('General_VisitorIP'),
                                                        className: 'visitorTableViewRow',
                                                        value: visitor.visitIp}));
        }
        
        if (visitor.visitorType) {
            var visitorTypeText = visitor.visitorType;
            switch (visitor.visitorType) {
                case 'new':
                    visitorTypeText = _('General_NewVisitor');
                    break;

                case 'returning':

                    visitorTypeText = '' + visitor.visitorType;

                    if (visitor.visitCount) {
                        var visits = '' + (parseInt(visitor.visitCount, 10));
                        visits     = String.format(_('VisitsSummary_NbVisits'), visits);

                        visitorTypeText += String.format(' (%s)', visits);
                    }
                    break;
            }

            this.rows.push(Piwik.UI.createTableViewRow({title: _('General_VisitType'),
                                                        className: 'visitorTableViewRow',
                                                        value: visitorTypeText}));
        }

        if (visitor.goalConversions) {
            var goalConversionsText = String.format(_('General_VisitConvertedNGoals'),
                                                    '' + parseInt(visitor.goalConversions, 10));
            this.rows.push(Piwik.UI.createTableViewRow({title: goalConversionsText,
                                                        className: 'visitorTableViewRow'}));
        }

        // @todo display more information about the referrer
        var referrerValue = visitor.referrerName ? visitor.referrerName : visitor.referrerTypeName;

        if (referrerValue) {
            var referrerParams = {title: _('General_FromReferrer'),
                                  className: 'visitorTableViewRow'};

            if (visitor.referrerUrl) {

                if (100 < visitor.referrerUrl.length) {
                    referrerParams.description = visitor.referrerUrl.substr(0, 100) + '...';
                } else {
                    referrerParams.description = visitor.referrerUrl;
                }

                // use vertical layout. Otherwise a long title will overlap the description (url).
                referrerParams.layout    = 'vertical';

                referrerParams.title    += ' ' + referrerValue;
                referrerParams.focusable = true;

            } else {
                 // use value to display referrerValue if no url is given
                 referrerParams.value = referrerValue;
            }

            if (visitor.referrerKeyword) {
                referrerParams.title += String.format(": '%s'", '' + visitor.referrerKeyword);
            }

            var referrerRow = Piwik.UI.createTableViewRow(referrerParams);

            referrerRow.addEventListener('click', function () {
                if (visitor.referrerUrl) {

                    Piwik.getTracker().trackLink('/visitor/referrer-url', 'link');
                    Titanium.Platform.openURL(visitor.referrerUrl);
                }
            });

            this.rows.push(referrerRow);
        }

        if (visitor.country) {
            this.rows.push(Piwik.UI.createTableViewRow({title: _('UserCountry_Country'),
                                                        value: visitor.country,
                                                        className: 'visitorTableViewRow'}));
            // leftImage: {url: accessUrl + visitor.countryFlag}
        }
    };

    /**
     * Displays all custom variables of the user.
     * Output looks like:
     *
     * Custom Variables
     * $VARNAME     $VARVALUE
     * $VARNAME     $VARVALUE
     * $VARNAME     $VARVALUE
     */
    this.createCustomVariables = function () {

        var visitor = this.getParam('visitor', {});

        if (!visitor.customVariables) {

            return;
        }

        this.rows.push(Piwik.UI.createTableViewSection({title: _('CustomVariables_CustomVariables')}));

        for (var customVariableIndex in visitor.customVariables) {

            var customVariable      = visitor.customVariables[customVariableIndex];
            var customVariableName  = customVariable['customVariableName' + customVariableIndex];
            var customVariableValue = customVariable['customVariableValue' + customVariableIndex];

            this.rows.push(Piwik.UI.createTableViewRow({title: customVariableName,
                                                        className: 'visitorTableViewRow',
                                                        value: customVariableValue}));
        }
    };

    /**
     * Creates system information.
     * Output looks like:
     *
     * System
     * OS           $OPERATINGSYSTEM $OPERATINGSYSTEMICON
     * Browser      $BROWSERNAME ($SCREENTYPE) $BROWSERICON
     * Resolution   $RESOLUTION
     * Plugins      $PLUGINICONS
     */
    this.createSystem = function () {

        var visitor   = this.getParam('visitor', {});
        var accessUrl = this.getParam('accessUrl', '');
        
        this.rows.push(Piwik.UI.createTableViewSection({title: _('UserSettings_VisitorSettings')}));

        if (visitor.operatingSystem) {
            this.rows.push(Piwik.UI.createTableViewRow({title: 'OS',
                                                        className: 'visitorTableViewRow',
                                                        value: visitor.operatingSystem}));
            // leftImage: {url: accessUrl + visitor.operatingSystemIcon}
        }

        if (visitor.browserName) {
            this.rows.push(Piwik.UI.createTableViewRow({title: _('UserSettings_ColumnBrowser'),
                                                        className: 'visitorTableViewRow',
                                                        value: visitor.browserName}));
            // leftImage: {url: accessUrl + visitor.browserIcon}
        }
        
        var resolution = visitor.resolution;
        if (resolution &&
            visitor.screenType &&
            'normal' != ('' + visitor.screenType).toLowerCase()) {
            resolution += String.format(' (%s)', ''+ visitor.screenType);
            // accessUrl + visitor.screenTypeIcon
        }

        if (resolution) {
            this.rows.push(Piwik.UI.createTableViewRow({title: _('UserSettings_ColumnResolution'),
                                                        className: 'visitorTableViewRow',
                                                        value: resolution}));
        }

        if (visitor.pluginsIcons && visitor.pluginsIcons.length) {

            var row = Piwik.UI.createTableViewRow({className: 'visitorTableViewRow'});
            row.add(Ti.UI.createLabel({text: _('UserSettings_Plugins'),
                                       id: 'tableViewRowTitleLabel'}));
            
            var right = 10;
            for (var index = 0; index < visitor.pluginsIcons.length; index++) {
                var pluginIcon = visitor.pluginsIcons[index];

                // @todo not all icons are 18x18
                row.add(Ti.UI.createImageView({image: accessUrl + pluginIcon.pluginIcon,
                                               right: right,
                                               width: 14,
                                               height: 14,
                                               className: 'pluginIcon'}));
                right +=28;
            }

            this.rows.push(row);
        }
    };

    /**
     * Triggers the rendering of several actions.
     */
    this.createActionDetails = function () {

        var visitor = this.getParam('visitor', {});
        if (!visitor.actionDetails || !visitor.actionDetails.length) {

            return;
        }

        var numActions = parseInt(visitor.actions, 10);
        
        this.rows.push(Piwik.UI.createTableViewSection({title: String.format(_('VisitsSummary_NbActions'),
                                                                             '' + numActions)}));

        for (var index = 0; index < visitor.actionDetails.length; index++) {
            var actionDetail = visitor.actionDetails[index];

            if (!actionDetail) {
                continue;
            }

            switch (actionDetail.type) {
                case 'action':
                    this.createActionAction(actionDetail, visitor);
                    break;

                case 'ecommerceOrder':
                case 'ecommerceAbandonedCart':
                    this.createEcommerceAction(actionDetail, visitor);
                    break;

                default:
                    this.createDefaultAction(actionDetail, visitor);
                    break;
            }
        }
    };

    /**
     * Renders the 'action' action.
     * Output looks like:
     * 
     * $PAGETITLE
     * $URL
     * $SERVERTIMEPRETTY
     *
     * @param {Object} actionDetail
     */
    this.createActionAction = function (actionDetail) {

        var row = Ti.UI.createTableViewRow({className: 'visitorActionActionTableViewRow'});

        if (actionDetail.pageTitle) {
            row.add(Ti.UI.createLabel({text: '' + actionDetail.pageTitle,
                                       id: 'visitorActionActionPageTitleLabel'}));
        }
        if (actionDetail.url) {
            row.add(Ti.UI.createLabel({text: actionDetail.url,
                                       id: 'visitorActionActionUrlLabel'}));
        }
        if (actionDetail.serverTimePretty) {
            row.add(Ti.UI.createLabel({text: actionDetail.serverTimePretty,
                                       id: 'visitorActionActionServerTimeLabel'}));
        }

        this.rows.push(row);
    };

    /**
     * Renders the 'default' action. For example 'outlink', 'goal' or 'download'.
     * Output looks like:
     *
     * $ICON $TYPE
     * $URL
     *
     * @param {Object} actionDetail
     */
    this.createDefaultAction = function (actionDetail) {

        var accessUrl = this.getParam('accessUrl', '');
        
        var row      = Ti.UI.createTableViewRow({className: 'visitorActionDefaultTableViewRow'});

        var view     = Ti.UI.createView({id: 'visitorActionDefaultHeadlineView'});

        if (accessUrl && actionDetail.icon) {
            view.add(Ti.UI.createImageView({image: accessUrl + actionDetail.icon,
                                            id: 'visitorActionDefaultIconImageView'}));
        }

        if (actionDetail.type) {

            var title = '' + actionDetail.type;

            switch (actionDetail.type) {
                case 'goal':
                    title = _('General_Goal');
                    break;
                
                case 'download':
                    title = _('General_Download');
                    break;

                case 'outlink':
                    title = _('General_Outlink');
                    break;
            }


            view.add(Ti.UI.createLabel({text: title,
                                        id: 'visitorActionDefaultTypeLabel'}));
        }

        row.add(view);

        if (actionDetail.url) {
            row.add(Ti.UI.createLabel({text: '' + actionDetail.url,
                                       id: 'visitorActionDefaultUrlLabel'}));
        }

        this.rows.push(row);
    };

    /**
     * Renders the 'default' action. For example 'outlink' or 'download'.
     * Output looks like:
     *
     * $ICON Ecommerce Order/Abandoned art ($ORDERID)
     * Revenue: $X $CURRENCY, Subtotal: $Y $CURRENCY, $ETC.
     * List of Products (Quantity: $QUANTITY):
     * * $PRODUCT NAME ($PRODUCT SKU), $PRODUCT_CATEGORY
     * $PRICE $CURRENCY - Quantity: $QTY
     * Product 2
     * Product 3 etc.
     *
     * @param {Object} actionDetail
     */
    this.createEcommerceAction = function (actionDetail) {
        var visitor       = this.getParam('visitor', {});
        var accessUrl     = this.getParam('accessUrl', '');
        var row           = Ti.UI.createTableViewRow({className: 'visitorActionEcommerceTableViewRow'});
        var ecommerceView = Ti.UI.createView({id: 'visitorActionEcommerceHeadlineView'});
        var ecommerceText = '';

        switch (actionDetail.type) {
            case 'ecommerceOrder':
                ecommerceText = _('Goals_EcommerceOrder');

                break;

            case 'ecommerceAbandonedCart':
                ecommerceText = _('Goals_AbandonedCart');

                break;

            default:
                ecommerceText = _('Goals_Ecommerce');
        }

        if (actionDetail.orderId) {
            ecommerceText = String.format('%s (%s)', '' + ecommerceText, '' + actionDetail.orderId);
        }

        if (accessUrl && actionDetail.icon) {
            ecommerceView.add(Ti.UI.createImageView({image: accessUrl + actionDetail.icon,
                                                     id: 'visitorActionEcommerceIconImageView'}));
        }

        if (ecommerceText) {
            ecommerceView.add(Ti.UI.createLabel({text: ecommerceText,
                                                 id: 'visitorActionEcommerceTypeLabel'}));
        }

        var itemDetailsView = Ti.UI.createView({id: 'visitorActionEcommerceDetailsView'});

        if (actionDetail.itemDetails) {
            for (var index = 0; index < actionDetail.itemDetails.length; index++) {
                var item     = actionDetail.itemDetails[index];
                var itemText = '';

                if (item.itemName) {
                    itemText += item.itemName + ' ';
                }

                itemText += String.format('(%s)', '' + item.itemSKU);

                if (item.itemCategory) {
                    itemText += ', ' + item.itemCategory;
                }

                var itemView = Ti.UI.createView({id: 'visitorActionEcommerceDetailsItemView'});

                itemView.add(Ti.UI.createLabel({text: ' * ',
                                                id: 'visitorActionEcommerceDetailsItemStarLabel'}));
                itemView.add(Ti.UI.createLabel({text: itemText,
                                                id: 'visitorActionEcommerceDetailsItemNameLabel'}));
                itemDetailsView.add(itemView);

                var priceText = '';

                if (item.price) {
                    priceText += item.price + ' ' + visitor.siteCurrency;
                }

                if (item.price && item.quantity) {
                    priceText += ' - ';
                }

                if (item.quantity) {
                    priceText += 'Quantity: ' + item.quantity;
                }

                itemDetailsView.add(Ti.UI.createLabel({text: priceText,
                                                       id: 'visitorActionEcommerceDetailsPriceLabel'}));
            }
        }

        var revenueText = String.format('%s: %s %s', _('Live_GoalRevenue'),
                                                     '' +  actionDetail.revenue,
                                                     '' + visitor.siteCurrency);
        
        if (actionDetail.revenueSubTotal) {
            revenueText += String.format(', %s: %s %s', _('General_Subtotal'),
                                                        '' + actionDetail.revenueSubTotal,
                                                        '' + visitor.siteCurrency);
        }

        var listOfProductsText = String.format('List of Products (Quantity: %s)',
                                               '' + parseInt(actionDetail.items, 10));

        row.add(ecommerceView);
        row.add(Ti.UI.createLabel({text: revenueText,
                                   id: 'visitorActionEcommerceRevenueLabel'}));
        row.add(Ti.UI.createLabel({text: listOfProductsText,
                                   id: 'visitorActionEcommerceDetailsListLabel'}));
        row.add(itemDetailsView);

        this.rows.push(row);
    };
};

/**
 * Extend Piwik.UI.View
 */
Piwik.UI.Visitor.prototype = Piwik.require('UI/View');