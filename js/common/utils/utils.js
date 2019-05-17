import MainRouter from './Router';
import React from 'react';
import { Link } from 'react-router-dom';

module.exports = {
    changeView: function (type) {

        this.navs = [];
        switch (type) {
            case 'GET_lOGGEDIN_VIEW':

                for (var r in MainRouter) {
                    if (LOGGED_IN_PAGE.includes(r)) {
                        this.navs.push(<Link to={r} ><nav>{r.replace('/', '')}</nav></Link>);
                    }
                }

                break;

            case 'GET_lOGGEDOUT_VIEW':

                for (var r in MainRouter) {
                    if (LOGGED_OUT_PAGE.includes(r)) {
                        this.navs.push(<Link to={r} ><nav>{r.replace('/', '')}</nav></Link>);
                    }
                }

                break;

            default:

                for (var r in MainRouter) {
                    this.navs.push(<Link to={r} ><nav>{r.replace('/', '')}</nav></Link>)
                }
                break;
        }


        return  this.navs;

    },

    clearAllSession: function (){

        for(var i in localStorage){
            localStorage.removeItem(i);
          }
    }
}