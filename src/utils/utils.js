import React from 'react';
import config from "../configs/config";
/* eslint-disable */
const utils = {
    groupBy: function (array, f) {
        var groups = {};
        array.forEach(function (o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        })
    },
    sumByCount: function (array, f) {
        var icount = 0;
        var count = 0;
        var groups = new Array();
        array.forEach(function (o) {
            if (icount === f) {
                icount = 0;
                count++;
            }
            groups[count] = groups[count] || [];
            groups[count].push(o);
            icount++
        });
        return groups;
    },
    formateAmount: function (numStr, decimal, sections) {
        var num = Number(numStr);
        var re = '\\d(?=(\\d{' + (sections || 3) + '})+' + (decimal > 0 ? '\\.' : '$') + ')';
        return num.toFixed(Math.max(0, ~~decimal)).replace(new RegExp(re, 'g'), '$&,');
    },
    generateUID: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return "UID" + s4() + "-" + s4() + "-" + s4();
    },
    isFirstPage: function (url) {
        if (url.indexOf("_") > 0) {
            if (url.split("_")[1] === "1") {
                return true;
            }
        }
        return false;
    },
    fixURL: function (url) {
        if (config.LocalTestMode) {
            return url;
        }
        let index = url.lastIndexOf("../");
        if (index > -1) {
            return "../" + url.substring(index);
        } else {
            return "../../" + url;
        }
    },
    formateDate: function (date) {
        if (date === undefined) {
            date = new Date();
        }
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return year + "/" + month + "/" + day;
    },
    formateDateTime: function (date) {
        if (date === undefined) {
            date = new Date();
        }
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        var hours = date.getHours().toString();
        hours = hours.length > 1 ? hours : '0' + hours;
        var minutes = date.getMinutes().toString();
        minutes = minutes.length > 1 ? minutes : '0' + minutes;
        var seconds = date.getSeconds().toString();
        seconds = seconds.length > 1 ? seconds : '0' + seconds;

        return year + "/" + month + "/" + day + " " + hours + ":" + minutes + ":" + seconds;
    },
    convertToMdate: function (cDate, isFormat) {
        var date1 = isFormat ? cDate.replace(/\//g, "") : cDate;
        var date2 = (Number(date1) - 19110000).toString();
        if (isFormat) {
            if (date2.length === 7) {
                date2 = date2.substr(0, 3) + "/" + date2.substr(3, 2) + "/" + date2.substr(5, 2);
            } else if (date2.length === 6) {
                date2 = date2.substr(0, 2) + "/" + date2.substr(2, 2) + "/" + date2.substr(4, 2);
            }
        }
        return date2;
    },
    convertToCdate: function (cDate, isFormat) {
        var date1 = isFormat ? cDate.replace(/\//g, "") : cDate;
        var date2 = (Number(date1) + 19110000).toString();
        if (isFormat) {
            date2 = date2.substr(0, 4) + "/" + date2.substr(4, 2) + "/" + date2.substr(6, 2);
        }
        return date2;
    },

    /*難字處理-將Server下傳的難字圖片*/
    parseSpecialWords: function (input) {
        return (<div dangerouslySetInnerHTML={{ "__html": input }} ></div>);
    },
    isMobileApp: function () {

        if (window.personalBankType !== undefined) {
            return window.personalBankType();
        }
        return false;
    },
    isMobileWeb: function () {
        var ua = navigator.userAgent;
        if (ua.match(/Android/i)
            || ua.match(/webOS/i)
            || ua.match(/iPhone/i)
            || ua.match(/iPad/i)
            || ua.match(/iPod/i)
            || ua.match(/BlackBerry/i)
            || ua.match(/Windows Phone/i)
        ) {
            return !this.isMobileApp();
        } else {
            return false;
        }
    },

    isMobileBrowser: function () {
        var ua = navigator.userAgent;
        if (ua.match(/Safari/i)
            || ua.match(/Chrome/i)
            || ua.match(/Firefox/i)
        ) {
            return true;
        } else {
            return false;
        }
    },

    isWebView: function () {
        var useragent = navigator.userAgent;
        var rules = ['WebView', '(iPhone|iPod|iPad)(?!.*Safari\/)', 'Android.*(wv|\.0\.0\.0)'];
        var regex = new RegExp(`(${rules.join('|')})`, 'ig');

        return Boolean(useragent.match(regex));
    },

    isMobile: function () {
        var is_uiwebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);

        return (this.isMobileWeb() || this.isMobileApp() || is_uiwebview);
    },
    isAppleMobile: function () {
        var ua = navigator.userAgent;
        if (ua.match(/iPhone/i)
            || ua.match(/iPad/i)
            || ua.match(/iPod/i)
        ) {
            return true;
        } else {
            return false;
        }
    },
    isPC: function () {
        return !(this.isMobileWeb() || this.isMobileApp());
    },

    isLogin: function () {
        if (this.isMobileWeb() || this.isPC()) {
            return false;
        }
        return true;
    },

    brStringTransformer: function (brString) {
        if (typeof brString != "string") {
            return brString;
        }
        var resultArray = [];
        var newBrString = brString.replace(/\<br *\/\>/g, "<br/>");
        newBrString = newBrString.replace(/\<br *\>/g, "<br/>");
        var splitString = newBrString.split("<br/>");
        splitString.forEach(function (row) {
            resultArray.push(row);
            resultArray.push(<br />);
        }.bind(this));
        resultArray[resultArray.length - 1] = "";
        return resultArray;
    },
    clearSessionStorage: function () {
        if (sessionStorage) {
            var i = sessionStorage.length;
            while (i--) {
                var key = sessionStorage.key(i);
                sessionStorage.removeItem(key);
            }
        }
    },
    b64EncodeUnicode: function (str) {
        return btoa(str);
    },
    b64DecodeUnicode: function (str) {
        return atob(str);
    },
    encode64: function (str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    },
    decode64: function (str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    },
    encode64Upload: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
                + keyStr.charAt(enc3) + keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);
        return output;
    },
    utf16to8: function (str) {
        var out, i, len, c;

        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }

        return out;
    },

    realLength: function (value) {
        var n = value.length, s;
        var len = 0;
        for (var i = 0; i < n; i++) {
            s = value.charCodeAt(i);
            while (s > 0) {
                len++;
                s = s >> 8;
            }
        }
        return len;
    },
    // isSafari: function() {
    //   var ua = navigator.userAgent.toLowerCase();
    //   if (ua.indexOf('safari') != -1) {
    //     if (ua.indexOf('chrome') == -1 && !this.isIE()) {
    //       return true;
    //     }
    //   }
    //   return false;
    // },
    // isIE: function() {
    //   return this.getIEVersion() >= 0;
    // },

    // getIEVersion: function() {
    //   var ua = window.navigator.userAgent.toLowerCase();

    //   // if IE 10 or older
    //   var msie = ua.indexOf('msie ');
    //   if (msie > 0) {
    //     return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    //   }

    //   // if IE 11
    //   var trident = ua.indexOf('trident/');
    //   if (trident > 0) {
    //     var rv = ua.indexOf('rv:');
    //     return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    //   }

    //   // if Edge (IE 12+)
    //   var edge = ua.indexOf('edge/');
    //   if (edge > 0) {
    //     return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    //   }

    //   //if not IE
    //   return -1;
    // },
    logout: function () {
        // $("#logoutAlert").modal("hide");
        // $(".logout-btn").click();

        window.feibApp.doLogout()

    },

    /*
    *  0: develop(開發版), 1: release(釋出版)
    */
    getMode: function () {
        return config.Mode;
    },
    getDeviceId: function () {
        try {
            return window.feibApp.getDeviceID();
        } catch (e) {
            console.log(e);
            return null;
        }
    },

    setInitialKey: function (initialKey) {
        try {
            window.feibApp.setInitialKey(initialKey);
        } catch (e) {
            console.log(e);
            return null;
        }
    },

    checkOTPBinding: function (initialKey) {
        try {
            window.feibApp.checkOTPBinding(initialKey);
        } catch (e) {
            console.log(e);
            return null;
        }
    },

    callToSignOTP: function (plainText, initialKey) {
        try {
            window.feibApp.callToSignOTP(plainText, initialKey);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    gotoBranch: function () {
        try {
            window.feibApp.gotoBranch();
        } catch (e) {
            console.log(e);
        }
    },

    //抓到server回傳的pss判斷使用者是否關閉cookie
    getCookie: function () {
        let allcookies = document.cookie;
        let name, value = '';
        let cookieFlag = true;
        try {
            let cookiearray = allcookies.split(';');

            for (var i = 0; i < cookiearray.length; i++) {
                name = cookiearray[i].split('=')[0];
                value = cookiearray[i].split('=')[1];
                // console.log("Key is : " + name + " and Value is : " + value);
            }
            if (name === 'pss') {
                cookieFlag = true;
            } else {
                cookieFlag = !cookieFlag;
            }

        } catch (e) {
            console.log(e.message);
            cookieFlag = !cookieFlag;
        }

        return cookieFlag;
    },

    getLastArrayElement(arr) {

        var last = arr[arr.length - 1]

        return last;
    },
    calculateBase64Size: function (base64String) {
        let padding, inBytes, base64StringLength;
        if (base64String.endsWith("==")) padding = 2;
        else if (base64String.endsWith("=")) padding = 1;
        else padding = 0;

        base64StringLength = base64String.length;
        console.log(base64StringLength)
        inBytes = (base64StringLength / 4) * 3 - padding;
        console.log(inBytes);
        let kbytes = inBytes / 1024;

        console.log('kbytes  ' + kbytes);

        return kbytes;
    },
    removeComma: function (val) {
        let fixVal = val.replace(/,/g, '');

        return fixVal;
    },
    isMoreRangeAmount: function (param1, param2) {
        var isNan = isNaN(val1);
        var reg = /[0-9]/;
        //判斷是否沒有數字
        if (!reg.test(param1) || !reg.test(param2)) {
            return false;//回訊息 ap自行判斷
        }
        //判斷是否有非數字
        if (isNan) {
            return false;
        } else {
            //兩參數比大小
            if (parseFloat(param1) > parseFloat(param2)) {
                return false;
            } else {
                return true;
            }
        }
    },
    isMoreRangeText: function (param1, param2) {
        var reg = /[0-9]/;
        //判斷是否沒有數字
        if (!reg.test(param1) || !reg.test(param2)) {
            return false;//回訊息 ap自行判斷
        }
        //字串排除非數字
        param1 = param1.replace(/[^0-9]?/ig, "");
        //字串排除非數字
        param2 = param2.replace(/[^0-9]?/ig, "");
        //兩參數比大小
        if (param1 > param2) {
            return false;
        } else {
            return true;
        }
    },
    isObjectEmpty: function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },
    DateFormatCheck: function (val) {
        var flag = "";
        var monthHas31Days = ['01', '03', '05', '07', '08', '10', '12'];
        var year = val.substring(0, 4);
        var month = val.substring(4, 6);
        var day = val.substring(6, 8);

        //若使用Number元件，可不需此判斷
        if (!isNumber(val)) {
            flag += "input number only\n";
        }

        if (year === '0000') {
            flag += "year can not be 0000\n";
        }

        if (convertToInt(month) > 12 || month === '00') {
            flag += "month error\n";
        }

        //閏年二月
        if (checkLeapYear(year)) {
            if (month === '02') {
                if (!(0 < convertToInt(day) && convertToInt(day) < 30)) {
                    flag += "day error\n";
                }
            }
        } else {
            if (month === '02') {
                if (!(0 < convertToInt(day) && convertToInt(day) < 29)) {
                    flag += "day error\n";
                }
            }
        }

        if (monthHas31Days.includes(month)) {
            if (!(0 < convertToInt(day) && convertToInt(day) < 32)) {
                flag += "day error\n";
            }
        } else {
            if (!(0 < convertToInt(day) && convertToInt(day) < 31)) {
                flag += "day error\n";
            }
        }

        return flag;
    },
    TimeFormatCheck: function (val) {
        var flag = "";
        var hours = 0;
        var lesserThan10 = val.substring(0, 1);
        if (lesserThan10 === '0') {
            hours = val.substring(1, 2);
        } else {
            hours = val.substring(0, 2);
        }
        var minutes = 0;
        lesserThan10 = val.substring(2, 3);
        if (lesserThan10 === '0') {
            minutes = val.substring(3, 4);
        } else {
            minutes = val.substring(2, 4);
        }

        //若使用Number元件，可不需此判斷
        if (!isNumber(val)) {
            flag += "input number only";
        }

        //00<=HH<=23
        if (!(convertToInt(hours) <= 23)) {
            flag += "hour error";
        }

        //00<=MM<=59
        if (!(convertToInt(minutes) <= 59)) {
            flag += "minute error";
        }

        return flag;
    },
    transferToAmountFormat: function (val, decimalPoint) {
        let negativeMark = false;
        if (parseInt(val) < 0) {
            negativeMark = true;
        }

        val = val.toString();
        let justNumbers = val.replace(/[^01234567890\.]/g, "");
        // let newVal = parseFloat(justNumbers);
        let decimalRegex = /(\d{0,})(\.(\d{1,})?)?/g

        let decimalPartMatches = decimalRegex.exec(justNumbers);
        // let decimalPart = "";

        //先把小數點分隔出來
        // if (decimalPartMatches[2]) {
        //   decimalPart = decimalPartMatches[2];
        // }
        let withoutDecimal = decimalPartMatches[1];
        let final = '';

        //加上千分位
        final += withoutDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        // final += decimalPart ? decimalPart : '.00';

        // final = (val).toFixed(decimalPoint).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        if (negativeMark) {

            final = '-' + final;
        }

        return final;
    },
    random_rgba(lastParam, lastParamBorder) {
        var o = Math.round, r = Math.random, s = 255;
        var param1 = o(r() * s);
        var param2 = o(r() * s);
        var param3 = o(r() * s);

        return [('rgba(' + param1 + ',' + param2 + ',' + param3 + ',' + lastParam + ')'), ('rgba(' + param1 + ',' + param2 + ',' + param3 + ',' + lastParamBorder + ')')];
    },
    initialYearOptions() {
        let yearBox = [];

        for (var i = 1977; i <= 3000; i++) {
            let items = {
                label: i,
                value: i + ''
            }
            yearBox.push(items);
        }

        return yearBox;
    }

};
export default utils; 
