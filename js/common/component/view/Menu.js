import React from 'react';


class Menu extends React.Component {
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
                <div>
                    {this.props.nav}
                </div>



            </div>
        )

    }
}

export default Menu;
