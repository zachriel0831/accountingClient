import React from 'react';
// import { validationCommon } from '../../../mtMessageCommon/validations/validationCommon';
// import AjaxWrapper from '../util/AjaxWrapper';
// import config from '../../configs/config'
//元件HOC
const HOCCommon = (ComposeComponent) => {
    let customerFunc = {
        doValidate: (val, props) => {
            //TODO
            console.log('validating!!!');
            //   let results = validationCommon.txnCommonValidationEngine(val, props);
            //   console.log('validation results ', JSON.stringify(results));
            //   return results;
            return true;
        },
        getDataFromServer: async (data, url) => {
            // console.log('context ajax firing!!')
            // let result = '';
            // var sendDataString = JSON.stringify(data);

            //   await AjaxWrapper.sendDataToServer({
            //     method: 'POST',
            //     url: config.mode === 0 ?`${config.testContextURL}${url}` : url,
            //     data: sendDataString,
            //     dataType: 'text',
            //     async: true,
            //     headers: {
            //       'Accept': 'application/json',
            //       'Content-Type': 'application/json',
            //       // 'DataCheckSum': sendDataStringCRC32
            //     },
            //     success: function (respData) {
            //       // console.log('SERVER RESPONSE: ', JSON.parse(respData));
            //       result = respData;
            //     },
            //     error: function (jqXHR, textStatus, errorThrown) {

            //       console.log('SERVER error jqXHR: ', jqXHR);
            //       console.log('SERVER error textStatus: ', textStatus);
            //       console.log('SERVER error errorThrown: ', errorThrown);

            //     },
            //     complete: function (jqXHR, textStatus) {
            //       return result;
            //     }
            //   })
        }
    }
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
            };
        }

        render() {
            return <> <ComposeComponent {...this.props} {...ComposeComponent} {...customerFunc} /></>
        }
    };

}

export default HOCCommon;