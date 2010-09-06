/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/** 
 * Creates and returns an instance of a Titanium TableViewRow. It does automatically set theme related settings and 
 * handles os specific differences. Extends the default row to set a value. Always use this function if you need a 
 * table row. This ensures the same look and feel in each table view without the need of handling os differences.
 *
 * @param  {Object}   [params]                    See <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.TableViewRow-object.html">Titanium API</a> for a list of all available parameters.
 * @param  {string}   [params.value]              Optional, displays a value within the row.
 * @param  {Object}   [params.rightImage]         Optional, an image to render in the right image area of the row cell.
 * @param  {string}   [params.rightImage.url]     The url (local or remote) to the right image.
 * @param  {number}   [params.rightImage.width]   The width of the right image.
 * @param  {number}   [params.rightImage.height]  The height of the right image.
 * @param  {Object}   [params.leftImage]          Optional, an image to render in the left image area of the row cell.
 * @param  {string}   [params.leftImage.url]      The local url to the left image.
 * @param  {number}   [params.leftImage.width]    The width of the left image.
 * @param  {number}   [params.leftImage.height]   The height of the left image.
 *
 * @example
 * var row = Ui_TableViewRow({title: 'Language',
 *                            hasCheck: true,
 *                            value: 'English'}); // creates an instance of the row
 * row.changeValue('German');                     // changes the value of the row afterwards
 * row.changeTitle('Foobar');                     // changes the title of the row afterwards
 *
 * @returns {Titanium.UI.TableViewRow} A table view row instance extended by the methods 'changeTitle' and 
 *                                     'changeValue'. ChangeValue lets you change the value whereas changeTitle lets you
 *                                     change the title. Please, do not set row.title directly as we use a custom title
 *                                     label to display the title.
 *
 * @todo provide the possiblity to set descriptions which is placed below the title
 */
function Ui_TableViewRow (params) {

    if (!params) {
        params = {};
    }

    var fontSize    = 14;
    var fontWeight  = 'normal';
    
    if ('android' !== Titanium.Platform.osname) {
        fontSize    = 18;
        fontWeight  = 'bold';
        params.selectionStyle = Titanium.UI.iPhone.TableViewCellSelectionStyle.GRAY;
    }

    params.color = config.theme.textColor;
    params.font  = {fontFamily: config.theme.fontFamily, fontSize: fontSize, fontWeight: fontWeight};
    
    var title      = params.title || null;
    var value      = params.value || null;
    var rightImage = params.rightImage || null;
    var leftImage  = params.leftImage || null;
        
    delete params.title;
    delete params.value;
    delete params.rightImage;
    delete params.leftImage;

    var row = Titanium.UI.createTableViewRow(params);
    
    /** @memberOf Titanium.UI.TableViewRow */
    row.changeTitle = function (title) {
    
        if (!this.titleLabel && (title || '' === title)) {

            this.titleLabel = Titanium.UI.createLabel({
                font: {fontFamily: config.theme.fontFamily, fontSize: fontSize, fontWeight: fontWeight},
                text: title,
                textAlign: 'left',
                width: 'auto',
                height: 'auto',
                left: 0,
                color: params.color
            });
            
            if ('android' !== Titanium.Platform.osname) {
                this.titleLabel.left = 10;
            }
            
            if (('undefined' !== (typeof leftImage)) && leftImage && leftImage.width) {
                 this.titleLabel.left = this.titleLabel.left + 10 + leftImage.width;
            }
            
            this.add(this.titleLabel);
            
        } else if (this.titleLabel && (title || '' === title)) {
        
            this.titleLabel.text = title;
            
        } else if (this.titleLabel && !title) {
        
            this.remove(this.titleLabel);
            this.titleLabel = null;
        }
    };
    
    /** @memberOf Titanium.UI.TableViewRow */
    row.changeValue = function (value) {
    
        if (!this.valueLabel && (value || '' === value)) {

            this.valueLabel = Titanium.UI.createLabel({
                right: 35,
                font: {fontFamily: config.theme.fontFamily, fontSize: fontSize, fontWeight: fontWeight},
                text: value,
                textAlign: 'left',
                width: 'auto',
                height: 'auto',
                color: config.theme.titleColor
            });
            
            if ('android' !== Titanium.Platform.osname) {
                this.valueLabel.right = 10;
            } 
            
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
    
    if (rightImage && 'android' === Titanium.Platform.osname) {
        
        row.rightImage = rightImage.url;
        
    } else if (rightImage) {

        var rowRightImage = Titanium.UI.createImageView({width: rightImage.width,
                                                         height: rightImage.height,
                                                         image: rightImage.url,
                                                         right: 5});
        row.add(rowRightImage);
    }
    
    if (leftImage && leftImage.url) {
        
        row.leftImage = leftImage.url;
    } 
    
    return row;
};

