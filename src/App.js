import React, { useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
// import config from './configs/config';
import NavBar from './components/blocks/NavBar';
import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();
const currentUrl = window.location.href;

function App(props) {
  useEffect(() => {
    let path = browserHistory.location.pathname;

    if (path === '#/') {
      window.location.hash = 'Home'
    }
  }, [currentUrl])
  return (
    <div style={{width:'140%'}}>
      <NavBar routersData={props.routersData} />
      {props.children}
    </div>
  );
}

export default App;
