// import MainRouter from './Router';
import React from 'react';
import { Link } from 'react-router-dom';

module.exports = {
    changeMenuView: function (type,MainRouter,routing,dispatch) {

        this.navs = [];
        switch (type) {

            case 'GET_INITIAL_VIEW':
                this.navs = [];

                break;
            case 'GET_lOGGEDIN_VIEW':

                for (var r in MainRouter) {
                    if (LOGGED_IN_PAGE.includes(r)) {
                      if((['/Home', '/LogOut'].includes(r))){

                        this.navs.push(<Link className="item" to={r}>{r.replace('/', '')}</Link>);

                      }else{
                        this.navs.push(<Link className="item" value={r} onClick={(e)=>routing(e,dispatch)}>{r.replace('/', '')}</Link>);
                      }
                    }
                }

                break;

            case 'GET_lOGGEDOUT_VIEW':
                
                for (var r in MainRouter) {
                    if (LOGGED_OUT_PAGE.includes(r)) {
                        this.navs.push(<Link className="item " to={r} value={r} onClick={(e)=>routing(e,dispatch)}>{r.replace('/', '')}</Link>);
                    }
                }

                break;

            default:

                for (var r in MainRouter) {
                    this.navs.push(<Link className="item" value={r} onClick={(e)=>routing(e,dispatch)}>{r.replace('/', '')}</Link>)
                }
                break;
        }


        return this.navs;

    },

    clearAllSession: function () {

        for (var i in localStorage) {
            localStorage.removeItem(i);
        }
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
    clearSessionStorage: function () {
        if (sessionStorage) {
            var i = sessionStorage.length;
            while (i--) {
                var key = sessionStorage.key(i);
                if (key.indexOf("SPID") < 0 && key.indexOf("TXN_NOTES")) {
                    sessionStorage.removeItem(key);
                }
            }
        }
    },

    isMobileApp: function () {

        if (window.personalBankType != undefined) {
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
    

      setCookie:function (name, value, days) {
        var expires = "";
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
      },
      
      getCookie:function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
      },

      deleteCookie:function(){
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
      }
    
}