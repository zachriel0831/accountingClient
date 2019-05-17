import React from 'react';

class ConfirmBtn extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    }

    componentDidMount(){

    }

    clicking(event){

        if(typeof this.props.onClick == 'function'){
            this.props.onClick(this.props.serial);
        }
    }

    render(){
        return(
            <div>  
                <button type='button' onClick={(e)=>this.clicking(e)} >
                    {this.props.displayName}
                </button>                                
            </div>
        )

    }
}

export default ConfirmBtn;
