import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import Menu from '../component/view/Menu'
import MainRouter from '../utils/Router';
import { changeView } from '../../actions/userAction';
import utils from '../utils/utils'
@connect((store) => {

  return {
    user: store.userReducer.user,
    userStatus: store.userReducer,
    navs: store.visibilityReducers.navs
    // newAccount:store.newAccountingReducer
  };
})
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.routers = [];
    this.navs = [];


    let loggedOutView = utils.changeView('GET_lOGGEDOUT_VIEW');
    this.props.dispatch(changeView('SET_VISIBILITY_FILTER', loggedOutView, this.props.userStatus.loggedIn));

    for (var r in MainRouter) {
      console.log(r);
      this.routers.push(
        <Route path={r} key={r} component={MainRouter[r]} />
      )
    }
  }

  componentDidUpdate(prevProps, preState) {
    if (prevProps.userStatus.loggedIn != this.props.userStatus.loggedIn) {
      let storage = localStorage;
      if (storage.token && storage.username) {
        window.location.hash = '/Home'

        let loggedView = utils.changeView('GET_lOGGEDIN_VIEW');
        this.props.dispatch(changeView('SET_VISIBILITY_FILTER', loggedView, this.props.userStatus.loggedIn));
      } else {
        this.navs = [];
        utils.clearAllSession();
        let loggedOutView = utils.changeView('GET_lOGGEDOUT_VIEW');
        this.props.dispatch(changeView('SET_VISIBILITY_FILTER', loggedOutView, this.props.userStatus.loggedIn));
      }
    }

  }

  componentDidMount() {

  }

  render() {

    let navs = this.props.navs;
    return (
      <Router>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Menu nav={navs} />
            <div>
              {this.routers}
            </div>
          </Suspense>
        </div>
      </Router>
    )

  }
}

export default Index;
