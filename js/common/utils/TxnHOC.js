import React from 'react';
import { fetchActionCall,fetchAction } from '../../actions/fetchAction';

module.exports = (WrappedComponent) => {
    return class extends React.Component {
        
        submitToServer(data, url,type) {
            this.props.action(fetchAction(data, url,type))
        }
        render() {
            let functions = {
                submitToServer: (data, url,type) => {
                    this.submitToServer(data, url,type);
                },
            };


            return <WrappedComponent {...this.props} {...functions} />;
        }
    }

}