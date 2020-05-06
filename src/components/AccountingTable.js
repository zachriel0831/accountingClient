
import React, { useState, useEffect, useRef } from 'react';
// import WithComponents from './WithComponents';
import TableExtendModal from './TableExtendModal';
import LargeTableExtendModal from './LargeTableExtendModal';
import Button from './Button';
import utils from '../utils/utils';
// import $ from 'jquery';
// import CheckBox from './CheckBox';
//TODO table先不包HOC
import _ from 'lodash';
//memo用來提高網頁效能 當props與state不變則不render
import { useTranslation } from "react-i18next";

const PureCheckBox = React.memo((props) => {
    const [state, setState] = useState(props.checked);
    /*eslint-disabled */
    const clickValue = (e) => {
        let cells = e.currentTarget.parentElement.parentElement.cells;
        let tdValues = [];
        let checkedTarget = [];
        _.each(cells, (v, k) => {
            let checkBoxFlag;
            if (v.children[0]) {
                checkBoxFlag = v.children[0].type === 'checkbox' ? true : false;
            }
            if (!checkBoxFlag) {
                checkedTarget.push(v.textContent);
            }
        });


        if (!state) {
            _.each(cells, (v, k) => {

                let checkBoxFlag;
                if (v.children[0]) {
                    checkBoxFlag = v.children[0].type === 'checkbox' ? true : false;
                }
                if (!checkBoxFlag) {
                    tdValues.push(v.textContent);
                }

            });
        }
        let newState = !state;
        setState(newState);

        if (_.isFunction(props.onClick)) {
            props.onClick(e, tdValues, !state, checkedTarget);
        }
    }

    PureCheckBox.defaultProps = {
        disabled: false,
    }
    return (
        <>
            <input
                type="checkbox"
                checked={state}
                name={props.name}
                value={props.value}
                onClick={(e) => clickValue(e)} />
        </>

    )
});


const propsEquality = (preProps, nextProps) => {
    //TODO make it more specific , zack

    //selectAll變了通行
    if (preProps.selectAll !== nextProps.selectAll) {
        return false;
    } else if (preProps.queriesData === nextProps.queriesData) {

        return true;
    }
    // 
    return false;
}
const AccountingTable = React.memo((props) => {
    const [state, setState] = useState(props.queriesData);
    const [showContent, setShowContent] = useState(true);
    const [sortingType, setSortingType] = useState('');
    const [checkBoxSelectAllState, setCheckBoxSelectAllState] = useState(false);
    const { t } = useTranslation();

    const tableRef = useRef();

    const swiftMethod = props.rowSpec.method;
    const querySwiftUrl = props.rowSpec.queryUrl;
    const requestDataKey = props.rowSpec.requestDataKey;
    const selectedValue = props.rowSpec.selectedValue;

    let ths = [];
    let trs = [];


    const checkBoxClick = (e, val, checked, checkedTarget) => {
        props.headerSpec.onCheckBoxClick(e, val, checked, checkedTarget);
    }

    const Header = (props) => {
        let headerStyle = { ...props.style };
        let orderByAmount = props.orderByAmount;
        let amountHeaderName = props.amountHeaderName;
        let id = props.id;
        _.assign(headerStyle, { cursor: 'pointer' });
        return (

            <th ref={(node) => {
                if (node) {
                    _.each(headerStyle, (v, k) => {
                        node.style.setProperty(k, v, "important");
                    })

                }
            }} onClick={(e) => {

                setShowContent(!showContent);
                setSortingType(e.currentTarget.textContent)

                props.onClick(e, !showContent, id, orderByAmount, amountHeaderName);
            }}>{props.children}
                <i className={props.showContent ? (props.angleDirection) : ''}></i>

            </th>

        )
    }
    const TRdata = (props) => {
        const setStyleOnDoubleClick = (e) => {
            if (selectedValue) {
                //非同步下無法取得currentTarget
                let getAllRow = e.currentTarget.parentElement.children;

                //重置所有row style
                _.each(getAllRow, (v, k) => {
                    v.style.backgroundColor = 'white';
                })

                //反白選取的row
                e.currentTarget.style.backgroundColor = '#cce2ff';
            }

            props.onDoubleClick(e)
        }

        if (!selectedValue) {
            return (
                <LargeTableExtendModal
                    {...props}
                    trElements={props.trElements}
                    rowKey={props.rowKey ? props.rowKey : utils.generateUID()}
                    queryMethod={swiftMethod}
                    queryURL={querySwiftUrl}
                    style={{ cursor: 'pointer' }}
                    onDoubleClick={setStyleOnDoubleClick}
                >
                    {props.children}
                </LargeTableExtendModal>
            )
        } else {
            return (
                <tr id={props.rowKey ? props.rowKey : utils.generateUID()}
                    style={{ cursor: 'pointer' }}
                    onDoubleClick={setStyleOnDoubleClick}
                >
                    {props.children}
                </tr>
            )
        }
    }

    const TDdata = (props) => {
        if (props.modal) {
            return (
                <TableExtendModal
                    tableDetails={props.tableDetails}
                    queryMethod={props.queryMethod}
                    queryURL={props.queryURL}
                    queryHeader={props.queryHeader}
                    style={props.style}
                    rowKey={props.rowKey}
                    key={utils.generateUID()}
                >
                    {props.children}
                </TableExtendModal>
            )
        } else {
            return (
                <td ref={(node) => {
                    if (node) {
                        _.each(props.style, (v, k) => {
                            node.style.setProperty(k, v, "important");
                        })

                    }

                }} style={props.style}>{props.children}</td>
            )
        }
    }
    TDdata.defaultProps = {
        modal: false,
        large_modal: false,
    }
    //header只要繞完第一圈
    let headerFinishFlag = false;


    //排序
    const sortingQuery = (value, sortingType, order, orderByAmount, amountHeaderName) => {
        let valuetoArray = _.toArray(value);

        if (orderByAmount) {
            let amountOrder = valuetoArray.sort(function (param1, param2) {
                return (order === 'desc') ? (param2[amountHeaderName].replace(/,/g, '') - param1[amountHeaderName].replace(/,/g, '')) : (param1[amountHeaderName].replace(/,/g, '') - param2[amountHeaderName].replace(/,/g, ''));
            }
            );

            return { ...amountOrder };
        } else {
            let result = _.orderBy(valuetoArray, [sortingType], [order]);

            return { ...result };

        }

    }

    const headerGenerator = (value) => {
        const headerEvent = (e, contentFlag, contenText, orderByAmount, amountHeaderName) => {
            let sortingResult = sortingQuery(state, contenText, contentFlag ? 'asc' : 'desc', orderByAmount, amountHeaderName);

            setState(sortingResult);
        }

        let header = value ? value.header : {};
        let amountSortingHeaderKey = value ? value.amountSortingHeaderKey : '';

        try {
            // by shane
            _.each(header, (h) => {

                let headerStyle = {};
                let orderByAmount = false;
                let amountHeaderName = '';
                if (h.style !== undefined) {
                    headerStyle = h.style;
                }

                _.each(amountSortingHeaderKey, (amount) => {
                    if (h.id === amount) {
                        amountHeaderName = h.id;
                        orderByAmount = true;
                        return false;
                    }
                });

                ths.push(
                    <Header
                        key={utils.generateUID()}
                        showContent={(sortingType === h.headerName) ? true : false}
                        angleDirection={showContent ? `icon angle down` : `icon angle up`}
                        id={h.id}
                        onClick={headerEvent}
                        style={headerStyle}
                        amountHeaderName={amountHeaderName}
                        orderByAmount={orderByAmount}
                    >
                        {h.headerName}
                    </Header>
                );
            });

            if (props.headerSpec.selectable) {
                ths.unshift(
                    <Header
                        key={utils.generateUID()}
                        showContent={(sortingType === props.headerSpec.selectableDisplayName.headerName) ? true : false}
                        angleDirection={showContent ? `icon angle down` : `icon angle up`}
                        id={props.headerSpec.selectableDisplayName.id}
                        onClick={headerEvent}>{props.headerSpec.selectableDisplayName.headerName}
                    </Header>
                );
            }
        } catch (e) {
            console.log('query data errr ', JSON.stringify(e));
        }

        return ths;
    }
    let tds = [];
    //TODO 之後會有需要編輯的table 會再更改
    const trGenerator = (value) => {

        const trClick = (e) => {
            //取得欄位值
            let cells = e.currentTarget.cells;
            let trValues = [];
            _.each(cells, (v, k) => {

                if (v.firstElementChild) {
                    if (v.firstElementChild.type === 'checkbox') {

                        return;
                    }
                }

                trValues.push(v.textContent);

            });

            if (typeof props.rowSpec.customOnRowDoubleClick === 'function') {
                props.rowSpec.customOnRowDoubleClick(e, trValues);

            }
        }

        let headerSpec = props.headerSpec ? props.headerSpec : {};
        let columnSpec = props.columnSpec;
        // let lastRowKey = '';
        let rowKey = '';
        let tdValueBox = [];
        _.each(value, (item, r) => {
            // 取得RowKey 參數
            _.each(item, (v, k) => {
                if (k === requestDataKey) {
                    rowKey = v;
                }
            });

            // 依據Header 順序取得相對應的資料
            _.each(headerSpec.header, (h) => {
                let tdValue = '';
                let tdKey = '';
                let sendAjax = false;
                let queryURL = '';
                let queryMethod = '';
                let queryHeader = [];
                let tableDetails = {};
                let content = '';
                let style = {};
                let modal = true;

                // 套用HeaderSpec Style
                if (h.style !== undefined) {
                    style = h.style;
                }
                _.each(item, (v, k) => {
                    tdValue = v;
                    tdKey = k;

                    if (tdKey === 'amount') {
                        tdValue = utils.transferToAmountFormat(tdValue);

                    }

                    // header key值與data key值做比對
                    if (h.id === tdKey) {
                        // 此欄位是否有定義ColumnSpec
                        _.each(columnSpec, (col) => {
                            if (col.header === tdKey) {
                                tdValueBox = [];

                                sendAjax = col.sendAjax ? col.sendAjax : false;
                                queryURL = col.url ? col.url : '';
                                queryMethod = col.method ? col.method : '';
                                queryHeader = col.headerSpec ? col.headerSpec : [];
                                tableDetails = col.tableDetails ? col.tableDetails : {};
                                style = col.style ? col.style : style;

                                switch (col.type) {
                                    case 'Button':
                                        _.each(col.displayValue, (c) => {
                                            if (tdValue.code === c) {
                                                content = <Button type='button' displayName={tdValue.label} className='ui button btn-primary btn-search' />
                                                return false;
                                            }
                                        })

                                        break;
                                    case 'RadioBtn':

                                        break;
                                    case 'CheckBox':

                                        break;
                                    case 'Multiple':
                                        if (tdValue.code !== "") {
                                            _.each(col.displayValue, (val) => {
                                                if (tdValue.code === val.code) {
                                                    switch (val.type) {
                                                        case 'Button':
                                                            content = <Button type='button' displayName={tdValue.label} className='ui button btn-primary btn-search' />
                                                            break;
                                                        case 'Label':
                                                            content = tdValue.label;
                                                            modal = false;
                                                            break;
                                                        default:
                                                            break;
                                                    }

                                                    return false;
                                                }
                                            });
                                        }
                                        else {
                                            content = '';
                                            modal = false;
                                        }

                                        break;
                                    case 'Custom':
                                        content = tdValue;
                                        modal = false;

                                        break;
                                    default:
                                        content = tdValue;
                                        break;
                                }

                                return false;
                            }
                            else {
                                content = tdValue;
                            }
                        });

                        if (sendAjax) {
                            tds.push(
                                <TDdata
                                    tableDetails={tableDetails}
                                    queryMethod={queryMethod}
                                    queryURL={queryURL}
                                    queryHeader={queryHeader}
                                    modal={modal}
                                    style={style}
                                    rowKey={rowKey}
                                    key={utils.generateUID()}
                                >{content}

                                </TDdata>);

                        } else {
                            tds.push(<TDdata style={style} rowKey={rowKey} key={utils.generateUID()}>{content}</TDdata>);
                        }
                        tdValueBox.push(tdValue);

                        return false;
                    }
                });
            });

            if (tds.length !== 0) {
                // 是否需要Checkbox選項
                if (props.headerSpec.selectable) {
                    //塞到第一組
                    tds.unshift(
                        <td key={utils.generateUID()}><PureCheckBox key={utils.generateUID()} checked={checkBoxSelectAllState} onClick={checkBoxClick} /></td>);
                }
                let trElements = tdValueBox;

                trs.push(<TRdata key={utils.generateUID()} {...props} trElements={trElements} rowKey={rowKey} onDoubleClick={trClick}>{tds}</TRdata>);
                tds = [];
            }
        });

        return trs;
    }

    useEffect(() => {
        setState(props.queriesData);
        setSortingType('');
        return () => {
        };
    }, [props.queriesData])

    //select all and cancel all
    useEffect(() => {

        if (props.headerSpec.selectable) {
            let refs = tableRef;

            if (refs.current) {
                let cells = refs.current.rows;
                let resultBox = [];
                _.each(cells, (v, k) => {
                    let tdBox = [];
                    if (v.firstChild) {
                        if (v.firstChild.nodeName !== 'TH') {
                            _.each(v.cells, (v, k) => {
                                let nodeText = v.innerText;
                                if (nodeText) {
                                    tdBox.push(nodeText);
                                }
                            });
                            resultBox.push(tdBox);
                        }
                    }
                });

                if (props.selectAll) {
                    setCheckBoxSelectAllState(true);
                    props.headerSpec.getAllCheckBoxVal(resultBox);
                } else {
                    setCheckBoxSelectAllState(false);
                    props.headerSpec.getAllCheckBoxVal([]);
                }
            }
        }
        return () => {
        }
    }, [props.selectAll]);


    let rowCounts = props.count ? props.count : 0;
    let queryResult = [];
    if (rowCounts === 0) {
        // queryResult.push(<div className="">***無顯示資料***</div>)
        queryResult.push(<div key={utils.generateUID()} className="">***{t("tableNoData")}***</div>)
    } else {
        queryResult.push(<div key={utils.generateUID()} className="">{t("tableNumData")} <span className="query__sum">{props.count ? props.count : 0}</span> {t("tableCount")}</div>);
    }

    return (
        <>
            <div className="query__info__row">
                {queryResult}
                {/* <div className="">若處理狀態有 ** 註記，表示未對到帳，請分行人工確認資金是否到位</div> */}
                <div className="">{t("tableQuerytime")}: <span className="query__time">{props.time}</span></div>
            </div>
            {/* // by shane */}
            <div className="query__table__wrap">
                <table ref={tableRef} className="ui selectable sortable small striped celled compact table">
                    <thead>
                        <tr>
                            {headerGenerator(props.headerSpec)}
                        </tr>
                    </thead>
                    <tbody>
                        {trGenerator(state)}
                    </tbody>
                </table>
            </div>
        </>

    );
}, propsEquality);

//props 預設值
AccountingTable.defaultProps = {
    //TODO default table, count, time 
    rowSpec: {
        selectedValue: false,
    },
    headerSpec: {
        selectable: false,
    },
    columnSpec: {
        tableDetails: {
            expandDetails: false,
        }
    },
    selectAll: false,


}

export default AccountingTable;
