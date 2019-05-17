//true if not null nor undefined
var isExisty = function (value) {
  return value !== null && value !== undefined;
};

var isEmpty = function (value) {
  return value == '';
};

/*
* get how many byte does this value has,
* chinese will be seen as 2 bytes no matter what kind of encoding ,
* value: string
* return: int
*/
var realLength = function (str) {
  var chineseStr = [];
  var enStr = [];
  for (var i = 0; i < str.length; i++) {
    if (getUTFLength(str.charAt(i)) == 1) {
      enStr.push(str.charAt(i));
    } else {
      chineseStr.push(str.charAt(i));
    }
  }
  return (chineseStr.length * 2) + enStr.length;
};

var getUTFLength = function (str) {
  var utflength = 0;
  for (var n = 0; n < str.length; n++) {
    var c = str.charCodeAt(n);
    if (c < 128) {
      utflength++;
    }
    else if ((c > 127) && (c < 2048)) {
      utflength = utflength + 2;
    }
    else {
      utflength = utflength + 3;
    }
  }
  return utflength;
};

/*
* Compare two date strings
* dateOne: string
* dateTwo: string
* isMonth: ture/false (from month object)
* return: true if dateOne is earlier or cant compare
**/
var compareDate = function (dateOne, dateTwo, isMonth) {

  //compare only if both dateOne and dateTwo have a value
  try {
    if (dateOne != "" && dateTwo != "") {
      dateOne = dateOne.replace(/\//g, "-");
      dateTwo = dateTwo.replace(/\//g, "-");
      if (isMonth) {
        dateOne += "-01";
        dateTwo += "-01";
      }
      var dateOneArr = dateOne.split("-");
      var dateTwoArr = dateTwo.split("-");
      if (dateOneArr[1].length == 1) {
        dateOneArr[1] = "0" + dateOneArr[1];
      }
      if (dateOneArr[2].length == 1) {
        dateOneArr[2] = "0" + dateOneArr[1];
      }
      if (dateTwoArr[1].length == 1) {
        dateTwoArr[1] = "0" + dateTwoArr[1];
      }
      if (dateTwoArr[2].length == 1) {
        dateTwoArr[2] = "0" + dateTwoArr[1];
      }
      var dateOneFix = dateOneArr[0] + "-" + dateOneArr[1] + "-" + dateOneArr[2];
      var dateTwoFix = dateTwoArr[0] + "-" + dateTwoArr[1] + "-" + dateTwoArr[2];
      console.log("dateOneFix = " + dateOneFix);
      console.log("dateTwoFix = " + dateTwoFix);
      var dateOneObj = new Date(dateOneFix);
      var dateTwoObj = new Date(dateTwoFix);

      return dateOneObj.getTime() <= dateTwoObj.getTime();
    }
    //nothing to compare
    return true;
  } catch (exception) {
    // incorrect format
    return true;
  }
};

/*
* check if user pick a start date is earlier than end date
* dateRanger: dateRange object
* return: true if start date is earlier than end date of only one date exists
**/
var isPositiveRange = function (ranger) {
  var isMonth = false;
  var start;
  if (ranger.getStartDateUnit) {
    start = ranger.getStartDateUnit().getValue();
  } else {
    start = ranger.getStartMonthUnit().getValue();
    isMonth = true;
  }
  var end;
  if (ranger.getEndDateUnit) {
    end = ranger.getEndDateUnit().getValue();
  } else {
    end = ranger.getEndMonthUnit().getValue();
  }
  return compareDate(start, end, isMonth);
};

/*
* get the specific date by given time argument
* time: int(millisecond)
* return: date string (yyyy/mm/dd)
*/
var getDate = function (time) {
  var someday = new Date();
  someday.setTime(time);
  var monthStr = (someday.getMonth() + 1).toString();
  if (monthStr.length == 1) {
    monthStr = "0" + monthStr.toString();
  }
  var dateStr = (someday.getDate()).toString();
  if (dateStr.length == 1) {
    dateStr = "0" + dateStr.toString();
  }
  var somedayStr = someday.getFullYear() + "/" + monthStr + "/" + dateStr;
  return somedayStr;
};

/*
* check if a given date is within the range from today
* to certain amount of days in the pass
* days: int
* return: true if within the range
*/
var inRangeDaysBefore = function (value, days) {
  var today = new Date();
  var todayGetTime = today.getTime();
  todayGetTime -= days * 86400000;
  var checkDate = getDate(todayGetTime);
  return compareDate(checkDate, value);
};

/*
* check if a given date is within the range from today
* to certain amount of days in the future
* days: int
* return: true if within the range
*/
var inRangeDaysAfter = function (value, days) {
  var today = new Date();
  var todayGetTime = today.getTime();
  todayGetTime += days * 86400000;
  var checkDate = getDate(todayGetTime);
  return compareDate(value, checkDate);
};

/*
* check if given ssn valiate the ssn rule
* return: true if validate the ssn rule, false if againt the rule
*/
var checkSsn = function (value) {
  //get the first char into number according to rule
  var birthPlace = value.charAt(0);
  var birthPlaceNum = 0;
  switch (birthPlace) {
    case 'I':
      birthPlaceNum = 34;
      break;
    case 'O':
      birthPlaceNum = 35;
      break;
    default:
      birthPlace = birthPlace.charCodeAt(0);
      birthPlaceNum = birthPlace - 55;
  }

  //sum up the rest of the number
  birthPlaceNum = Math.floor(birthPlaceNum / 10) + (birthPlaceNum % 10) * 9;
  var ssnNum = parseInt(value.substring(1));
  var ssnSum = 0;
  for (i = 0; i < 9; i++) {
    var lastDigit = ssnNum % 10;
    ssnNum = Math.floor(ssnNum / 10);
    if (i == 0) {
      ssnSum += lastDigit;
    } else {
      ssnSum += lastDigit * i;
    }
  }

  ssnSum += birthPlaceNum;

  //true if sum happens to be multiples of 10
  if ((ssnSum % 10) != 0) {
    return false;
  }

  return true;
};

/**
* check if the difference of start and end date is in a certain amount of time
* dateRanger: DateRange component
* return: true if within the range
*/
var inRange = function (dateRanger) {
  var start = dateRanger.getStartDateUnit().getValue();
  var end = dateRanger.getEndDateUnit().getValue();
  //examinate only if both dates exist
  if (start != "" && end != "") {
    var startObj = new Date(start);
    var endObj = new Date(end);
    var limit = dateRanger.props.rangeLimit;
    var type = limit.charAt(limit.length - 1);
    var amount = parseInt(limit.substring(0, limit.length - 1));
    //check range type
    switch (type) {
      case 'y':
        startObj.setFullYear(startObj.getFullYear() + amount);
        break;
      case 'm':
        startObj.setMonth(startObj.getMonth() + amount);
        break;
      case 'd':
        startObj.setDate(startObj.getDate() + amount);
        break;
      default:
        console.error("Error: unknown rangeLimit validation type \"" + type + "\"");
    }

    return startObj.getTime() >= endObj.getTime();
  }

  return true;
};

/**
* check if selected date is earilier than a certain range from today
* value: selected date
* return: true if selected date is within the range
*/
var inRangeBefore = function (value, dateRanger) {
  if (value != "") {
    var selectedDate = new Date(value);
    var today = new Date();
    var limit = dateRanger.props.outerRangeLimit;
    var type = limit.charAt(limit.length - 1);
    var amount = parseInt(limit.substring(0, limit.length - 1));
    //check range type
    switch (type) {
      case 'y':
        today.setFullYear(today.getFullYear() - amount);
        break;
      case 'm':
        today.setMonth(today.getMonth() - amount);
        break;
      case 'd':
        today.setDate(today.getDate() - amount);
        break;
      default:
        console.error("Error: unknown rangeLimit validation type \"" + type + "\"");
    }
    return today.getTime() <= selectedDate.getTime();
  }
  return true;
};

var inRangeAfter = function (value, dateRanger) {
  if (value != "") {
    var selectedDate = new Date(value);
    var today = new Date();
    var limit = dateRanger.props.outerRangeLimit;
    var type = limit.charAt(limit.length - 1);
    var amount = parseInt(limit.substring(0, limit.length - 1));
    //check range type
    switch (type) {
      case 'y':
        today.setFullYear(today.getFullYear() + amount);
        break;
      case 'm':
        today.setMonth(today.getMonth() + amount);
        break;
      case 'd':
        today.setDate(today.getDate() + amount);
        break;
      default:
        console.error("Error: unknown rangeLimit validation type \"" + type + "\"");
    }
    return today.getTime() >= selectedDate.getTime();
  }
  return true;
};

/**
 * 檢查字串是否有重複的英文或數字
 * 初始值為超過4次就擋，例如：11111 (X) BBBBB(X) AAAAa(O) AAAA(O)
 * 
 * param value 驗證的參數
 * param maxRepeatCount 自定義重複的次數,若無輸入的話初始值為5
 */
var validateTextRepeat = function (value, maxRepeatCount) {
  var isValidatePass = true; // 用於識別是否驗證成功
  var repeatCount = 1;

  maxRepeatCount = maxRepeatCount != undefined ? maxRepeatCount : 5; // 判斷是否有輸入，沒輸入則塞初始值

  var charArray = [];

  //驗證重複邏輯
  for (var i = 0; i < value.length; i++) {
    charArray[i] = value.charAt(i);

    if (i != 0) {
      if (charArray[i - 1] == charArray[i]) {
        repeatCount++
      } else {
        repeatCount = 1;//計數從1開始
      }

      if (repeatCount == maxRepeatCount) {
        var errorStr = charArray[i - 4] + charArray[i - 3] + charArray[i - 2] + charArray[i - 1] + charArray[i];
        console.info("連續重複" + maxRepeatCount + "次以上的值為 :" + errorStr);
        isValidatePass = false;
        return false;
      }
    }
  }

  //限制只能輸入英數字
  if (isValidatePass) {
    if (isEnNum(value)) {
      return true;
    } else {
      return false;
    }
  }

  return isValidatePass;
};

/**
 * 檢查字串是否有連續的英文或數字
 * 初始值為超過4次就擋，例如：12345 (X) 1234(O) ABCDE (X) ABCDA(O)
 * 
 * param value 驗證的參數
 * param maxContinuousCount 自定義連續的次數，若無輸入初始值為5
 */
var validateTextContinuous = function (value, maxContinuousCount) {
  var validateText1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; //A-Z
  var validateText2 = validateText1.toLowerCase(); // a-z  -> abcdefghijklmnopqrstuvwxyz
  var validateText3 = "0123456789";

  var isValidatePass = true; //用於識別是否驗證成功

  maxContinuousCount = maxContinuousCount != undefined ? maxContinuousCount : 5; //判斷是否有輸入，沒輸入則塞初始值

  var charArray = [];

  //驗證是否有連續N次都是按照字母或數字的順序
  if (isValidatePass) {
    for (var i = 1; i <= value.length; i++) {
      if (i != 0) {
        var str = charArray[i - 2] + charArray[i - 1];

        //驗證當前字元的前兩個字元的組合是否符合連續字串的條件
        //若符合的話，直接把這個字元前兩個字元外加後面maxContinuousCount -2 的字元全部抓出來。對比validateText的字串是否是連續字串
        if (validateText1.indexOf(str) != -1 || validateText2.indexOf(str) != -1 || validateText3.indexOf(str) != -1) {
          var endStrIndex = maxContinuousCount - 2;
          var fullStr = value.substring(i - 2, i + endStrIndex);

          if (validateText1.indexOf(fullStr) != -1 || validateText2.indexOf(fullStr) != -1 || validateText3.indexOf(fullStr) != -1) {
            if (fullStr.length == maxContinuousCount) {
              console.info("按照順序達到" + maxContinuousCount + "次以上的值為 :" + fullStr)
              isValidatePass = false;
              return false;
            }
          }
        }
      }
    }
  }

  //限制只能輸入英數字
  if (isValidatePass) {
    if (isEnNum(value)) {
      return true;
    } else {
      return false;
    }
  }

  return isValidatePass;
};

var isEnNum = function (value) {
  if (value.length == 0) {
    return false;
  }
  if (/^([a-zA-Z0-9])+$/.test(value)) {
    return true;
  }
  return false;
};

var validations = {
  isDefaultRequiredValue: function (value) {
    return value === undefined || value == '';
  },
  isExisty: function (value) {
    return isExisty(value);
  },
  matchRegexp: function (value, regexp) {
    return !isExisty(value) || isEmpty(value) || regexp.test(value);
  },
  isUndefined: function (value) {
    return value === undefined;
  },
  isEmptyString: function (value) {
    return isEmpty(value);
  },
  isEmail: function (value) {
    return validations.matchRegexp(value, /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(([0-9]{1,3})|([a-zA-Z]{2,3})|(aero|coop|info|museum|name|taipei))$/i);
  },
  isMutipleEmail: function (value) {
    return validations.matchRegexp(value, /^(([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*;\s*|\s*$))*$/i);
  },
  isUrl: function (value) {
    return validations.matchRegexp(value, /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i);
  },
  //check if the ssn is in a correct form
  isSSN: function (value) {
    if (validations.matchRegexp(value, /^([A-Z]{1}[1-2]{1}\d{8})?$/)) {
      return !isExisty(value) || isEmpty(value) || checkSsn(value);
    }

    return false;
  },
  isTrue: function (value) {
    return value == true;
  },
  isFalse: function (value) {
    return value == false;
  },
  isNumeric: function (value) {
    if (typeof value === 'number') {
      return true;
    }
    return validations.matchRegexp(value, /^[-+]?(?:\d*[.])?\d+$/);
  },
  isAlpha: function (value) {
    return validations.matchRegexp(value, /^[A-Z]+$/i);
  },
  isAlphanumeric: function (value) {
    return validations.matchRegexp(value, /^[0-9A-Z]+$/i);
  },
  isInt: function (value) {
    return validations.matchRegexp(value, /^(?:[-+]?(?:0|[1-9]\d*))$/);
  },
  isFloat: function (value) {
    return validations.matchRegexp(value, /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][\+\-]?(?:\d+))?$/);
  },
  isWords: function (value) {
    return validations.matchRegexp(value, /^[A-Z\s]+$/i);
  },
  isSpecialWords: function (value) {
    return validations.matchRegexp(value, /^[A-Z\s\u00C0-\u017F]+$/i);
  },
  isLength: function (value, length) {
    return !isExisty(value) || isEmpty(value) || value.length == length;
  },
  isGreater: function (value, checkNum) {
    return !isExisty(value) || isEmpty(value) || value > checkNum;
  },
  isGreaterEquals: function (value, checkNum) {
    return !isExisty(value) || isEmpty(value) || value >= checkNum;
  },
  isLess: function (value, checkNum) {
    return !isExisty(value) || isEmpty(value) || value < checkNum;
  },
  isLessEquals: function (value, checkNum) {
    return !isExisty(value) || isEmpty(value) || value <= checkNum;
  },
  //check if the user input date is earlier than a specific date
  isEarlier: function (value, checkDate) {
    return compareDate(value, checkDate);
  },
  //check if the user input date is later than a specific date
  isLater: function (value, checkDate) {
    return compareDate(checkDate, value);
  },
  equals: function (value, eql) {
    return !isExisty(value) || isEmpty(value) || value == eql;
  },
  notEquals: function (value, eql) {
    return !isExisty(value) || isEmpty(value) || value != eql;
  },
  maxLength: function (value, length) {
    return !isExisty(value) || isEmpty(value) || value.length <= length;
  },
  minLength: function (value, length) {
    return !isExisty(value) || isEmpty(value) || value.length >= length;
  },
  maxRealLength: function (value, length) {
    return !isExisty(value) || isEmpty(value) || realLength(value) <= length;
  },
  minRealLength: function (value, length) {
    return !isExisty(value) || isEmpty(value) || realLength(value) >= length;
  },
  //start date must be earlier than end date
  positiveRange: function (value, dateRanger) {
    return isPositiveRange(dateRanger);
  },
  //max number of days before today
  maxDaysBefore: function (value, days) {
    return inRangeDaysBefore(value, days);
  },
  //max amount of days after today
  maxDaysAfter: function (value, days) {
    return inRangeDaysAfter(value, days);
  },
  //examinate two dates' range
  rangeLimit: function (value, dateRanger) {
    return inRange(dateRanger);
  },
  //examinate max rage from today
  beforeRangeLimit: function (value, dateRanger) {
    return inRangeBefore(value, dateRanger);
  },

  afterRangeLimit: function (value, dateRanger) {
    return inRangeAfter(value, dateRanger);
  },

  validateTextRepeat: function (value, maxRepeatCount) {
    return validateTextRepeat(value, maxRepeatCount);
  },

  validateTextContinuous: function (value, maxContinuousCount) {
    return validateTextContinuous(value, maxContinuousCount);
  },

};

module.exports = validations;
