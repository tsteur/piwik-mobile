/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class   Titanium Mobile 1.4 does not support Date Picker in Android. Therefore we created a custom
 *          Date Picker for Anrdoid which looks similar. We are planning to remove the whole class as soon as
 *          Titanium supports Date Picker in Android (we expect it in Titanium Mobile 1.5.0). The interface is  
 *          similar to Titaniu.UI.Picker. Have a look at this documentation if something is unclear.
 * 
 * @todo remove this class as soon as Date Picker is supported in Android
 * 
 * @see <a href="http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.Picker-object">Titanium.UI.Picker</a>
 */
function Ui_Picker (params, win) {
    
    this.selectionIndicator = false;
    
    this.period  = 'day';

    this.create = function (params) {
    
        if (params.value) {
            this.value = params.value;
        }
        
        var view = this.createView();
        
        this.addTitle(view);
        this.addDateSelector(view, params);
        this.addButtons(view);
        
        this.setValue(this.value);
        
        win.add(view);
         
        view.show();
        
        return this;
    };
    
    this.createView = function () {

        var view    = Titanium.UI.createView({backgroundColor: '#535253',
                                              borderRadius: config.theme.borderRadius,
                                              borderWidth: 2,
                                              borderColor: '#ffffff'});
        
        view.height = 230;
        view.top    = 50;
        view.width  = 275;
        view.zIndex = 99;
        
        return view;
    };
    
    this.addTitle = function (view) {
        
        this.titleLabel  = Titanium.UI.createLabel({
            text: '',
            height: 32,
            left: 10,
            top: 5,
            color: '#efefef',
            width: 240,
            font: {fontSize: 14, fontFamily: config.theme.fontFamily}
        });
        
        view.add(this.titleLabel);
    };
    
    
    this.updateDisplayedValues = function () {
    
        this.titleLabel.text = this.value.toPiwikDateRangeString(this.period);
    };
    
    this.setValue = function (value) {
    
        this.value = value;
        
        var event  = {value: this.value};
        
        this.updateDisplayedValues();
    };

    this.addDateSelector = function (view, params) {
        
        var _this    = this;
        params.top   = 45;
        params.left  = 7;
        
        var picker = Titanium.UI.createPicker(params);
        
        picker.addEventListener('change', function (event) {
            _this.setValue(event.value);
        });
        
        view.add(picker);
    };
    
    this.addButtons = function (view) {
        
        var buttonBarView = Titanium.UI.createView({backgroundColor: '#dddddd',
                                                    left: 2,
                                                    right: 2,
                                                    bottom: 2,
                                                    height: 40});
        
        view.add(buttonBarView);
        
        this.setValueButton =  Titanium.UI.createButton({
            title: _('CoreUpdater_UpdateTitle'),
            left: 10,
            top: 5,
            width: 120,
            height: 30,
            color: '#333333',
            backgroundColor: '#f3f3f3',
            borderColor: '#333333',
            borderWidth: 1,
            font: {fontSize: 10, fontWeight: 'bold', fontFamily: config.theme.fontFamily}
        });
        
        var _this = this;
        
        this.setValueButton.addEventListener('click', function () {
            
            var event = {value: _this.value};
            _this.fireEvent('set', event);
            
            _this.cancelButton.fireEvent('click', {});
        });
        
        this.cancelButton =  Titanium.UI.createButton({
            title: _('SitesManager_Cancel_js'),
            width: 120,
            top: 5,
            right: 10,
            height: 30,
            color: '#333333',
            backgroundColor: '#f3f3f3',
            borderColor: '#333333',
            borderWidth: 1,
            font: {fontSize: 10, fontWeight: 'bold', fontFamily: config.theme.fontFamily}
        });
        
        this.cancelButton.addEventListener('click', function () {
            
            view.hide();
            
            win.remove(view);
            
            view = null;
        });
        
        buttonBarView.add(this.setValueButton);
        buttonBarView.add(this.cancelButton);
    };
    
    this.addEventListener = function (name, callback) {
        name = 'picker' + name;
        
        if (this.setValueButton) {
            this.setValueButton.addEventListener(name, callback);
        }
    };
    
    this.fireEvent = function (name, event) {
        name = 'picker' + name;

        if (this.setValueButton) {
            this.setValueButton.fireEvent(name, event);
        }
    };
    
    this.create(params);
};

/**
 * Acts a bit like a factory or strategy pattern. Creates a Date Picker depending on the os. 
 * It detects automatically whether it can use the Titanium.UI.Picker (if supported by Titanium) or the 
 * clone Ui_Picker.
 * 
 * Beyond that it provides an additional event 'set' which is fired when the user saves the adjusted value.
 * 
 * @example
 * var picker = create_Ui_Picker({ // picker parameters });
 * picker.addEventListener('set', function () { //do something with the new value });
 */
function create_Ui_Picker(params) {
    
    var picker;
    
    var view      = params.view;
    delete params.view;
    params.type   = Ti.UI.PICKER_TYPE_DATE;
    params.bottom = 0;
    
    if ('android' !== Titanium.Platform.osname) {
        params.zIndex = 102;

        try {
            picker = Titanium.UI.createPicker(params);
        } catch (e) {
        
            try {
                picker = new Ui_Picker(params);
                
                return picker;
            } catch (exception) {}
        
            return;
        }
        
        view.add(picker);
        
        var update = Titanium.UI.createButton({
            title:_('CoreUpdater_UpdateTitle'),
            systemButton:Titanium.UI.iPhone.SystemButton.DONE
        });

        var cancel = Titanium.UI.createButton({
            title:_('SitesManager_Cancel_js'),
            style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED                
        });
       
        var flexSpace = Titanium.UI.createButton({
            systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
        });

        var toolbar = Titanium.UI.createToolbar({
            items: [cancel, flexSpace, update],
            bottom: picker.height,
            zIndex: 101,
            borderTop: true,
            borderBottom: false,
            translucent: true,
            barColor: '#999'
        });
        
        view.add(toolbar);

        update.pickerValue = params.value;
        
        picker.addEventListener('change', function (event) {
            update.pickerValue = event.value;
        });
        
        cancel.addEventListener('click', function (event) {
            toolbar.hide();
            view.remove(picker);
            view.remove(toolbar);
        });
        
        update.addEventListener('click', function (event) {
            var myEvent = {value: update.pickerValue};
                           
            toolbar.hide();
            picker.fireEvent('set', myEvent); 
            view.remove(picker);
            view.remove(toolbar);
        });
            
        return picker;
    }
    
    // android
    picker = new Ui_Picker(params, view);
    
    return picker;
    
}
