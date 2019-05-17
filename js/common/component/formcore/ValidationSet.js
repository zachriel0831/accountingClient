/*-----密碼檢核START-----*/
var pwAllowStrCheck = function(value){
  //UTF-16 number ：33-126
  for(var i=0;i < value.length;i++){
    var uni16 = value.charCodeAt(i);
    if(uni16 < 33 || uni16 > 126){
      return false;
    }
  }
  return true;
};

var pwStrTypeCheck = function(value){
  if(value.length == 0){
    return true;
  }
  var engN = 0;
  var numN = 0;

  for(var i=0;i < value.length;i++){
    var uni16 = value.charCodeAt(i);
    if(uni16 >= 48 && uni16 <= 57){
      numN++;
    }else if(uni16 >= 33 && uni16 <= 126){
      engN++;
    }
  }

  return (engN > 0 && numN > 0);
};

var pwStrComplexCheck = function(value){
  var iLength = value.length;
  for(var i=0 ; i < iLength ; i++){
  	if (i <= iLength-3){
  		var cToken1 = value.charCodeAt(i);
  		var cToken2 = value.charCodeAt(i+1);
  		var cToken3 = value.charCodeAt(i+2);

  		if (cToken1 == cToken2 && cToken2 == cToken3){
  			return 1;
  		}else if((cToken1+1) == cToken2 && (cToken2+1) == cToken3){
				return 2;
			}else if((cToken1-1) == cToken2 && (cToken2-1) == cToken3){
				return 2;
			}
  	}
  }
  return 0;
};

var pwStrRepeatCheck = function(value){
  return pwStrComplexCheck(value) != 1;
};

var pwStrSortCheck = function(value){
  return pwStrComplexCheck(value) != 2;
};
/*-----密碼檢核END-----*/

/*-----使用者代號檢核START-----*/

var isEng = function(uni16){
  if(uni16 >= 65 && uni16 <= 90){
    return true;
  }else{
    return false;
  }
};

var uidAdminCheck = function(value){
  var valueC = value.toUpperCase();
  return valueC != "ADMIN";
};

var uidStrTypeCheck = function(value){
  var valueC = value.toUpperCase();
  if(valueC.length == 0){
    return true;
  }
  var engN = 0;
  var numN = 0;

  for(var i=0;i < valueC.length;i++){
    var uni16 = valueC.charCodeAt(i);
    if(uni16 >= 48 && uni16 <= 57){
      numN++;
    }else if(uni16 >= 65 && uni16 <= 90){
      engN++;
    }
  }

  return (numN <= 0 || engN > 0);
};

var uidStrComplexCheck = function(value){
  var valueC = value.toUpperCase();
  var iLength = valueC.length;
  for(var i=0 ; i < iLength ; i++){
  	if (i <= iLength-6){
      var cToken1 = valueC.charCodeAt(i);
    	var cToken2 = valueC.charCodeAt(i+1);
    	var cToken3 = valueC.charCodeAt(i+2);
    	var cToken4 = valueC.charCodeAt(i+3);
    	var cToken5 = valueC.charCodeAt(i+4);
    	var cToken6 = valueC.charCodeAt(i+5);
    	//名稱全部都是英文才需要檢核連續(含升冪或降冪)
    	if(isEng(cToken1) && isEng(cToken2) && isEng(cToken3) && isEng(cToken4) && isEng(cToken5) && isEng(cToken6) ){
    		if (cToken1 == cToken2 && cToken2 == cToken3 && cToken3 == cToken4 && cToken4 == cToken5 && cToken5 == cToken6){
          return 1;
    		}else if((cToken1+1) == cToken2 && (cToken2+1) == cToken3 && (cToken3+1) == cToken4 && (cToken4+1) == cToken5 && (cToken5+1) == cToken6){
          return 2;
    		}else if((cToken1-1) == cToken2 && (cToken2-1) == cToken3 && (cToken3-1) == cToken4 && (cToken4-1) == cToken5 && (cToken5-1) == cToken6){
    			return 2;
    		}
    	}
  	}
  }
  return 0;
};

var uidStrRepeatCheck = function(value){
  return uidStrComplexCheck(value) != 1;
};

var uidStrSorttCheck = function(value){
  return uidStrComplexCheck(value) != 2;
};

var dateFormat = function(value){
  return (/^([1-9][0-9]{3}\/(0[1-9]|1[012])\/(0[1-9]|1[0-9]|2[0-9]|3[01]))?$/).test(value);
};

var monthFormat = function(value) {
  return (/^([1-9][0-9]{3}\/(0[1-9]|1[012]))?$/).test(value);
};

var validateDate = function(value) {
  if(value.length == 10){
    var dateArr = value.split('/');
    var dateObj = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
    return (dateObj.getMonth() + 1) == dateArr[1];
  }
  return true;
};

/*-----使用者代號檢核END-----*/

var validationSet = {
  pass:{
    validation:{
      "minLength":6,
      "maxLength":20,
      "pw1":pwAllowStrCheck,
      "pw2":pwStrTypeCheck,
      "pw3":pwStrRepeatCheck,
      "pw4":pwStrSortCheck
    },
    validationError:{
      "minLength":i18next.t('comConstants:ValidationSet_pwValidate'),
      "maxLength":i18next.t('comConstants:ValidationSet_pwValidate'),
      "pw1":i18next.t('comConstants:ValidationSet_pw1'),
      "pw2":i18next.t('comConstants:ValidationSet_pw2'),
      "pw3":i18next.t('comConstants:ValidationSet_pw3'),
      "pw4":i18next.t('comConstants:ValidationSet_pw4')
    }
  },
  userid:{
    validation:{
      "minLength":6,
      "maxLength":15,
      "uid1":uidAdminCheck,
      "isAlphanumeric":true,
      "uid2":uidStrTypeCheck,
      "uid3":uidStrRepeatCheck,
      "uid4":uidStrSorttCheck
    },
    validationError:{
      "minLength":i18next.t('comConstants:ValidationSet_uidValidate'),
      "maxLength":i18next.t('comConstants:ValidationSet_uidValidate'),
      "uid1":i18next.t('comConstants:ValidationSet_uid1'),
      "isAlphanumeric":i18next.t('comConstants:ValidationSet_isAlphanumeric'),
      "uid2":i18next.t('comConstants:ValidationSet_uid2'),
      "uid3":i18next.t('comConstants:ValidationSet_uid3'),
      "uid4":i18next.t('comConstants:ValidationSet_uid4')
    }
  },
  bankQuery:{
    validation:{
      "minLength":3,
    },
    validationError:{
      "minLength":i18next.t('comConstants:ValidationSet_bankMinLength')
    }
  },
  branchQuery:{
    validation:{
      "minLength":4,
    },
    validationError:{
      "minLength":i18next.t('comConstants:ValidationSet_branchMinLength')
    }
  },
  datePicker:{
    validation:{
      "format":dateFormat,
      "validateDate": validateDate
    },
    validationError:{
      "format":i18next.t('comConstants:ValidationSet_invalidDateFormat'),
      "validateDate": i18next.t('comConstants:ValidationSet_dateNotExist'),
    }
  },
  monthPicker:{
    validation:{
      "format":monthFormat,
    },
    validationError:{
      "format":i18next.t('comConstants:ValidationSet_invalidDateFormat'),
    }
  }
};

module.exports = validationSet;
