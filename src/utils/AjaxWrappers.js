import $ from 'jquery';
import ajaxq from 'ajaxq';
import utils from './utils';
// import _ from 'lodash';
var config = require('./configs/config');
var crc32 = require('./SecCRC32');

var txnQueueName = 'sinoPac';

const AjaxWrapper = {
    sendDataToServer: async function (conf) {
        var sendInfo = {};

        sendInfo.path = conf.url;
        sendInfo.method = conf.method;
        sendInfo.taskID = (conf.txnId === undefined)
            ? 'none'
            : conf.txnId;
        sendInfo.data = (conf.data === undefined) ? {} : conf.data;

        console.log('CLIENT SEND:');
        console.log(sendInfo);
        //使用Queue避免非同步request導致JWT資料被覆蓋
        var queueName = (conf.queueName === undefined)
            ? txnQueueName
            : conf.queueName;
        var sendDataString = JSON.stringify(sendInfo);
        console.log('crc32 sendingString：');
        console.log(sendDataString);
        console.log(utils.encode64Upload(utils.utf16to8(sendDataString)));
        console.log(crc32(utils.encode64Upload(utils.utf16to8(sendDataString))));

        var sendDataStringCRC32 = crc32(utils.encode64Upload(utils.utf16to8(sendDataString)));
        let currentLanguageID = document.getElementsByName('select-lang');
        let selectedCurrentLanguage = currentLanguageID[0] ?
        (currentLanguageID[0].value ? currentLanguageID[0].value : config.defaultLanguage)
        : config.defaultLanguage;
        
        await $.ajaxq(queueName, {
            // method: conf.method ? conf.method :'POST',
            method: 'POST',
            url: config.mode === 0 ? conf.url : './',
            data: sendDataString,
            dataType: 'text',
            async: conf.async,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'DataCheckSum': sendDataStringCRC32,
                'Accept-Language': selectedCurrentLanguage,
            },
            timeout: config.AjaxTimeOut,
            success: function (respData) {

                // utils.resetTimer(true);
                try {

                    respData = JSON.parse(respData);
                } catch (exception) {
                    // to error page 資料錯誤
                    console.warn('AjaxWrapper: ' + exception);
                    respData = {
                        'isSuccess': false,
                        'data': '',
                        'returnCode': 'DataError',
                        'returnMessage': exception
                    };
                }

                console.log('SERVER RESPONSE:');
                console.log(respData);
                if (respData.isSuccess) {
                    console.log(conf.method + ':' + conf.url + ':' + JSON.stringify(respData.data));
                    if (conf.success) {
                        if (respData.data !== undefined && respData.data != null) {
                            respData.data['_serverTime'] = respData.serverTime;
                        }
                        conf.success(respData);
                    }
                } else {

                    conf.fail(respData);
                    return;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (conf.error && 'abort' !== textStatus) {
                    console.log('Connection Fail !!');
                    conf.error(jqXHR, textStatus, errorThrown);
                }
            },
            complete: function (jqXHR, textStatus) {
                if (window.updateCookie) {
                    window.updateCookie(document.cookie);
                }
                if (conf.complete) {
                    conf.complete(jqXHR, textStatus);
                }
            }
        });
    }
};
export default AjaxWrapper;
