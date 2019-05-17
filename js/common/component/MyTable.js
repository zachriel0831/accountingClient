import React from 'react';
import InputBtn from './button/InputBtn.js';
import Text from './input/Text.js';
import $ from 'jquery'
import Number from './input/Number.js'

class Row extends React.Component{

    constructor(props){
        super(props);
        this.state={
            rowName:this.props.name,
            rowPhone:this.props.phone,
            modifyBtnName:'修改',
            modifyingName:<Text />,
            modifyingPhone:<Number />,
        }

    }    


    componentDidUpdate(prevProps,prevState){


    }

    changeVal(event){
        let val = event.currentTarget.value;       
            this.setState({
                rowName:val,
            })
    }
    blurring(){
        this.modifyData();
    }
    changePhoneVal(event){
        let val = event.currentTarget.value;       
            this.setState({
                rowPhone:val,
            })    
        }

    modifyData(event){
        let serial = this.props.serial;
        let nameId = `plainName${serial}`
        let pboneId = `plainPhone${serial}`
        let modifyingNameId = `modifyingName${serial}`
        let modifyingPhoneId = `modifyingPhone${serial}`

        let displayName = '';
        let name = {};
        let phone = {};
        let modifyingName = {};
        let modifyingPhone = {};
        if(this.state.modifyBtnName == '修改'){
            displayName = '確認';
            modifyingName = <Text value={this.state.rowName} placeholder={this.state.rowName} onChange={(e)=>this.changeVal(e)} onBlur={(e)=>this.blurring(e)} />;
            modifyingPhone = <Number value={this.state.rowPhone} placeholder={this.state.rowPhone} onChange={(e)=>this.changePhoneVal(e)} onBlur={(e)=>this.blurring(e)} />
            $(`#${nameId}`).hide();
            $(`#${pboneId}`).hide();
            $(`#${modifyingNameId}`).show();
            $(`#${modifyingPhoneId}`).show();
            this.setState({
                modifyingName:modifyingName,
                modifyingPhone:modifyingPhone,
                modifyBtnName:displayName,
            })
    
        }else{
            displayName = '修改';

            $(`#${nameId}`).show();
            $(`#${pboneId}`).show();
            $(`#${modifyingNameId}`).hide();
            $(`#${modifyingPhoneId}`).hide();
            this.setState({
                modifyBtnName:displayName,
            })

        }
    }
    componentDidMount(){
        $('.modifying').hide();
    }

    delete(serial){
          
        this.props.deleteRows(serial);

    }

  
    render(){
        let serial = this.props.serial;
        let nameId = `plainName${serial}`
        let pboneId = `plainPhone${serial}`
        let modifyingNameId = `modifyingName${serial}`
        let modifyingPhoneId = `modifyingPhone${serial}`
        
        return (
                <tr key={serial} >                                  
                    <td>{serial}</td>
                    <td id={nameId}>{this.state.rowName}</td>
                    <td id={pboneId}>{this.state.rowPhone}</td>
                    <td className='modifying' id={modifyingNameId}>{this.state.modifyingName}</td>
                    <td className='modifying' id={modifyingPhoneId}>{this.state.modifyingPhone}</td>
                    <td>
                    <InputBtn displayName={this.state.modifyBtnName} 
                        value={this.state.modifyBtnName} 
                        onClick={(e)=>this.modifyData(e)} />
                    <InputBtn displayName='刪除' 
                              onClick={(e)=>this.delete(e)} 
                              serial={this.props.serial}
                              />
                    </td>
                    
                </tr>
             )
    } 

}

const ADDROW = Row;

class MyTable extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            rowData:[]
        }

    }

    componentDidUpdate(prevProps,prevState){

        if(this.props.row.name != prevProps.row.name){
            this.setNewRow(this.props.row)
        }

        if(prevState.rowData.length != this.state.rowData.length){
            $('.modifying').hide();
        }
    }


    deleteRows(index){
        console.log('deleting ' + index);
        var rows = [...this.state.rowData];
        const result = rows.filter(row => row.props.serial != index );

        this.setState({rowData:result});

    }

    setNewRow(rowDatas){
        let rows = this.state.rowData;
        var validationFlag = false;
        var box = [];
        rows.map((row)=>{
            if(row.props.name == rowDatas.name){

                validationFlag = true;
            }
            box.push(parseInt(row.props.serial));

        })
      let max = Math.max.apply(null, box);

      if(validationFlag){
            alert('已有相同成員!');
            return;
        }

        let serial =box.length==0?1:(max)+1;
          
        let row = <ADDROW serial={serial} name={rowDatas.name} phone={rowDatas.phone} deleteRows={(data)=>this.deleteRows(data)} />
        rows.push(row);
        this.setState({
            rowData:rows,
        })
    }

    componentDidMount(){
    }
    render(){
        return(
            <div>
                <table className="table" ref='mainTable'>
                <thead>
                    <tr>
                        <th>編號:</th>
                        <th>姓名:</th>
                        <th>電話:</th>
                        <th>編輯:</th>
                    </tr>
                </thead>
                    <tbody id='mainBody'>
                        {this.state.rowData}
                    </tbody>
                </table>
                                
            </div>
        )

    }
}

export default MyTable;
