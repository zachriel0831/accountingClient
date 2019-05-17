import React from 'react';
import ValidRules from './ValidationRules';
import ValidationSet from './ValidationSet';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import utils from '../../../util/utils.js'
module.exports = ComposeComponent => class extends ComposeComponent {
  constructor(props) {
    super(props);
    this.state = {
      _value: this.getDefaultValue(),
      invalid: false,
      errorMessage: "",
      validateByChild: false
    };
    this.resetCalled = false;
    this.errorMessage = "";
  }
  static contextTypes = {
    bankeeForm: PropTypes.object,
    txnEmitter: PropTypes.object,
    formEmitter: PropTypes.object,
    displayBlock: PropTypes.object,
    gridRowEmitter: PropTypes.object,
    Accordion: PropTypes.object,
    alert:PropTypes.func
  }
  static defaultProps = {
    value: null,
    displayName: '',
    memo: '',
    placeholder: '',
    addClass: '',
    hideLabel: false,
    required: false,
    visible: true,
    disabled: false,
    history: true,
    minify: false,
    divStyle: {},
    sendToServer: true,
    validation: {},
    validationError: {}
  }

  //欄位值是否由最上層State控制?
  valueFromGlobalState() {
    return !(this.props.value === undefined || this.props.value === null);
  }

  //初始值
  initialValue = null;
  //取得標籤名稱
  getDisplayName() {
    return this.props.displayName;
  }
  //取得欄位值
  getValue() {
    
    if (this.valueFromGlobalState()) {
      return this.props.value;
    } else {
      return this.state._value;
    }
  }
  //取得上送Server的欄位值
  getSendValue() {
    if (typeof this.props.overWriteSendData == 'function') {
      return this.props.overWriteSendData(this);
    } else if (typeof this.overWriteSendData_Com == 'function') {
      return this.overWriteSendData_Com(this);
    }
    var currentValue = this.getValue();
    if (this.props.capital) {
      currentValue = currentValue.toUpperCase();
    }
    return currentValue;
  }
  //設定欄位值
  setValue(values) {
    this.resetCalled = false;
    if (this.valueFromGlobalState()) {
      var data = {};
      data.name = this.context.bankeeForm.name + '_' + this.props.name;
      data.value = values;
      this.context.txnEmitter.emit('setStateByName', data);
    } else {
      this.setState({
        _value: values
      });
    }




    if (typeof this.props.doAfterSetValue == 'function') {
      this.props.doAfterSetValue(values);
    }

    this.doValidate(values, false);

  }
  //取得預設值(只有在valueFromGlobalState == false 時，有作用)
  getDefaultValue() {
    if (this.props.defaultValue) {
      return this.props.defaultValue;
    } else {
      //若下拉選單，未定義預設值，則以第一筆Option-Value為初始值
      if (this.fieldType == 'select') {
        if (this.props.blankOption === undefined || this.props.blankOption === null) {
          var filtedOptions = this.getFiltedOptions();
          if (filtedOptions.length > 0) {
            return filtedOptions[0].value;
          }
        }
      } else if (this.fieldType == 'radio') {
        var radios = this.props.radioData;
        for (var i = 0; i < radios.length; i++) {
          if (!this.isRadioButtonDisabled(radios[i].value)) {
            return radios[i].value;
          }
        }
      } else if (this.fieldType == 'check') {
        return false;
      } else if (this.fieldType == 'checkGroup') {
        return [];
      }
    }
    return '';
  }
  //重設欄位值為初始值
  resetValue() {
    if (this.fieldType == 'file') {
      this.clearFile();
    } else {
      this.setValue(this.initialValue);
    }
    this.resetCalled = true;
    this.clearValidError();
  }
  //此欄位目前是否開啟檢核功能(包含必輸)
  isValidationOn() {
    //欄位disabled or visible=false時，不檢核
    if (this.props.disabled || (!this.props.visible)) {
      return false;
    }

    //若欄位在displayBlock內，且displayBlock隱藏時，不檢核
    if (this.context.displayBlock != undefined) {
      if (this.context.displayBlock.checkIsHidden()) {
        return false;
      }
    }

    try {
      if (this.context.Accordion == undefined) {
        if ($(ReactDOM.findDOMNode(this)).is(':visible') == false && this.getValue() == '') {
          return false;
        } else {
          if ($(ReactDOM.findDOMNode(this)).is(':visible') == false) {
            $(ReactDOM.findDOMNode(this)).parents('div.content-collpase-widget').first().find('div.header-bg-line').find('div.header-style-circle-text-wrap.js-toggle-collpase-widget').click();
          }
        }
      }
    } catch (e) {
      console.log(e);
    }

    //AccountSelectGroup元件，選中的元件才開啟檢核
    if (typeof this.props.checkAccTypeActive == 'function') {
      return this.props.checkAccTypeActive();
    }

    //若欄位有設定isValidate，則以欄位的isValidate為準，否則以form的isValidate判斷
    if (this.props.hasOwnProperty('isValidate')) {
      return (this.props.isValidate);
    } else {
      return this.context.bankeeForm.isValidate();
    }
  }
  getValidationObject() {
    var v1 = {};
    if (typeof this.props.validationSet == 'string') {
      v1 = ValidationSet[this.props.validationSet]['validation'];
    }
    var v2 = this.props.validation;
    var v3 = {};
    for (var attrname in v1) {
      v3[attrname] = v1[attrname];
    }
    for (var attrname_2 in v2) {
      v3[attrname_2] = v2[attrname_2];
    }
    return v3;
  }
  getValidationErrorObject() {
    var v1 = {};
    if (typeof this.props.validationSet == 'string') {
      v1 = ValidationSet[this.props.validationSet]['validationError'];
    }
    var v2 = this.props.validationError;
    var v3 = {};
    for (var attrname in v1) {
      v3[attrname] = v1[attrname];
    }
    for (var attrname_2 in v2) {
      v3[attrname_2] = v2[attrname_2];
    }
    return v3;
  }
  doValidate(currentValue, firstNotFound) {
    var validResult = {
      invalid: false,
      errorMessage: ''
    };

    if (this.isValidationOn()) {
      // var validation = this.props.validation;
      // var errMsg = this.props.validationError;
      var validation = this.getValidationObject();
      var errMsg = this.getValidationErrorObject();
      var required = this.props.required;
      var inputValue = currentValue;

      if (this.state.validateByChild) {
        validResult.invalid = this.state.invalid;
        validResult.errorMessage = this.state.errorMessage;
      }

      if (!this.runValidate('required', inputValue, required, firstNotFound)) {
        validResult.invalid = true;
        if (errMsg['required'] === undefined) {
          validResult.errorMessage = "此欄位為必輸";
        } else if (typeof errMsg['required'] === 'function') {
          var unFormMsg = errMsg['required'](this.getDisplayName(), inputValue, this.props.name);
          validResult.errorMessage = this.formateErrMsg(unFormMsg, inputValue);
        } else {
          validResult.errorMessage = this.formateErrMsg(errMsg['required'], inputValue);
        }

        this.setState(validResult);
        this.errorMessage = validResult.errorMessage;
        return validResult;
      }

      for (let validType in validation) {
        if (!this.runValidate(validType, inputValue, validation[validType], firstNotFound)) {
          validResult.invalid = true;
          if (errMsg[validType] === undefined) {
            validResult.errorMessage = i18next.t('comConstants:FieldMixin_validType');
          } else if (typeof errMsg[validType] === 'function') {
            var unFormMsg = errMsg[validType](this.getDisplayName(), inputValue, this.props.name);
            validResult.errorMessage = this.formateErrMsg(unFormMsg, inputValue);
          } else {
            validResult.errorMessage = this.formateErrMsg(errMsg[validType], inputValue);
          }
          this.setState(validResult);
          this.errorMessage = validResult.errorMessage;
          return validResult;
        }
      }
    }

    this.setState(validResult);
    return validResult;
  }

  //執行檢核(輸入: 檢核類別，欄位值，檢核參數內容)，回傳TRUE:檢核通過;FALSE:檢核失敗
  runValidate(validType, fieldValue, validContent, firstNotFound) {

    if (validContent === false) { //validContent為false 表示跳過此檢核項目
      return true;
    }

    //if get value from CheckBoxGroup
    if (typeof fieldValue == 'object') {
      fieldValue = fieldValue.toString();
    }

    var accordion = this.context.Accordion;

    if (validType == 'required') { //先判斷是否有必輸，有則先檢核必輸
      //if checkbox is set to required
      if (this.fieldType == 'check') {
        if (fieldValue == false) {
          //if inside Accordion component and first invalidate field
          //has not found yet, open the corresponding panel
          if (accordion != undefined && firstNotFound) {
            //dont click the panel again if it is already opened
            if ($('#' + accordion.pageId + '_tab').attr('aria-expanded') == 'false') {
              $('#' + accordion.pageId + '_tab').click();
            }
          }
          return false;
        }
        return true;
      }
      if (ValidRules.isEmptyString(fieldValue)) {
        //if inside Accordion component and first invalidate field
        //has not found yet, open the corresponding panel
        if (accordion != undefined && firstNotFound) {
          //dont click the panel again if it is already opened
          if ($('#' + accordion.pageId + '_tab').attr('aria-expanded') == 'false') {
            $('#' + accordion.pageId + '_tab').click();
          }
        }
        return false;
      }
      return true;
    }

    if (ValidRules.hasOwnProperty(validType)) {
      
      //共用檢核項目
      if (!ValidRules[validType](fieldValue, validContent)) {
        //if inside Accordion component and first invalidate field
        //has not found yet, open the corresponding panel
        if (accordion != undefined && firstNotFound) {
          //dont click the panel again if it is already opened
          if ($('#' + accordion.pageId + '_tab').attr('aria-expanded') == 'false') {
            $('#' + accordion.pageId + '_tab').click();
          }
        }
        return false;
      }
      return true;
    } else if (typeof validContent === 'function') {
      //自訂義檢核函式
      if (!validContent(fieldValue, validType)) {
        //if inside Accordion component and first invalidate field
        //has not found yet, open the corresponding panel
        if (accordion != undefined && firstNotFound) {
          //dont click the panel again if it is already opened
          if ($('#' + accordion.pageId + '_tab').attr('aria-expanded') == 'false') {
            $('#' + accordion.pageId + '_tab').click();
          }
        }
        return false;
      }
      return true;
    } else {
      //定義錯誤回false
      return false;
    }
  }
  getAccordionPageId() {
    if (this.context.Accordion != undefined) {
      return this.context.Accordion.pageId;
    }
    return undefined;
  }
  clearValidError() {
    this.setState({
      invalid: false,
      errorMessage: ''
    });
  }
  formateErrMsg(msg, inputValue) {
    return msg.replace(new RegExp('%value', 'g'), inputValue).replace(new RegExp('%name', 'g'), this.getDisplayName());
  }
  componentWillMount() {
    this.initialValue = this.getValue(); //將初始欄位值儲存

    if (this.context.gridRowEmitter != undefined) {
      this.context.gridRowEmitter.emit('attachToGridRow', this);
    } else {
      this.context.formEmitter.emit('attachToForm', this);
    }

    if (this.context.displayBlock != undefined) {
      this.context.displayBlock.attachToBlock(this);
    }
  }
  componentDidMount() {
    console.log("-------------componentDidMount---------------");
    
    if (this.fieldType == 'select') {
      $('select.grey').each(function(){
        if($(this).hasClass("select-popup")){
          if($(this).val()){
            $(this).attr("class", "grey select-popup selected");
          }else{
            $(this).attr("class", "grey select-popup");
          }
        }else{
          if($(this).val()){
            $(this).attr("class", "grey selected");
          }else{
            $(this).attr("class", "grey");
          }
        }
      });
      
      $('select.grey').on("change", function(){
        if($(this).hasClass("select-popup")){
          if($(this).val()){
            $(this).attr("class", "grey select-popup selected");
          }else{
            $(this).attr("class", "grey select-popup");
          }
        }else{
          if($(this).val()){
            $(this).attr("class", "grey selected");
          }else{
            $(this).attr("class", "grey");
          }
        }
      });
      
      
      $('select.select-popup').on("click", function(){
        $('.overlay').show();
        $(this).siblings(".select-list").show();
      });
      $('.select-list button').on("click", function(){
        $('.overlay').hide();
        $('.select-list').hide();
      });
      $('.select-list ul li').on("click", function(){
        $(this).addClass("active").siblings().removeClass("active");
        // index = $(this).index();
        // console.log(index);
        val = $(this).attr("select-val");
        // console.log($(this).parents(".select-list").siblings('select').val(val));
        opSelect = $(this).parents(".select-list").siblings('select');
        opSelect.val(val);
        if(opSelect.val()){
          opSelect.attr("class", "grey select-popup selected");
        }else{
          opSelect.attr("class", "grey select-popup");
        }
        $('.overlay').hide();
        $('.select-list').hide();
        
        
      });
    } else if (this.fieldType == 'date') {
      
    } else if (this.fieldType == 'month') {
      
    }
  }

  componentDidUpdate(prevProps, prevState, rootNode) {
    try {
      if (JSON.stringify(this.props.validation) != JSON.stringify(prevProps.validation)) {
        this.doValidate(this.getValue(), false);
      }
    } catch (e) {
      //若有Exception應為JSON.stringify轉換問題，某些validation無法轉換，則不做validate
      console.warn('FieldMixin - componentDidUpdate: JSON stringify error, validation check might be skipped');
      this.getValue();
    }
  }
  //override scrollIntoView function
  // scrollIntoView() {
  //   var node = ReactDOM.findDOMNode(this);
  //   if (this.fieldType == 'select') {
  //     $(node).find('select')[0].scrollIntoView();
  //   } else if (this.fieldType == 'radio' || this.fieldType == 'checkGroup' || this.fieldType == 'checkGroupSingle') {
  //     $(node).find('ul')[0].scrollIntoView();
  //   } else if (this.fieldType == 'text' || this.fieldType == 'check' || this.fieldType == 'date' || this.fieldType == 'file' || this.fieldType == 'month' || this.fieldType == 'password') {
  //     $(node).find('input')[0].scrollIntoView();
  //   } else if (this.fieldType == 'textarea') {
  //     $(node).find('textarea')[0].scrollIntoView();
  //   }
  //   //scoll element to the middle of the window view
  //   var windowHeight = $(window).height();
  //   var currentPosition = $(window).scrollTop();
  //   $(window).scrollTop(currentPosition - windowHeight / 2);
  // }

  showError() {
    console.log(this.props.displayName);
    var name = this.props.displayName;
    if( name === '' || name === undefined || name === null){
      name = '';
    }else{
      name = name ;

    }
    
    if(this.props.displayName.indexOf('一次性簡訊密碼') != -1){
      this.errorMessage = '請輸入一次性簡訊密碼！'
    }

    if(utils.isAppleMobile()){
      var _this = this;

      if(utils.isWebView()){
         alert(name + this.errorMessage);

      }else{
        this.context.alert(name,this.errorMessage);

      }

    }else{
      if(utils.isWebView()){
        alert(name + this.errorMessage);
     }else{
       this.context.alert(name,this.errorMessage);
     }
   }

  }

  render() {
    let functions = {
      valueFromGlobalState: () => {return this.valueFromGlobalState()},
      doValidate: (value, firstNotFound) => {return this.doValidate(value, firstNotFound)},
      getDisplayName: () => { return this.getDisplayName() },
      getValue: () => { return this.getValue() },
      setValue: (val) => { this.setValue(val) } 
    }

    return (
      <ComposeComponent { ...this.props} { ...this.state} {...this.context} {...functions}/>
    );
  }
};