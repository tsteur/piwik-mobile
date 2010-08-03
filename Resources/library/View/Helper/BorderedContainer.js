/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */

/**
 * @class    View helper which displays a bordered container.
 *
 * @property {Object}   [options]        See {@link View_Helper#setOptions}
 * @property {Int}      [options.top=5]  Optional - Top position of the resulting view
 * 
 * @augments View_Helper
 */
function View_Helper_BorderedContainer () {

    /**
     * Creates a bordered container view.
     *
     * @returns {View_Helper_BorderedContainer} An instance of the current state.
     */
    this.direct  = function () {
        
        var view = Titanium.UI.createView({
            height: 'auto',
            top: this.getOption('top', 5) + 5,
            left: 5,
            right: 5,
            borderWidth: 1,
            borderColor: '#B8B4AB',
            width: this.view.size.width - 10,
            borderRadius: config.theme.borderRadius,
            backgroundColor: config.theme.backgroundColor
        });

        this.subView = view;
        
        return this;
    };
}

/**
 * Extend View_Helper
 */
View_Helper_BorderedContainer.prototype = new View_Helper();
