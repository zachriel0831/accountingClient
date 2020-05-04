import React, { useState, useRef } from 'react';
import _ from 'lodash';
import { Button, Modal } from 'semantic-ui-react';
// import AjaxWrapper from '../utils/AjaxWrappers';
import config from '../configs/config';
// import LargeTableExtendModalWithForm from '../txnComponents/LargeTableExtendModalWithForm';
import utils from '../utils/utils';
import { useTranslation } from "react-i18next";

const TableExtendModal = React.memo((props) => {

    const { t } = useTranslation();
    let ths = [];
    let trs = [];
    const url = props.queryURL;
    let selectedValue = false;
    let swiftMethod = '';
    let querySwiftUrl = '';
    let detailType = '';
    let submitUrl = '';
    let submitMethod = '';
    let enLarge = false;
    const modalRef = useRef();
    if (props.tableDetails.expandDetail) {
        submitUrl = props.tableDetails.url;
        submitMethod = props.tableDetails.method;

        selectedValue = props.tableDetails.rowSpec.selectedValue;
        swiftMethod = props.tableDetails.rowSpec.method;
        querySwiftUrl = props.tableDetails.rowSpec.url;
        detailType = props.tableDetails.rowSpec.detailType;

    }


    const Header = (props) => {
        return (
            <th style={props.style}>{props.children}</th>
        )
    }
    const TRdata = (props) => {
        const setStyleOnDoubleClick = (e) => {
            e.stopPropagation();

            if (selectedValue) {
                let getAllRow = e.currentTarget.parentElement.children;

                //重置所有row style
                _.each(getAllRow, (v, k) => {
                    v.style.backgroundColor = 'white';
                })

                //反白選取的row
                e.currentTarget.style.backgroundColor = '#cce2ff';
            }

            props.onClick(e)
        }


        // if (!selectedValue) {

        //     return (
        //         <LargeTableExtendModalWithForm
        //             rowKey={props.rowKey ? props.rowKey : utils.generateUID()}
        //             submitUrl={submitUrl}
        //             submitMethod={submitMethod}
        //             queryMethod={swiftMethod}
        //             queryURL={querySwiftUrl}
        //             detailType={detailType}
        //             style={{ cursor: 'pointer' }}
        //             onClick={setStyleOnDoubleClick}
        //         >
        //             {props.children}
        //         </LargeTableExtendModalWithForm>
        //     )
        // } else {
            return (
                <tr id={props.rowKey ? props.rowKey : utils.generateUID()}
                    style={{ cursor: 'pointer' }}
                    onDoubleClick={setStyleOnDoubleClick}
                >
                    {props.children}
                </tr>
            )
        // }
    }

    const TDdata = (props) => {
        return (
            <td style={props.style}>{props.children}</td>
        )
    }

    const headerGenerator = (value) => {

        try {
            _.each(value, (v) => {
                ths.push(<Header style={v.style}>{v.headerName}</Header>);
            });
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
                trValues.push(v.textContent);
            });

            if (props.tableDetails.expandDetail) {
                if (typeof props.tableDetails.rowSpec.customOnRowDoubleClick === 'function') {
                    props.rowSpec.customOnRowDoubleClick(e, trValues);

                }
            }
        }

        let header = props.queryHeader ? props.queryHeader : [];

        _.each(value, (item, r) => {
            let rowKey = '';
            _.each(header, (h) => {
                _.each(item, (v, k) => {
                    //取得row key
                    if (props.tableDetails.expandDetail) {
                        if (k === props.tableDetails.rowSpec.requestDataKey) {
                            rowKey = v;
                        }
                    }

                    if (h.id === k) {
                        tds.push(<TDdata style={h.style}>{v}</TDdata>);
                    }
                })
            });

            if (tds.length !== 0) {
                trs.push(<TRdata rowKey={rowKey} onClick={trClick}>{tds}</TRdata>);
                tds = [];
            }
        })
        return trs;
    }

    const [open, setOpen] = useState(false);
    const [queries, setQueries] = useState({ queries: {}, counts: 0, time: new Date() });

    const closeModal = (e) => {

        setOpen(false);
    };

    const enLargeModal = (e) => {

        let modalRefs = modalRef;

        if (!enLarge) {
            modalRefs.current.ref.current.style.height = '90%'
            modalRefs.current.ref.current.style.width = '90%'
            enLarge = !enLarge;
        } else {
            modalRefs.current.ref.current.style.height = ''
            modalRefs.current.ref.current.style.width = ''
            enLarge = !enLarge;

        }
    }

    const openModal = async (e) => {
        console.log('modal ajax firing!!')
        let result = '';
        var sendDataString = { 'id': props.rowKey }; //TODO 應為欄位參數


        // await AjaxWrapper.sendDataToServer({
        //     method: props.queryMethod,
        //     url: config.mode === 0 ? `${config.testContextURL}${url}` : url,
        //     data: sendDataString,
        //     dataType: 'text',
        //     async: true,
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         // 'DataCheckSum': sendDataStringCRC32  /做為比對data用 以免資料被人竄改
        //     },
        //     success: function (respData) {
        //         // console.log('SERVER RESPONSE: ', JSON.parse(respData));
                
        //         result = respData;
        //     },
        //     error: function (jqXHR, textStatus, errorThrown) {

        //         console.log('SERVER error jqXHR: ', jqXHR);
        //         console.log('SERVER error textStatus: ', textStatus);
        //         console.log('SERVER error errorThrown: ', errorThrown);

        //     },
        //     complete: function (jqXHR, textStatus) {
        //         console.log('TableModal ajax complete')
        //     }
        // })

        setQueries(result.data.queriesData);
        setOpen(true);
    }
    return (
        <Modal ref={modalRef} open={open} trigger={<td style={props.style}><a onClick={(e) => openModal(e)} href="javascript:void(0)" className="btn-link-querylist">{props.children}</a></td>}>
            <Modal.Header className="header">{'　'}
                <div className="ui horizontal list right floated">
                    <div className="item">
                        <a href="javascript:void(0)" className="btn-close-modal"><i className="external alternate icon" onClick={(e) => enLargeModal(e)}></i></a>
                    </div>

                    <div className="item">
                        <a href="javascript:void(0)" className="btn-close-modal"><i className="times icon" onClick={(e) => closeModal(e)}></i></a>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Content className="scrolling content">
                <div className="query__info__row">
                    <div className="">{t("tableNumData")} <span className="query__sum">{queries.count}</span> {t("tableCount")}</div>
                    <div className="">{t("tableQuerytime")}: <span className="query__time">{queries.time}</span></div>
                </div>
                <div className="query__table__wrap">
                    <table className="ui selectable small striped celled compact table">
                        <thead>
                            <tr>
                                {headerGenerator(props.queryHeader)}
                            </tr>
                        </thead>
                        <tbody>
                            {trGenerator(queries.queries)}
                        </tbody>
                    </table>
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button className="ui cancel button" onClick={(e) => closeModal(e)}>{t("cancel")}</Button>

            </Modal.Actions>
        </Modal>
    )
})


export default TableExtendModal;
