import React from 'react';

class InputBtn extends React.Component{
    constructor(props){
        super(props);
        this.state={
            modifyBtnName:this.props.value,
        }
    }

    componentDidMount(){

    }

    clicking(event){
        this.setState({
            modifyBtnName:this.props.value,
        })
        if(typeof this.props.onClick == 'function'){

            this.props.onClick(this.props.serial);
        }
    }

    render(){
        return(
            <div>  
                <button type='button' onClick={(e)=>this.clicking(e)} value={this.state.modifyBtnName} >
                    {this.props.displayName}
                </button>                                
            </div>
        )

    }
}

export default InputBtn;
