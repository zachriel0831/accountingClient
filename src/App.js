import React from 'react';
import logo from './logo.svg';
import './App.css';
import config from './configs/config';

import { initDB, useIndexedDB } from 'react-indexed-db';
import { DBConfig } from './service/DBConfig';
import NavBar from './components/blocks/NavBar';
initDB(DBConfig);
const db = useIndexedDB('Accountings');
console.log(JSON.stringify(db));

function App(props) {
  return (
    <div>
      <NavBar routersData={props.routersData} />
      {props.children}
    </div>
  );
}

export default App;
