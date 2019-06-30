import React from 'react'
import ReactDOM from 'react-dom'
import Index from './common/utils/Index'
import {Provider,connect} from 'react-redux'
import store from './store'
import 'bootstrap';
import css from '../app/css/style.css'
import scss from '../app/css/custom.scss'

ReactDOM.render(
    <Provider store={store}>
      <Index />
    </Provider>
    , document.getElementById('app'));
  