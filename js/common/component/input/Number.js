import React from 'react';

class Number extends React.Component{
    constructor(props){
        super(props);
        this.state={
            value:'',
        }
    }
    componentDidUpdate(prevProps,prevState){

        if(prevProps.value != this.props.value && this.props.value === ''){
            this.setState({
                value:this.props.value
            })
        }
    }
    componentDidMount(){

    }


    onBlur(){
        if(typeof this.props.onBlur == 'function'){
            this.props.onBlur();
        }
    }

    changeValue(event){
        let val = event.currentTarget.value;     
        
        if (!(/^[0-9]*$/).test(val)) {
            return false;
        }

        this.setState({
            value:val,
        })
        if(typeof this.props.onChange == 'function'){
            this.props.onChange(event);
        }
    }

    render(){
        return(
            <div>  
                <input 
                       name={this.props.name}
                       placeholder={this.props.placeholder}                
                       type='tel'
                       onChange={(e)=>this.changeValue(e)}
                       onBlur={(e)=>this.onBlur(e)}
                       value={this.state.value}

                />                              
            </div>
        )

    }
}

export default Number;
