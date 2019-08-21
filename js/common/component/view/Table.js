import React from 'react';
import ReactTable from 'react-table'


class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // columnData: [],
        }
        this.updateItem = {};

        this.renderEditable = this.renderEditable.bind(this);
    }

    componentDidUpdate(prevProps, preState) {

        if (this.props.columnData != prevProps.columnData) {
            this.setState({
                columnData: this.props.columnData,
            })
        }
    }

    componentDidMount() {

    }

    deleting(e, _id) {
        let data = {};

        data._id = _id;

        this.props.submitToServer(data, '/account/deleting', 'NEW_ACCOUNT');

    }

    columOnblur(e) {

        this.props.submitToServer(this.updateItem, '/account/updating', 'NEW_ACCOUNT');
    }

    renderEditable(cellInfo) {

        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                    const data = [...this.state.columnData];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;

                    this.updateItem = data[cellInfo.index];

                    this.columOnblur(e)
                }
                }
                dangerouslySetInnerHTML={{
                    __html: cellInfo.value
                }}
            />
        );
    }

    render() {
        const data = this.props.columnData;

        const columns = [
            {
                Header: 'moneyType',
                accessor: 'sourceFlag',
                Cell: this.renderEditable
            },
            {
                Header: 'category',
                accessor: 'category',
            },
            {
                Header: 'amount',
                accessor: 'amount',
                headerStyle: { whiteSpace: 'unset' },
                style: { whiteSpace: 'unset' },
            },
            {
                Header: 'date',
                accessor: 'created',
            },
            {
                Header: 'remark',
                accessor: 'remark',
            },
            {
                Header: "delete",
                id: 'delete',
                accessor: ({ _id }) => (<button onClick={(e) => this.deleting(e, _id)}>Delete</button>)
            },

        ];

        let deposit = 0;
        let totalExpenditure = 0;
        let totalIncome = 0;
        let accountDetail = this.props.columnData;
        if (accountDetail) {
            accountDetail.map((k, v) => {
                if (k.sourceFlag === 'expenditure') {
                    totalExpenditure += parseInt(k.amount);
                }

                if (k.sourceFlag === 'income') {
                    totalIncome += parseInt(k.amount);
                }
            })

            deposit = totalIncome - totalExpenditure;
        }
        return (
            <div>
                <div>
                    <span>deposit:NTD {deposit}</span>
                </div>
                <div>
                    <span>total income:NTD {totalIncome}</span>
                </div>
                <div>
                    <span>total expenditure:NTD {totalExpenditure}</span>
                </div>
                <ReactTable
                    minRows={0}
                    defaultPageSize={10}
                    showPagination={true}
                    data={data}
                    columns={columns}
                />

            </div>
        )
    }
}

export default Table;
