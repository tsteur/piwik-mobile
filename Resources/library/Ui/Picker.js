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
function Ui_Picker (params) {
    
    this.maxDate = new Date();
    
    this.minDate = new Date(2008, 0, 1);
    
    this.value   = new Date();
    
    this.selectionIndicator = false;
    
    this.period  = 'day';

    this.create = function (params) {
        
        if (!params) {
            params = {};
        }
    
        if (params.maxDate) {
            this.maxDate = params.maxDate;
        }
        
        if (params.period) {
            this.period = params.period;
        }
        
        this.maxDate.setHours(0);
        this.maxDate.setMilliseconds(0);
        this.maxDate.setMinutes(0);
        this.maxDate.setSeconds(0);
        
        if (params.minDate) {
            this.minDate = params.minDate;
        }
        
        this.minDate.setHours(0);
        this.minDate.setMilliseconds(0);
        this.minDate.setMinutes(0);
        this.minDate.setSeconds(0);
        
        if (params.value) {
            this.value = params.value;
        }
        
        var view = this.createView();
        
        this.addTitle(view);
        this.addDateSelector(view);
        this.addButtons(view);
        
        this.setValue(this.value);
        
        Titanium.UI.currentWindow.add(view);
         
        view.show();
        
        return this;
    };
    
    this.createView = function () {

        var view    = Titanium.UI.createView({backgroundColor: '#535253',
                                              borderRadius: config.theme.borderRadius,
                                              borderWidth: 2,
                                              borderColor: '#ffffff'});
        
        view.height = 207;
        view.top    = 50;
        view.width  = 200;
        view.zIndex = 99;
        
        return view;
    };
    
    this.addTitle = function (view) {
        
        this.titleLabel  = Titanium.UI.createLabel({
            text: '',
            height: 32,
            left: 10,
            top: 5,
            right: 10,
            color: '#efefef',
            font: {fontSize: 14, fontFamily: config.theme.fontFamily}
        });
        
        view.add(this.titleLabel);
    };
    
    
    this.updateDisplayedValues = function () {
    
        this.titleLabel.text = this.value.toPiwikDateRangeString(this.period);
        
        this.dayValue.text   = '' + this.value.getDate();
            
        this.monthValue.text = '' + (this.value.getMonth() + 1);
            
        this.yearValue.text  = '' + (this.value.getYear() + 1900);
        
        var activeBgColor    = '#f3f3f3';
        var inactiveBgColor  = '#d4d4d4';
        
        // simulate each possible click
        
        var testMaxYear = this.value;
        testMaxYear.setYear(testMaxYear.getYear() + 1 + 1900);
        
        if (testMaxYear > this.maxDate) {
            this.yearValueAdd.backgroundColor  = inactiveBgColor;
        } else {
            this.yearValueAdd.backgroundColor  = activeBgColor;
        }
        
        var testMinYear = this.value;
        testMinYear.setYear(testMinYear.getYear() - 1 + 1900);
        
        if (testMinYear < this.minDate) {
            this.yearValueSub.backgroundColor  = inactiveBgColor;
        } else {
            this.yearValueSub.backgroundColor  = activeBgColor;
        }
        
        var testMaxMonth = this.value;
        testMaxMonth.setMonth(testMaxMonth.getMonth() + 1);
        
        if (testMaxMonth > this.maxDate) {
            this.monthValueAdd.backgroundColor = inactiveBgColor;
        } else {
            this.monthValueAdd.backgroundColor = activeBgColor;
        }
        
        var testMinMonth = this.value;
        testMinMonth.setMonth(testMinMonth.getMonth() - 1);
        
        if (testMinMonth < this.minDate) {
            this.monthValueSub.backgroundColor = inactiveBgColor;
        } else {
            this.monthValueSub.backgroundColor = activeBgColor;
        }
        
        var testMaxDay = this.value;
        testMaxDay.setDate(testMaxDay.getDate() + 1);
        
        if (testMaxDay > this.maxDate) {
            this.dayValueAdd.backgroundColor   = inactiveBgColor;
        } else {
            this.dayValueAdd.backgroundColor   = activeBgColor;
        }
        
        var testMinDay = this.value;
        testMinDay.setDate(testMinDay.getDate() - 1);
        
        if (testMinDay < this.minDate) {
            this.dayValueSub.backgroundColor   = inactiveBgColor;
        } else {
            this.dayValueSub.backgroundColor   = activeBgColor;
        }
    };
    
    this.setValue = function (value) {
        
        value.setHours(0);
        value.setMilliseconds(0);
        value.setMinutes(0);
        value.setSeconds(0);
        
        if (value >= this.minDate && value <= this.maxDate) {
        
            this.value = value;
            
            var event  = {value: this.value};
            
            this.fireEvent('change', event);
            
            this.updateDisplayedValues();
        }
    };

    this.addDateSelector = function (view) {
        
        var _this     = this;
        
        this.dayValue =  Titanium.UI.createLabel({
            text: '',
            left: 10,
            top: 82,
            width: 50,
            color: '#333333',
            height: 35,
            textAlign: 'center',
            backgroundColor: '#d4d4d4',
            borderColor: '#7a7a7a',
            borderWidth: 1,
            font: {fontSize: 22, fontWeight: 'bold', fontFamily: config.theme.fontFamily},
            zIndex: 3
        });
        
        this.monthValue =  Titanium.UI.createLabel({
            text: '',
            left: 65,
            top: 82,
            width: 50,
            color: '#333333',
            height: 35,
            textAlign: 'center',
            backgroundColor: '#d4d4d4',
            borderColor: '#7a7a7a',
            borderWidth: 1,
            font: {fontSize: 22, fontWeight: 'bold', fontFamily: config.theme.fontFamily},
            zIndex: 3
        });
        
        this.yearValue =  Titanium.UI.createLabel({
            text: '',
            left: 120,
            top: 82,
            width: 70,
            color: '#333333',
            height: 35,
            textAlign: 'center',
            backgroundColor: '#d4d4d4',
            borderColor: '#7a7a7a',
            borderWidth: 1,
            font: {fontSize: 22, fontWeight: 'bold', fontFamily: config.theme.fontFamily},
            zIndex: 3
        });

        this.dayValueAdd =  Titanium.UI.createButton({
            title: '+',
            left: 10,
            top: 52,
            width: 50,
            height: 30,
            color: '#7e7e7e',
            borderColor: '#333333',
            borderWidth: 1,
            font: {fontSize: 20, fontWeight: 'bold', fontFamily: config.theme.fontFamily}
        });
        
        this.dayValueAdd.addEventListener('click', function () {

            var value = _this.value;
            value.setDate(value.getDate() + 1);
            
            _this.setValue(value);
        });
        
        this.monthValueAdd =  Titanium.UI.createButton({
            title: '+',
            left: 65,
            top: 52,
            width: 50,
            height: 30,
            color: '#7e7e7e',
            borderColor: '#333333',
            borderWidth: 1,
            font: {fontSize: 20, fontWeight: 'bold', fontFamily: config.theme.fontFamily}
        });
        
        this.monthValueAdd.addEventListener('click', function () {

            var value = _this.value;
            value.setMonth(value.getMonth() + 1);
            
            _this.setValue(value);
        });
        
        this.yearValueAdd =  Titanium.UI.createButton({
            title: '+',
            left: 120,
            top: 52,
            width: 70,
            height: 30,
            color: '#7e7e7e',
            borderColor: '#333333',
            borderWidth: 1,
            font: {fontSize: 20, fontWeight: 'bold', fontFamily: config.theme.fontFamily}
        });
        
        this.yearValueAdd.addEventListener('click', function () {

            var value = _this.value;
            value.setYear(value.getYear() + 1 + 1900);
            
            _this.setValue(value);
        });

        this.dayValueSub =  Titanium.UI.createButton({
            title: '-',
            left: 10,
            top: 117,
            width: 50,
            height: 30,
            color: '#7e7e7e',
            borderColor: '#333333',
            borderWidth: 1,
            font: {fontSize: 20, fontWeight: 'bold', fontFamily: config.theme.fontFamily}
        });
        
        this.dayValueSub.addEventListener('click', function () {

            var value = _this.value;
            value.setDate(value.getDate() - 1);
            
            _this.setValue(value);
        });
        
        this.monthValueSub =  Titanium.UI.createButton({
            title: '-',
            left: 65,
            top: 117,
            width: 50,
            height: 30,
            color: '#7e7e7e',
            borderColor: '#333333',
            borderWidth: 1,
            font: {fontSize: 20, fontWeight: 'bold', fontFamily: config.theme.fontFamily}
        });
        
        this.monthValueSub.addEventListener('click', function () {

            var value = _this.value;
            value.setMonth(value.getMonth() - 1);
            
            _this.setValue(value);
        });
        
        this.yearValueSub =  Titanium.UI.createButton({
            title: '-',
            left: 120,
            top: 117,
            width: 70,
            height: 30,
            color: '#7e7e7e',
            borderColor: '#333333',
            borderWidth: 1,
            font: {fontSize: 20, fontWeight: 'bold', fontFamily: config.theme.fontFamily}
        });
        
        this.yearValueSub.addEventListener('click', function () {

            var value = _this.value;
            value.setYear(value.getYear() - 1 + 1900);
            
            _this.setValue(value);
        });

        view.add(this.dayValueAdd);
        view.add(this.monthValueAdd);
        view.add(this.yearValueAdd);
        view.add(this.dayValue);
        view.add(this.monthValue);
        view.add(this.yearValue);
        view.add(this.dayValueSub);
        view.add(this.monthValueSub);
        view.add(this.yearValueSub);
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
            width: 70,
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
            left: 90,
            width: 60,
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
            
            Titanium.UI.currentWindow.remove(view);
            
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
    
    params.type   = Ti.UI.PICKER_TYPE_DATE;
    params.bottom = 0;
    
    if ('android' !== Titanium.Platform.osname) {
        
        try {
            picker = Titanium.UI.createPicker(params);
        } catch (e) {
            picker = null;
        }
    } 
    
    if (picker && picker.addEventListener) {
        // iphone
        
        Titanium.UI.currentWindow.add(picker);

        var buttonBar = Titanium.UI.createButtonBar({labels:[_('CoreUpdater_UpdateTitle'), _('SitesManager_Cancel_js')],
                                                     backgroundColor:'#336699',
                                                     bottom:picker.height,
                                                     left: 0,
                                                     right: 0,
                                                     style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
                                                     height:25});
        
        buttonBar.pickerValue = params.value;
        
        picker.addEventListener('change', function (event) {
               buttonBar.pickerValue = event.value;
        });
        
        buttonBar.addEventListener('click', function (event) {
            if (0 == event.index) {
                
                var event = {value: buttonBar.pickerValue};
                
                picker.fireEvent('set', event);
            } 
            
            buttonBar.hide();
            Titanium.UI.currentWindow.remove(picker);
            Titanium.UI.currentWindow.remove(buttonBar);
        });
        
        Titanium.UI.currentWindow.add(buttonBar);
            
        return picker;
    }
    
    // android
    picker = new Ui_Picker(params);
    
    return picker;
    
}
