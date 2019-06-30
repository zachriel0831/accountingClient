import React from 'react';
import utils from '../../utils/utils'
import { Field, ErrorMessage } from 'formik';

/**
* 簡訊隨機密碼
*/

let keyPressCheck = true;

class OPTText  extends React.Component {
  constructor(props) {
    super(props);
    this.fieldType = 'password';
  }

  static defaultProps = {
    name: "otpCode",
    maxlength:4,
  }
  componentDidMount() {
  }

  changeValue(event) {
    var currentValue = event.currentTarget.value;

    console.log('otpcode value ' + currentValue);
  }

  checkKey(event) {
    if (event.key === 'Enter' && event.charCode === 13) {
      keyPressCheck = false;
      return;
    } else {
      keyPressCheck = true;
    }
  }

  render() {
    return (
      <div>
        <div>
          <div>
            OTP密碼：
        </div>

          <Field name={this.props.name} >
            {({ field, form }) => (
              <div>
                <input
                  type="tel"
                  {...field}
                  name={this.props.name}
                  maxlength={this.props.maxlength}
                  placeholder={this.props.placeholder}

            />

                {/* {form.touched[field.name] &&
                        form.errors[field.name] && <div className="error">{form.errors[field.name]}</div>} */}
                <small className="form-text text-muted"><ErrorMessage name={this.props.name} component="div" render={msg => <div className='errorMsg'>{msg}</div>} /></small>
              </div>
            )}
          </Field>
        </div>
      </div >
    );
  }
}

const OPTTextHOC = OPTText;

export default class OTPPanel extends React.Component {

  static defaultProps = {
    visible: true,
    resendOff: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      countDown: "5:00",
      otpid: this.props.securityParam.otpCode,
    }
    this.duration = 300;
    this.timerID = undefined;

    if (localStorage.getItem('otpSent')) {
      let currentPage = window.location.hash;
      currentPage = currentPage.split('_')[0] + '_1';

      window.location.hash = currentPage;
      utils.clearSessionStorage();
    }
  }

  componentDidMount() {
    this.checkValidation();
    this.startTimer();
  }

  componentDidUpdate(prevProps, prevState) {
    let otpErrorCount = localStorage.getItem("OTPErrorCount");
    if (otpErrorCount === undefined || otpErrorCount === '' || otpErrorCount === null) {
      otpErrorCount = 0;
    }

    if (otpErrorCount >= 3) {
      alert('錯誤三次!')
    }
  }

  checkValidation() {
    let otpStr = localStorage.getItem("BankeeOTPSession");

    if (otpStr != undefined) {
      let otpSessionObj = JSON.parse(utils.decode64(otpStr));

      let now = new Date();

      if (otpSessionObj[this.props.securityParam.phone] == undefined || now.getTime() >= otpSessionObj[this.props.securityParam.phone].expire) {
        this.createOTPSession();
        return true;
      }
    } else {
      this.createOTPSession();
      return true;
    }
  }

  resend() {

    if (!(keyPressCheck)) {

      return;
    }

    let _this = this;
    if (this.checkValidation()) {
    

      this.startTimer()
    }
  }

  createOTPSession() {
    let otpSessionObj = {}
    let expire = new Date();
    expire.setMinutes(expire.getMinutes() + 10);
    otpSessionObj[this.props.securityParam.phone] = {};
    otpSessionObj[this.props.securityParam.phone].expire = expire.getTime();
    otpSessionObj[this.props.securityParam.phone].count = 1;
    localStorage.setItem("BankeeOTPSession", utils.encode64(JSON.stringify(otpSessionObj)));
  }

  startTimer() {
    let timer = this.props.counttime ? this.props.counttime : this.duration, minutes, seconds;
    //到期時間
    var time = new Date();
    time.setMinutes(time.getMinutes() + parseInt(timer / 60, 10));

    if (this.timerID != undefined || this.timerID != null) {
      clearInterval(this.timerID);
      this.timerID = null;
    }
    var _utils = utils;
    this.timerID = setInterval(() => {
      timer = (time.getTime() - new Date().getTime()) / 1000;
      if (timer < 0) {
        clearInterval(this.timerID);
        this.timerID = null;
        let currentPage = window.location.hash;

        if (!_utils.isLogin()) {
          currentPage = currentPage.split('_')[0] + '_1';

          window.location.hash = currentPage;
        } else {
          window.location.hash = "/HomePage/HomePage_1";
        }
        // return;
      }
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
      seconds = seconds < 10 ? "0" + seconds : seconds;
      let newCountDown = minutes + ":" + seconds;
      this.setState({ countDown: newCountDown });
      console.log('>>>>> reset time');
    }, 1000);
  }


  componentWillUnmount() {
    if (this.timerID != null) {
      clearInterval(this.timerID);
      this.timerID = null;
    }
  }

  backToHome() {
    let currentPage = window.location.hash;

    if (localStorage.getItem('OTPErrorCount')) {
      this.otpCount = 0;
      localStorage.removeItem('OTPErrorCount');
    }

    currentPage = currentPage.split('_')[0] + '_1';
    window.location.hash = currentPage;
  }

  render() {
    let msg;
    if (this.props.securityParam) {
      msg = (
        <div style={{ letterSpacing: "-0.04em" }}>
          行動電話 : <span>{this.props.securityParam.phone}</span><br />
          簡訊<span>OTP</span>密碼有效時間尚餘
        </div>
      );
    } else {
      msg = (
        <div style={{ letterSpacing: "-0.04em" }}>
          簡訊<span>OTP</span>密碼有效時間尚餘
        </div>
      );
    }
    return (
      <div style={this.props.visible ? {} : { display: "none" }}>
        {msg}
        <div style={{ marginTop: "0.9em" }}>
          <div>
            <h4>{this.state.countDown}</h4>
          </div>
        </div>
        <OPTTextHOC 
          displayName="一次性簡訊密碼"
          name={this.props.name}
          maxlength={this.props.maxlength}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}