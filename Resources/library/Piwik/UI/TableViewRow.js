/**
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/** 
 * Creates and returns an instance of a Titanium TableViewRow. It does automatically set theme related settings and 
 * handles os specific differences. Extends the default row to set a value and description. Always use this function if
 * you need a table row. This ensures the same look and feel in each table view without the need of handling os
 * differences.
 *
 * @param  {Object}   [params]                    See <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.TableViewRow-object.html">Titanium API</a> for a list of all available parameters.
 * @param  {string}   [params.value]              Optional. Displays a value within the row.
 * @param  {string}   [params.description]        Optional. Displays a description within the row.
 * @param  {Object}   [params.rightImage]         Optional. An image to render in the right image area of the row cell.
 * @param  {string}   [params.rightImage.url]     The url (local or remote) to the right image.
 * @param  {number}   [params.rightImage.width]   The width of the right image.
 * @param  {number}   [params.rightImage.height]  The height of the right image.
 * @param  {Object}   [params.leftImage]          Optional, an image to render in the left image area of the row cell.
 * @param  {string}   [params.leftImage.url]      The local url to the left image.
 *
 * @example
 * var row = Piwik.Ui.createTableViewRow({title: 'Language',
 *                                        hasCheck: true,
 *                                        value: 'English'}); // creates an instance of the row
 * row.changeValue('German');                                 // changes the value of the row afterwards
 * row.changeTitle('Foobar');                                 // changes the title of the row afterwards
 * row.changeDescription('Foobar');                           // changes the description of the row afterwards
 *
 * @returns {Titanium.UI.TableViewRow} A table view row instance extended by the methods 'changeTitle' and 
 *                                     'changeValue'. ChangeValue lets you change the value whereas changeTitle lets you
 *                                     change the title. Please, do not set row.title directly as we use a custom title
 *                                     label to display the title.
 */
Piwik.UI.TableViewRow = function () {

    /**
     * Create and render the TableViewRow depending on the defined parameters.
     * 
     * @param    {Object}    See {@link Piwik.UI.TableViewRow}
     */
    this.init = function (params) {
        
        if (!params) {
            params = {};
        }

        if (Piwik.isIos) {
            // @todo define this in jss
            params.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY;
        }

        var title       = params.title || null;
        var value       = params.value || null;
        var description = params.description || null;
        var rightImage  = params.rightImage || null;
        var leftImage   = params.leftImage || null;

        // we handle those parameters ourselves... therefore we delete them and don't pass them to TableViewRow creation
        delete params.title;
        delete params.value;
        delete params.description;
        delete params.rightImage;
        delete params.leftImage;

        var row = Ti.UI.createTableViewRow(params);

        /** @memberOf Titanium.UI.TableViewRow */
        row.changeTitle = function (title) {

            if (!this.titleLabel && (title || '' === title)) {
                // no title label already exists

                this.titleLabel = Ti.UI.createLabel({
                    text: title,
                    id: 'tableViewRowTitleLabel' + (description ? 'WithDescription' : '')
                });

                this.add(this.titleLabel);
            }

            if (this.titleLabel && (title || '' === title)) {
                // title label already exists, we can simply overwrite the title

                this.titleLabel.text = title;

            } else if (this.titleLabel && !title) {
                // we have to remove the title label cause title is empty

                this.remove(this.titleLabel);
                this.titleLabel = null;
            }
        };

        /** @memberOf Ti.UI.TableViewRow */
        row.changeDescription = function (description) {

            if (!this.descriptionLabel && (description || '' === description)) {

                this.descriptionLabel = Ti.UI.createLabel({
                    text: description,
                    id: 'tableViewRowDescriptionLabel'
                });

                this.add(this.descriptionLabel);
            }

            if (this.descriptionLabel && (description || '' === description)) {

                this.descriptionLabel.text = description;

            } else if (this.descriptionLabel && !description) {

                this.remove(this.descriptionLabel);
                this.descriptionLabel = null;
            }
        };

        /** @memberOf Titanium.UI.TableViewRow */
        row.changeValue = function (value) {

            if (!this.valueLabel && (value || '' === value)) {

                this.valueLabel = Ti.UI.createLabel({
                    text: value,
                    id: 'tableViewRowValueLabel'
                });

                this.add(this.valueLabel);

            } else if (this.valueLabel && (value || '' === value)) {

                this.valueLabel.text = value;

            } else if (this.valueLabel && !value) {

                this.remove(this.valueLabel);
                this.valueLabel = null;
            }
        };

        row.changeTitle(title);
        row.changeValue(value);
        row.changeDescription(description);

        if (params.onShowOptionMenu && Piwik.isAndroid) {
            // there is no native event 'onShowOptionMenu' available in Titanium, therefore we 'fake' it
            row.addEventListener('touchstart', function (event) {

                if (row.accountId) {
                    row.optionTimeout = setTimeout(function () {
                        params.onShowOptionMenu.apply(row, [event]);
                    }, 1000);
                }
            });

            row.addEventListener('touchend', function (event) {
                if (row.optionTimeout) {
                    clearTimeout(row.optionTimeout);
                    delete row.optionTimeout;
                }
            });

            row.addEventListener('touchcancel', function (event) {
                if (row.optionTimeout) {
                    clearTimeout(row.optionTimeout);
                    delete row.optionTimeout;
                }
            });
        } 

        if (rightImage && rightImage.url) {

            var rowRightImage = Ti.UI.createImageView({width: rightImage.width,
                                                       height: rightImage.height,
                                                       image: rightImage.url,
                                                       id: 'tableViewRowRightImage'});
            row.add(rowRightImage);
        }

        if (leftImage && leftImage.url) {

            row.leftImage = leftImage.url;
        }

        return row;
    };
};