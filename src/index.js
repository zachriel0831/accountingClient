import React, { lazy, Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from 'history';
import _ from 'lodash';
import HOCBundle from './components/hocs/HOCBundle';
import config from './configs/config';
import './index.css';
import App from './App';
import { initDB, useIndexedDB } from 'react-indexed-db';
import { DBConfig } from './service/DBConfig';

import * as serviceWorker from './serviceWorker';
import axios from 'axios'
//DB initializing
initDB(DBConfig);
const wakeUpCurrency = () => {
  axios({
    method: 'get',
    baseURL: config.mode === 0 ? config.crawlingLocalService : config.crawlerService,
    url: '/currency/heroku_wakeup_signal',
    'Content-Type': 'application/json',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: false,
  }).then(function (response) {
    let responseData = response.data;

    console.log(response);
  }).catch(function (error) {
    // handle error
    console.log(error);
    alert(' failed!')
  }).finally(function () {
    console.log('request finished');
  });
};

const wakeUpBackUpServer = () => {
  axios({
    method: 'get',
    baseURL: config.mode === 0 ? config.localTestUrl : config.backEndUrl,
    url: '/BackUp/wake_up_call',
    'Content-Type': 'application/json',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: false,
  }).then(function (response) {
    let responseData = response.data;

    console.log(response);
  }).catch(function (error) {
    // handle error
    console.log(error);
    alert(' failed!')
  }).finally(function () {
    console.log('request finished');
  });
}

wakeUpBackUpServer();

wakeUpCurrency();

const routersData = config.routersData;
// const browserHistory = createBrowserHistory();
let route = [];
_.each(routersData, (v, k) => {
  const txnComponent = lazy(() => import(`./components/pages${v}`));
  // console.log('path ', v);
  route.push(<Route exact sensitive={true} path={v} key={v} component={HOCBundle(txnComponent)} />);
})

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<>loading...</>}>
      <HashRouter>
        <App routersData={routersData}>
          <Switch>
            {route}
          </Switch>
        </App>
      </HashRouter>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
