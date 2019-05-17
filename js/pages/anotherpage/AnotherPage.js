import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom'

class AnotherPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidUpdate(prevProps, preState) {
    }



    componentDidMount() {

    }

    render() {
        return (
            <div>
                <h1>this is another page</h1>
            </div>
        )

    }
}

export default AnotherPage;
