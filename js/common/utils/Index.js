import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router, Route, Link } from 'react-router-dom';

const Menu = React.lazy(() => import('../component/view/Menu'));

import MainRouter from '../utils/Router';
// import { changeView, fetchUser } from '../../actions/userAction';

import { fetchInitCall, fetchAction } from '../../actions/fetchAction';

// import utils from '../utils/utils'

@connect((store) => {

  return {
    user: store.userReducer.user,
    userStatus: store.userReducer,
    // navs: store.visibilityReducers.navs
  };
})
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.routers = [];
    this.navs = [];


    // this.setView();
    for (var r in MainRouter) {
      this.routers.push(
        <Route path={r} key={r} component={this.HOCBundle(MainRouter[r], this.props.dispatch)} />
      )
    }

  }

  routing(e, action) {
    let pageValue = e.currentTarget.attributes[1].value;

    let pageId = (pageValue.replace('/', '')).toLowerCase();
    let txnId = (pageId.replace('/', '')).toLowerCase();

    if (txnId.indexOf('_') != -1) {
      txnId = txnId.split('_')[0];
    }

    let storage = localStorage

    let data = {};
    data.token = storage.token;
    data.username = storage.username;

    let type = `${(pageId).toUpperCase()}_INITIALIZING`;
    if ((['register', 'login'].includes(pageId))) {
      return;
    } else {
      action(fetchAction(data, txnId, pageId, pageId));

    }

  }

  // setView() {
  //   let storage = localStorage;
  //   let loggedView = [];

  //   if (storage.token && storage.username) {

  //     loggedView = utils.changeMenuView('GET_lOGGEDIN_VIEW', MainRouter, this.routing, this.props.dispatch);

  //   } else {
  //     this.navs = [];
  //     utils.clearAllSession();
  //     loggedView = utils.changeMenuView('GET_lOGGEDOUT_VIEW', MainRouter, this.routing, this.props.dispatch);

  //   }

  //   this.props.dispatch(changeView('SET_VISIBILITY_FILTER', loggedView, this.props.userStatus.loggedIn));
  // }

  HOCBundle(WrappedComponent, action) {
    let customerFunc = {
      goToPage: (url) => {

        window.location.hash = `/${url}`;
      },

    }

    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
        };

        let pageId = (this.props.location.pathname.replace('/', '')).toLowerCase();
        let txnId = (pageId.replace('/', '')).toLowerCase();

        if (txnId.indexOf('_') != -1) {
          txnId = txnId.split('_')[0];
        }

        let type = `${(pageId).toUpperCase()}_INITIALIZING`;
        let storage = localStorage

        let data = {};
        data.token = storage.token;
        data.username = storage.username;
        //debugger
        if (!(['register', 'login'].includes(txnId))) {
          if (pageId === 'home') {

            //TODO
            action(fetchInitCall(type, txnId, pageId, data));
          }
        }
      }

      componentDidMount() {
      }

      componentWillUnmount() {
      }



      render() {
        let functions = {
          action: action
        }
        return <Suspense fallback={<div>Loading...</div>}>
          <WrappedComponent {...this.props} {...functions} {...customerFunc} />
        </Suspense>;
      }
    };
  }

  componentDidUpdate(prevProps, preState) {
    // if (prevProps.userStatus.loggedIn != this.props.userStatus.loggedIn) {
    //   this.setView();
    // }

  }

  componentDidMount() {

  }

  render() {

    let navs = this.props.navs;

    return (
      <ErrorBoundary>
        <Router>
          <div>
            <Suspense fallback={<div>Loading...</div>}>
              <Menu nav={navs} MainRouter={MainRouter} routing={this.routing} />
              <div>
                {this.routers}
              </div>
            </Suspense>
          </div>
        </Router>
      </ErrorBoundary>
    )

  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    let data = {};
    console.log(error.stack);
    data.log = error.stack;


    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }
  onClick() {

    window.location.hash = "/Home";
    window.location.reload();
  }
  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
            Oops!! Something Went Wrong!!

          <div className={"LargeDocBtn"} >
            <button id="btnID" onClick={() => { this.onClick() }}>回首頁</button>
          </div>

        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default Index;
